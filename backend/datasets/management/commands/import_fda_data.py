from django.core.management.base import BaseCommand
import requests
import json
import time
from drug_interactions.models import Drug, DrugInteraction
from django.conf import settings

class Command(BaseCommand):
    help = 'Import drug data from FDA API'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=1000,
            help='Limit number of drugs to import',
        )
        parser.add_argument(
            '--skip',
            type=int,
            default=0,
            help='Number of records to skip',
        )
    
    def handle(self, *args, **options):
        self.import_fda_drug_labels(options['limit'], options['skip'])
    
    def import_fda_drug_labels(self, limit, skip):
        """Import drug labels from FDA API"""
        self.stdout.write('Importing drug labels from FDA API...')
        
        base_url = 'https://api.fda.gov/drug/label.json'
        
        try:
            imported_count = 0
            current_skip = skip
            
            while imported_count < limit:
                # Calculate how many to fetch in this batch
                batch_size = min(100, limit - imported_count)
                
                params = {
                    'limit': batch_size,
                    'skip': current_skip
                }
                
                # Add API key if available
                api_key = settings.FDA_API_KEY
                if api_key:
                    params['api_key'] = api_key
                
                response = requests.get(base_url, params=params)
                
                if response.status_code == 429:  # Rate limited
                    self.stdout.write('Rate limited, waiting 60 seconds...')
                    time.sleep(60)
                    continue
                
                response.raise_for_status()
                data = response.json()
                
                results = data.get('results', [])
                if not results:
                    self.stdout.write('No more results available')
                    break
                
                for drug_label in results:
                    self.process_drug_label(drug_label)
                    imported_count += 1
                
                current_skip += batch_size
                
                self.stdout.write(f'Processed {imported_count} drug labels...')
                
                # Rate limiting - FDA allows 240 requests per minute for registered users
                time.sleep(0.25)  # 4 requests per second
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully imported {imported_count} drug labels')
            )
            
        except requests.exceptions.RequestException as e:
            self.stdout.write(
                self.style.ERROR(f'FDA API request failed: {str(e)}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Import error: {str(e)}')
            )
    
    def process_drug_label(self, label_data):
        """Process a single drug label from FDA data"""
        try:
            # Extract drug name
            brand_name = ''
            generic_name = ''
            
            if 'openfda' in label_data:
                openfda = label_data['openfda']
                brand_name = openfda.get('brand_name', [''])[0] if openfda.get('brand_name') else ''
                generic_name = openfda.get('generic_name', [''])[0] if openfda.get('generic_name') else ''
            
            # Use brand name or generic name as primary name
            drug_name = brand_name or generic_name
            if not drug_name:
                return  # Skip if no name available
            
            # Extract other information
            manufacturer = ''
            if 'openfda' in label_data and 'manufacturer_name' in label_data['openfda']:
                manufacturer = label_data['openfda']['manufacturer_name'][0]
            
            # Extract indications and usage
            indications = []
            if 'indications_and_usage' in label_data:
                indications_text = ' '.join(label_data['indications_and_usage'])
                # Split into individual indications (basic parsing)
                indications = [ind.strip() for ind in indications_text.split('.') if ind.strip()]
            
            # Extract contraindications
            contraindications = []
            if 'contraindications' in label_data:
                contraindications_text = ' '.join(label_data['contraindications'])
                contraindications = [contra.strip() for contra in contraindications_text.split('.') if contra.strip()]
            
            # Extract dosage and administration
            dosage_forms = []
            if 'dosage_and_administration' in label_data:
                dosage_text = ' '.join(label_data['dosage_and_administration'])
                # Basic extraction of dosage forms
                if 'tablet' in dosage_text.lower():
                    dosage_forms.append('tablet')
                if 'capsule' in dosage_text.lower():
                    dosage_forms.append('capsule')
                if 'injection' in dosage_text.lower():
                    dosage_forms.append('injection')
                if 'oral' in dosage_text.lower():
                    dosage_forms.append('oral')
            
            # Extract mechanism of action
            mechanism = ''
            if 'mechanism_of_action' in label_data:
                mechanism = ' '.join(label_data['mechanism_of_action'])
            elif 'clinical_pharmacology' in label_data:
                mechanism = ' '.join(label_data['clinical_pharmacology'])
            
            # Extract drug interactions
            drug_interactions_text = ''
            if 'drug_interactions' in label_data:
                drug_interactions_text = ' '.join(label_data['drug_interactions'])
            
            # Create or update drug record
            drug_id = self.generate_drug_id(drug_name, manufacturer)
            
            drug, created = Drug.objects.get_or_create(
                drug_id=drug_id,
                defaults={
                    'name': drug_name,
                    'generic_name': generic_name,
                    'brand_names': [brand_name] if brand_name else [],
                    'drug_class': manufacturer,  # Using manufacturer as class for now
                    'mechanism_of_action': mechanism,
                    'indications': indications,
                    'contraindications': contraindications,
                    'dosage_forms': dosage_forms
                }
            )
            
            if created:
                self.stdout.write(f'Created drug: {drug.name}')
            
            # Process drug interactions if available
            if drug_interactions_text:
                self.extract_interactions_from_text(drug, drug_interactions_text)
            
        except Exception as e:
            self.stdout.write(f'Error processing drug label: {str(e)}')
    
    def generate_drug_id(self, drug_name, manufacturer):
        """Generate a unique drug ID"""
        import hashlib
        
        # Create ID from drug name and manufacturer
        combined = f"{drug_name}_{manufacturer}".lower().replace(' ', '_')
        return f"fda_{hashlib.md5(combined.encode()).hexdigest()[:10]}"
    
    def extract_interactions_from_text(self, drug, interactions_text):
        """Extract drug interactions from text using basic NLP"""
        try:
            # This is a simplified extraction - in production, you'd use more sophisticated NLP
            
            # Common drug interaction keywords
            severity_keywords = {
                'severe': ['severe', 'serious', 'major', 'contraindicated', 'avoid'],
                'moderate': ['moderate', 'caution', 'monitor', 'may increase'],
                'low': ['minor', 'slight', 'possible']
            }
            
            # Look for drug names mentioned in the interaction text
            # This would be more sophisticated in a real implementation
            mentioned_drugs = self.find_mentioned_drugs(interactions_text)
            
            for mentioned_drug in mentioned_drugs:
                # Determine severity based on keywords
                severity = 'moderate'  # default
                text_lower = interactions_text.lower()
                
                for sev_level, keywords in severity_keywords.items():
                    if any(keyword in text_lower for keyword in keywords):
                        severity = sev_level
                        break
                
                # Create interaction record
                interaction, created = DrugInteraction.objects.get_or_create(
                    drug1=drug,
                    drug2=mentioned_drug,
                    defaults={
                        'severity': severity,
                        'description': interactions_text[:500],  # Truncate for storage
                        'mechanism': 'Extracted from FDA label',
                        'clinical_effects': [],
                        'management_recommendations': 'Consult prescribing information',
                        'evidence_level': 'FDA Label'
                    }
                )
                
                if created:
                    self.stdout.write(f'Created interaction: {drug.name} + {mentioned_drug.name}')
            
        except Exception as e:
            self.stdout.write(f'Error extracting interactions: {str(e)}')
    
    def find_mentioned_drugs(self, text):
        """Find drug names mentioned in the interaction text"""
        try:
            # Get list of known drugs from database
            known_drugs = Drug.objects.all()
            mentioned_drugs = []
            
            text_lower = text.lower()
            
            for drug in known_drugs:
                # Check if drug name is mentioned
                if drug.name.lower() in text_lower:
                    mentioned_drugs.append(drug)
                
                # Check brand names
                for brand_name in drug.brand_names:
                    if brand_name.lower() in text_lower:
                        mentioned_drugs.append(drug)
                        break
            
            return mentioned_drugs[:5]  # Limit to prevent too many interactions
            
        except Exception as e:
            self.stdout.write(f'Error finding mentioned drugs: {str(e)}')
            return []