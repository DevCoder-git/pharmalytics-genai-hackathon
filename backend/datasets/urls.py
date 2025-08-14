from django.urls import path
from . import views

urlpatterns = [
    path('import-status/', views.import_status, name='import-status'),
    path('start-import/', views.start_import, name='start-import'),
]