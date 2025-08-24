import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight, Bone, HeartPulse, Scissors, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const surgeryTypes = [
  {
    id: 'orthopedics',
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
    id: 'limb',
    name: 'Limb Surgery',
    description: 'Procedures related to the limbs',
    icon: Scissors,
    examples: ['Appendectomy', 'Gallbladder', 'Hernia Repair', 'Bowel Surgery','Hand Surgery'],
    duration: '2-6 weeks recovery',
    color: 'success'
  },
  {
    id: 'neurological',
    name: 'Neurological Surgery',
    description: 'Brain and spinal procedures',
    icon: HeartPulse,
    examples: ['Spinal Fusion', 'Brain Surgery', 'Disc Surgery', 'Nerve Repair'],
    duration: '8-16 weeks recovery',
    color: 'primary'
  },
  {
    id: 'plastic',
    name: 'Plastic Surgery',
    description: 'Reconstructive and cosmetic procedures',
    icon: Scissors,
    examples: ['Breast Surgery', 'Facial Surgery', 'Reconstruction', 'Liposuction'],
    duration: '2-8 weeks recovery',
    color: 'success'
  },
  {
    id: 'gynecological',
    name: 'Gynecological Surgery',
    description: 'Women\'s reproductive health procedures',
    icon: Heart,
    examples: ['Hysterectomy', 'Ovarian Surgery', 'C-Section', 'Laparoscopy'],
    duration: '4-8 weeks recovery',
    color: 'alert'
  },
  {
    id: 'urological',
    name: 'Urological Surgery',
    description: 'Kidney, bladder, and urinary procedures',
    icon: HeartPulse,
    examples: ['Kidney Surgery', 'Prostate Surgery', 'Bladder Surgery', 'Stone Removal'],
    duration: '2-6 weeks recovery',
    color: 'primary'
  }
];

const SurgerySelection = () => {
  const [selectedSurgery, setSelectedSurgery] = useState<string>('');
  const [selectedProcedure, setSelectedProcedure] = useState<string>('');
  const [surgeryDate, setSurgeryDate] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectedType = surgeryTypes.find(s => s.id === selectedSurgery);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleCreateRecoveryPlan = async () => {
    if (!selectedSurgery || !selectedProcedure || !surgeryDate) {
      toast({
        title: "Missing Information",
        description: "Please select surgery type, procedure, and surgery date.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get onboarding data from localStorage
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      // First create surgery onboarding
      const surgeryData = {
        preferredLanguage: onboardingData.preferredLanguage || 'english',
        privacyPermission: onboardingData.privacyPermission || true,
        surgery: {
          category: selectedSurgery,
          specificProcedure: selectedProcedure,
          surgeryDate: surgeryDate,
          additionalDetails: additionalDetails
        }
      };

      const surgeryResponse = await api.post('/surgery/onboarding', surgeryData);
      const surgeryId = surgeryResponse.data.data._id;

      // Then create recovery plan
      await api.post('/recovery/createplan', { surgeryId });

      // Store surgery ID for future reference
      localStorage.setItem('currentSurgeryId', surgeryId);

      toast({
        title: "Recovery Plan Created! 🎉",
        description: "Your personalized recovery plan has been generated.",
      });

      navigate('/recovery-plan');
    } catch (error: any) {
      console.error('Error creating recovery plan:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create recovery plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

        {/* Surgery Date Input */}
        {selectedProcedure && (
          <div className="mb-8 slide-in-up">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-semibold text-foreground text-center">
                When is your surgery scheduled?
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="surgeryDate">Surgery Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="surgeryDate"
                      type="date"
                      value={surgeryDate}
                      onChange={(e) => setSurgeryDate(e.target.value)}
                      min={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 30 days ago
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can select a past date if surgery already happened
                  </p>
                </div>

                <div>
                  <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
                  <Input
                    id="additionalDetails"
                    placeholder="Any specific details about your procedure..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo User Selection for Prototype */}
        {selectedProcedure && surgeryDate && (
          <div className="mb-8 slide-in-up">
            <div className="bg-primary-soft border border-primary/20 rounded-xl p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold text-primary mb-2">Ready to Create Your Plan</h3>
              <p className="text-sm text-primary/80 mb-2">
                We'll create a personalized recovery plan based on your {selectedProcedure} procedure.
              </p>
              <div className="text-xs text-primary/70">
                Surgery: {selectedProcedure} • Date: {new Date(surgeryDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleCreateRecoveryPlan}
            variant="primary" 
            size="lg" 
            className="w-full max-w-md"
            disabled={!selectedProcedure || !surgeryDate || loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating your plan...
              </div>
            ) : (
              <>
                Create my recovery plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurgerySelection;