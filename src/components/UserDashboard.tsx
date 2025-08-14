import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stethoscope, 
  Pill, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Calendar,
  FileText,
  Shield
} from "lucide-react";

const UserDashboard = () => {
  const [activeUserType, setActiveUserType] = useState<"doctor" | "pharmacist" | "patient">("doctor");

  const userTypes = [
    {
      id: "doctor" as const,
      name: "Healthcare Provider",
      icon: Stethoscope,
      color: "from-primary to-primary-glow"
    },
    {
      id: "pharmacist" as const,
      name: "Pharmacist", 
      icon: Pill,
      color: "from-medical-teal to-accent"
    },
    {
      id: "patient" as const,
      name: "Patient",
      icon: Users,
      color: "from-medical-green to-success"
    }
  ];

  const dashboardData = {
    doctor: {
      stats: [
        { label: "Patients Monitored", value: "234", icon: Users, trend: "+12%" },
        { label: "Prescriptions Analyzed", value: "1,847", icon: FileText, trend: "+8%" },
        { label: "Interactions Prevented", value: "42", icon: Shield, trend: "+15%" },
        { label: "Safety Score", value: "98.5%", icon: CheckCircle, trend: "+2%" }
      ],
      recentActivity: [
        { type: "warning", message: "High-risk interaction detected for Patient #1847", time: "2 min ago" },
        { type: "success", message: "Alternative medication recommended for Patient #1823", time: "15 min ago" },
        { type: "info", message: "Dosage adjustment completed for Patient #1834", time: "1 hour ago" }
      ]
    },
    pharmacist: {
      stats: [
        { label: "Prescriptions Verified", value: "567", icon: FileText, trend: "+5%" },
        { label: "Drug Interactions Found", value: "23", icon: AlertTriangle, trend: "-10%" },
        { label: "Alternative Drugs Suggested", value: "89", icon: Pill, trend: "+18%" },
        { label: "Patient Consultations", value: "156", icon: Users, trend: "+7%" }
      ],
      recentActivity: [
        { type: "warning", message: "Prescription verification required for controlled substance", time: "5 min ago" },
        { type: "success", message: "Generic alternative suggested and approved", time: "22 min ago" },
        { type: "info", message: "Patient counseling session completed", time: "45 min ago" }
      ]
    },
    patient: {
      stats: [
        { label: "Current Medications", value: "5", icon: Pill, trend: "0%" },
        { label: "Adherence Rate", value: "94%", icon: Activity, trend: "+3%" },
        { label: "Next Appointment", value: "3 days", icon: Calendar, trend: "" },
        { label: "Health Score", value: "Good", icon: TrendingUp, trend: "+1" }
      ],
      recentActivity: [
        { type: "success", message: "Medication taken on time - Metformin 500mg", time: "2 hours ago" },
        { type: "info", message: "Reminder: Next dose in 4 hours", time: "4 hours ago" },
        { type: "warning", message: "Missed dose alert resolved", time: "Yesterday" }
      ]
    }
  };

  const currentData = dashboardData[activeUserType];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              Multi-User Interface
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Tailored Dashboards for Every User
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience personalized interfaces designed for healthcare professionals and patients
            </p>
          </div>

          {/* User Type Selector */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-card rounded-lg p-1 shadow-soft">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={activeUserType === type.id ? "default" : "ghost"}
                    onClick={() => setActiveUserType(type.id)}
                    className="px-6 py-3 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {currentData.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-6 shadow-soft hover:shadow-medical transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${userTypes.find(t => t.id === activeUserType)?.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {stat.trend && (
                        <Badge variant={stat.trend.startsWith('+') ? "default" : stat.trend.startsWith('-') ? "destructive" : "secondary"} className="text-xs">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })}
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="p-6 shadow-soft">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      Performance Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Safety Compliance</span>
                        <span className="font-semibold">98.5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full" style={{width: '98.5%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-semibold">&lt; 500ms</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-medical-green to-success h-2 rounded-full" style={{width: '95%'}}></div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 shadow-soft">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      {activeUserType === "doctor" && (
                        <>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            New Prescription Analysis
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="w-4 h-4 mr-2" />
                            Patient Risk Assessment
                          </Button>
                        </>
                      )}
                      {activeUserType === "pharmacist" && (
                        <>
                          <Button variant="outline" className="w-full justify-start">
                            <Pill className="w-4 h-4 mr-2" />
                            Verify Prescription
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Interaction Alert Review
                          </Button>
                        </>
                      )}
                      {activeUserType === "patient" && (
                        <>
                          <Button variant="outline" className="w-full justify-start">
                            <Pill className="w-4 h-4 mr-2" />
                            Log Medication Taken
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Appointment
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="p-6 shadow-soft">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {currentData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'warning' ? 'bg-warning' : 
                          activity.type === 'success' ? 'bg-success' : 'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="p-6 shadow-soft">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    Analytics Dashboard
                  </h3>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Advanced Analytics</p>
                    <p>Comprehensive reporting and insights would be displayed here with interactive charts and data visualization.</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;