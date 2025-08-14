import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  MessageCircle, 
  Eye, 
  Pill, 
  Languages, 
  Shield, 
  Brain,
  Calendar,
  TrendingUp,
  Globe,
  Smartphone
} from "lucide-react";
import { VoiceAssistant } from "./VoiceAssistant";
import { ARPillIdentifier } from "./ARPillIdentifier";
import { AdherenceMonitor } from "./AdherenceMonitor";
import { MultiLanguageProcessor } from "./MultiLanguageProcessor";
import { BlockchainValidator } from "./BlockchainValidator";
import { PredictiveTimeline } from "./PredictiveTimeline";
import { ChronicDiseaseOptimizer } from "./ChronicDiseaseOptimizer";
import { RegionalDrugApproval } from "./RegionalDrugApproval";
import { PharmacogenomicsAnalysis } from "./PharmacogenomicsAnalysis";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'core' | 'advanced' | 'innovation';
  status: 'active' | 'beta' | 'coming-soon';
  component?: React.ReactNode;
}

export function AdvancedFeaturesHub() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'voice-assistant',
      name: 'Voice Medical Assistant',
      description: 'Hands-free drug safety checks and medical queries using voice commands',
      icon: <MessageCircle className="h-5 w-5" />,
      category: 'advanced',
      status: 'active',
      component: <VoiceAssistant />
    },
    {
      id: 'ar-pill-identifier',
      name: 'AR Pill Identifier',
      description: 'Identify pills and medications using augmented reality camera scanning',
      icon: <Eye className="h-5 w-5" />,
      category: 'innovation',
      status: 'beta',
      component: <ARPillIdentifier />
    },
    {
      id: 'adherence-monitor',
      name: 'Adherence Monitoring',
      description: 'Smart alerts and IoT-enabled pill bottle tracking for medication adherence',
      icon: <Pill className="h-5 w-5" />,
      category: 'advanced',
      status: 'active',
      component: <AdherenceMonitor />
    },
    {
      id: 'multi-language',
      name: 'Multi-Language Processor',
      description: 'Real-time medical text translation and understanding in 13+ languages',
      icon: <Languages className="h-5 w-5" />,
      category: 'advanced',
      status: 'active',
      component: <MultiLanguageProcessor />
    },
    {
      id: 'blockchain-validator',
      name: 'Blockchain Prescription Validator',
      description: 'Secure prescription verification and fraud prevention using blockchain',
      icon: <Shield className="h-5 w-5" />,
      category: 'innovation',
      status: 'beta',
      component: <BlockchainValidator />
    },
    {
      id: 'predictive-timeline',
      name: 'Predictive Interaction Timeline',
      description: 'AI-powered timeline prediction for when drug interactions might occur',
      icon: <Calendar className="h-5 w-5" />,
      category: 'innovation',
      status: 'active',
      component: <PredictiveTimeline />
    },
    {
      id: 'chronic-disease',
      name: 'Chronic Disease Optimization',
      description: 'Specialized drug recommendations for chronic disease management',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'advanced',
      status: 'active',
      component: <ChronicDiseaseOptimizer />
    },
    {
      id: 'regulatory-compliance',
      name: 'Regional Drug Approval Checker',
      description: 'Verify drug approval status across different countries and regions',
      icon: <Globe className="h-5 w-5" />,
      category: 'advanced',
      status: 'active',
      component: <RegionalDrugApproval />
    },
    {
      id: 'genomics-integration',
      name: 'Pharmacogenomics Analysis',
      description: 'Personalized drug recommendations based on genetic markers',
      icon: <Brain className="h-5 w-5" />,
      category: 'innovation',
      status: 'active',
      component: <PharmacogenomicsAnalysis />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'coming-soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'innovation': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeFeatureData = features.find(f => f.id === activeFeature);

  if (activeFeature && activeFeatureData?.component) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setActiveFeature(null)}
          >
            ← Back to Features
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{activeFeatureData.name}</h1>
            <p className="text-muted-foreground">{activeFeatureData.description}</p>
          </div>
        </div>
        {activeFeatureData.component}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight">Advanced Features Hub</h2>
        <p className="text-xl text-muted-foreground mt-2">
          Explore cutting-edge AI and blockchain-powered healthcare technologies
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="core">Core</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="innovation">Innovation</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card 
                key={feature.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => feature.status === 'active' || feature.status === 'beta' ? setActiveFeature(feature.id) : null}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                    {(feature.status === 'active' || feature.status === 'beta') && (
                      <Button size="sm">
                        Launch Feature
                      </Button>
                    )}
                    {feature.status === 'coming-soon' && (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="core">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => f.category === 'core').map(feature => (
              <Card 
                key={feature.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => feature.status === 'active' || feature.status === 'beta' ? setActiveFeature(feature.id) : null}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                    {(feature.status === 'active' || feature.status === 'beta') && (
                      <Button size="sm">
                        Launch Feature
                      </Button>
                    )}
                    {feature.status === 'coming-soon' && (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => f.category === 'advanced').map(feature => (
              <Card 
                key={feature.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => feature.status === 'active' || feature.status === 'beta' ? setActiveFeature(feature.id) : null}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                    {(feature.status === 'active' || feature.status === 'beta') && (
                      <Button size="sm">
                        Launch Feature
                      </Button>
                    )}
                    {feature.status === 'coming-soon' && (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="innovation">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => f.category === 'innovation').map(feature => (
              <Card 
                key={feature.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => feature.status === 'active' || feature.status === 'beta' ? setActiveFeature(feature.id) : null}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                    {(feature.status === 'active' || feature.status === 'beta') && (
                      <Button size="sm">
                        Launch Feature
                      </Button>
                    )}
                    {feature.status === 'coming-soon' && (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Features</p>
                <p className="text-2xl font-bold">{features.length}</p>
              </div>
              <Smartphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Features</p>
                <p className="text-2xl font-bold text-green-600">
                  {features.filter(f => f.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beta Features</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {features.filter(f => f.status === 'beta').length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                <p className="text-2xl font-bold text-blue-600">
                  {features.filter(f => f.status === 'coming-soon').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Powered by Advanced Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">AI & Machine Learning</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hugging Face Granite Models</li>
                <li>• Natural Language Processing</li>
                <li>• Computer Vision (OpenCV)</li>
                <li>• Predictive Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Blockchain & Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hyperledger Fabric</li>
                <li>• Digital Signatures</li>
                <li>• HIPAA Compliance</li>
                <li>• End-to-end Encryption</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">IoT & Hardware</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Smart Pill Bottles</li>
                <li>• Wearable Devices</li>
                <li>• Camera Integration</li>
                <li>• Voice Recognition</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}