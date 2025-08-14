import os
import requests
import json
import logging
from django.conf import settings
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

logger = logging.getLogger(__name__)

class HuggingFaceGraniteClient:
    """Client for interacting with Hugging Face Granite models"""
    
    def __init__(self):
        self.api_key = settings.HUGGINGFACE_API_KEY
        self.base_url = "https://api-inference.huggingface.co/models"
        self.headers = {"Authorization": f"Bearer {self.api_key}"}
        
        # Granite model endpoints for different tasks
        self.models = {
            'drug_interaction': 'ibm-granite/granite-7b-instruct',
            'dosage_calculation': 'ibm-granite/granite-3b-code-instruct',
            'text_extraction': 'ibm-granite/granite-7b-instruct',
            'safety_scoring': 'ibm-granite/granite-7b-instruct'
        }
    
    def query_model(self, model_name, prompt, max_tokens=500):
        """Query a Granite model with a prompt"""
        try:
            url = f"{self.base_url}/{self.models[model_name]}"
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": 0.1,
                    "return_full_text": False
                }
            }
            
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '')
            return result.get('generated_text', '')
            
        except Exception as e:
            logger.error(f"Error querying Granite model {model_name}: {str(e)}")
            return None

class DrugInteractionAnalyzer:
    """AI-powered drug interaction analysis using Granite models"""
    
    def __init__(self):
        self.granite_client = HuggingFaceGraniteClient()
    
    def analyze_interaction(self, drug1, drug2, patient_age=None):
        """Analyze interaction between two drugs using AI"""
        try:
            # Create prompt for Granite model
            prompt = self._create_interaction_prompt(drug1, drug2, patient_age)
            
            # Query the model
            response = self.granite_client.query_model('drug_interaction', prompt)
            
            if response:
                return self._parse_interaction_response(response)
            return None
            
        except Exception as e:
            logger.error(f"Error in AI drug interaction analysis: {str(e)}")
            return None
    
    def _create_interaction_prompt(self, drug1, drug2, patient_age):
        """Create prompt for drug interaction analysis"""
        drug1_name = drug1.get('name', '')
        drug1_dosage = drug1.get('dosage', '')
        drug2_name = drug2.get('name', '')
        drug2_dosage = drug2.get('dosage', '')
        
        prompt = f"""
As a clinical pharmacologist, analyze the potential drug interaction between:

Drug 1: {drug1_name} ({drug1_dosage})
Drug 2: {drug2_name} ({drug2_dosage})
"""
        
        if patient_age:
            prompt += f"Patient Age: {patient_age} years\n"
        
        prompt += """
Provide analysis in the following format:
1. Interaction Severity: [None/Low/Moderate/High/Severe]
2. Mechanism: [Brief description of interaction mechanism]
3. Clinical Effects: [Potential clinical consequences]
4. Recommendations: [Management recommendations]
5. Monitoring: [What parameters to monitor]

Analysis:"""
        
        return prompt
    
    def _parse_interaction_response(self, response):
        """Parse the AI response into structured data"""
        try:
            lines = response.strip().split('\n')
            analysis = {}
            
            for line in lines:
                if 'Severity:' in line:
                    analysis['severity'] = line.split('Severity:')[1].strip().lower()
                elif 'Mechanism:' in line:
                    analysis['mechanism'] = line.split('Mechanism:')[1].strip()
                elif 'Clinical Effects:' in line:
                    analysis['clinical_effects'] = line.split('Clinical Effects:')[1].strip()
                elif 'Recommendations:' in line:
                    analysis['recommendations'] = [line.split('Recommendations:')[1].strip()]
                elif 'Monitoring:' in line:
                    analysis['monitoring'] = line.split('Monitoring:')[1].strip()
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return None

class DosageCalculator:
    """AI-powered dosage calculation and recommendations"""
    
    def __init__(self):
        self.granite_client = HuggingFaceGraniteClient()
    
    def calculate_age_specific_dosage(self, drug_name, age, weight=None, indication=None):
        """Calculate age-specific dosage using AI"""
        try:
            prompt = self._create_dosage_prompt(drug_name, age, weight, indication)
            response = self.granite_client.query_model('dosage_calculation', prompt)
            
            if response:
                return self._parse_dosage_response(response)
            return None
            
        except Exception as e:
            logger.error(f"Error in AI dosage calculation: {str(e)}")
            return None
    
    def _create_dosage_prompt(self, drug_name, age, weight, indication):
        """Create prompt for dosage calculation"""
        prompt = f"""
As a clinical pharmacist, calculate the appropriate dosage for:

Medication: {drug_name}
Patient Age: {age} years
"""
        
        if weight:
            prompt += f"Patient Weight: {weight} kg\n"
        if indication:
            prompt += f"Indication: {indication}\n"
        
        prompt += """
Provide dosage recommendation in the following format:
1. Recommended Dose: [Amount and frequency]
2. Route of Administration: [Oral/IV/IM/etc.]
3. Duration: [Treatment duration if applicable]
4. Special Considerations: [Age-specific considerations]
5. Monitoring Parameters: [What to monitor]

Recommendation:"""
        
        return prompt
    
    def _parse_dosage_response(self, response):
        """Parse dosage calculation response"""
        try:
            lines = response.strip().split('\n')
            dosage_info = {}
            
            for line in lines:
                if 'Recommended Dose:' in line:
                    dosage_info['dose'] = line.split('Recommended Dose:')[1].strip()
                elif 'Route of Administration:' in line:
                    dosage_info['route'] = line.split('Route of Administration:')[1].strip()
                elif 'Duration:' in line:
                    dosage_info['duration'] = line.split('Duration:')[1].strip()
                elif 'Special Considerations:' in line:
                    dosage_info['considerations'] = line.split('Special Considerations:')[1].strip()
                elif 'Monitoring Parameters:' in line:
                    dosage_info['monitoring'] = line.split('Monitoring Parameters:')[1].strip()
            
            return dosage_info
            
        except Exception as e:
            logger.error(f"Error parsing dosage response: {str(e)}")
            return None

class MedicalTextExtractor:
    """Extract medication information from medical text using NLP"""
    
    def __init__(self):
        self.granite_client = HuggingFaceGraniteClient()
    
    def extract_medications(self, medical_text):
        """Extract medication information from unstructured text"""
        try:
            prompt = self._create_extraction_prompt(medical_text)
            response = self.granite_client.query_model('text_extraction', prompt)
            
            if response:
                return self._parse_extraction_response(response)
            return []
            
        except Exception as e:
            logger.error(f"Error in medical text extraction: {str(e)}")
            return []
    
    def _create_extraction_prompt(self, text):
        """Create prompt for medication extraction"""
        prompt = f"""
Extract all medications, dosages, and frequencies from the following medical text:

Text: {text}

For each medication found, provide in this format:
- Medication: [Name]
- Dosage: [Amount]
- Frequency: [How often]
- Route: [Administration route if mentioned]

Extracted Medications:"""
        
        return prompt
    
    def _parse_extraction_response(self, response):
        """Parse medication extraction response"""
        try:
            medications = []
            lines = response.strip().split('\n')
            current_med = {}
            
            for line in lines:
                line = line.strip()
                if line.startswith('- Medication:'):
                    if current_med:
                        medications.append(current_med)
                    current_med = {'name': line.split('Medication:')[1].strip()}
                elif line.startswith('- Dosage:') and current_med:
                    current_med['dosage'] = line.split('Dosage:')[1].strip()
                elif line.startswith('- Frequency:') and current_med:
                    current_med['frequency'] = line.split('Frequency:')[1].strip()
                elif line.startswith('- Route:') and current_med:
                    current_med['route'] = line.split('Route:')[1].strip()
            
            if current_med:
                medications.append(current_med)
            
            return medications
            
        except Exception as e:
            logger.error(f"Error parsing extraction response: {str(e)}")
            return []

class SideEffectAnalyzer:
    """Analyze and score potential side effects"""
    
    def __init__(self):
        self.granite_client = HuggingFaceGraniteClient()
    
    def analyze_side_effects(self, medication, patient_profile):
        """Analyze potential side effects for a patient"""
        try:
            prompt = self._create_side_effect_prompt(medication, patient_profile)
            response = self.granite_client.query_model('safety_scoring', prompt)
            
            if response:
                return self._parse_side_effect_response(response)
            return None
            
        except Exception as e:
            logger.error(f"Error in side effect analysis: {str(e)}")
            return None
    
    def _create_side_effect_prompt(self, medication, patient_profile):
        """Create prompt for side effect analysis"""
        prompt = f"""
Analyze potential side effects for the following medication and patient:

Medication: {medication.get('name', '')} ({medication.get('dosage', '')})
Patient Age: {patient_profile.get('age', 'Unknown')}
Medical Conditions: {', '.join(patient_profile.get('medical_conditions', []))}
Allergies: {', '.join(patient_profile.get('allergies', []))}

Provide analysis in this format:
1. Common Side Effects: [List with probability %]
2. Serious Side Effects: [List with probability %]
3. Patient-Specific Risks: [Based on profile]
4. Risk Score: [1-10 scale]
5. Precautions: [Special precautions for this patient]

Analysis:"""
        
        return prompt
    
    def _parse_side_effect_response(self, response):
        """Parse side effect analysis response"""
        try:
            analysis = {
                'common_side_effects': [],
                'serious_side_effects': [],
                'patient_risks': '',
                'risk_score': 0,
                'precautions': ''
            }
            
            # Parse the structured response
            sections = response.split('\n')
            current_section = None
            
            for line in sections:
                line = line.strip()
                if 'Common Side Effects:' in line:
                    current_section = 'common'
                elif 'Serious Side Effects:' in line:
                    current_section = 'serious'
                elif 'Patient-Specific Risks:' in line:
                    analysis['patient_risks'] = line.split('Patient-Specific Risks:')[1].strip()
                elif 'Risk Score:' in line:
                    score_text = line.split('Risk Score:')[1].strip()
                    try:
                        analysis['risk_score'] = int(score_text.split('/')[0])
                    except:
                        analysis['risk_score'] = 5
                elif 'Precautions:' in line:
                    analysis['precautions'] = line.split('Precautions:')[1].strip()
                elif current_section and line and not line.startswith(('1.', '2.', '3.', '4.', '5.')):
                    if current_section == 'common':
                        analysis['common_side_effects'].append(line)
                    elif current_section == 'serious':
                        analysis['serious_side_effects'].append(line)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error parsing side effect response: {str(e)}")
            return None