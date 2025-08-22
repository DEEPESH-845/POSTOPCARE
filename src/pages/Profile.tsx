import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Bell, Shield, Trash2, MessageCircle, Smartphone, Globe } from "lucide-react";

const Profile = () => {
  const [notifications, setNotifications] = useState({
    checkInReminders: true,
    medicationAlerts: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    careTeamMessages: true,
    pushNotifications: true
  });

  const [language, setLanguage] = useState('en');

  const handleDeleteAccount = () => {
    // In real app, this would delete user data
    console.log("Account deletion requested");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile & Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Patient Information */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">Neha Patel</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p className="text-foreground">35 years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Surgery Type</label>
                <p className="text-foreground">Knee Replacement</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Recovery Day</label>
                <p className="text-foreground">Day 5 of 42</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Care Team</label>
                <p className="text-foreground">Regional Medical Center</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Next Check-in</label>
                <p className="text-foreground">Today, 8:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary" />
              Language Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { code: 'en', name: 'English', native: 'English' },
                { code: 'hi', name: 'Hindi', native: 'हिंदी' },
                { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    language === lang.code
                      ? 'border-primary bg-primary-soft'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{lang.native}</div>
                      <div className="text-sm text-muted-foreground">{lang.name}</div>
                    </div>
                    {language === lang.code && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Check-in Reminders</p>
                  <p className="text-sm text-muted-foreground">Daily recovery check-in notifications</p>
                </div>
                <Switch
                  checked={notifications.checkInReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, checkInReminders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Medication Alerts</p>
                  <p className="text-sm text-muted-foreground">Reminders for prescribed medications</p>
                </div>
                <Switch
                  checked={notifications.medicationAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, medicationAlerts: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">Upcoming medical appointments</p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, appointmentReminders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Emergency Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical health notifications</p>
                </div>
                <Switch
                  checked={notifications.emergencyAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emergencyAlerts: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Care Team Messages</p>
                  <p className="text-sm text-muted-foreground">Messages from your medical team</p>
                </div>
                <Switch
                  checked={notifications.careTeamMessages}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, careTeamMessages: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Mobile app notifications</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, pushNotifications: checked})
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-success" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-success-soft border border-success/20 rounded-lg p-4">
              <h4 className="font-medium text-success mb-2">Your Data is Protected</h4>
              <ul className="text-sm text-success/80 space-y-1">
                <li>• All health data is encrypted end-to-end</li>
                <li>• HIPAA compliant data handling</li>
                <li>• Only authorized care team members can access your information</li>
                <li>• Regular security audits and monitoring</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Download My Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Privacy Policy
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="mr-2 h-4 w-4" />
                Terms of Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Deletion */}
        <Card className="mb-6 shadow-card border-alert/20">
          <CardHeader>
            <CardTitle className="flex items-center text-alert">
              <Trash2 className="w-5 h-5 mr-2" />
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-alert-soft border border-alert/20 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-alert mb-2">Delete Account & Data</h4>
              <p className="text-sm text-alert/80">
                This will permanently delete your account and all associated health data. 
                This action cannot be undone.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-alert text-alert hover:bg-alert/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Request Account Deletion
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This will permanently remove
                    all your health data, recovery progress, and care team connections. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-alert hover:bg-alert/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Demo Information */}
        <div className="text-center">
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Mode:</strong> Settings changes are simulated and won't persist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;