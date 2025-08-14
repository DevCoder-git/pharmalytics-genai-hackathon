from djongo import models

class DatasetImport(models.Model):
    SOURCE_CHOICES = [
        ('drugbank', 'DrugBank'),
        ('fda', 'FDA'),
        ('who', 'WHO'),
        ('pharmgkb', 'PharmGKB'),
    ]
    
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    total_records = models.IntegerField(default=0)
    imported_records = models.IntegerField(default=0)
    failed_records = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='pending')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_log = models.TextField(blank=True)
    
    class Meta:
        db_table = "dataset_imports"