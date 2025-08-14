from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('user_management.urls')),
    path('api/v1/drugs/', include('drug_interactions.urls')),
    path('api/v1/ai/', include('ai_models.urls')),
    path('api/v1/datasets/', include('datasets.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)