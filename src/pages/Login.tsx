import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, User, Shield, Stethoscope, Building2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const roles = [
  { 
    id: 'patient', 
    name: 'Patient', 
    icon: <User className="h-5 w-5" />,
    description: 'Personal medication management and health tracking',
    features: ['Drug Interaction Checks', 'Medication Reminders', 'Health Tracking']
  },
  { 
    id: 'doctor', 
    name: 'Doctor', 
    icon: <Stethoscope className="h-5 w-5" />,
    description: 'Clinical decision support and patient management',
    features: ['Clinical Decision Support', 'Patient Management', 'Prescription Analytics']
  },
  { 
    id: 'pharmacist', 
    name: 'Pharmacist', 
    icon: <Pill className="h-5 w-5" />,
    description: 'Prescription verification and drug interaction analysis',
    features: ['Prescription Verification', 'Drug Interaction Analysis', 'Inventory Management']
  },
  { 
    id: 'researcher', 
    name: 'Researcher', 
    icon: <Shield className="h-5 w-5" />,
    description: 'Advanced analytics and research tools',
    features: ['Data Analytics', 'Research Tools', 'Clinical Trials']
  },
  { 
    id: 'administrator', 
    name: 'Administrator', 
    icon: <Building2 className="h-5 w-5" />,
    description: 'System administration and user management',
    features: ['User Management', 'System Analytics', 'Compliance Monitoring']
  }
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    licenseNumber: '',
    specialization: '',
    hospitalAffiliation: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await apiClient.login(formData.username, formData.password);
      } else {
        response = await apiClient.register(
          formData.username,
          formData.email,
          formData.password,
          formData.role
        );
      }

      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response.error || 'Authentication failed');
      }
    } catch (error) {
      toast.error('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Branding Section */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">PharmaLytics</h1>
          </div>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Advanced AI-Powered Healthcare Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Intelligent drug interaction analysis, personalized healthcare insights, 
            and cutting-edge medical technology integration.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold text-primary">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Hugging Face Granite models for intelligent analysis</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold text-primary">Blockchain Secure</h3>
              <p className="text-sm text-muted-foreground">HIPAA compliant with advanced security</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold text-primary">Multi-Role Support</h3>
              <p className="text-sm text-muted-foreground">Tailored experiences for all healthcare professionals</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold text-primary">Innovation Hub</h3>
              <p className="text-sm text-muted-foreground">AR, IoT, and voice-powered features</p>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isLogin ? 'Welcome Back' : 'Join PharmaLytics'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to access your healthcare dashboard' : 'Create your account and select your role'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label>Select Your Role</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {roles.map(role => (
                        <Card 
                          key={role.id}
                          className={`cursor-pointer transition-all ${
                            selectedRole === role.id ? 'ring-2 ring-primary bg-primary/5' : ''
                          }`}
                          onClick={() => handleRoleSelect(role.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              {role.icon}
                              <div className="flex-1">
                                <h4 className="font-medium">{role.name}</h4>
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {role.features.slice(0, 2).map(feature => (
                                    <Badge key={feature} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {(selectedRole === 'doctor' || selectedRole === 'pharmacist') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {selectedRole === 'doctor' && (
                    <div>
                      <Label htmlFor="hospital">Hospital Affiliation</Label>
                      <Input
                        id="hospital"
                        value={formData.hospitalAffiliation}
                        onChange={(e) => setFormData(prev => ({ ...prev, hospitalAffiliation: e.target.value }))}
                      />
                    </div>
                  )}
                </>
              )}

              {isLogin && (
                <>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || (!isLogin && !selectedRole)}>
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}