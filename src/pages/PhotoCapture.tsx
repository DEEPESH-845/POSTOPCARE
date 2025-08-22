import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, CheckCircle, ArrowRight, Lightbulb, Eye, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const PhotoCapture = () => {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePhotoCapture = () => {
    // Simulate photo capture
    setIsUploading(true);
    setTimeout(() => {
      const mockPhotoUrls = [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop"
      ];
      setCapturedPhotos(mockPhotoUrls);
      setIsUploading(false);
      setShowPreview(true);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsUploading(true);
      setTimeout(() => {
        const urls = Array.from(files).map(file => URL.createObjectURL(file));
        setCapturedPhotos([...capturedPhotos, ...urls]);
        setIsUploading(false);
        setShowPreview(true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Document Your Wound
          </h1>
          <p className="text-muted-foreground">
            Take clear photos to help your care team monitor healing
          </p>
        </div>

        {/* Photography Guidelines */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-success">
              <Lightbulb className="w-5 h-5 mr-2" />
              Photo Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-success-soft border border-success/20 rounded-lg p-4">
              <p className="text-success font-medium mb-3">
                Hold steady, show the wound clearly; avoid flash glare.
              </p>
              
              <div className="space-y-2 text-sm text-success/80">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Use natural lighting when possible</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Take 2-3 photos from different angles</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Include a ruler or coin for scale if available</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Remove any dressing before photographing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Interface */}
        {!showPreview && (
          <Card className="mb-6 shadow-card">
            <CardContent className="p-8 text-center">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-muted-foreground">Processing photos...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Camera viewfinder simulation */}
                  <div className="relative mx-auto w-64 h-48 bg-muted rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Position wound in center</p>
                    </div>
                    
                    {/* Viewfinder overlay */}
                    <div className="absolute inset-4 border-2 border-primary/50 rounded"></div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handlePhotoCapture}
                      className="w-full"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Take Photo
                    </Button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" size="lg" className="w-full">
                        <Upload className="mr-2 h-5 w-5" />
                        Upload from Gallery
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photo Preview */}
        {showPreview && (
          <Card className="mb-6 shadow-card slide-in-up">
            <CardHeader>
              <CardTitle className="flex items-center text-success">
                <CheckCircle className="w-5 h-5 mr-2" />
                Photos Captured
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {capturedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Wound photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-success/20"
                    />
                    <div className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-primary-soft border border-primary/20 rounded-lg p-4">
                <div className="flex items-center text-primary mb-2">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="font-medium">AI Analysis</span>
                </div>
                <p className="text-sm text-primary/80 mb-2">
                  Photos uploaded successfully. AI analysis detecting:
                </p>
                <div className="space-y-1 text-xs text-primary/70">
                  <div>• Redness: Moderate level detected</div>
                  <div>• Swelling: Minimal</div>
                  <div>• Drainage: None visible</div>
                </div>
              </div>
              
              <div className="bg-alert-soft border border-alert/20 rounded-lg p-4">
                <div className="flex items-center text-alert mb-2">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Attention Required</span>
                </div>
                <p className="text-sm text-alert/80">
                  Based on the photos and your check-in responses, we recommend contacting your care team.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Retake Photos
                </Button>
                <Link to="/alert-modal" className="flex-1">
                  <Button variant="primary" className="w-full">
                    Send to Care Team
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Information */}
        <div className="text-center">
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Mode:</strong> Photos are simulated. In the real app, actual camera access would be requested.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCapture;