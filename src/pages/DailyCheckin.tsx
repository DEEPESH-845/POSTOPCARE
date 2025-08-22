import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Thermometer, Camera, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  type: 'scale' | 'temperature' | 'text' | 'boolean';
  question: string;
  followUp?: string;
  triggerValue?: any;
  options?: string[];
}

const baseQuestions: Question[] = [
  {
    id: 'pain',
    type: 'scale',
    question: "How would you rate your pain level today?",
    followUp: "Tell us more about your pain",
    triggerValue: 7
  },
  {
    id: 'temperature',
    type: 'temperature',
    question: "What is your current temperature?",
    followUp: "When did you first notice the fever?",
    triggerValue: 38.0
  },
  {
    id: 'mobility',
    type: 'scale',
    question: "How is your mobility today compared to yesterday?"
  },
  {
    id: 'appetite',
    type: 'scale',
    question: "How is your appetite today?"
  }
];

const DailyCheckin = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [additionalQuestions, setAdditionalQuestions] = useState<Question[]>([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const allQuestions = [...baseQuestions, ...additionalQuestions];
  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Check if this answer triggers a follow-up question
    if (currentQuestion.triggerValue !== undefined && 
        value >= currentQuestion.triggerValue && 
        currentQuestion.followUp &&
        !additionalQuestions.find(q => q.id === `${currentQuestion.id}_followup`)) {
      
      const followUpQuestion: Question = {
        id: `${currentQuestion.id}_followup`,
        type: 'text',
        question: currentQuestion.followUp!
      };
      
      setAdditionalQuestions([...additionalQuestions, followUpQuestion]);
      setShowFollowUp(true);
    }

    // Auto-advance for scale and boolean questions
    if (currentQuestion.type === 'scale' || currentQuestion.type === 'boolean') {
      setTimeout(() => {
        if (isLastQuestion && !showFollowUp) {
          setIsComplete(true);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 1000);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    answers[currentQuestion.id] === value
                      ? 'border-primary bg-primary text-white'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-lg font-semibold">{value}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>No pain</span>
              <span>Severe pain</span>
            </div>
          </div>
        );

      case 'temperature':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-primary" />
              <Input
                type="number"
                step="0.1"
                placeholder="36.5"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: parseFloat(e.target.value) || '' })}
                className="text-lg"
              />
              <span className="text-muted-foreground">°C</span>
            </div>
            {answers[currentQuestion.id] >= 38.0 && (
              <div className="bg-alert-soft border border-alert/20 rounded-lg p-3">
                <div className="flex items-center text-alert text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Elevated temperature detected
                </div>
              </div>
            )}
            <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
              Continue
            </Button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Please describe in detail..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              className="min-h-24"
            />
            <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
              Continue
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    const hasAlerts = answers.temperature >= 38.0 || answers.pain >= 7;
    
    return (
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`w-16 h-16 ${hasAlerts ? 'bg-alert' : 'bg-success'} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            {hasAlerts ? (
              <AlertTriangle className="w-8 h-8 text-white" />
            ) : (
              <MessageCircle className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {hasAlerts ? "We're Concerned About Your Recovery" : "Check-in Complete!"}
          </h1>
          
          {hasAlerts ? (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Based on your responses, we recommend immediate attention from your care team.
              </p>
              
              <div className="bg-alert-soft border border-alert/20 rounded-xl p-6">
                <h3 className="font-semibold text-alert mb-2">⚠ Possible infection detected</h3>
                <p className="text-alert/80 mb-4">Contact your care team now.</p>
                
                <div className="grid gap-3">
                  <Link to="/photo-capture">
                    <Button variant="primary" size="lg" className="w-full">
                      <Camera className="mr-2 h-5 w-5" />
                      Take wound photos first
                    </Button>
                  </Link>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <Button variant="outline" size="lg">
                      Call clinician
                    </Button>
                    <Button variant="secondary" size="lg">
                      Send message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Great progress! Your recovery is on track. Keep up the good work.
              </p>
              
              <Link to="/recovery-plan">
                <Button variant="primary" size="lg">
                  View Recovery Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all timeline-progress"
              style={{ '--progress-width': `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` } as any}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-card slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-primary" />
              Daily Check-in • Day 5
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2 className="text-xl text-foreground mb-4">
              {currentQuestion.question}
            </h2>
            
            {renderQuestionInput()}
          </CardContent>
        </Card>

        {/* Demo Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Demo: Answer with fever (38.2°C) or high pain (8/10) to trigger alerts
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckin;