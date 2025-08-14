import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { 
  Pill, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Bell, 
  Calendar,
  TrendingUp,
  Award
} from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: Date;
  endDate?: Date;
  adherenceRate: number;
  lastTaken?: Date;
  missedDoses: number;
  totalDoses: number;
}

interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  taken: boolean;
  missed: boolean;
  date: Date;
}

export function AdherenceMonitor() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    times: ["08:00"],
    startDate: new Date().toISOString().split('T')[0]
  });
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Load demo data
    const demoMedications: Medication[] = [
      {
        id: "1",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        times: ["08:00", "20:00"],
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        adherenceRate: 85,
        lastTaken: new Date(Date.now() - 12 * 60 * 60 * 1000),
        missedDoses: 2,
        totalDoses: 14
      },
      {
        id: "2",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        times: ["08:00"],
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        adherenceRate: 95,
        lastTaken: new Date(Date.now() - 8 * 60 * 60 * 1000),
        missedDoses: 1,
        totalDoses: 14
      }
    ];
    
    setMedications(demoMedications);
    setupReminders();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(prev => [...prev, 'Notifications enabled successfully']);
      }
    }
  };

  const setupReminders = () => {
    // Set up notifications for medication times
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Check if it's time for any medications
    medications.forEach(med => {
      med.times.forEach(time => {
        if (time === currentTime) {
          showNotification(`Time to take ${med.name}`, `${med.dosage} - ${med.frequency}`);
        }
      });
    });
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/pill-icon.png',
        tag: 'medication-reminder'
      });
    }
    
    setNotifications(prev => [...prev, `${title}: ${body}`]);
  };

  const addMedication = () => {
    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      times: newMedication.times,
      startDate: new Date(newMedication.startDate),
      adherenceRate: 100,
      missedDoses: 0,
      totalDoses: 0
    };
    
    setMedications(prev => [...prev, medication]);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "daily",
      times: ["08:00"],
      startDate: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const markAsTaken = (medicationId: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? {
              ...med,
              lastTaken: new Date(),
              totalDoses: med.totalDoses + 1,
              adherenceRate: Math.round(((med.totalDoses + 1 - med.missedDoses) / (med.totalDoses + 1)) * 100)
            }
          : med
      )
    );
    
    const medication = medications.find(med => med.id === medicationId);
    if (medication) {
      setNotifications(prev => [...prev, `✓ ${medication.name} taken successfully`]);
    }
  };

  const markAsMissed = (medicationId: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? {
              ...med,
              missedDoses: med.missedDoses + 1,
              totalDoses: med.totalDoses + 1,
              adherenceRate: Math.round(((med.totalDoses + 1 - med.missedDoses - 1) / (med.totalDoses + 1)) * 100)
            }
          : med
      )
    );
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 bg-green-100";
    if (rate >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getOverallAdherence = () => {
    if (medications.length === 0) return 0;
    const total = medications.reduce((sum, med) => sum + med.adherenceRate, 0);
    return Math.round(total / medications.length);
  };

  const addTimeSlot = () => {
    setNewMedication(prev => ({
      ...prev,
      times: [...prev.times, "12:00"]
    }));
  };

  const updateTimeSlot = (index: number, time: string) => {
    setNewMedication(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? time : t)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Adherence Monitor</h2>
          <p className="text-muted-foreground">
            Track medication adherence and receive smart reminders
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Overall Adherence</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{getOverallAdherence()}%</span>
                  <Progress value={getOverallAdherence()} className="w-16 h-2 ml-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Pill className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Active Medications</p>
                <p className="text-2xl font-bold">{medications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Doses Taken Today</p>
                <p className="text-2xl font-bold">
                  {medications.reduce((sum, med) => {
                    const todayTaken = med.lastTaken && 
                      med.lastTaken.toDateString() === new Date().toDateString() ? 1 : 0;
                    return sum + todayTaken;
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-yellow-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Medication</CardTitle>
            <CardDescription>Set up monitoring and reminders for a new medication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Metformin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input
                  id="med-dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-frequency">Frequency</Label>
                <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="thrice">Three times daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-start">Start Date</Label>
                <Input
                  id="med-start"
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Reminder Times</Label>
              {newMedication.times.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="w-32"
                  />
                  {index === newMedication.times.length - 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addMedication} disabled={!newMedication.name || !newMedication.dosage}>
                Add Medication
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map(medication => (
          <Card key={medication.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{medication.name}</CardTitle>
                <Badge className={getAdherenceColor(medication.adherenceRate)}>
                  {medication.adherenceRate}%
                </Badge>
              </div>
              <CardDescription>
                {medication.dosage} • {medication.frequency}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Adherence Rate</span>
                  <span>{medication.adherenceRate}%</span>
                </div>
                <Progress value={medication.adherenceRate} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Doses Taken</p>
                  <p className="font-medium">{medication.totalDoses - medication.missedDoses}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Missed Doses</p>
                  <p className="font-medium text-red-600">{medication.missedDoses}</p>
                </div>
              </div>
              
              {medication.lastTaken && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Last Taken</p>
                  <p className="font-medium">
                    {medication.lastTaken.toLocaleDateString()} at {medication.lastTaken.toLocaleTimeString()}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Reminder Times</p>
                <div className="flex flex-wrap gap-2">
                  {medication.times.map((time, index) => (
                    <Badge key={index} variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => markAsTaken(medication.id)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Taken
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => markAsMissed(medication.id)}
                  className="flex-1"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Mark as Missed
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.slice(-5).map((notification, index) => (
                <Alert key={index}>
                  <AlertDescription className="text-sm">{notification}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* IoT Integration Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Smart Bottle Integration</CardTitle>
          <CardDescription>
            Connect IoT-enabled pill bottles for automatic adherence tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic dose detection</li>
                <li>• Real-time notifications</li>
                <li>• Temperature monitoring</li>
                <li>• Refill reminders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Compatible Devices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hero Health Smart Dispenser</li>
                <li>• PillPack by Amazon</li>
                <li>• AdhereTech Smart Bottles</li>
                <li>• Custom IoT solutions</li>
              </ul>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Connect Smart Device
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}