import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Plus, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { apiClient } from "../lib/api";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface InteractionResult {
  severity: "low" | "moderate" | "high" | "severe";
  drug1: string;
  drug2: string;
  description: string;
  recommendation: string;
}

const DrugInteractionChecker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMed, setCurrentMed] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock interaction results for demo
  const mockInteractions: InteractionResult[] = [
    {
      severity: "severe",
      drug1: "Warfarin",
      drug2: "Aspirin",
      description: "Increased risk of bleeding due to anticoagulant interaction",
      recommendation: "Monitor INR closely. Consider alternative pain management."
    },
    {
      severity: "moderate",
      drug1: "Metformin",
      drug2: "Lisinopril",
      description: "May affect kidney function in elderly patients",
      recommendation: "Monitor creatinine levels regularly in patients >65."
    }
  ];

  const addMedication = () => {
    if (currentMed.trim()) {
      const newMed: Medication = {
        id: Date.now().toString(),
        name: currentMed,
        dosage: dosage || "Not specified",
        frequency: frequency || "Not specified"
      };
      setMedications([...medications, newMed]);
      setCurrentMed("");
      setDosage("");
      setFrequency("");
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    setShowResults(false);
  };

  const analyzeInteractions = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const medicationObjects = medications.map(med => ({ name: med.name, dosage: med.dosage, frequency: med.frequency }));
      const response = await apiClient.checkDrugInteractions(
        medicationObjects, 
        patientAge ? parseInt(patientAge) : undefined
      );
      setResults(response);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze interactions');
      // Show mock data for demo purposes
      setResults({
        interactions: mockInteractions,
        overall_risk_score: 3,
        total_interactions_found: mockInteractions.length,
        recommendations: ["Consult physician", "Monitor closely"]
      });
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe": return "destructive";
      case "high": return "destructive";
      case "moderate": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "severe":
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "moderate":
        return <Info className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              Live Demo
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Drug Interaction Checker
            </h2>
            <p className="text-xl text-muted-foreground">
              Add medications to analyze potential interactions and receive safety recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="p-6 shadow-soft">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-primary" />
                Add Medications
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Patient Age</label>
                  <Input
                    placeholder="Enter patient age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="mb-4"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Medication Name</label>
                  <Input
                    placeholder="e.g., Warfarin, Aspirin, Metformin"
                    value={currentMed}
                    onChange={(e) => setCurrentMed(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Dosage</label>
                    <Input
                      placeholder="e.g., 5mg"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Frequency</label>
                    <Input
                      placeholder="e.g., Daily"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={addMedication}
                disabled={!currentMed.trim()}
                className="w-full mb-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>

              {/* Current Medications List */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Current Medications ({medications.length})</h4>
                {medications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(med.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {medications.length >= 2 && (
                <Button 
                  onClick={analyzeInteractions}
                  disabled={isAnalyzing}
                  className="w-full mt-6"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Interactions...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze Drug Interactions
                    </>
                  )}
                </Button>
              )}
            </Card>

            {/* Results Section */}
            <Card className="p-6 shadow-soft">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                Analysis Results
              </h3>

              {!showResults && medications.length < 2 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Add at least 2 medications to check for interactions</p>
                </div>
              )}

              {!showResults && medications.length >= 2 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Analyze Drug Interactions" to see results</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error} (Showing demo data)</AlertDescription>
                </Alert>
              )}

              {showResults && results && (
                <div className="space-y-4">
                  {/* Patient Info */}
                  {patientAge && (
                    <Alert>
                      <User className="h-4 w-4" />
                      <AlertDescription>
                        Patient Age: {patientAge} years - Age-specific dosage recommendations applied
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Risk Score */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Overall Risk Score</span>
                    <Badge variant={results.overall_risk_score > 3 ? "destructive" : "secondary"}>
                      {results.overall_risk_score}/5
                    </Badge>
                  </div>

                  {/* Interaction Results */}
                  {(results.interactions || mockInteractions).map((interaction: any, index: number) => (
                    <Alert key={index} variant={getSeverityColor(interaction.severity) as any}>
                      <div className="flex items-start">
                        {getSeverityIcon(interaction.severity)}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center mb-2">
                            <Badge variant={getSeverityColor(interaction.severity) as any} className="mr-2">
                              {interaction.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">
                              {interaction.drug1} + {interaction.drug2}
                            </span>
                          </div>
                          <AlertDescription className="mb-2">
                            {interaction.description}
                          </AlertDescription>
                          <div className="text-sm">
                            <strong>Recommendation:</strong> {interaction.recommendation}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}

                  <Separator />

                  {/* Recommendations */}
                  {results.recommendations && results.recommendations.length > 0 && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Recommendations:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {results.recommendations.map((rec: any, index: number) => (
                          <li key={index}>• {typeof rec === 'string' ? rec : rec.recommendation || rec.type}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safe Combinations */}
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertDescription>
                      Analysis complete. {results.total_interactions_found || 0} interaction(s) found.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="mt-8 p-4 bg-muted/50 border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Notice:</strong> This is a demonstration interface with mock data. 
              For actual clinical use, the system would integrate with comprehensive drug databases 
              and require proper medical validation. Always consult healthcare professionals for medical decisions.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DrugInteractionChecker;