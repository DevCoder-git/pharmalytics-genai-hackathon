import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Key, 
  Terminal, 
  Code, 
  FileText, 
  ExternalLink,
  Download,
  Upload,
  Settings,
  Brain
} from "lucide-react";

export const DatasetTrainingGuide = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dataset Training & API Configuration</h2>
        <p className="text-muted-foreground">
          Complete guide for training datasets and configuring API keys for PharmaLytics
        </p>
      </div>

      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys Configuration
          </CardTitle>
          <CardDescription>
            Configure your API keys for external data sources and AI models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {/* HuggingFace API */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">1. HuggingFace API Key</h3>
                <Badge variant="secondary">Required for AI Models</Badge>
              </div>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Used for: AI-powered drug interaction analysis, clinical predictions, and NLP processing
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Get your key:</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      HuggingFace Tokens
                    </a>
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs font-mono">
                    Frontend: Go to Dashboard → Settings → API Keys → Configure HuggingFace Key
                  </p>
                  <p className="text-xs font-mono mt-1">
                    Backend: Add to backend/.env → HUGGINGFACE_API_KEY=your_key_here
                  </p>
                </div>
              </div>
            </div>

            {/* DrugBank API */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">2. DrugBank API Key</h3>
                <Badge variant="secondary">Drug Database</Badge>
              </div>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Used for: Comprehensive drug information, interactions, and pharmacological data
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Get your key:</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://go.drugbank.com/releases/latest#open-data" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      DrugBank Open Data
                    </a>
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs font-mono">
                    Backend: Add to backend/.env → DRUGBANK_API_KEY=your_key_here
                  </p>
                </div>
              </div>
            </div>

            {/* FDA API */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">3. FDA API Key</h3>
                <Badge variant="secondary">Regulatory Data</Badge>
              </div>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Used for: FDA drug approvals, safety alerts, and regulatory information
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Get your key:</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://open.fda.gov/apis/authentication/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      openFDA API
                    </a>
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs font-mono">
                    Backend: Add to backend/.env → FDA_API_KEY=your_key_here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Training Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Dataset Training Guide
          </CardTitle>
          <CardDescription>
            How to train and import datasets for enhanced AI performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Backend Setup */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Step 1: Backend Setup
              </h3>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Set up the Django backend environment for dataset training
                </p>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div># Navigate to backend directory</div>
                    <div>cd backend</div>
                    <div></div>
                    <div># Create virtual environment</div>
                    <div>python -m venv venv</div>
                    <div>source venv/bin/activate  # Linux/Mac</div>
                    <div># or</div>
                    <div>venv\\Scripts\\activate     # Windows</div>
                    <div></div>
                    <div># Install dependencies</div>
                    <div>pip install -r requirements.txt</div>
                    <div></div>
                    <div># Setup environment variables</div>
                    <div>cp .env.example .env</div>
                    <div># Edit .env with your API keys</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Setup */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Step 2: Database Setup
              </h3>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Initialize MongoDB and run database migrations
                </p>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div># Start MongoDB (if local)</div>
                    <div>mongod</div>
                    <div></div>
                    <div># Run Django migrations</div>
                    <div>python manage.py makemigrations</div>
                    <div>python manage.py migrate</div>
                    <div></div>
                    <div># Create superuser</div>
                    <div>python manage.py createsuperuser</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Import Datasets */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Step 3: Import Training Datasets
              </h3>
              <div className="pl-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import pharmaceutical datasets for AI model training
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium">DrugBank Dataset Import:</h4>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div># Import DrugBank drug data</div>
                    <div>python manage.py import_drugbank</div>
                    <div></div>
                    <div># This will:</div>
                    <div># - Download DrugBank open data</div>
                    <div># - Parse drug interactions</div>
                    <div># - Store in MongoDB collections</div>
                    <div># - Prepare data for AI training</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">FDA Dataset Import:</h4>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div># Import FDA regulatory data</div>
                    <div>python manage.py import_fda_data</div>
                    <div></div>
                    <div># This will:</div>
                    <div># - Fetch FDA drug approval data</div>
                    <div># - Import adverse event reports</div>
                    <div># - Process safety information</div>
                    <div># - Enhance AI model accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Model Training */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Step 4: AI Model Training
              </h3>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Train custom AI models with your imported datasets
                </p>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div># Start the Django development server</div>
                    <div>python manage.py runserver</div>
                    <div></div>
                    <div># Access AI training endpoints:</div>
                    <div># POST /api/ai-models/train/</div>
                    <div># GET /api/ai-models/status/</div>
                    <div># POST /api/ai-models/predict/</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Docker Deployment */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-4 w-4" />
                Step 5: Docker Deployment (Optional)
              </h3>
              <div className="pl-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Deploy the entire stack using Docker Compose
                </p>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div># Build and start all services</div>
                    <div>docker-compose up --build</div>
                    <div></div>
                    <div># This will start:</div>
                    <div># - Django backend (port 8000)</div>
                    <div># - MongoDB database</div>
                    <div># - Redis for caching</div>
                    <div># - Celery for background tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Structure Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Important Files Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Configuration Files:</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div>• <code>backend/.env</code> - API keys & database config</div>
                <div>• <code>backend/requirements.txt</code> - Python dependencies</div>
                <div>• <code>backend/docker-compose.yml</code> - Docker services</div>
                <div>• <code>backend/settings.py</code> - Django configuration</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Dataset Management:</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div>• <code>datasets/management/commands/</code> - Import scripts</div>
                <div>• <code>datasets/models.py</code> - Data models</div>
                <div>• <code>ai_models/services.py</code> - AI training logic</div>
                <div>• <code>drug_interactions/models.py</code> - Interaction data</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="https://docs.djangoproject.com/en/4.2/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Django Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://huggingface.co/docs" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                HuggingFace Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.mongodb.com/docs/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                MongoDB Docs
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.location.hash = 'settings'}>
              <Settings className="mr-2 h-4 w-4" />
              Configure API Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};