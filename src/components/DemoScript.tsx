import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, User, AlertTriangle, MessageCircle } from "lucide-react";

const DemoScript = () => {
  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-primary/20 bg-primary-soft/50 backdrop-blur-sm z-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-primary text-sm">
          <Play className="w-4 h-4 mr-2" />
          Investor Demo Script
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-start space-x-2">
          <Badge variant="outline" className="text-xs">1</Badge>
          <div>
            <p className="font-medium">Show Onboarding</p>
            <p className="text-muted-foreground">Patient signup → language selection → surgery type</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Badge variant="outline" className="text-xs">2</Badge>
          <div>
            <p className="font-medium">Simulate Check-in</p>
            <p className="text-muted-foreground">Day 5 → fever 38.2°C → pain 8/10 → photo capture</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Badge variant="outline" className="text-xs">3</Badge>
          <div>
            <p className="font-medium">Clinician Alert</p>
            <p className="text-muted-foreground">Dashboard alert → review photos → send message</p>
          </div>
        </div>
        
        <div className="bg-white/80 rounded-lg p-2 border">
          <p className="font-medium text-primary text-xs">Demo Users:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>👩 Neha Patel • Knee replacement • Day 5</div>
            <div>👨 Rajesh Singh • Appendectomy • Day 2</div>
            <div>👨‍⚕️ Dr. Mehta • Triage nurse</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoScript;