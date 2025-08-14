import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Brain, FileText, Calculator, AlertTriangle, Loader2 } from "lucide-react";
import { apiClient } from "../lib/api";

export function AIFeatures() {
  const [dosageForm, setDosageForm] = useState({
    drugName: "",
    patientAge: "",
    patientWeight: "",
    conditions: ""
  });
  const [textInput, setTextInput] = useState("");
  const [sideEffectMeds, setSideEffectMeds] = useState("");
  const [loading, setLoading] = useState({ dosage: false, text: false, sideEffect: false });
  const [results, setResults] = useState<any>({});

  const handleDosageRecommendation = async () => {
    setLoading({ ...loading, dosage: true });
    try {
      const response = await apiClient.getDosageRecommendation(
        dosageForm.drugName,
        parseInt(dosageForm.patientAge),
        dosageForm.patientWeight ? parseFloat(dosageForm.patientWeight) : undefined,
        dosageForm.conditions ? dosageForm.conditions.split(',').map(c => c.trim()) : []
      );
      setResults({ ...results, dosage: response });
    } catch (error) {
      setResults({ ...results, dosage: { error: error instanceof Error ? error.message : 'Failed to get dosage recommendation' } });
    } finally {
      setLoading({ ...loading, dosage: false });
    }
  };

  const handleTextExtraction = async () => {
    setLoading({ ...loading, text: true });
    try {
      const response = await apiClient.extractFromText(textInput);
      setResults({ ...results, text: response });
    } catch (error) {
      setResults({ ...results, text: { error: error instanceof Error ? error.message : 'Failed to extract text' } });
    } finally {
      setLoading({ ...loading, text: false });
    }
  };

  const handleSideEffectAnalysis = async () => {
    setLoading({ ...loading, sideEffect: true });
    try {
      const medications = sideEffectMeds.split(',').map(name => ({ name: name.trim() }));
      const response = await apiClient.analyzeSideEffects(medications);
      setResults({ ...results, sideEffect: response });
    } catch (error) {
      setResults({ ...results, sideEffect: { error: error instanceof Error ? error.message : 'Failed to analyze side effects' } });
    } finally {
      setLoading({ ...loading, sideEffect: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Features</h2>
        <p className="text-muted-foreground mt-2">
          Advanced AI capabilities for personalized healthcare analysis
        </p>
      </div>

      <Tabs defaultValue="dosage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dosage">Dosage AI</TabsTrigger>
          <TabsTrigger value="text">Text Extraction</TabsTrigger>
          <TabsTrigger value="sideeffects">Side Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="dosage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                AI Dosage Recommendation
              </CardTitle>
              <CardDescription>
                Get personalized dosage recommendations based on patient profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Drug Name</label>
                  <Input
                    placeholder="e.g., Aspirin"
                    value={dosageForm.drugName}
                    onChange={(e) => setDosageForm({ ...dosageForm, drugName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Age</label>
                  <Input
                    type="number"
                    placeholder="e.g., 35"
                    value={dosageForm.patientAge}
                    onChange={(e) => setDosageForm({ ...dosageForm, patientAge: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 70"
                    value={dosageForm.patientWeight}
                    onChange={(e) => setDosageForm({ ...dosageForm, patientWeight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical Conditions</label>
                  <Input
                    placeholder="e.g., diabetes, hypertension"
                    value={dosageForm.conditions}
                    onChange={(e) => setDosageForm({ ...dosageForm, conditions: e.target.value })}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleDosageRecommendation}
                disabled={loading.dosage || !dosageForm.drugName || !dosageForm.patientAge}
                className="w-full"
              >
                {loading.dosage && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Get AI Recommendation
              </Button>

              {results.dosage && (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    {results.dosage.error ? (
                      <span className="text-destructive">{results.dosage.error}</span>
                    ) : (
                      <div className="space-y-2">
                        <div><strong>Recommended Dosage:</strong> {results.dosage.recommended_dosage || 'Processing...'}</div>
                        <div><strong>Frequency:</strong> {results.dosage.frequency || 'Processing...'}</div>
                        {results.dosage.warnings && (
                          <div><strong>Warnings:</strong> {results.dosage.warnings.join(', ')}</div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical Text Extraction
              </CardTitle>
              <CardDescription>
                Extract structured drug information from medical text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Medical Text</label>
                <Textarea
                  placeholder="Paste prescription text, discharge summary, or clinical notes..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={handleTextExtraction}
                disabled={loading.text || !textInput.trim()}
                className="w-full"
              >
                {loading.text && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Extract Information
              </Button>

              {results.text && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    {results.text.error ? (
                      <span className="text-destructive">{results.text.error}</span>
                    ) : (
                      <div className="space-y-2">
                        <div><strong>Extracted Medications:</strong></div>
                        {results.text.medications?.map((med: any, index: number) => (
                          <Badge key={index} variant="secondary" className="mr-2">
                            {med.name} - {med.dosage}
                          </Badge>
                        )) || <span>Processing...</span>}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sideeffects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Side Effect Analysis
              </CardTitle>
              <CardDescription>
                AI-powered analysis of potential side effects and severity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Medications (comma-separated)</label>
                <Input
                  placeholder="e.g., Aspirin, Warfarin, Metformin"
                  value={sideEffectMeds}
                  onChange={(e) => setSideEffectMeds(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSideEffectAnalysis}
                disabled={loading.sideEffect || !sideEffectMeds.trim()}
                className="w-full"
              >
                {loading.sideEffect && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Analyze Side Effects
              </Button>

              {results.sideEffect && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {results.sideEffect.error ? (
                      <span className="text-destructive">{results.sideEffect.error}</span>
                    ) : (
                      <div className="space-y-2">
                        <div><strong>Risk Score:</strong> {results.sideEffect.risk_score || 'Processing...'}/10</div>
                        <div><strong>Common Side Effects:</strong></div>
                        {results.sideEffect.side_effects?.map((effect: any, index: number) => (
                          <Badge 
                            key={index} 
                            variant={effect.severity === 'high' ? 'destructive' : 'secondary'} 
                            className="mr-2"
                          >
                            {effect.name} ({effect.severity})
                          </Badge>
                        )) || <span>Processing...</span>}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}