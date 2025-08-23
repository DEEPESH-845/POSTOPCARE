import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Users, MessageCircle, Thermometer, Camera, Clock, Send } from "lucide-react";

const patientAlerts = [
  {
    id: 1,
    name: "Neha Patel",
    age: 35,
    surgery: "Knee Replacement",
    day: 5,
    priority: "high",
    timestamp: "10 minutes ago",
    alerts: [
      { type: "temperature", value: "38.2°C", status: "elevated" },
      { type: "pain", value: "8/10", status: "high" },
      { type: "visual", value: "Redness detected", status: "concerning" }
    ],
    photos: 2,
    lastCheckin: "2 hours ago"
  },
  {
    id: 2,
    name: "Rajesh Singh", 
    age: 42,
    surgery: "Appendectomy",
    day: 2,
    priority: "low",
    timestamp: "3 hours ago",
    alerts: [
      { type: "pain", value: "3/10", status: "normal" },
      { type: "mobility", value: "Good", status: "normal" }
    ],
    photos: 0,
    lastCheckin: "6 hours ago"
  }
];

const ClinicianDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(patientAlerts[0]);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = () => {
    setMessageSent(true);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              PostOpCare+ Clinician Dashboard
            </h1>
            <p className="text-muted-foreground">
              Triage • Dr. Mehta • Regional Medical Center
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold text-alert">1</div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">2</div>
              <div className="text-xs text-muted-foreground">Total Patients</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Patient List Sidebar */}
        <div className="w-80 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Active Alerts
            </h2>
          </div>
          
          <div className="space-y-2 p-4">
            {patientAlerts.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPatient.id === patient.id
                    ? 'border-primary bg-primary-soft'
                    : 'border-border hover:border-primary/50'
                } ${patient.priority === 'high' ? 'pulse-alert' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.surgery} • Day {patient.day}
                    </p>
                  </div>
                  <Badge 
                    variant={patient.priority === 'high' ? 'destructive' : 'secondary'}
                    className={patient.priority === 'high' ? 'bg-alert text-white' : ''}
                  >
                    {patient.priority === 'high' ? 'URGENT' : 'Monitor'}
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {patient.timestamp}
                </div>
              </div>
            ))}
            
            {patientAlerts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No alerts. You're on track — keep going!</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Header */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {selectedPatient.name}, {selectedPatient.age}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {selectedPatient.surgery} • Post-op Day {selectedPatient.day}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {selectedPatient.priority === 'high' && (
                        <AlertTriangle className="w-5 h-5 text-alert" />
                      )}
                      <Badge 
                        variant={selectedPatient.priority === 'high' ? 'destructive' : 'secondary'}
                        className={selectedPatient.priority === 'high' ? 'bg-alert text-white' : ''}
                      >
                        {selectedPatient.priority === 'high' ? 'HIGH PRIORITY' : 'ROUTINE'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Alert Summary */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-alert">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Current Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedPatient.alerts.map((alert, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          alert.status === 'elevated' || alert.status === 'high' || alert.status === 'concerning'
                            ? 'border-alert/20 bg-alert-soft' 
                            : 'border-border bg-muted'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {alert.type === 'temperature' && <Thermometer className="w-4 h-4" />}
                          {alert.type === 'visual' && <Camera className="w-4 h-4" />}
                          <span className="font-medium capitalize">{alert.type}</span>
                        </div>
                        <div className="text-lg font-semibold">{alert.value}</div>
                        <div className={`text-xs ${
                          alert.status === 'elevated' || alert.status === 'high' || alert.status === 'concerning'
                            ? 'text-alert' 
                            : 'text-muted-foreground'
                        }`}>
                          {alert.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              {selectedPatient.photos > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Wound Photos ({selectedPatient.photos})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
                          alt="Wound photo 1"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          10 min ago
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop"
                          alt="Wound photo 2"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          10 min ago
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-alert-soft border border-alert/20 rounded-lg p-3">
                      <p className="text-sm text-alert font-medium">AI Analysis Results:</p>
                      <ul className="text-xs text-alert/80 mt-1 space-y-1">
                        <li>• Moderate redness detected around incision site</li>
                        <li>• No visible drainage or pus</li>
                        <li>• Slight swelling consistent with post-op inflammation</li>
                        <li>• Recommend closer monitoring</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Response Section */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type your message to the patient..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-24"
                  />
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    
                    <Button variant="outline">
                      Schedule Call
                    </Button>
                    
                    <Button variant="outline">
                      Escalate to Doctor
                    </Button>
                  </div>
                  
                  {messageSent && (
                    <div className="bg-success-soft border border-success/20 rounded-lg p-3">
                      <p className="text-success text-sm">
                        ✓ Message sent to patient. They will be notified immediately.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicianDashboard;