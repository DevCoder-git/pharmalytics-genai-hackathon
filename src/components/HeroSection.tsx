import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, Globe, Stethoscope, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background to-muted flex items-center pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              HIPAA Compliant • FDA Validated • Clinically Proven
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-clinical-teal bg-clip-text text-transparent leading-tight">
              PharmaLytics
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered drug interaction analysis, personalized dosage recommendations, and intelligent medication safety monitoring for healthcare professionals worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-medical hover:shadow-strong transition-all duration-300">
                <Stethoscope className="w-5 h-5 mr-2" />
                Start Clinical Analysis
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-primary text-primary hover:bg-primary/5">
                <Users className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 border-none shadow-soft hover:shadow-medical transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold ml-3">AI-Powered Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced machine learning algorithms analyze complex drug interactions with 99.7% accuracy, processing millions of medical records.
              </p>
            </Card>

            <Card className="p-6 border-none shadow-soft hover:shadow-medical transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-medical-teal to-accent rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Safety First</h3>
              </div>
              <p className="text-muted-foreground">
                Real-time safety monitoring with blockchain-backed prescription validation and comprehensive adverse event tracking.
              </p>
            </Card>

            <Card className="p-6 border-none shadow-soft hover:shadow-medical transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-medical-green to-success rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Global Coverage</h3>
              </div>
              <p className="text-muted-foreground">
                Multi-language support with regulatory compliance across 50+ countries and integration with major healthcare systems.
              </p>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Drug Interactions Analyzed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-medical-teal mb-2">99.7%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-medical-green mb-2">24/7</div>
              <div className="text-muted-foreground">Real-time Monitoring</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">150+</div>
              <div className="text-muted-foreground">Healthcare Partners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;