import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, ArrowRight, AlertTriangle, Thermometer, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface TimelineItem {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  status: 'completed' | 'current' | 'upcoming';
}

interface RecoveryData {
  title: string;
  surgeryType?: string;
  specificProcedure?: string;
  progress: {
    overallProgress: number;
    daysCompleted: number;
    currentDay: number;
    daysRemaining: number;
  };
  timeline: TimelineItem[];
}

const RecoveryPlan = () => {
  const [recoveryData, setRecoveryData] = useState<RecoveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [canCheckIn, setCanCheckIn] = useState(true);
  const navigate = useNavigate();
  const { recoveryId } = useParams<{ recoveryId?: string }>();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecoveryPlan();
    checkDailyCheckInStatus();
  }, []);

  const fetchRecoveryPlan = async () => {
    try {
      // Check if recoveryId is provided in the URL parameter
      let surgeryId = recoveryId;
      
      // If no URL parameter, try to get from localStorage (backward compatibility)
      if (!surgeryId) {
        surgeryId = localStorage.getItem('currentSurgeryId');
      }
      
      if (!surgeryId) {
        toast({
          title: "No Recovery Plan Found",
          description: "Please complete the surgery selection to create your recovery plan.",
          variant: "destructive",
        });
        navigate('/surgery-selection');
        return;
      }

      const response = await api.get(`/recovery/plan/${surgeryId}`);
      setRecoveryData(response.data.recoveryJourney);
    } catch (error: any) {
      console.error('Error fetching recovery plan:', error);
      setError(error.response?.data?.message || 'Failed to load recovery plan');
      toast({
        title: "Error Loading Recovery Plan",
        description: "Please try again or create a new recovery plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkDailyCheckInStatus = () => {
    // Check if user has already done daily check-in today
    const lastCheckIn = localStorage.getItem('lastDailyCheckIn');
    const today = new Date().toDateString();
    
    if (lastCheckIn === today) {
      setCanCheckIn(false);
    }
  };

  const handleDailyCheckIn = () => {
    if (!canCheckIn) {
      toast({
        title: "Already Completed",
        description: "You've already completed your daily check-in today. Please come back tomorrow.",
        variant: "destructive",
      });
      return;
    }

    navigate('/daily-checkin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your recovery plan...</p>
        </div>
      </div>
    );
  }

  if (error || !recoveryData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <AlertTriangle className="h-12 w-12 text-alert mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to Load Recovery Plan</h2>
            <p className="text-muted-foreground mb-4">
              {error || "There was an issue loading your recovery plan."}
            </p>
            <Button onClick={() => navigate('/surgery-selection')} variant="primary">
              Create Recovery Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDayData = recoveryData.timeline.find(d => d.status === 'current');

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Recovery Journey
          </h1>
          <p className="text-muted-foreground">
            {recoveryData.title}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Recovery Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{Math.round(recoveryData.progress.overallProgress)}%</span>
                </div>
                <Progress 
                  value={recoveryData.progress.overallProgress} 
                  className="h-3"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">{recoveryData.progress.daysCompleted}</div>
                  <div className="text-sm text-muted-foreground">Days Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{recoveryData.progress.currentDay}</div>
                  <div className="text-sm text-muted-foreground">Current Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground mb-1">{recoveryData.progress.daysRemaining}</div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Timeline */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Recovery Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recoveryData.timeline.map((day, index) => (
                <div key={day.dayNumber} className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      day.status === 'completed' ? 'bg-success border-success' :
                      day.status === 'current' ? 'bg-primary border-primary pulse-alert' :
                      'bg-muted border-muted-foreground'
                    }`}>
                      {day.status === 'completed' && (
                        <CheckCircle className="w-3 h-3 text-white -m-0.5" />
                      )}
                    </div>
                    {index < recoveryData.timeline.length - 1 && (
                      <div className={`w-0.5 h-8 mt-2 ${
                        day.status === 'completed' ? 'bg-success' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                  
                  {/* Timeline content */}
                  <div className={`flex-1 pb-8 ${
                    day.status === 'current' ? 'bg-primary-soft rounded-lg p-4 -ml-2' : ''
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-foreground">
                        Day {day.dayNumber}: {day.title}
                      </span>
                      {day.status === 'current' && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-alert" />
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {day.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {day.activities.map((activity, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Actions */}
        {currentDayData && (
          <Card className="mb-8 shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Clock className="w-5 h-5 mr-2" />
                Today's Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete your daily check-in to track your recovery progress and ensure you're healing properly.
              </p>
              
              <div className="bg-alert-soft border border-alert/20 rounded-lg p-4 mb-4">
                <div className="flex items-center text-alert mb-2">
                  <Thermometer className="w-4 h-4 mr-2" />
                  <span className="font-medium">Important Reminder</span>
                </div>
                <p className="text-sm text-alert/80">
                  Please monitor for signs of infection: fever over 38°C, increased pain, redness, or unusual discharge.
                </p>
              </div>
              
              <Button 
                onClick={handleDailyCheckIn}
                variant="primary" 
                size="lg" 
                className="w-full"
                disabled={!canCheckIn}
              >
                {canCheckIn ? (
                  <>
                    Start Daily Check-in
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Daily Check-in Completed
                  </>
                )}
              </Button>
              
              {!canCheckIn && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Come back tomorrow for your next check-in
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecoveryPlan;