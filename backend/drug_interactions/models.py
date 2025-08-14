from djongo import models
from django.contrib.auth.models import User
import uuid

class Drug(models.Model):
    drug_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=200, blank=True)
    brand_names = models.JSONField(default=list)
    drug_class = models.CharField(max_length=100)
    mechanism_of_action = models.TextField()
    indications = models.JSONField(default=list)
    contraindications = models.JSONField(default=list)
    dosage_forms = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "drugs"
        
    def __str__(self):
        return f"{self.name} ({self.generic_name})"

class DrugInteraction(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High'),
        ('severe', 'Severe'),
    ]
    
    interaction_id = models.UUIDField(default=uuid.uuid4, unique=True)
    drug1 = models.ForeignKey(Drug, on_delete=models.CASCADE, related_name='interactions_as_drug1')
    drug2 = models.ForeignKey(Drug, on_delete=models.CASCADE, related_name='interactions_as_drug2')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    description = models.TextField()
    mechanism = models.TextField()
    clinical_effects = models.JSONField(default=list)
    management_recommendations = models.TextField()
    evidence_level = models.CharField(max_length=50)
    references = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "drug_interactions"
        unique_together = ['drug1', 'drug2']

    def __str__(self):
        return f"{self.drug1.name} + {self.drug2.name} ({self.severity})"

class DosageRecommendation(models.Model):
    drug = models.ForeignKey(Drug, on_delete=models.CASCADE)
    age_group = models.CharField(max_length=50)  # e.g., "pediatric", "adult", "geriatric"
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    weight_min = models.FloatField(null=True, blank=True)
    weight_max = models.FloatField(null=True, blank=True)
    indication = models.CharField(max_length=200)
    dosage_amount = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    route = models.CharField(max_length=50)
    duration = models.CharField(max_length=100, blank=True)
    special_considerations = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "dosage_recommendations"

class AlternativeMedication(models.Model):
    original_drug = models.ForeignKey(Drug, on_delete=models.CASCADE, related_name='alternatives')
    alternative_drug = models.ForeignKey(Drug, on_delete=models.CASCADE)
    reason_for_alternative = models.CharField(max_length=200)
    efficacy_comparison = models.TextField()
    safety_profile = models.TextField()
    cost_comparison = models.CharField(max_length=100, blank=True)
    therapeutic_equivalence = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "alternative_medications"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    medical_conditions = models.JSONField(default=list)
    allergies = models.JSONField(default=list)
    current_medications = models.JSONField(default=list)
    genetic_markers = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "patient_profiles"

class InteractionCheck(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    medications = models.JSONField()  # List of medication objects
    patient_age = models.IntegerField(null=True, blank=True)
    interactions_found = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    risk_score = models.FloatField(null=True, blank=True)
    checked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "interaction_checks"