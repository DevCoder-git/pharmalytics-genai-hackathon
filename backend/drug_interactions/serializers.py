from rest_framework import serializers
from .models import Drug, DrugInteraction, DosageRecommendation, InteractionCheck, PatientProfile

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = '__all__'

class DrugInteractionSerializer(serializers.ModelSerializer):
    drug1_name = serializers.CharField(source='drug1.name', read_only=True)
    drug2_name = serializers.CharField(source='drug2.name', read_only=True)
    
    class Meta:
        model = DrugInteraction
        fields = '__all__'

class InteractionCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionCheck
        fields = '__all__'
        read_only_fields = ('user',)