import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Database, 
  Shield, 
  Zap, 
  Globe, 
  Smartphone,
  AlertTriangle,
  ExternalLink
} from "lucide-react";

const TechnologyStack = () => {
  const techCategories = [
    {
      title: "AI & Machine Learning",
      icon: Brain,
      color: "from-primary to-primary-glow",
      technologies: [
        { name: "Hugging Face Transformers", description: "NLP models for medical text processing", status: "active" },
        { name: "IBM Granite Models", description: "Enterprise-grade AI for healthcare", status: "active" },
        { name: "OpenAI Whisper", description: "Voice recognition for hands-free queries", status: "planned" },
        { name: "TensorFlow/PyTorch", description: "Custom ML model development", status: "planned" }
      ]
    },
    {
      title: "Database & APIs",
      icon: Database,
      color: "from-medical-teal to-accent",
      technologies: [
        { name: "DrugBank API", description: "Comprehensive drug interaction database", status: "integration" },
        { name: "FDA Drug Label API", description: "Official FDA drug information", status: "integration" },
        { name: "WHO ATC/DDD Index", description: "Global dosage guidelines", status: "integration" },
        { name: "PostgreSQL", description: "Primary database for user data", status: "active" }
      ]
    },
    {
      title: "Security & Compliance",
      icon: Shield,
      color: "from-medical-green to-success",
      technologies: [
        { name: "Hyperledger Fabric", description: "Blockchain for prescription validation", status: "planned" },
        { name: "HIPAA Compliance", description: "Healthcare data protection standards", status: "active" },
        { name: "End-to-End Encryption", description: "Data security in transit and at rest", status: "active" },
        { name: "OAuth 2.0 / FHIR", description: "Healthcare identity standards", status: "planned" }
      ]
    },
    {
      title: "Frontend & Mobile",
      icon: Smartphone,
      color: "from-medical-amber to-warning",
      technologies: [
        { name: "React & TypeScript", description: "Modern web application framework", status: "active" },
        { name: "TailwindCSS", description: "Utility-first CSS framework", status: "active" },
        { name: "Progressive Web App", description: "Mobile-first responsive design", status: "active" },
        { name: "ARCore/ARKit", description: "Augmented reality pill identification", status: "planned" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "integration":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Integration Required</Badge>;
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              Technical Foundation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built on{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cutting-Edge Technology
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform leverages the latest advances in AI, blockchain, and healthcare technology 
              to deliver unparalleled safety and reliability.
            </p>
          </div>

          {/* Backend Integration Alert */}
          <Alert className="mb-12 border-medical-amber bg-medical-amber/5">
            <AlertTriangle className="h-4 w-4 text-medical-amber" />
            <AlertDescription className="text-medical-amber">
              <strong>Integration Note:</strong> This demo showcases the frontend interface. 
              To implement the full backend functionality including drug databases, AI models, and secure data storage, 
              connect your project to Supabase using our native integration.
            </AlertDescription>
          </Alert>

          {/* Technology Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {techCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="p-6 shadow-soft hover:shadow-medical transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {category.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h4 className="font-medium mr-3">{tech.name}</h4>
                            {getStatusBadge(tech.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{tech.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Integration Requirements */}
          <Card className="p-8 bg-gradient-to-br from-card to-muted/30 shadow-medical">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 mr-2 text-primary" />
                Required Integrations for Production
              </h3>
              <p className="text-muted-foreground">
                These external services and APIs are essential for full functionality
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-card rounded-lg shadow-soft">
                <Database className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">DrugBank API</h4>
                <p className="text-sm text-muted-foreground mb-3">Comprehensive drug database</p>
                <Badge variant="outline">API Key Required</Badge>
              </div>
              
              <div className="text-center p-4 bg-card rounded-lg shadow-soft">
                <Globe className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">FDA API Access</h4>
                <p className="text-sm text-muted-foreground mb-3">Official drug labeling data</p>
                <Badge variant="outline">Registration Required</Badge>
              </div>
              
              <div className="text-center p-4 bg-card rounded-lg shadow-soft">
                <Brain className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">Hugging Face</h4>
                <p className="text-sm text-muted-foreground mb-3">AI model inference</p>
                <Badge variant="outline">API Key Required</Badge>
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Ready to implement the full system with backend integration?
              </p>
              <Button size="lg" className="mr-4">
                <Shield className="w-4 h-4 mr-2" />
                Connect to Supabase
              </Button>
              <Button variant="outline" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechnologyStack;