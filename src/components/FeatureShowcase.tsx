import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calculator, 
  Pill, 
  FileText, 
  Heart, 
  Mic, 
  Camera, 
  Shield,
  TrendingUp,
  Globe2,
  Clock,
  Users
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Drug Interaction Detection",
    description: "Instantly detect harmful interactions between multiple medications using our comprehensive database.",
    category: "Core",
    color: "from-primary to-primary-glow"
  },
  {
    icon: Calculator,
    title: "Age-Specific Dosage",
    description: "Get precise dosage recommendations tailored to patient age, weight, and medical conditions.",
    category: "Core",
    color: "from-medical-teal to-accent"
  },
  {
    icon: Pill,
    title: "Alternative Medications",
    description: "Discover safer drug alternatives when interactions or contraindications are identified.",
    category: "Core",
    color: "from-medical-green to-success"
  },
  {
    icon: FileText,
    title: "NLP Text Extraction",
    description: "Extract structured medication data from prescriptions and clinical notes using advanced NLP.",
    category: "Core",
    color: "from-medical-amber to-warning"
  },
  {
    icon: Heart,
    title: "Personalized Predictions",
    description: "AI-driven predictions based on genetics and health history for optimal treatment outcomes.",
    category: "Advanced",
    color: "from-primary to-medical-teal"
  },
  {
    icon: Globe2,
    title: "Multi-Language Support",
    description: "Process medical data in multiple languages with accurate translation and analysis.",
    category: "Advanced",
    color: "from-accent to-medical-blue"
  },
  {
    icon: TrendingUp,
    title: "Side Effect Scoring",
    description: "Rate potential side effects by severity and probability using machine learning algorithms.",
    category: "Advanced",
    color: "from-medical-teal to-medical-green"
  },
  {
    icon: Mic,
    title: "Voice Assistant",
    description: "Hands-free drug safety checks through intelligent voice recognition and processing.",
    category: "Advanced",
    color: "from-medical-amber to-medical-red"
  },
  {
    icon: Camera,
    title: "AR Pill Identifier",
    description: "Identify medications and packaging through augmented reality camera scanning.",
    category: "Innovation",
    color: "from-primary to-accent"
  },
  {
    icon: Shield,
    title: "Blockchain Validation",
    description: "Secure prescription validation and fraud prevention using blockchain technology.",
    category: "Innovation",
    color: "from-medical-green to-primary"
  },
  {
    icon: Clock,
    title: "Predictive Timeline",
    description: "Forecast when drug interactions might become problematic over time.",
    category: "Innovation",
    color: "from-medical-teal to-medical-amber"
  },
  {
    icon: Users,
    title: "Adherence Monitoring",
    description: "Track medication adherence through IoT devices and smart reminder systems.",
    category: "Innovation",
    color: "from-accent to-medical-red"
  }
];

const FeatureShowcase = () => {
  const categories = ["Core", "Advanced", "Innovation"];
  
  return (
    <section className="py-24 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              Comprehensive Feature Set
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Safe Medication Management
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From basic drug interaction checking to advanced AI-powered predictions, 
              our platform covers every aspect of modern pharmaceutical safety.
            </p>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-16">
              <div className="flex items-center mb-8">
                <Badge 
                  variant={category === "Core" ? "default" : category === "Advanced" ? "secondary" : "outline"}
                  className="mr-4 px-3 py-1"
                >
                  {category} Features
                </Badge>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features
                  .filter((feature) => feature.category === category)
                  .map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={index} className="p-6 border-none shadow-soft hover:shadow-medical transition-all duration-300 group">
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;