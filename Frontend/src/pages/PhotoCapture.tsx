import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Camera,
	Upload,
	CheckCircle,
	ArrowRight,
	Lightbulb,
	Eye,
	AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface PredictionResult {
	prediction: string;
	confidence: number;
}

const PhotoCapture = () => {
	const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [predictionResult, setPredictionResult] =
		useState<PredictionResult | null>(null);
	const [analysisLoading, setAnalysisLoading] = useState(false);

	// Function to convert image URL to blob
	const urlToBlob = async (url: string): Promise<Blob> => {
		const response = await fetch(url);
		return await response.blob();
	};

	// Function to send image to AI endpoint
	const analyzeImage = async (imageBlob: Blob) => {
		setAnalysisLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", imageBlob, "arm_injured.jpg");

			const response = await fetch(
				"https://twl1bn9h-8081.inc1.devtunnels.ms/detect-arm-injury",
				{
					method: "POST",
					body: formData,
				},
			);

			if (response.ok) {
				const result: PredictionResult = await response.json();
				setPredictionResult(result);
			} else {
				console.error("Failed to analyze image:", response.statusText);
			}
		} catch (error) {
			console.error("Error analyzing image:", error);
		} finally {
			setAnalysisLoading(false);
		}
	};

	// Remove auto-loading functionality - user will select image manually

	const handlePhotoCapture = async () => {
		// Load the arm_injured.jpg image
		setIsUploading(true);
		try {
			const imageUrl = "/arm_injured.jpg";
			setCapturedPhotos([imageUrl]);
			setShowPreview(true);

			// Convert to blob and send to AI endpoint
			const imageBlob = await urlToBlob(imageUrl);
			await analyzeImage(imageBlob);
		} catch (error) {
			console.error("Error processing image:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			setIsUploading(true);
			setAnalysisLoading(true);
			try {
				const file = files[0];

				// Validate file size (10MB limit)
				if (file.size > 10 * 1024 * 1024) {
					alert("File size must be less than 10MB");
					return;
				}

				// Validate file type
				if (!file.type.startsWith("image/")) {
					alert("Please select a valid image file");
					return;
				}

				const url = URL.createObjectURL(file);
				setCapturedPhotos([url]);
				setShowPreview(true);

				// Send the selected file to AI endpoint
				await analyzeImage(file);
			} catch (error) {
				console.error("Error processing uploaded file:", error);
				alert("Error processing the image. Please try again.");
			} finally {
				setIsUploading(false);
			}
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
									<span>
										Include a ruler or coin for scale if available
									</span>
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
									<p className="text-muted-foreground">
										Processing photos...
									</p>
								</div>
							) : (
								<div className="space-y-6">
									{/* Image Upload Area */}
									<div className="relative mx-auto w-full max-w-md">
										<div className="relative border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
											<input
												type="file"
												accept="image/*"
												onChange={handleFileUpload}
												className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
												id="image-upload"
											/>
											<div className="space-y-4">
												<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
													<Upload className="w-8 h-8 text-primary" />
												</div>
												<div>
													<h3 className="text-lg font-medium text-foreground mb-2">
														Upload Wound Image
													</h3>
													<p className="text-sm text-muted-foreground mb-4">
														Click here or drag and drop your image
														file
													</p>
													<p className="text-xs text-muted-foreground">
														Supports: JPG, PNG, GIF (Max 10MB)
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className="text-center">
										<p className="text-sm text-muted-foreground mb-4">
											Or
										</p>
										<label
											htmlFor="image-upload"
											className="cursor-pointer"
										>
											<Button
												variant="primary"
												size="lg"
												className="w-full max-w-md"
												type="button"
												onClick={() =>
													document
														.getElementById("image-upload")
														?.click()
												}
											>
												<Camera className="mr-2 h-5 w-5" />
												Choose Image File
											</Button>
										</label>
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
							<div className="grid grid-cols-1 gap-4">
								{capturedPhotos.map((photo, index) => (
									<div
										key={index}
										className="relative"
									>
										<img
											src={photo}
											alt={`Wound photo ${index + 1}`}
											className="w-full h-64 object-cover rounded-lg border-2 border-success/20"
										/>
										<div className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
											{index + 1}
										</div>
									</div>
								))}
							</div>

							{/* AI Analysis Results */}
							{analysisLoading ? (
								<div className="bg-primary-soft border border-primary/20 rounded-lg p-4">
									<div className="flex items-center text-primary mb-2">
										<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
										<span className="font-medium">
											AI Analysis in Progress...
										</span>
									</div>
									<p className="text-sm text-primary/80">
										Analyzing wound condition, please wait...
									</p>
								</div>
							) : predictionResult ? (
								<div
									className={`border rounded-lg p-4 ${
										predictionResult.prediction === "injured"
											? "bg-alert-soft border-alert/20"
											: "bg-success-soft border-success/20"
									}`}
								>
									<div
										className={`flex items-center mb-2 ${
											predictionResult.prediction === "injured"
												? "text-alert"
												: "text-success"
										}`}
									>
										{predictionResult.prediction === "injured" ? (
											<AlertTriangle className="w-4 h-4 mr-2" />
										) : (
											<CheckCircle className="w-4 h-4 mr-2" />
										)}
										<span className="font-medium">
											AI Analysis Complete
										</span>
									</div>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Prediction:
											</span>
											<span
												className={`text-sm font-bold capitalize ${
													predictionResult.prediction === "injured"
														? "text-alert"
														: "text-success"
												}`}
											>
												{predictionResult.prediction}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Confidence:
											</span>
											<span className="text-sm font-bold">
												{(
													predictionResult.confidence * 100
												).toFixed(1)}
												%
											</span>
										</div>
									</div>
								</div>
							) : (
								<div className="bg-muted border border-muted rounded-lg p-4">
									<div className="flex items-center text-muted-foreground mb-2">
										<Eye className="w-4 h-4 mr-2" />
										<span className="font-medium">
											No Analysis Available
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Unable to analyze the image. Please try again.
									</p>
								</div>
							)}

							{/* Recommendation based on prediction */}
							{predictionResult &&
								predictionResult.prediction === "injured" && (
									<div className="bg-alert-soft border border-alert/20 rounded-lg p-4">
										<div className="flex items-center text-alert mb-2">
											<AlertTriangle className="w-4 h-4 mr-2" />
											<span className="font-medium">
												Attention Required
											</span>
										</div>
										<p className="text-sm text-alert/80">
											The AI analysis indicates potential injury
											concerns. We recommend contacting your care
											team for further evaluation.
										</p>
									</div>
								)}

							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => {
										setShowPreview(false);
										setPredictionResult(null);
										setCapturedPhotos([]);
										// Reset the file input
										const fileInput = document.getElementById(
											"image-upload",
										) as HTMLInputElement;
										if (fileInput) fileInput.value = "";
									}}
								>
									Upload Different Image
								</Button>
								<Link
									to="/alert-modal"
									className="flex-1"
								>
									<Button
										variant="primary"
										className="w-full"
									>
										Send to Care Team
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default PhotoCapture;