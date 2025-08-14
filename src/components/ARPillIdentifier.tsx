import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Camera, CameraOff, RotateCcw, Scan, Eye, Upload } from "lucide-react";

interface PillIdentification {
  name: string;
  strength: string;
  manufacturer: string;
  shape: string;
  color: string;
  imprint: string;
  confidence: number;
  warnings: string[];
}

export function ARPillIdentifier() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [identificationResult, setIdentificationResult] = useState<PillIdentification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
      setHasCamera(hasVideoDevice);
    } catch (err) {
      setHasCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);

    // Process the image for pill identification
    await identifyPill(imageData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      await identifyPill(imageData);
    };
    reader.readAsDataURL(file);
  };

  const identifyPill = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate AI pill identification
      // In a real implementation, this would send the image to an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock identification result
      const mockResult: PillIdentification = {
        name: "Ibuprofen",
        strength: "200 mg",
        manufacturer: "Generic Pharma",
        shape: "Round",
        color: "White",
        imprint: "I-2",
        confidence: 0.85,
        warnings: [
          "Take with food to reduce stomach irritation",
          "Do not exceed 1200mg in 24 hours",
          "Consult doctor if taking blood thinners"
        ]
      };

      setIdentificationResult(mockResult);
    } catch (err) {
      setError("Failed to identify pill. Please try again with a clearer image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetIdentification = () => {
    setIdentificationResult(null);
    setCapturedImage(null);
    setError(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          AR Pill Identifier
        </CardTitle>
        <CardDescription>
          Use your camera or upload an image to identify pills and medications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera Controls */}
        <div className="flex items-center justify-center gap-4">
          {hasCamera && (
            <Button
              onClick={isScanning ? stopCamera : startCamera}
              variant={isScanning ? "destructive" : "default"}
              disabled={isProcessing}
            >
              {isScanning ? (
                <>
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          )}
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          
          {(identificationResult || capturedImage) && (
            <Button
              onClick={resetIdentification}
              variant="ghost"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Camera Feed */}
        {isScanning && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-black rounded-lg object-cover"
              playsInline
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
                <Scan className="h-8 w-8 text-primary" />
              </div>
            </div>
            <Button
              onClick={captureImage}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Capture & Identify"}
            </Button>
          </div>
        )}

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured Image Preview */}
        {capturedImage && !isScanning && (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured pill"
              className="w-full h-64 object-cover rounded-lg"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Analyzing pill...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Camera Not Available */}
        {!hasCamera && !capturedImage && (
          <Alert>
            <Camera className="h-4 w-4" />
            <AlertDescription>
              Camera not available. You can still upload images for pill identification.
            </AlertDescription>
          </Alert>
        )}

        {/* Identification Results */}
        {identificationResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Identification Result</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getConfidenceColor(identificationResult.confidence)}`} />
                <span className="text-sm text-muted-foreground">
                  {Math.round(identificationResult.confidence * 100)}% confidence
                </span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Medication</label>
                    <p className="font-semibold">{identificationResult.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Strength</label>
                    <p className="font-semibold">{identificationResult.strength}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shape</label>
                    <p>{identificationResult.shape}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Color</label>
                    <p>{identificationResult.color}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Imprint</label>
                    <p>{identificationResult.imprint}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                    <p>{identificationResult.manufacturer}</p>
                  </div>
                </div>

                {identificationResult.warnings.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Important Warnings</label>
                    <div className="space-y-2">
                      {identificationResult.warnings.map((warning, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertDescription>{warning}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Usage Tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Ensure good lighting for better identification accuracy</li>
            <li>• Place the pill on a plain background</li>
            <li>• Make sure any imprints or markings are clearly visible</li>
            <li>• Take multiple photos from different angles if needed</li>
            <li>• This tool is for identification only - always verify with a pharmacist</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}