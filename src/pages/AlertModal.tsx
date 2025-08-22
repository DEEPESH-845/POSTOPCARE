import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, MessageCircle, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AlertModal = () => {
  const [alertSent, setAlertSent] = useState(false);

  const handleSendAlert = () => {
    setAlertSent(true);
  };

  if (alertSent) {
    return (
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Alert Sent Successfully
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Your care team has been notified and will respond soon. A clinician will review your case within 30 minutes.
          </p>

          <Card className="shadow-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground mb-1">
                    What happens next?
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• Your photos and check-in data have been sent to the triage nurse</div>
                    <div>• A clinician will review your case within 30 minutes</div>
                    <div>• You'll receive a message or call with next steps</div>
                    <div>• Continue monitoring your symptoms</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Link to="/clinician-dashboard">
              <Button variant="primary" size="lg" className="w-full">
                View Clinician Dashboard (Demo)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/recovery-plan">
              <Button variant="outline" size="lg" className="w-full">
                Return to Recovery Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        {/* Alert Card */}
        <Card className="shadow-alert border-alert/20 pulse-alert">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-alert rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-alert">
              Urgent: Medical Attention Needed
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-alert-soft border border-alert/20 rounded-lg p-4">
              <h3 className="font-semibold text-alert mb-2">
                ⚠ Possible infection detected
              </h3>
              <p className="text-sm text-alert/80 mb-3">
                Contact your care team now.
              </p>
              
              <div className="space-y-2 text-xs text-alert/70">
                <div>• Temperature: 38.2°C (elevated)</div>
                <div>• Pain level: 8/10 (high)</div>
                <div>• Wound appearance: Redness detected</div>
                <div>• Risk level: High</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Choose your next action:</h4>
              
              <div className="grid gap-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full justify-start"
                  onClick={handleSendAlert}
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Send urgent alert to care team
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full justify-start border-alert text-alert hover:bg-alert/10"
                >
                  <Phone className="mr-3 h-5 w-5" />
                  Call emergency line: 1-800-POST-OP
                </Button>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Emergency:</strong> If you experience severe symptoms like difficulty breathing, 
                chest pain, or severe bleeding, call emergency services (911) immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Demo: Click "Send urgent alert" to see the clinician dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;