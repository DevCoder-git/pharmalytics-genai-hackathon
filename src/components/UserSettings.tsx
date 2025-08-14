import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Database,
  Key,
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UserSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      alerts: true,
      reports: true,
      marketing: false
    },
    privacy: {
      analytics: true,
      cookies: true,
      dataSharing: false
    },
    apiKeys: {
      huggingface: '',
      drugbank: '',
      fda: ''
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const exportData = () => {
    const userData = localStorage.getItem('user');
    const userSettings = localStorage.getItem('userSettings');
    
    const exportData = {
      user: userData ? JSON.parse(userData) : null,
      settings: userSettings ? JSON.parse(userSettings) : null,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmalytics-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your application preferences and integrations
          </p>
        </div>
        <Button onClick={saveSettings}>
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="integrations">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Preferences
              </CardTitle>
              <CardDescription>
                Configure your basic application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Theme</Label>
                  <div className="text-sm text-muted-foreground">
                    Choose how PharmaLytics looks to you
                  </div>
                </div>
                <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Language</Label>
                  <div className="text-sm text-muted-foreground">
                    Select your preferred language
                  </div>
                </div>
                <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium capitalize">
                      {key === 'email' ? 'Email Notifications' :
                       key === 'push' ? 'Push Notifications' :
                       key === 'alerts' ? 'Critical Alerts' :
                       key === 'reports' ? 'Report Updates' :
                       'Marketing Communications'}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {key === 'email' ? 'Receive notifications via email' :
                       key === 'push' ? 'Browser push notifications' :
                       key === 'alerts' ? 'Urgent system alerts and warnings' :
                       key === 'reports' ? 'Updates on report generation' :
                       'Product updates and feature announcements'}
                    </div>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateSetting(`notifications.${key}`, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      {key === 'analytics' ? 'Usage Analytics' :
                       key === 'cookies' ? 'Performance Cookies' :
                       'Data Sharing'}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {key === 'analytics' ? 'Help improve the app with anonymous usage data' :
                       key === 'cookies' ? 'Essential cookies for app functionality' :
                       'Share anonymized data with research partners'}
                    </div>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateSetting(`privacy.${key}`, checked)}
                  />
                </div>
              ))}

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Data Management</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Export Data</Label>
                    <div className="text-sm text-muted-foreground">
                      Download all your data in JSON format
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-destructive">Delete Account</Label>
                    <div className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys & Integrations
              </CardTitle>
              <CardDescription>
                Configure external API integrations for enhanced functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Secure API Key Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      API keys are stored securely in your browser's local storage. For production use, 
                      consider using Supabase secrets management or environment variables.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">HuggingFace API Key</Label>
                      <div className="text-sm text-muted-foreground">
                        Required for AI model predictions and analysis
                      </div>
                    </div>
                    <Badge variant={settings.apiKeys.huggingface ? "default" : "secondary"}>
                      {settings.apiKeys.huggingface ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Get your API key from: <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://huggingface.co/settings/tokens</a>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">DrugBank API Key</Label>
                      <div className="text-sm text-muted-foreground">
                        Access comprehensive drug information database
                      </div>
                    </div>
                    <Badge variant={settings.apiKeys.drugbank ? "default" : "secondary"}>
                      {settings.apiKeys.drugbank ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Get your API key from: <a href="https://go.drugbank.com/releases/latest#open-data" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DrugBank Open Data</a>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">FDA API Key</Label>
                      <div className="text-sm text-muted-foreground">
                        Access FDA drug approval and safety data
                      </div>
                    </div>
                    <Badge variant={settings.apiKeys.fda ? "default" : "secondary"}>
                      {settings.apiKeys.fda ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Get your API key from: <a href="https://open.fda.gov/apis/authentication/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openFDA API</a>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-900">Dataset Training Information</h4>
                    <p className="text-sm text-blue-700">
                      The AI models use pre-trained datasets from pharmaceutical research. 
                      You can enhance the models by providing additional training data through 
                      the Django backend's dataset management commands:
                    </p>
                    <ul className="text-xs text-blue-600 mt-2 space-y-1">
                      <li>• <code>python manage.py import_drugbank</code> - Import DrugBank data</li>
                      <li>• <code>python manage.py import_fda_data</code> - Import FDA datasets</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};