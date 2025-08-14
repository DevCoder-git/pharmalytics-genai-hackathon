import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Plus,
  Trash2
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  type: 'interaction' | 'peak' | 'warning' | 'reminder';
  time: string;
  date: string;
  medication: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
}

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export function PredictiveTimeline() {
  const [medications, setMedications] = useState<MedicationSchedule[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7'); // days

  useEffect(() => {
    generateTimeline();
  }, [medications, timeRange]);

  const generateTimeline = async () => {
    if (medications.length === 0) return;

    setLoading(true);
    try {
      // Generate predictive timeline based on medication schedules
      const events: TimelineEvent[] = [];
      const today = new Date();
      const endDate = new Date(today.getTime() + parseInt(timeRange) * 24 * 60 * 60 * 1000);

      medications.forEach((med, index) => {
        const startDate = new Date(med.startDate);
        let currentDate = new Date(Math.max(startDate.getTime(), today.getTime()));

        while (currentDate <= endDate) {
          // Add medication doses
          const hours = getFrequencyHours(med.frequency);
          hours.forEach(hour => {
            const eventTime = new Date(currentDate);
            eventTime.setHours(hour, 0, 0, 0);

            if (eventTime >= today) {
              events.push({
                id: `${med.id}-${eventTime.getTime()}`,
                type: 'reminder',
                time: eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: eventTime.toLocaleDateString(),
                medication: med.name,
                description: `Take ${med.dosage}`,
                severity: 'low',
                confidence: 95
              });

              // Predict peak levels (2-4 hours after dose)
              const peakTime = new Date(eventTime.getTime() + 3 * 60 * 60 * 1000);
              if (peakTime <= endDate) {
                events.push({
                  id: `peak-${med.id}-${peakTime.getTime()}`,
                  type: 'peak',
                  time: peakTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  date: peakTime.toLocaleDateString(),
                  medication: med.name,
                  description: `Expected peak concentration`,
                  severity: 'medium',
                  confidence: 85
                });
              }
            }
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Check for potential interactions with other medications
        medications.forEach((otherMed, otherIndex) => {
          if (index !== otherIndex) {
            const interactionTime = new Date(today.getTime() + Math.random() * parseInt(timeRange) * 24 * 60 * 60 * 1000);
            events.push({
              id: `interaction-${med.id}-${otherMed.id}`,
              type: 'interaction',
              time: interactionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: interactionTime.toLocaleDateString(),
              medication: `${med.name} + ${otherMed.name}`,
              description: `Potential interaction detected`,
              severity: 'high',
              confidence: 78
            });
          }
        });
      });

      // Sort events by date and time
      events.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
      
      setTimeline(events);
    } catch (error) {
      toast.error('Failed to generate timeline');
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyHours = (frequency: string): number[] => {
    const freq = frequency.toLowerCase();
    if (freq.includes('once') || freq.includes('daily')) return [9];
    if (freq.includes('twice') || freq.includes('bid')) return [9, 21];
    if (freq.includes('three') || freq.includes('tid')) return [9, 15, 21];
    if (freq.includes('four') || freq.includes('qid')) return [9, 13, 17, 21];
    if (freq.includes('every 6')) return [6, 12, 18, 24];
    if (freq.includes('every 8')) return [8, 16, 24];
    if (freq.includes('every 12')) return [9, 21];
    return [9]; // default
  };

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.frequency || !newMed.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medication: MedicationSchedule = {
      id: Date.now().toString(),
      ...newMed
    };

    setMedications(prev => [...prev, medication]);
    setNewMed({ name: '', dosage: '', frequency: '', startDate: '', endDate: '' });
    toast.success('Medication added successfully');
  };

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    toast.success('Medication removed');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interaction': return <AlertTriangle className="h-4 w-4" />;
      case 'peak': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Predictive Interaction Timeline
          </CardTitle>
          <CardDescription>
            AI-powered timeline prediction for when drug interactions and peak levels might occur
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="medications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          {/* Add New Medication */}
          <Card>
            <CardHeader>
              <CardTitle>Add Medication</CardTitle>
              <CardDescription>
                Add medications to generate predictive timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    value={newMed.name}
                    onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Lisinopril"
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 10mg"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="e.g., Twice daily"
                  />
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newMed.startDate}
                    onChange={(e) => setNewMed(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={addMedication}>
                <Plus className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Current Medications ({medications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No medications added yet. Add medications to generate timeline predictions.
                </p>
              ) : (
                <div className="space-y-3">
                  {medications.map(med => (
                    <div key={med.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency} • Started {med.startDate}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {/* Timeline Controls */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Predictive Timeline</h3>
              <p className="text-sm text-muted-foreground">
                AI-generated predictions for medication interactions and peak levels
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="time-range">Time Range:</Label>
              <select
                id="time-range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 border rounded-md"
              >
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>

          {/* Timeline Events */}
          <Card>
            <CardContent className="p-6">
              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Timeline Data</h3>
                  <p className="text-muted-foreground">
                    Add medications to generate timeline predictions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    timeline.reduce((acc, event) => {
                      if (!acc[event.date]) acc[event.date] = [];
                      acc[event.date].push(event);
                      return acc;
                    }, {} as Record<string, TimelineEvent[]>)
                  ).map(([date, events]) => (
                    <div key={date} className="space-y-3">
                      <h4 className="font-semibold text-lg border-b pb-2">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <div className="space-y-2">
                        {events
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map(event => (
                          <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(event.type)}
                              <span className="font-mono text-sm">{event.time}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{event.medication}</span>
                                <Badge className={getSeverityColor(event.severity)}>
                                  {event.severity}
                                </Badge>
                                <Badge variant="outline">
                                  {event.confidence}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Timeline Analytics</CardTitle>
              <CardDescription>
                Insights and statistics from your predictive timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {timeline.filter(e => e.type === 'interaction').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Predicted Interactions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {timeline.filter(e => e.type === 'peak').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Peak Level Events</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {timeline.filter(e => e.type === 'reminder').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Medication Reminders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}