import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, ArrowRight, AlertTriangle, Thermometer } from "lucide-react";
import { Link } from "react-router-dom";

const timelineData = [
  {
    day: 1,
    title: "Surgery Day",
    status: "completed",
    description: "Rest and initial recovery",
    activities: ["Pain management", "Basic mobility", "Initial assessment"]
  },
  {
    day: 2,
    title: "Early Recovery",
    status: "completed", 
    description: "Gentle movement begins",
    activities: ["Physical therapy assessment", "Walking with assistance", "Wound care"]
  },
  {
    day: 3,
    title: "Mobility Building",
    status: "completed",
    description: "Increased movement and strength",
    activities: ["Short walks", "Range of motion exercises", "Pain tracking"]
  },
  {
    day: 4,
    title: "Independence",
    status: "completed",
    description: "Building self-sufficiency",
    activities: ["Longer walks", "Stair climbing practice", "Home exercises"]
  },
  {
    day: 5,
    title: "Current Progress",
    status: "current",
    description: "Monitoring and assessment",
    activities: ["Daily check-in due", "Photo documentation", "Symptom tracking"],
    alert: true
  },
  {
    day: 6,
    title: "Continued Recovery",
    status: "upcoming",
    description: "Building endurance",
    activities: ["Extended exercises", "Strength building", "Flexibility work"]
  },
  {
    day: 7,
    title: "Week 1 Complete",
    status: "upcoming",
    description: "First milestone reached",
    activities: ["Progress assessment", "Exercise plan update", "Goal setting"]
  }
];

const RecoveryPlan = () => {
  const currentDay = 5;
  const totalDays = 42; // 6 weeks
  const progressPercentage = (currentDay / totalDays) * 100;
  
  const currentDayData = timelineData.find(d => d.day === currentDay);

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Recovery Journey
          </h1>
          <p className="text-muted-foreground">
            Knee Replacement Recovery • Day {currentDay} of {totalDays}
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
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-3"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">{currentDay - 1}</div>
                  <div className="text-sm text-muted-foreground">Days Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">1</div>
                  <div className="text-sm text-muted-foreground">Current Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground mb-1">{totalDays - currentDay}</div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Twin Visualization */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Recovery Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineData.map((day, index) => (
                <div key={day.day} className="flex items-start space-x-4">
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
                    {index < timelineData.length - 1 && (
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
                        Day {day.day}: {day.title}
                      </span>
                      {day.alert && (
                        <AlertTriangle className="w-4 h-4 text-alert" />
                      )}
                      {day.status === 'current' && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          Current
                        </span>
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
              
              <Link to="/daily-checkin">
                <Button variant="primary" size="lg" className="w-full">
                  Start Daily Check-in
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecoveryPlan;