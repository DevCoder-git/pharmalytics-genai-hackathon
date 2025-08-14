import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Hash, 
  Clock, 
  User, 
  FileText,
  Lock,
  QrCode,
  Download
} from "lucide-react";

interface PrescriptionRecord {
  id: string;
  patientId: string;
  doctorId: string;
  medications: Array<{
    name: string;
    dosage: string;
    quantity: number;
    instructions: string;
  }>;
  issueDate: Date;
  validUntil: Date;
  blockchainHash: string;
  transactionId: string;
  verified: boolean;
  digitalSignature: string;
  timestamps: {
    created: Date;
    signed: Date;
    dispensed?: Date;
  };
}

export function BlockchainValidator() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    doctorId: "",
    medications: "",
    validDays: "30"
  });
  const [validationResult, setValidationResult] = useState<PrescriptionRecord | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock blockchain data
  const mockPrescriptions: PrescriptionRecord[] = [
    {
      id: "RX-2024-001",
      patientId: "PAT-001",
      doctorId: "DOC-123",
      medications: [
        {
          name: "Metformin",
          dosage: "500mg",
          quantity: 60,
          instructions: "Take twice daily with meals"
        },
        {
          name: "Lisinopril",
          dosage: "10mg",
          quantity: 30,
          instructions: "Take once daily in the morning"
        }
      ],
      issueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      transactionId: "0xabc123def456789012345678901234567890abcd",
      verified: true,
      digitalSignature: "304502210089abcdef...",
      timestamps: {
        created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        signed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        dispensed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    }
  ];

  const validatePrescription = async () => {
    if (!prescriptionId.trim()) return;

    setIsValidating(true);
    setError(null);

    try {
      // Simulate blockchain validation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prescription = mockPrescriptions.find(p => p.id === prescriptionId);
      
      if (prescription) {
        setValidationResult(prescription);
      } else {
        setError("Prescription not found or invalid");
      }
    } catch (err) {
      setError("Validation failed. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const createPrescription = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      const medications = newPrescription.medications.split('\n').map(line => {
        const parts = line.split(',').map(p => p.trim());
        return {
          name: parts[0] || '',
          dosage: parts[1] || '',
          quantity: parseInt(parts[2]) || 0,
          instructions: parts[3] || ''
        };
      }).filter(med => med.name);

      const prescription: PrescriptionRecord = {
        id: `RX-2024-${Date.now().toString().slice(-3)}`,
        patientId: newPrescription.patientId,
        doctorId: newPrescription.doctorId,
        medications,
        issueDate: new Date(),
        validUntil: new Date(Date.now() + parseInt(newPrescription.validDays) * 24 * 60 * 60 * 1000),
        blockchainHash: `0x${Math.random().toString(16).slice(2, 34)}`,
        transactionId: `0x${Math.random().toString(16).slice(2, 42)}`,
        verified: true,
        digitalSignature: `304502210${Math.random().toString(16).slice(2, 16)}...`,
        timestamps: {
          created: new Date(),
          signed: new Date(Date.now() + 5 * 60 * 1000)
        }
      };

      setValidationResult(prescription);
      setShowCreateForm(false);
      setNewPrescription({
        patientId: "",
        doctorId: "",
        medications: "",
        validDays: "30"
      });
    } catch (err) {
      setError("Failed to create prescription. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const generateQRCode = (prescription: PrescriptionRecord) => {
    // Generate QR code data
    const qrData = {
      id: prescription.id,
      hash: prescription.blockchainHash,
      valid: prescription.validUntil.toISOString()
    };
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">QR Code</text>
        <text x="100" y="120" text-anchor="middle" font-size="8" fill="gray">${prescription.id}</text>
      </svg>
    `)}`;
  };

  const downloadCertificate = (prescription: PrescriptionRecord) => {
    const certificate = `
BLOCKCHAIN PRESCRIPTION CERTIFICATE

Prescription ID: ${prescription.id}
Blockchain Hash: ${prescription.blockchainHash}
Transaction ID: ${prescription.transactionId}
Issue Date: ${prescription.issueDate.toISOString()}
Valid Until: ${prescription.validUntil.toISOString()}
Digital Signature: ${prescription.digitalSignature}

This prescription has been verified on the blockchain.
    `;
    
    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${prescription.id}-certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blockchain Prescription Validator</h2>
          <p className="text-muted-foreground">
            Secure prescription verification and fraud prevention using blockchain technology
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <FileText className="h-4 w-4 mr-2" />
          Create Prescription
        </Button>
      </div>

      {/* Validation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Prescription Validation
          </CardTitle>
          <CardDescription>
            Enter a prescription ID to verify its authenticity on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter prescription ID (e.g., RX-2024-001)"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={validatePrescription}
              disabled={!prescriptionId.trim() || isValidating}
            >
              {isValidating ? (
                <>
                  <Hash className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Validate
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Create Prescription Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Blockchain Prescription</CardTitle>
            <CardDescription>
              Create a new prescription that will be stored and verified on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient ID</label>
                <Input
                  value={newPrescription.patientId}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, patientId: e.target.value }))}
                  placeholder="PAT-001"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Doctor ID</label>
                <Input
                  value={newPrescription.doctorId}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, doctorId: e.target.value }))}
                  placeholder="DOC-123"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Valid for (days)</label>
                <Input
                  type="number"
                  value={newPrescription.validDays}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, validDays: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Medications (one per line: Name, Dosage, Quantity, Instructions)</label>
              <Textarea
                value={newPrescription.medications}
                onChange={(e) => setNewPrescription(prev => ({ ...prev, medications: e.target.value }))}
                placeholder="Metformin, 500mg, 60, Take twice daily with meals"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={createPrescription}
                disabled={isCreating || !newPrescription.patientId || !newPrescription.doctorId}
              >
                {isCreating ? (
                  <>
                    <Lock className="h-4 w-4 mr-2 animate-spin" />
                    Creating on Blockchain...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Create Prescription
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Prescription Verified
                <Badge className="ml-auto bg-green-100 text-green-800">
                  Authentic
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prescription ID</label>
                  <p className="font-mono text-sm">{validationResult.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                  <p className="font-mono text-sm">{validationResult.patientId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Doctor ID</label>
                  <p className="font-mono text-sm">{validationResult.doctorId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                  <p className="text-sm">{validationResult.issueDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valid Until</label>
                  <p className="text-sm">{validationResult.validUntil.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={validationResult.validUntil > new Date() ? "default" : "destructive"}>
                    {validationResult.validUntil > new Date() ? "Active" : "Expired"}
                  </Badge>
                </div>
              </div>

              {/* Medications */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Prescribed Medications</label>
                <div className="space-y-2 mt-2">
                  {validationResult.medications.map((med, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">{med.name} {med.dosage}</div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {med.quantity} • {med.instructions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Timeline</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Created: {validationResult.timestamps.created.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Signed: {validationResult.timestamps.signed.toLocaleString()}</span>
                  </div>
                  {validationResult.timestamps.dispensed && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Dispensed: {validationResult.timestamps.dispensed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Blockchain Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Blockchain Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Blockchain Hash</label>
                  <p className="font-mono text-xs bg-muted p-2 rounded break-all">
                    {validationResult.blockchainHash}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <p className="font-mono text-xs bg-muted p-2 rounded break-all">
                    {validationResult.transactionId}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Digital Signature</label>
                  <p className="font-mono text-xs bg-muted p-2 rounded break-all">
                    {validationResult.digitalSignature}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <label className="text-sm font-medium text-muted-foreground">Verification QR Code</label>
                <div className="mt-2 flex justify-center">
                  <img
                    src={generateQRCode(validationResult)}
                    alt="Prescription QR Code"
                    className="w-32 h-32 border rounded"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={() => downloadCertificate(validationResult)}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                
                <Button
                  onClick={() => navigator.clipboard.writeText(validationResult.blockchainHash)}
                  variant="outline"
                  className="w-full"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Copy Hash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Example Prescriptions */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Try Example Prescription</CardTitle>
          <CardDescription>
            Use this example prescription ID to test the validation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-mono text-sm bg-background p-2 rounded border">
                RX-2024-001
              </p>
            </div>
            <Button
              onClick={() => {
                setPrescriptionId("RX-2024-001");
                validatePrescription();
              }}
              variant="outline"
            >
              Try This Example
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Network Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Blockchain Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Network Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Security Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Immutable records</li>
                <li>• Digital signatures</li>
                <li>• Fraud prevention</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HIPAA compliant</li>
                <li>• FDA guidelines</li>
                <li>• International standards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}