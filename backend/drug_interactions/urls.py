from django.urls import path
from . import views

urlpatterns = [
    path('', views.DrugListView.as_view(), name='drug-list'),
    path('<str:drug_id>/', views.DrugDetailView.as_view(), name='drug-detail'),
    path('search/', views.search_medications, name='search-medications'),
    path('check-interactions/', views.check_drug_interactions, name='check-interactions'),
    path('interaction-history/', views.get_user_interaction_history, name='interaction-history'),
]