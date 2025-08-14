# PharmaLytics Nexus Backend

Django REST API backend for the PharmaLytics Nexus drug interaction analysis platform.

## Features

- **Drug Interaction Detection**: AI-powered analysis using Hugging Face Granite models
- **MongoDB Integration**: Scalable NoSQL database for drug data
- **Dataset Import**: Commands to import from DrugBank, FDA, and WHO datasets
- **REST API**: Comprehensive API endpoints for frontend integration
- **Celery Tasks**: Background processing for heavy AI computations
- **Authentication**: Token-based authentication for healthcare professionals

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys and database credentials
nano .env
```

### 2. Docker Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Import sample drug data
docker-compose exec web python manage.py import_drugbank --limit 100
docker-compose exec web python manage.py import_fda_data --limit 100
```

### 3. Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Start MongoDB and Redis
# (Install and start MongoDB and Redis on your system)

# Run migrations
python manage.py migrate

# Import drug datasets
python manage.py import_drugbank --api --limit 1000
python manage.py import_fda_data --limit 1000

# Start development server
python manage.py runserver

# Start Celery worker (in another terminal)
celery -A pharmalytics_backend worker --loglevel=info
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/logout/` - User logout

### Drug Data
- `GET /api/v1/drugs/` - List all drugs
- `GET /api/v1/drugs/{drug_id}/` - Get drug details
- `GET /api/v1/drugs/search/?q={query}` - Search medications

### Drug Interactions
- `POST /api/v1/drugs/check-interactions/` - Check drug interactions
- `GET /api/v1/drugs/interaction-history/` - Get user's interaction history

### AI Services
- `POST /api/v1/ai/analyze-interaction/` - AI-powered interaction analysis
- `POST /api/v1/ai/calculate-dosage/` - Age-specific dosage calculation
- `POST /api/v1/ai/extract-medications/` - Extract meds from medical text
- `POST /api/v1/ai/analyze-side-effects/` - Side effect analysis

## Required API Keys

Add these to your `.env` file:

```bash
# Hugging Face (for Granite models)
HUGGINGFACE_API_KEY=hf_your_token_here

# DrugBank (for drug interaction database)
DRUGBANK_API_KEY=your_drugbank_key

# FDA (for drug labeling data)
FDA_API_KEY=your_fda_key
```

## Dataset Import Commands

```bash
# Import from DrugBank API
python manage.py import_drugbank --api --limit 1000

# Import from DrugBank XML file
python manage.py import_drugbank --file /path/to/drugbank.xml --limit 1000

# Import FDA drug labels
python manage.py import_fda_data --limit 1000 --skip 0
```

## AI Model Integration

The backend integrates with Hugging Face Granite models for:

1. **Drug Interaction Analysis**: Uses `ibm-granite/granite-7b-instruct`
2. **Dosage Calculations**: Uses `ibm-granite/granite-3b-code-instruct`
3. **Medical Text Extraction**: NLP processing of prescriptions
4. **Side Effect Analysis**: Risk assessment and scoring

## Development

### Project Structure

```
backend/
├── pharmalytics_backend/     # Django project settings
├── drug_interactions/        # Drug data and interaction models
├── ai_models/               # AI service integrations
├── datasets/                # Data import management commands
├── user_management/         # Authentication and user profiles
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker services
└── README.md               # This file
```

### Adding New Features

1. Create new Django apps for different functionalities
2. Add models to appropriate apps
3. Create serializers for API responses
4. Add views and URL patterns
5. Write tests for new functionality

## Deployment

### Production Deployment

1. Set `DEBUG=False` in production
2. Configure proper database credentials
3. Set up reverse proxy (nginx)
4. Use gunicorn for WSGI server
5. Set up monitoring and logging

### Environment Variables for Production

```bash
DEBUG=False
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
DJANGO_SECRET_KEY=your-production-secret-key
MONGO_URI=mongodb://user:pass@your-mongo-cluster
REDIS_URL=redis://your-redis-instance
```

## API Usage Examples

### Check Drug Interactions

```bash
curl -X POST http://localhost:8000/api/v1/drugs/check-interactions/ \
  -H "Authorization: Token your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "medications": [
      {"name": "Warfarin", "dosage": "5mg", "frequency": "daily"},
      {"name": "Aspirin", "dosage": "81mg", "frequency": "daily"}
    ],
    "patient_age": 65
  }'
```

### Search Medications

```bash
curl "http://localhost:8000/api/v1/drugs/search/?q=aspirin"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.