from django.core.management.base import BaseCommand
import xml.etree.ElementTree as ET
import json
import requests
import os
from drug_interactions.models import Drug, DrugInteraction
from django.conf import settings

class Command(BaseCommand):
    help = 'Import drug data from DrugBank API and XML files'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to DrugBank XML file',
        )
        parser.add_argument(
            '--api',
            action='store_true',
            help='Use DrugBank API instead of XML file',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=1000,
            help='Limit number of drugs to import',
        )
    
    def handle(self, *args, **options):
        if options['api']:
            self.import_from_api(options['limit'])
        elif options['file']:
            self.import_from_xml(options['file'], options['limit'])
        else:
            self.stdout.write(
                self.style.ERROR('Please specify either --file or --api option')
            )
    
    def import_from_api(self, limit):
        """Import drugs from DrugBank API"""
        self.stdout.write('Importing drugs from DrugBank API...')
        
        api_key = settings.DRUGBANK_API_KEY
        if not api_key:
            self.stdout.write(
                self.style.ERROR('DRUGBANK_API_KEY not found in settings')
            )
            return
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        base_url = 'https://api.drugbank.com/v1'
        
        try:
            # Get list of drugs
            response = requests.get(
                f'{base_url}/drugs',
                headers=headers,
                params={'limit': limit}
            )
            response.raise_for_status()
            
            drugs_data = response.json()
            
            for drug_data in drugs_data.get('data', []):
                self.create_drug_from_api_data(drug_data)
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully imported {len(drugs_data.get("data", []))} drugs')
            )
            
        except requests.exceptions.RequestException as e:
            self.stdout.write(
                self.style.ERROR(f'API request failed: {str(e)}')
            )
    
    def import_from_xml(self, file_path, limit):
        """Import drugs from DrugBank XML file"""
        self.stdout.write(f'Importing drugs from XML file: {file_path}')
        
        if not os.path.exists(file_path):
            self.stdout.write(
                self.style.ERROR(f'File not found: {file_path}')
            )
            return
        
        try:
            tree = ET.parse(file_path)
            root = tree.getroot()
            
            # Define namespace
            ns = {'db': 'http://www.drugbank.ca'}
            
            drugs_imported = 0
            
            for drug_elem in root.findall('.//db:drug', ns):
                if drugs_imported >= limit:
                    break
                
                drug_data = self.parse_drug_xml(drug_elem, ns)
                if drug_data:
                    self.create_drug_from_xml_data(drug_data)
                    drugs_imported += 1
                    
                    if drugs_imported % 100 == 0:
                        self.stdout.write(f'Imported {drugs_imported} drugs...')
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully imported {drugs_imported} drugs from XML')
            )
            
        except ET.ParseError as e:
            self.stdout.write(
                self.style.ERROR(f'XML parsing error: {str(e)}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Import error: {str(e)}')
            )
    
    def parse_drug_xml(self, drug_elem, ns):
        """Parse drug data from XML element"""
        try:
            drug_id = drug_elem.get('drugbank-id')
            
            name_elem = drug_elem.find('.//db:name', ns)
            name = name_elem.text if name_elem is not None else ''
            
            if not name:
                return None
            
            # Get generic name
            generic_name_elem = drug_elem.find('.//db:generic-name', ns)
            generic_name = generic_name_elem.text if generic_name_elem is not None else ''
            
            # Get brand names
            brand_names = []
            for brand_elem in drug_elem.findall('.//db:brand', ns):
                brand_name_elem = brand_elem.find('db:name', ns)
                if brand_name_elem is not None:
                    brand_names.append(brand_name_elem.text)
            
            # Get drug classification
            classification_elem = drug_elem.find('.//db:classification/db:class', ns)
            drug_class = classification_elem.text if classification_elem is not None else ''
            
            # Get mechanism of action
            mechanism_elem = drug_elem.find('.//db:mechanism-of-action', ns)
            mechanism = mechanism_elem.text if mechanism_elem is not None else ''
            
            # Get indications
            indications = []
            for indication_elem in drug_elem.findall('.//db:indication', ns):
                if indication_elem.text:
                    indications.append(indication_elem.text)
            
            # Get contraindications
            contraindications = []
            for contra_elem in drug_elem.findall('.//db:contraindication', ns):
                if contra_elem.text:
                    contraindications.append(contra_elem.text)
            
            return {
                'drug_id': drug_id,
                'name': name,
                'generic_name': generic_name,
                'brand_names': brand_names,
                'drug_class': drug_class,
                'mechanism_of_action': mechanism,
                'indications': indications,
                'contraindications': contraindications
            }
            
        except Exception as e:
            self.stdout.write(f'Error parsing drug XML: {str(e)}')
            return None
    
    def create_drug_from_api_data(self, drug_data):
        """Create Drug object from API data"""
        try:
            drug, created = Drug.objects.get_or_create(
                drug_id=drug_data.get('drugbank_id', ''),
                defaults={
                    'name': drug_data.get('name', ''),
                    'generic_name': drug_data.get('generic_name', ''),
                    'brand_names': drug_data.get('brand_names', []),
                    'drug_class': drug_data.get('classification', {}).get('class', ''),
                    'mechanism_of_action': drug_data.get('mechanism_of_action', ''),
                    'indications': drug_data.get('indications', []),
                    'contraindications': drug_data.get('contraindications', [])
                }
            )
            
            if created:
                self.stdout.write(f'Created drug: {drug.name}')
            
        except Exception as e:
            self.stdout.write(f'Error creating drug from API data: {str(e)}')
    
    def create_drug_from_xml_data(self, drug_data):
        """Create Drug object from XML data"""
        try:
            drug, created = Drug.objects.get_or_create(
                drug_id=drug_data['drug_id'],
                defaults={
                    'name': drug_data['name'],
                    'generic_name': drug_data['generic_name'],
                    'brand_names': drug_data['brand_names'],
                    'drug_class': drug_data['drug_class'],
                    'mechanism_of_action': drug_data['mechanism_of_action'],
                    'indications': drug_data['indications'],
                    'contraindications': drug_data['contraindications']
                }
            )
            
            if created:
                self.stdout.write(f'Created drug: {drug.name}')
            
        except Exception as e:
            self.stdout.write(f'Error creating drug from XML data: {str(e)}')