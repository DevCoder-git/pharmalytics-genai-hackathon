from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import DrugInteractionAnalyzer, DosageRecommendationService, SideEffectAnalyzer, TextExtractionService
from .models import AIAnalysis
import time

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_interaction(request):
    try:
        start_time = time.time()
        medications = request.data.get('medications', [])
        patient_age = request.data.get('patient_age')
        
        analyzer = DrugInteractionAnalyzer()
        result = analyzer.analyze_comprehensive_interaction(medications, patient_age)
        
        processing_time = time.time() - start_time
        
        AIAnalysis.objects.create(
            user=request.user,
            analysis_type='interaction',
            input_data={'medications': medications, 'patient_age': patient_age},
            result_data=result,
            confidence_score=result.get('confidence', 0.8),
            processing_time=processing_time
        )
        
        return Response(result)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_dosage_recommendation(request):
    try:
        start_time = time.time()
        drug_name = request.data.get('drug_name')
        patient_age = request.data.get('patient_age')
        patient_weight = request.data.get('patient_weight')
        medical_conditions = request.data.get('medical_conditions', [])
        
        service = DosageRecommendationService()
        result = service.get_personalized_dosage(drug_name, patient_age, patient_weight, medical_conditions)
        
        processing_time = time.time() - start_time
        
        AIAnalysis.objects.create(
            user=request.user,
            analysis_type='dosage',
            input_data={'drug_name': drug_name, 'patient_age': patient_age, 'patient_weight': patient_weight},
            result_data=result,
            processing_time=processing_time
        )
        
        return Response(result)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_side_effects(request):
    try:
        start_time = time.time()
        medications = request.data.get('medications', [])
        patient_profile = request.data.get('patient_profile', {})
        
        analyzer = SideEffectAnalyzer()
        result = analyzer.predict_side_effects(medications, patient_profile)
        
        processing_time = time.time() - start_time
        
        AIAnalysis.objects.create(
            user=request.user,
            analysis_type='side_effect',
            input_data={'medications': medications, 'patient_profile': patient_profile},
            result_data=result,
            processing_time=processing_time
        )
        
        return Response(result)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def extract_from_text(request):
    try:
        start_time = time.time()
        text = request.data.get('text', '')
        
        extractor = TextExtractionService()
        result = extractor.extract_drug_information(text)
        
        processing_time = time.time() - start_time
        
        AIAnalysis.objects.create(
            user=request.user,
            analysis_type='text_extraction',
            input_data={'text': text},
            result_data=result,
            processing_time=processing_time
        )
        
        return Response(result)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)