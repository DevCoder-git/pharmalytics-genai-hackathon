from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import DatasetImport

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def import_status(request):
    imports = DatasetImport.objects.all().order_by('-started_at')[:10]
    data = []
    for imp in imports:
        data.append({
            'id': imp.id,
            'source': imp.source,
            'total_records': imp.total_records,
            'imported_records': imp.imported_records,
            'status': imp.status,
            'started_at': imp.started_at,
            'completed_at': imp.completed_at
        })
    return Response({'imports': data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_import(request):
    source = request.data.get('source')
    if source not in ['drugbank', 'fda', 'who', 'pharmgkb']:
        return Response({'error': 'Invalid source'}, status=status.HTTP_400_BAD_REQUEST)
    
    import_record = DatasetImport.objects.create(source=source, status='running')
    
    # This would trigger the actual import process
    # For now, we'll just return success
    return Response({
        'message': f'Import started for {source}',
        'import_id': import_record.id
    })