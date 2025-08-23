import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowRight, Bone, HeartPulse, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

const surgeryTypes = [
  {
    id: 'orthopedic',
    name: 'Orthopedic Surgery',
    description: 'Knee, hip, shoulder, and joint procedures',
    icon: Bone,
    examples: ['Knee Replacement', 'Hip Replacement', 'ACL Repair', 'Shoulder Surgery'],
    duration: '6-12 weeks recovery',
    color: 'primary'
  },
  {
    id: 'cardiac',
    name: 'Cardiac Surgery',
    description: 'Heart and cardiovascular procedures',
    icon: HeartPulse,
    examples: ['Bypass Surgery', 'Valve Repair', 'Angioplasty', 'Pacemaker'],
    duration: '4-8 weeks recovery',
    color: 'alert'
  },
  {
    id: 'abdominal',
    name: 'Abdominal Surgery',
    description: 'Digestive and internal organ procedures',
    icon: Scissors,
    examples: ['Appendectomy', 'Gallbladder', 'Hernia Repair', 'Bowel Surgery'],
    duration: '2-6 weeks recovery',
    color: 'success'
  }
];

const SurgerySelection = () => {
  const [selectedSurgery, setSelectedSurgery] = useState<string>('');
  const [selectedProcedure, setSelectedProcedure] = useState<string>('');

  const selectedType = surgeryTypes.find(s => s.id === selectedSurgery);

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            What type of surgery did you have?
          </h1>
          <p className="text-muted-foreground">
            This helps us create your personalized recovery plan
          </p>
        </div>

        {/* Surgery Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {surgeryTypes.map((surgery) => {
            const IconComponent = surgery.icon;
            const isSelected = selectedSurgery === surgery.id;
            
            return (
              <Card 
                key={surgery.id}
                className={`cursor-pointer transition-all shadow-card hover:shadow-soft ${
                  isSelected ? 'ring-2 ring-primary bg-primary-soft' : ''
                }`}
                onClick={() => {
                  setSelectedSurgery(surgery.id);
                  setSelectedProcedure('');
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    surgery.color === 'primary' ? 'gradient-primary' :
                    surgery.color === 'alert' ? 'bg-alert' : 'bg-success'
                  }`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {surgery.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {surgery.description}
                  </p>
                  
                  <div className="text-xs text-primary font-medium">
                    {surgery.duration}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Specific Procedure Selection */}
        {selectedType && (
          <div className="mb-8 slide-in-up">
            <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
              Which specific procedure?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {selectedType.examples.map((procedure) => (
                <button
                  key={procedure}
                  onClick={() => setSelectedProcedure(procedure)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedProcedure === procedure
                      ? 'border-primary bg-primary-soft'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{procedure}</span>
                    {selectedProcedure === procedure && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Demo User Selection for Prototype */}
        {selectedProcedure && (
          <div className="mb-8 slide-in-up">
            <div className="bg-primary-soft border border-primary/20 rounded-xl p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold text-primary mb-2">Demo Mode</h3>
              <p className="text-sm text-primary/80 mb-4">
                For this prototype, you'll experience the app as Neha Patel recovering from knee replacement surgery.
              </p>
              <div className="text-xs text-primary/70">
                Surgery: {selectedProcedure} • Day 5 of recovery • Next check-in due
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <Link to="/recovery-plan">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full max-w-md"
              disabled={!selectedProcedure}
            >
              Create my recovery plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SurgerySelection;