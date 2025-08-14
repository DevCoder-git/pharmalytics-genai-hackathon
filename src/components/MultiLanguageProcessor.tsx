import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Languages, FileText, Mic, Volume2, Loader2, ArrowRight } from "lucide-react";

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  extractedData: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      instructions: string;
    }>;
    allergies: string[];
    conditions: string[];
  };
}

export function MultiLanguageProcessor() {
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" }
  ];

  const exampleTexts = {
    es: "El paciente debe tomar Metformina 500mg dos veces al día con las comidas. Alérgico a la penicilina. Diagnóstico: Diabetes tipo 2.",
    fr: "Le patient doit prendre Metformine 500mg deux fois par jour avec les repas. Allergique à la pénicilline. Diagnostic: Diabète type 2.",
    de: "Der Patient soll Metformin 500mg zweimal täglich zu den Mahlzeiten einnehmen. Allergisch gegen Penicillin. Diagnose: Typ-2-Diabetes.",
    zh: "患者应服用二甲双胍500毫克，每日两次，随餐服用。对青霉素过敏。诊断：2型糖尿病。",
    ar: "يجب على المريض تناول الميتفورمين 500 مجم مرتين يوميا مع الوجبات. حساسية من البنسلين. التشخيص: مرض السكري من النوع الثاني."
  };

  const processText = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate translation and extraction
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: TranslationResult = {
        originalText: inputText,
        translatedText: sourceLanguage === "en" ? inputText : 
          "Patient should take Metformin 500mg twice daily with meals. Allergic to penicillin. Diagnosis: Type 2 diabetes.",
        sourceLanguage: sourceLanguage === "auto" ? "es" : sourceLanguage,
        targetLanguage: targetLanguage,
        confidence: 0.95,
        extractedData: {
          medications: [
            {
              name: "Metformin",
              dosage: "500mg",
              frequency: "Twice daily",
              instructions: "Take with meals"
            }
          ],
          allergies: ["Penicillin"],
          conditions: ["Type 2 Diabetes"]
        }
      };

      setResults(mockResult);
    } catch (err) {
      setError("Failed to process text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      setInputText("El paciente debe tomar Metformina 500mg dos veces al día con las comidas.");
    }, 3000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLanguage === 'en' ? 'en-US' : `${targetLanguage}-${targetLanguage.toUpperCase()}`;
      speechSynthesis.speak(utterance);
    }
  };

  const loadExample = (langCode: string) => {
    setInputText(exampleTexts[langCode as keyof typeof exampleTexts] || "");
    setSourceLanguage(langCode);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Multi-Language Medical Processor</h2>
        <p className="text-muted-foreground mt-2">
          Translate and extract medical information from text in multiple languages
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Processing</TabsTrigger>
          <TabsTrigger value="examples">Example Texts</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Input Text
              </CardTitle>
              <CardDescription>
                Enter medical text in any supported language for translation and extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Language</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Language</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.filter(lang => lang.code !== "auto").map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Medical Text</label>
                <Textarea
                  placeholder="Enter prescription, discharge summary, or clinical notes..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={processText}
                  disabled={!inputText.trim() || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Translate & Extract
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={startRecording}
                  disabled={isRecording || isProcessing}
                  variant="outline"
                >
                  {isRecording ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Input
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Translation Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Translation Result
                    <div className="flex items-center gap-2 ml-auto">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(results.confidence)}`} />
                      <span className="text-sm text-muted-foreground">
                        {Math.round(results.confidence * 100)}%
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Original Text</label>
                    <div className="p-3 bg-muted rounded-lg mt-1">
                      <p className="text-sm">{results.originalText}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {languages.find(l => l.code === results.sourceLanguage)?.name}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakText(results.originalText)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Translated Text</label>
                    <div className="p-3 bg-primary/5 rounded-lg mt-1 border border-primary/20">
                      <p className="text-sm">{results.translatedText}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="default" className="text-xs">
                          {languages.find(l => l.code === results.targetLanguage)?.name}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakText(results.translatedText)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Extracted Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Medications */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Medications</label>
                    <div className="space-y-2 mt-1">
                      {results.extractedData.medications.map((med, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {med.dosage} • {med.frequency}
                          </div>
                          {med.instructions && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {med.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {results.extractedData.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Medical Conditions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {results.extractedData.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Example Medical Texts</CardTitle>
              <CardDescription>
                Try these example texts in different languages to see the translation and extraction in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(exampleTexts).map(([langCode, text]) => (
                <div key={langCode} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">
                      {languages.find(l => l.code === langCode)?.name}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadExample(langCode)}
                    >
                      Load Example
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supported Features */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Supported Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Translation Capabilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 13+ supported languages</li>
                <li>• Medical terminology accuracy</li>
                <li>• Context-aware translation</li>
                <li>• Real-time processing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data Extraction</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Medication names and dosages</li>
                <li>• Allergy information</li>
                <li>• Medical conditions</li>
                <li>• Treatment instructions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}