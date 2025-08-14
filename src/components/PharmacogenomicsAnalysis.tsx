import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Brain, 
  Dna, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Upload,
  Download,
  Zap
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface GeneticVariant {
  gene: string;
  variant: string;
  genotype: string;
  phenotype: string;
  metabolizerType: 'poor' | 'intermediate' | 'normal' | 'rapid' | 'ultra-rapid';
  clinicalSignificance: 'high' | 'moderate' | 'low';
}

interface DrugRecommendation {
  drug: string;
  recommendation: 'standard' | 'reduced' | 'increased' | 'alternative' | 'avoid';
  reason: string;
  dosageAdjustment?: string;
  monitoring?: string;
  alternatives?: string[];
  evidence: 'strong' | 'moderate' | 'limited';
}

interface PharmacogenomicProfile {
  patientId: string;
  variants: GeneticVariant[];
  recommendations: DrugRecommendation[];
  riskFactors: string[];
  lastUpdated: string;
}

const commonVariants = [
  {
    gene: 'CYP2D6',
    description: 'Metabolizes ~25% of all medications including codeine, tramadol, antidepressants',
    variants: ['*1/*1', '*1/*2', '*2/*2', '*3/*4', '*4/*4', '*5/*5']
  },
  {
    gene: 'CYP2C19',
    description: 'Metabolizes clopidogrel, omeprazole, antidepressants',
    variants: ['*1/*1', '*1/*2', '*1/*17', '*2/*2', '*2/*17', '*17/*17']
  },
  {
    gene: 'CYP2C9',
    description: 'Metabolizes warfarin, phenytoin, NSAIDs',
    variants: ['*1/*1', '*1/*2', '*1/*3', '*2/*2', '*2/*3', '*3/*3']
  },
  {
    gene: 'VKORC1',
    description: 'Warfarin sensitivity gene',
    variants: ['AA', 'AG', 'GG']
  },
  {
    gene: 'SLCO1B1',
    description: 'Statin-induced myopathy risk',
    variants: ['*1/*1', '*1/*5', '*5/*5']
  },
  {
    gene: 'TPMT',
    description: 'Thiopurine metabolism',
    variants: ['*1/*1', '*1/*2', '*1/*3A', '*2/*3A', '*3A/*3A']
  }
];

export function PharmacogenomicsAnalysis() {
  const [profile, setProfile] = useState<PharmacogenomicProfile | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const generateRecommendations = async () => {
    if (!patientId || Object.keys(selectedVariants).length === 0) {
      toast.error('Please enter patient ID and select genetic variants');
      return;
    }

    setLoading(true);
    try {
      // Simulate pharmacogenomic analysis
      const variants: GeneticVariant[] = Object.entries(selectedVariants).map(([gene, variant]) => {
        const geneInfo = commonVariants.find(v => v.gene === gene);
        
        // Determine metabolizer type based on variant
        let metabolizerType: GeneticVariant['metabolizerType'] = 'normal';
        let phenotype = 'Normal metabolizer';
        
        if (gene === 'CYP2D6') {
          if (variant.includes('*4') || variant.includes('*5')) {
            metabolizerType = 'poor';
            phenotype = 'Poor metabolizer';
          } else if (variant.includes('*2')) {
            metabolizerType = 'intermediate';
            phenotype = 'Intermediate metabolizer';
          }
        }
        
        if (gene === 'CYP2C19') {
          if (variant.includes('*2')) {
            metabolizerType = 'poor';
            phenotype = 'Poor metabolizer';
          } else if (variant.includes('*17')) {
            metabolizerType = 'rapid';
            phenotype = 'Rapid metabolizer';
          }
        }

        return {
          gene,
          variant,
          genotype: variant,
          phenotype,
          metabolizerType,
          clinicalSignificance: variant.includes('*1/*1') ? 'low' : 'high'
        };
      });

      // Generate drug recommendations based on variants
      const recommendations: DrugRecommendation[] = [];

      variants.forEach(variant => {
        if (variant.gene === 'CYP2D6' && variant.metabolizerType === 'poor') {
          recommendations.push({
            drug: 'Codeine',
            recommendation: 'avoid',
            reason: 'Poor CYP2D6 metabolizer - reduced conversion to active morphine',
            alternatives: ['Morphine', 'Hydromorphone'],
            evidence: 'strong'
          });
          
          recommendations.push({
            drug: 'Tramadol',
            recommendation: 'alternative',
            reason: 'Reduced analgesic efficacy in poor CYP2D6 metabolizers',
            alternatives: ['Morphine', 'Oxycodone'],
            evidence: 'strong'
          });
        }

        if (variant.gene === 'CYP2C19' && variant.metabolizerType === 'poor') {
          recommendations.push({
            drug: 'Clopidogrel',
            recommendation: 'alternative',
            reason: 'Poor CYP2C19 metabolizer - reduced antiplatelet efficacy',
            alternatives: ['Prasugrel', 'Ticagrelor'],
            evidence: 'strong'
          });
        }

        if (variant.gene === 'CYP2C9' && variant.variant !== '*1/*1') {
          recommendations.push({
            drug: 'Warfarin',
            recommendation: 'reduced',
            reason: 'CYP2C9 variant - increased bleeding risk',
            dosageAdjustment: 'Reduce initial dose by 25-50%',
            monitoring: 'Increased INR monitoring required',
            evidence: 'strong'
          });
        }

        if (variant.gene === 'SLCO1B1' && variant.variant.includes('*5')) {
          recommendations.push({
            drug: 'Simvastatin',
            recommendation: 'reduced',
            reason: 'SLCO1B1 variant - increased myopathy risk',
            dosageAdjustment: 'Maximum dose 20mg daily',
            monitoring: 'Monitor for muscle pain and CK levels',
            evidence: 'strong'
          });
        }
      });

      const riskFactors = [];
      if (variants.some(v => v.metabolizerType === 'poor')) {
        riskFactors.push('Poor metabolizer phenotype present');
      }
      if (variants.some(v => v.clinicalSignificance === 'high')) {
        riskFactors.push('High clinical significance variants detected');
      }

      const newProfile: PharmacogenomicProfile = {
        patientId,
        variants,
        recommendations,
        riskFactors,
        lastUpdated: new Date().toISOString()
      };

      setProfile(newProfile);
      setActiveTab('results');
      toast.success('Pharmacogenomic analysis completed');

    } catch (error) {
      toast.error('Failed to generate pharmacogenomic analysis');
    } finally {
      setLoading(false);
    }
  };

  const getMetabolizerColor = (type: string) => {
    switch (type) {
      case 'poor': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'rapid': return 'bg-blue-100 text-blue-800';
      case 'ultra-rapid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'standard': return 'bg-green-100 text-green-800';
      case 'reduced': return 'bg-yellow-100 text-yellow-800';
      case 'increased': return 'bg-blue-100 text-blue-800';
      case 'alternative': return 'bg-orange-100 text-orange-800';
      case 'avoid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'standard': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'avoid': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Pharmacogenomics Analysis
          </CardTitle>
          <CardDescription>
            Personalized drug recommendations based on genetic markers and metabolizer status
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Genetic Input</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="recommendations">Drug Recommendations</TabsTrigger>
          <TabsTrigger value="reports">Clinical Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Enter patient details for pharmacogenomic analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient identifier"
                />
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Genetic Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <Dna className="mr-2 h-4 w-4" />
                  Import from Lab
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Genetic Variants Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Genetic Variants</CardTitle>
              <CardDescription>
                Select genetic variants for pharmacogenomic analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {commonVariants.map(geneInfo => (
                <div key={geneInfo.gene} className="space-y-3">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Dna className="h-4 w-4" />
                      {geneInfo.gene}
                    </h4>
                    <p className="text-sm text-muted-foreground">{geneInfo.description}</p>
                  </div>
                  
                  <Select
                    value={selectedVariants[geneInfo.gene] || ''}
                    onValueChange={(value) => setSelectedVariants(prev => ({
                      ...prev,
                      [geneInfo.gene]: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${geneInfo.gene} variant`} />
                    </SelectTrigger>
                    <SelectContent>
                      {geneInfo.variants.map(variant => (
                        <SelectItem key={variant} value={variant}>
                          {variant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button onClick={generateRecommendations} disabled={loading} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                {loading ? 'Analyzing Genetics...' : 'Generate Pharmacogenomic Analysis'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {!profile ? (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
                <p className="text-muted-foreground">
                  Complete genetic input to view pharmacogenomic analysis
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Pharmacogenomic Profile</CardTitle>
                  <CardDescription>
                    Patient ID: {profile.patientId} • Last Updated: {new Date(profile.lastUpdated).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profile.variants.length}</div>
                      <p className="text-sm text-muted-foreground">Genes Analyzed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{profile.recommendations.length}</div>
                      <p className="text-sm text-muted-foreground">Drug Recommendations</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{profile.riskFactors.length}</div>
                      <p className="text-sm text-muted-foreground">Risk Factors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Genetic Variants Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Genetic Variants Analysis</CardTitle>
                  <CardDescription>
                    Metabolizer status and clinical significance by gene
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.variants.map((variant, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{variant.gene}</h4>
                            <p className="text-sm text-muted-foreground">
                              Genotype: {variant.genotype}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getMetabolizerColor(variant.metabolizerType)}>
                              {variant.metabolizerType} metabolizer
                            </Badge>
                            <Badge variant={variant.clinicalSignificance === 'high' ? 'destructive' : 'secondary'}>
                              {variant.clinicalSignificance} significance
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm">{variant.phenotype}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              {profile.riskFactors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profile.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {!profile?.recommendations.length ? (
            <Card>
              <CardContent className="text-center py-12">
                <Dna className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
                <p className="text-muted-foreground">
                  Complete genetic analysis to view personalized drug recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Personalized Drug Recommendations ({profile.recommendations.length})
                </h3>
                <Badge variant="outline">
                  Evidence-Based
                </Badge>
              </div>

              {profile.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getRecommendationIcon(rec.recommendation)}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{rec.drug}</h4>
                          <Badge className={getRecommendationColor(rec.recommendation)}>
                            {rec.recommendation}
                          </Badge>
                          <Badge variant="outline">
                            {rec.evidence} evidence
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        
                        {rec.dosageAdjustment && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Dosage Adjustment:</strong> {rec.dosageAdjustment}
                            </p>
                          </div>
                        )}
                        
                        {rec.monitoring && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Monitoring:</strong> {rec.monitoring}
                            </p>
                          </div>
                        )}
                        
                        {rec.alternatives && rec.alternatives.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Alternatives:</strong> {rec.alternatives.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Reports</CardTitle>
              <CardDescription>
                Generate clinical reports for healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Pharmacogenomic Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive genetic analysis and drug recommendations
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Generate PDF Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Clinical Summary</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Brief summary for clinical decision making
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Generate Summary
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}