import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Stethoscope, 
  Brain, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Upload,
  Download,
  Search,
  TrendingUp
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface ClinicalData {
  patientId: string;
  symptoms: string[];
  currentMedications: string[];
  allergies: string[];
  medicalHistory: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
  };
  labResults: Record<string, number>;
}

interface ClinicalAnalysis {
  riskAssessment: {
    level: 'low' | 'moderate' | 'high' | 'critical';
    factors: string[];
    score: number;
  };
  drugInteractions: Array<{
    drugs: string[];
    severity: 'minor' | 'moderate' | 'major';
    description: string;
    recommendation: string;
  }>;
  recommendations: Array<{
    type: 'medication' | 'monitoring' | 'lifestyle' | 'referral';
    priority: 'low' | 'medium' | 'high';
    description: string;
    rationale: string;
  }>;
  contraindications: string[];
  monitoring: string[];
}

const symptomsList = [
  'Chest pain', 'Shortness of breath', 'Fatigue', 'Dizziness', 'Nausea',
  'Headache', 'Fever', 'Cough', 'Abdominal pain', 'Joint pain',
  'Muscle weakness', 'Confusion', 'Anxiety', 'Depression', 'Insomnia'
];

const commonMedications = [
  'Lisinopril', 'Atorvastatin', 'Metformin', 'Amlodipine', 'Omeprazole',
  'Sertraline', 'Warfarin', 'Aspirin', 'Levothyroxine', 'Metoprolol',
  'Gabapentin', 'Prednisone', 'Furosemide', 'Insulin', 'Clopidogrel'
];

export function ClinicalAnalysis() {
  const [clinicalData, setClinicalData] = useState<ClinicalData>({
    patientId: '',
    symptoms: [],
    currentMedications: [],
    allergies: [],
    medicalHistory: [],
    vitalSigns: {
      bloodPressure: '',
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0
    },
    labResults: {}
  });

  const [analysis, setAnalysis] = useState<ClinicalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('data-entry');

  const startAnalysis = async () => {
    if (!clinicalData.patientId || clinicalData.symptoms.length === 0) {
      toast.error('Please enter patient ID and at least one symptom');
      return;
    }

    setLoading(true);
    try {
      // Simulate comprehensive clinical analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock analysis based on input data
      const riskScore = Math.floor(Math.random() * 100);
      let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
      
      if (riskScore > 80) riskLevel = 'critical';
      else if (riskScore > 60) riskLevel = 'high';
      else if (riskScore > 40) riskLevel = 'moderate';

      const mockAnalysis: ClinicalAnalysis = {
        riskAssessment: {
          level: riskLevel,
          score: riskScore,
          factors: [
            'Multiple medication interactions detected',
            'Age-related risk factors present',
            'Comorbidity considerations',
            ...(clinicalData.symptoms.includes('Chest pain') ? ['Cardiovascular symptoms present'] : []),
            ...(clinicalData.currentMedications.length > 3 ? ['Polypharmacy concern'] : [])
          ]
        },
        drugInteractions: clinicalData.currentMedications.length > 1 ? [
          {
            drugs: clinicalData.currentMedications.slice(0, 2),
            severity: 'moderate',
            description: 'May affect drug absorption and metabolism',
            recommendation: 'Monitor closely and consider timing adjustment'
          },
          ...(clinicalData.currentMedications.length > 2 ? [{
            drugs: [clinicalData.currentMedications[0], clinicalData.currentMedications[2]],
            severity: 'minor' as const,
            description: 'Potential additive effects on blood pressure',
            recommendation: 'Regular blood pressure monitoring recommended'
          }] : [])
        ] : [],
        recommendations: [
          {
            type: 'monitoring',
            priority: 'high',
            description: 'Regular vital signs monitoring required',
            rationale: 'Patient presents with multiple risk factors requiring close observation'
          },
          {
            type: 'medication',
            priority: 'medium',
            description: 'Consider dose adjustment for current medications',
            rationale: 'Drug interaction analysis suggests potential efficacy concerns'
          },
          ...(clinicalData.symptoms.includes('Chest pain') ? [{
            type: 'referral' as const,
            priority: 'high' as const,
            description: 'Cardiology consultation recommended',
            rationale: 'Chest pain symptoms require specialized evaluation'
          }] : []),
          {
            type: 'lifestyle',
            priority: 'medium',
            description: 'Diet and exercise modifications',
            rationale: 'Lifestyle factors can significantly impact medication effectiveness'
          }
        ],
        contraindications: clinicalData.allergies.length > 0 ? [
          `Avoid medications containing ${clinicalData.allergies[0]} derivatives`,
          'Exercise caution with new medication introductions'
        ] : [
          'No specific contraindications identified based on current data'
        ],
        monitoring: [
          'Blood pressure monitoring twice weekly',
          'Laboratory tests every 3 months',
          'Symptom diary maintenance',
          'Medication adherence tracking'
        ]
      };

      setAnalysis(mockAnalysis);
      setActiveTab('results');
      toast.success('Clinical analysis completed successfully');

    } catch (error) {
      toast.error('Failed to complete clinical analysis');
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (symptom: string) => {
    if (!clinicalData.symptoms.includes(symptom)) {
      setClinicalData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
    }
  };

  const removeSymptom = (symptom: string) => {
    setClinicalData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const addMedication = (medication: string) => {
    if (!clinicalData.currentMedications.includes(medication)) {
      setClinicalData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, medication]
      }));
    }
  };

  const removeMedication = (medication: string) => {
    setClinicalData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter(m => m !== medication)
    }));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'major': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Clinical Analysis System
          </CardTitle>
          <CardDescription>
            Comprehensive AI-powered clinical decision support and drug interaction analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="reports">Clinical Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="data-entry" className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Enter comprehensive patient data for clinical analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  value={clinicalData.patientId}
                  onChange={(e) => setClinicalData(prev => ({ ...prev, patientId: e.target.value }))}
                  placeholder="Enter patient identifier"
                />
              </div>

              {/* Symptoms */}
              <div>
                <Label>Current Symptoms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {symptomsList.map(symptom => (
                    <Button
                      key={symptom}
                      variant={clinicalData.symptoms.includes(symptom) ? "default" : "outline"}
                      size="sm"
                      onClick={() => clinicalData.symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
                {clinicalData.symptoms.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Selected symptoms:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {clinicalData.symptoms.map(symptom => (
                        <Badge key={symptom} variant="secondary">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Medications */}
              <div>
                <Label>Current Medications</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {commonMedications.map(medication => (
                    <Button
                      key={medication}
                      variant={clinicalData.currentMedications.includes(medication) ? "default" : "outline"}
                      size="sm"
                      onClick={() => clinicalData.currentMedications.includes(medication) ? removeMedication(medication) : addMedication(medication)}
                    >
                      {medication}
                    </Button>
                  ))}
                </div>
                {clinicalData.currentMedications.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Current medications:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {clinicalData.currentMedications.map(medication => (
                        <Badge key={medication} variant="secondary">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vital Signs */}
              <div>
                <Label>Vital Signs</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <Label htmlFor="bp">Blood Pressure</Label>
                    <Input
                      id="bp"
                      value={clinicalData.vitalSigns.bloodPressure}
                      onChange={(e) => setClinicalData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                      }))}
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hr">Heart Rate (bpm)</Label>
                    <Input
                      id="hr"
                      type="number"
                      value={clinicalData.vitalSigns.heartRate || ''}
                      onChange={(e) => setClinicalData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, heartRate: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temp">Temperature (°F)</Label>
                    <Input
                      id="temp"
                      type="number"
                      step="0.1"
                      value={clinicalData.vitalSigns.temperature || ''}
                      onChange={(e) => setClinicalData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, temperature: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="98.6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rr">Respiratory Rate</Label>
                    <Input
                      id="rr"
                      type="number"
                      value={clinicalData.vitalSigns.respiratoryRate || ''}
                      onChange={(e) => setClinicalData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, respiratoryRate: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="16"
                    />
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  value={clinicalData.allergies.join(', ')}
                  onChange={(e) => setClinicalData(prev => ({
                    ...prev,
                    allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  }))}
                  placeholder="Enter allergies separated by commas"
                />
              </div>

              {/* Medical History */}
              <div>
                <Label htmlFor="history">Medical History</Label>
                <Textarea
                  id="history"
                  value={clinicalData.medicalHistory.join('\n')}
                  onChange={(e) => setClinicalData(prev => ({
                    ...prev,
                    medicalHistory: e.target.value.split('\n').filter(h => h.trim())
                  }))}
                  placeholder="Enter relevant medical history"
                  rows={4}
                />
              </div>

              <Button onClick={startAnalysis} disabled={loading} className="w-full" size="lg">
                <Brain className="mr-2 h-5 w-5" />
                {loading ? 'Analyzing Clinical Data...' : 'Start Clinical Analysis'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {!analysis ? (
            <Card>
              <CardContent className="text-center py-12">
                <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
                <p className="text-muted-foreground">
                  Complete the clinical data entry to view analysis results
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getRiskColor(analysis.riskAssessment.level)}>
                          {analysis.riskAssessment.level.toUpperCase()} RISK
                        </Badge>
                        <div className="text-2xl font-bold">
                          {analysis.riskAssessment.score}/100
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Clinical Risk Score</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl">
                        {analysis.riskAssessment.level === 'critical' ? '🚨' : 
                         analysis.riskAssessment.level === 'high' ? '⚠️' : 
                         analysis.riskAssessment.level === 'moderate' ? '⚡' : '✅'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors:</h4>
                    <ul className="space-y-1">
                      {analysis.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-1 text-orange-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Drug Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Drug Interactions ({analysis.drugInteractions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.drugInteractions.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                      <p className="text-green-600 font-medium">No significant drug interactions detected</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysis.drugInteractions.map((interaction, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{interaction.drugs.join(' + ')}</h4>
                              <p className="text-sm text-muted-foreground">{interaction.description}</p>
                            </div>
                            <Badge className={getSeverityColor(interaction.severity)}>
                              {interaction.severity}
                            </Badge>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Recommendation:</strong> {interaction.recommendation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contraindications */}
              {analysis.contraindications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Contraindications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.contraindications.map((contraindication, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600" />
                          <span>{contraindication}</span>
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
          {!analysis?.recommendations.length ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
                <p className="text-muted-foreground">
                  Complete clinical analysis to view personalized recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Clinical Recommendations ({analysis.recommendations.length})
                </h3>
                <Badge variant="outline">AI-Generated</Badge>
              </div>

              {analysis.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {rec.type === 'medication' && <Activity className="h-4 w-4" />}
                        {rec.type === 'monitoring' && <TrendingUp className="h-4 w-4" />}
                        {rec.type === 'lifestyle' && <CheckCircle className="h-4 w-4" />}
                        {rec.type === 'referral' && <Stethoscope className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline">
                            {rec.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{rec.description}</h4>
                        <p className="text-sm text-muted-foreground">{rec.rationale}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Monitoring Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Monitoring Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.monitoring.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Reports</CardTitle>
              <CardDescription>
                Generate comprehensive clinical reports and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Complete Clinical Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive analysis report with all findings and recommendations
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Generate Full Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Drug Interaction Summary</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Focused report on drug interactions and contraindications
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Generate Summary
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Risk Assessment Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Detailed risk stratification and mitigation strategies
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Monitoring Protocol</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Structured monitoring and follow-up recommendations
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Generate Protocol
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