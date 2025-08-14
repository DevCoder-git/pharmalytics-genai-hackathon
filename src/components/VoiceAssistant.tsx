import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageCircle } from "lucide-react";
import { apiClient } from "../lib/api";

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'user' | 'assistant', message: string}>>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          processVoiceQuery(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setError(null);
      setTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setError("Speech recognition not supported in this browser");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    setConversationHistory(prev => [...prev, { type: 'user', message: query }]);
    
    try {
      // Process the voice query based on content
      let response = "";
      
      if (query.toLowerCase().includes('interaction') || query.toLowerCase().includes('drug')) {
        // Extract drug names and check interactions
        const drugMatches = query.match(/\b[A-Z][a-z]+\b/g) || [];
        if (drugMatches.length >= 2) {
          const medications = drugMatches.map(name => ({ name }));
          const result = await apiClient.checkDrugInteractions(medications);
          if (result.success) {
            response = `I found ${result.data.interactions?.length || 0} interactions. Risk level: ${result.data.riskLevel}`;
          } else {
            response = "Sorry, I couldn't check for interactions at the moment.";
          }
        } else {
          response = "Please specify at least two medication names to check for interactions.";
        }
      } else if (query.toLowerCase().includes('dosage') || query.toLowerCase().includes('dose')) {
        response = "To provide dosage recommendations, I need the medication name, patient age, and weight. Please provide these details.";
      } else if (query.toLowerCase().includes('side effect')) {
        response = "I can analyze side effects for specific medications. Please tell me which medications you'd like me to analyze.";
      } else {
        response = "I can help with drug interactions, dosage recommendations, and side effect analysis. How can I assist you today?";
      }
      
      setResponse(response);
      setConversationHistory(prev => [...prev, { type: 'assistant', message: response }]);
      speakResponse(response);
      
    } catch (err) {
      const errorMsg = "I encountered an error processing your request. Please try again.";
      setResponse(errorMsg);
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setError("Speech synthesis failed");
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setTranscript("");
    setResponse("");
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Voice Medical Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about drug interactions, dosages, and side effects using your voice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="relative"
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop Listening
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start Listening
              </>
            )}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
            disabled={!response || isProcessing}
            variant={isSpeaking ? "destructive" : "outline"}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-5 w-5 mr-2" />
                Stop Speaking
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                Repeat Response
              </>
            )}
          </Button>
          
          <Button
            onClick={clearConversation}
            variant="ghost"
            disabled={conversationHistory.length === 0}
          >
            Clear
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-2">
          {isListening && (
            <Badge variant="destructive" className="animate-pulse">
              <Mic className="h-3 w-3 mr-1" />
              Listening...
            </Badge>
          )}
          {isProcessing && (
            <Badge variant="secondary">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Processing...
            </Badge>
          )}
          {isSpeaking && (
            <Badge variant="default" className="animate-pulse">
              <Volume2 className="h-3 w-3 mr-1" />
              Speaking...
            </Badge>
          )}
        </div>

        {/* Current Transcript */}
        {transcript && (
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>You said:</strong> {transcript}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h4 className="font-medium text-sm text-muted-foreground">Conversation History</h4>
            {conversationHistory.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  item.type === 'user'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className="text-xs font-medium mb-1">
                  {item.type === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="text-sm">{item.message}</div>
              </div>
            ))}
          </div>
        )}

        {/* Usage Tips */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Voice Commands You Can Try:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• "Check interactions between Warfarin and Aspirin"</li>
            <li>• "What are the side effects of Metformin?"</li>
            <li>• "Recommend dosage for Ibuprofen for a 65-year-old"</li>
            <li>• "Are there any alternatives to Lisinopril?"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}