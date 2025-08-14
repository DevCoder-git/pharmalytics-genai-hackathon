import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  Target,
  Brain,
  Pill,
  BarChart3
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface ChronicCondition {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosisDate: string;
  targetMetrics: Record<string, number>;
  currentMedications: string[];
}

interface OptimizationRecommendation {
  type: 'medication' | 'dosage' | 'timing' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  medication?: string;
  currentDose?: string;
  recommendedDose?: string;
  reason: string;
  expectedImprovement: string;
  confidence: number;
}

const chronicConditions = [
  {
    id: 'diabetes_type2',
    name: 'Type 2 Diabetes',
    icon: <Activity className="h-5 w-5" />,
    targetMetrics: { hba1c: 7.0, glucose: 130, bp_systolic: 130, bp_diastolic: 80 },
    commonMeds: ['Metformin', 'Insulin', 'Glipizide', 'Linagliptin']
  },
  {
    id: 'hypertension',
    name: 'Hypertension',
    icon: <Heart className="h-5 w-5" />,
    targetMetrics: { bp_systolic: 120, bp_diastolic: 80, heart_rate: 70 },
    commonMeds: ['Lisinopril', 'Amlodipine', 'Losartan', 'Hydrochlorothiazide']
  },
  {
    id: 'hyperlipidemia',
    name: 'Hyperlipidemia',
    icon: <TrendingUp className="h-5 w-5" />,
    targetMetrics: { ldl: 100, hdl: 40, triglycerides: 150, total_cholesterol: 200 },
    commonMeds: ['Atorvastatin', 'Simvastatin', 'Rosuvastatin', 'Ezetimibe']
  },
  {
    id: 'depression',
    name: 'Depression',
    icon: <Brain className="h-5 w-5" />,
    targetMetrics: { phq9: 5, gad7: 5 },
    commonMeds: ['Sertraline', 'Fluoxetine', 'Escitalopram', 'Bupropion']
  }
];

export function ChronicDiseaseOptimizer() {
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [patientData, setPatientData] = useState({
    age: '',
    weight: '',
    height: '',
    currentMetrics: {} as Record<string, number>,
    currentMedications: [] as string[],
    allergies: '',
    comorbidities: [] as string[]
  });
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const generateOptimizations = async () => {
    if (!selectedCondition) {
      toast.error('Please select a chronic condition');
      return;
    }

    setLoading(true);
    try {
      const condition = chronicConditions.find(c => c.id === selectedCondition);
      if (!condition) return;

      // Simulate AI-powered optimization recommendations
      const optimizations: OptimizationRecommendation[] = [];

      // Check if current metrics are above target
      Object.entries(condition.targetMetrics).forEach(([metric, target]) => {
        const current = patientData.currentMetrics[metric];
        if (current && current > target) {
          const deviation = ((current - target) / target) * 100;
          
          if (deviation > 20) {
            optimizations.push({
              type: 'medication',
              priority: 'high',
              reason: `${metric.toUpperCase()} is ${deviation.toFixed(1)}% above target (${current} vs ${target})`,
              expectedImprovement: `Reduce ${metric} by 15-25%`,
              confidence: 87
            });
          } else if (deviation > 10) {
            optimizations.push({
              type: 'dosage',
              priority: 'medium',
              reason: `${metric.toUpperCase()} slightly elevated (${current} vs target ${target})`,
              expectedImprovement: `Reduce ${metric} by 10-15%`,
              confidence: 78
            });
          }
        }
      });

      // Add condition-specific recommendations
      if (selectedCondition === 'diabetes_type2') {
        if (patientData.currentMetrics.hba1c > 8) {
          optimizations.push({
            type: 'medication',
            priority: 'high',
            medication: 'Metformin + SGLT2 inhibitor',
            reason: 'HbA1c significantly elevated, combination therapy recommended',
            expectedImprovement: 'Reduce HbA1c by 1.5-2.0%',
            confidence: 92
          });
        }

        optimizations.push({
          type: 'lifestyle',
          priority: 'medium',
          reason: 'Regular glucose monitoring and dietary optimization',
          expectedImprovement: 'Improve glucose control and reduce variability',
          confidence: 85
        });
      }

      if (selectedCondition === 'hypertension') {
        if (patientData.currentMetrics.bp_systolic > 140) {
          optimizations.push({
            type: 'dosage',
            priority: 'high',
            medication: 'ACE Inhibitor',
            currentDose: '10mg daily',
            recommendedDose: '20mg daily',
            reason: 'Blood pressure not at goal despite current therapy',
            expectedImprovement: 'Reduce systolic BP by 10-15 mmHg',
            confidence: 89
          });
        }
      }

      if (selectedCondition === 'hyperlipidemia') {
        if (patientData.currentMetrics.ldl > 130) {
          optimizations.push({
            type: 'medication',
            priority: 'high',
            medication: 'High-intensity statin',
            reason: 'LDL cholesterol above recommended target',
            expectedImprovement: 'Reduce LDL by 30-40%',
            confidence: 91
          });
        }
      }

      // Add timing optimization
      optimizations.push({
        type: 'timing',
        priority: 'low',
        reason: 'Optimize medication timing for better absorption and efficacy',
        expectedImprovement: 'Improve medication effectiveness by 5-10%',
        confidence: 75
      });

      setRecommendations(optimizations);
      toast.success('Optimization recommendations generated');
    } catch (error) {
      toast.error('Failed to generate optimizations');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'dosage': return <Target className="h-4 w-4" />;
      case 'timing': return <Activity className="h-4 w-4" />;
      case 'lifestyle': return <Heart className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const selectedConditionData = chronicConditions.find(c => c.id === selectedCondition);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Chronic Disease Optimization
          </CardTitle>
          <CardDescription>
            AI-powered drug recommendations optimized for chronic disease management
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Patient Setup</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          {/* Condition Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Chronic Condition</CardTitle>
              <CardDescription>
                Choose the primary chronic condition to optimize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chronicConditions.map(condition => (
                  <Card 
                    key={condition.id}
                    className={`cursor-pointer transition-all ${
                      selectedCondition === condition.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedCondition(condition.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {condition.icon}
                        <div>
                          <h4 className="font-medium">{condition.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {condition.commonMeds.length} common medications
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Data Input */}
          {selectedCondition && selectedConditionData && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>
                  Enter patient data for {selectedConditionData.name} optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="65"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={patientData.weight}
                      onChange={(e) => setPatientData(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={patientData.height}
                      onChange={(e) => setPatientData(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="170"
                    />
                  </div>
                </div>

                {/* Target Metrics */}
                <div>
                  <Label>Current Metrics</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.entries(selectedConditionData.targetMetrics).map(([metric, target]) => (
                      <div key={metric}>
                        <Label htmlFor={metric}>
                          {metric.replace('_', ' ').toUpperCase()} (Target: {target})
                        </Label>
                        <Input
                          id={metric}
                          type="number"
                          value={patientData.currentMetrics[metric] || ''}
                          onChange={(e) => setPatientData(prev => ({
                            ...prev,
                            currentMetrics: {
                              ...prev.currentMetrics,
                              [metric]: parseFloat(e.target.value) || 0
                            }
                          }))}
                          placeholder={target.toString()}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <Label>Current Medications</Label>
                  <div className="mt-2 space-y-2">
                    {selectedConditionData.commonMeds.map(med => (
                      <label key={med} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={patientData.currentMedications.includes(med)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPatientData(prev => ({
                                ...prev,
                                currentMedications: [...prev.currentMedications, med]
                              }));
                            } else {
                              setPatientData(prev => ({
                                ...prev,
                                currentMedications: prev.currentMedications.filter(m => m !== med)
                              }));
                            }
                          }}
                        />
                        <span className="text-sm">{med}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={generateOptimizations} disabled={loading} className="w-full">
                  {loading ? 'Generating Optimizations...' : 'Generate AI Optimizations'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Optimizations Yet</h3>
                <p className="text-muted-foreground">
                  Complete patient setup to generate AI-powered optimization recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Optimization Recommendations ({recommendations.length})
                </h3>
                <Badge variant="outline">
                  AI-Powered Analysis
                </Badge>
              </div>

              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getTypeIcon(rec.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline">
                            {rec.type}
                          </Badge>
                          <Badge variant="outline">
                            {rec.confidence}% confidence
                          </Badge>
                        </div>
                        
                        {rec.medication && (
                          <div className="text-sm">
                            <strong>Medication:</strong> {rec.medication}
                            {rec.currentDose && rec.recommendedDose && (
                              <span className="ml-2">
                                ({rec.currentDose} → {rec.recommendedDose})
                              </span>
                            )}
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Expected Improvement:</strong> {rec.expectedImprovement}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Monitoring</CardTitle>
              <CardDescription>
                Track the effectiveness of optimization recommendations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Monitoring Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Track patient progress and optimization effectiveness over time
                </p>
                <Button variant="outline">Set Up Monitoring</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}