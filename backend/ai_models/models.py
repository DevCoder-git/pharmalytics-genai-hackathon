from djongo import models
from django.contrib.auth.models import User

class AIAnalysis(models.Model):
    ANALYSIS_TYPES = [
        ('interaction', 'Drug Interaction'),
        ('dosage', 'Dosage Recommendation'),
        ('side_effect', 'Side Effect Analysis'),
        ('alternative', 'Alternative Medication'),
        ('text_extraction', 'Text Extraction'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis_type = models.CharField(max_length=20, choices=ANALYSIS_TYPES)
    input_data = models.JSONField()
    result_data = models.JSONField()
    confidence_score = models.FloatField(null=True, blank=True)
    processing_time = models.FloatField(null=True, blank=True)
    model_version = models.CharField(max_length=50, default='granite-v1')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "ai_analyses"