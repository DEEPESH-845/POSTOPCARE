import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Bell, Shield, Trash2, MessageCircle, Smartphone, Globe, LogOut, Calendar, Activity, ArrowRight, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface RecoveryPlan {
  _id: string;
  surgeryType: string;
  specificProcedure: string;
  category: string;
  surgeryDate: string;
  progress: {
    overallProgress: number;
    currentDay: number;
    totalDays: number;
    daysCompleted: number;
    daysRemaining: number;
  };
  startDate: string;
  estimatedEndDate: string;
  isActive: boolean;
  createdAt: string;
}

interface ProfileData {
  user: {
    _id: string;
    fullname: string;
    email: string;
    language: string;
    createdAt: string;
  };
  recovery: {
    hasActivePlans: boolean;
    totalPlans: number;
    currentPlan: {
      surgeryType: string;
      currentDay: number;
      totalDays: number;
      progress: number;
    } | null;
    nextCheckIn: string | null;
  };
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [notifications, setNotifications] = useState({
    checkInReminders: true,
    medicationAlerts: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    careTeamMessages: true,
    pushNotifications: true
  });

  const [language, setLanguage] = useState('en');

  // Fetch profile data and recovery plans
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile data
        const profileResponse = await api.get('/user/profile');
        setProfileData(profileResponse.data.data);
        setLanguage(profileResponse.data.data.user.language);

        // Fetch recovery plans
        const recoveryResponse = await api.get('/user/recovery-plans');
        setRecoveryPlans(recoveryResponse.data.data);

      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // In real app, this would delete user data
    console.log("Account deletion requested");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to Load Profile</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <p className="text-foreground">{profileData?.user.fullname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{profileData?.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Language</label>
                <p className="text-foreground">
                  {profileData?.user.language === 'english' ? 'English' :
                   profileData?.user.language === 'hindi' ? 'हिंदी (Hindi)' :
                   profileData?.user.language === 'tamil' ? 'தமிழ் (Tamil)' : 
                   profileData?.user.language}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Recovery Plans</label>
                <p className="text-foreground">{profileData?.recovery.totalPlans} active</p>
              </div>
              {profileData?.recovery.currentPlan && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Recovery</label>
                    <p className="text-foreground">{profileData.recovery.currentPlan.surgeryType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Recovery Day</label>
                    <p className="text-foreground">
                      Day {profileData.recovery.currentPlan.currentDay} of {profileData.recovery.currentPlan.totalDays}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {/* Logout Button */}
            <div className="mt-6 pt-4 border-t">
            </div>
          </CardContent>
        </Card>

        {/* Recovery Plans Section */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Recovery Plans
              </div>
              {!profileData?.recovery.hasActivePlans && (
                <Link to="/onboarding">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Recovery
                  </Button>
                </Link>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData?.recovery.hasActivePlans ? (
              <div className="space-y-4">
                {recoveryPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      plan.isActive ? 'border-primary/20 bg-primary-soft' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {plan.category} - {plan.specificProcedure}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Surgery Date: {formatDate(plan.surgeryDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        {plan.isActive ? (
                          <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">
                          {Math.round(plan.progress.overallProgress)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">
                          {plan.progress.currentDay}
                        </div>
                        <div className="text-xs text-muted-foreground">Current Day</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-muted-foreground">
                          {plan.progress.daysRemaining}
                        </div>
                        <div className="text-xs text-muted-foreground">Days Left</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/recovery-plan/${plan._id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          View Plan
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      {plan.isActive && (
                        <Link to="/daily-checkin" className="flex-1">
                          <Button variant="primary" className="w-full" size="sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            Check-in
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Recovery Plans Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your personalized recovery journey today. Our AI-powered system 
                  will create a custom recovery plan based on your surgery type.
                </p>
                <Link to="/onboarding">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Your Recovery Plan
                  </Button>
                </Link>
              </div>
            )}
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