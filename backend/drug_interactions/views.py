from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
import logging
from .models import Drug, DrugInteraction, DosageRecommendation, AlternativeMedication, InteractionCheck
from .serializers import DrugSerializer, DrugInteractionSerializer, InteractionCheckSerializer
from ai_models.services import DrugInteractionAnalyzer

logger = logging.getLogger(__name__)

class DrugListView(generics.ListAPIView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    
    def get_queryset(self):
        queryset = Drug.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(generic_name__icontains=search)
            )
        return queryset

class DrugDetailView(generics.RetrieveAPIView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    lookup_field = 'drug_id'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_drug_interactions(request):
    """
    Check for drug interactions between multiple medications
    """
    try:
        medications = request.data.get('medications', [])
        patient_age = request.data.get('patient_age')
        
        if len(medications) < 2:
            return Response(
                {'error': 'At least 2 medications are required for interaction checking'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Initialize the AI analyzer
        analyzer = DrugInteractionAnalyzer()
        
        # Find interactions
        interactions = []
        recommendations = []
        risk_scores = []
        
        for i in range(len(medications)):
            for j in range(i + 1, len(medications)):
                drug1_name = medications[i].get('name', '').lower()
                drug2_name = medications[j].get('name', '').lower()
                
                # Check database for known interactions
                db_interaction = DrugInteraction.objects.filter(
                    Q(drug1__name__icontains=drug1_name, drug2__name__icontains=drug2_name) |
                    Q(drug1__name__icontains=drug2_name, drug2__name__icontains=drug1_name)
                ).first()
                
                if db_interaction:
                    interaction_data = {
                        'drug1': drug1_name.title(),
                        'drug2': drug2_name.title(),
                        'severity': db_interaction.severity,
                        'description': db_interaction.description,
                        'recommendation': db_interaction.management_recommendations
                    }
                    interactions.append(interaction_data)
                    risk_scores.append(get_severity_score(db_interaction.severity))
                
                # Use AI for additional analysis
                ai_analysis = analyzer.analyze_interaction(
                    medications[i], medications[j], patient_age
                )
                if ai_analysis:
                    recommendations.extend(ai_analysis.get('recommendations', []))
        
        # Get dosage recommendations for patient age
        if patient_age:
            for medication in medications:
                dosage_rec = get_age_specific_dosage(medication['name'], patient_age)
                if dosage_rec:
                    recommendations.append({
                        'type': 'dosage',
                        'medication': medication['name'],
                        'recommendation': dosage_rec
                    })
        
        # Get alternative medications for high-risk interactions
        for interaction in interactions:
            if interaction['severity'] in ['high', 'severe']:
                alternatives = get_alternative_medications(interaction['drug1'])
                if alternatives:
                    recommendations.append({
                        'type': 'alternative',
                        'original_drug': interaction['drug1'],
                        'alternatives': alternatives
                    })
        
        # Calculate overall risk score
        overall_risk = max(risk_scores) if risk_scores else 0
        
        # Save interaction check
        InteractionCheck.objects.create(
            user=request.user,
            medications=medications,
            patient_age=patient_age,
            interactions_found=interactions,
            recommendations=recommendations,
            risk_score=overall_risk
        )
        
        response_data = {
            'interactions': interactions,
            'recommendations': recommendations,
            'overall_risk_score': overall_risk,
            'total_interactions_found': len(interactions),
            'severity_breakdown': get_severity_breakdown(interactions)
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in drug interaction check: {str(e)}")
        return Response(
            {'error': 'An error occurred while checking drug interactions'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_interaction_history(request):
    """Get user's interaction check history"""
    checks = InteractionCheck.objects.filter(user=request.user).order_by('-checked_at')[:10]
    serializer = InteractionCheckSerializer(checks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_medications(request):
    """Search for medications by name"""
    query = request.query_params.get('q', '')
    if len(query) < 2:
        return Response({'error': 'Query must be at least 2 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    drugs = Drug.objects.filter(
        Q(name__icontains=query) | Q(generic_name__icontains=query)
    )[:20]
    
    results = [{'name': drug.name, 'generic_name': drug.generic_name, 'drug_id': drug.drug_id} for drug in drugs]
    return Response({'results': results})

def get_severity_score(severity):
    """Convert severity to numeric score"""
    severity_scores = {
        'low': 1,
        'moderate': 2,
        'high': 3,
        'severe': 4
    }
    return severity_scores.get(severity, 0)

def get_age_specific_dosage(drug_name, age):
    """Get age-specific dosage recommendation"""
    try:
        drug = Drug.objects.filter(name__icontains=drug_name).first()
        if not drug:
            return None
            
        dosage_rec = DosageRecommendation.objects.filter(
            drug=drug,
            min_age__lte=age,
            max_age__gte=age
        ).first()
        
        if dosage_rec:
            return f"{dosage_rec.dosage_amount} {dosage_rec.frequency} via {dosage_rec.route}"
        return None
    except Exception:
        return None

def get_alternative_medications(drug_name):
    """Get alternative medications for a given drug"""
    try:
        drug = Drug.objects.filter(name__icontains=drug_name).first()
        if not drug:
            return []
            
        alternatives = AlternativeMedication.objects.filter(original_drug=drug)[:3]
        return [
            {
                'name': alt.alternative_drug.name,
                'reason': alt.reason_for_alternative,
                'efficacy': alt.efficacy_comparison
            } for alt in alternatives
        ]
    except Exception:
        return []

def get_severity_breakdown(interactions):
    """Get breakdown of interactions by severity"""
    breakdown = {'low': 0, 'moderate': 0, 'high': 0, 'severe': 0}
    for interaction in interactions:
        severity = interaction.get('severity', 'low')
        breakdown[severity] += 1
    return breakdown