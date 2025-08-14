from django.urls import path
from . import views

urlpatterns = [
    path('analyze-interaction/', views.analyze_interaction, name='analyze-interaction'),
    path('dosage-recommendation/', views.get_dosage_recommendation, name='dosage-recommendation'),
    path('analyze-side-effects/', views.analyze_side_effects, name='analyze-side-effects'),
    path('extract-from-text/', views.extract_from_text, name='extract-from-text'),
]