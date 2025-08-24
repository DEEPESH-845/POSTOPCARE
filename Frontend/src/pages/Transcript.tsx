import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LanguageToggle from "@/components/LanguageToggle";
import { uploadService } from "../services/upload.service";
import {
	Upload,
	FileText,
	Image,
	X,
	CheckCircle,
	AlertCircle,
	Download,
	Eye,
	Calendar,
	User,
	Hospital,
	ArrowLeft,
	ArrowRight,
} from "lucide-react";

interface UploadedFile {
	id: string;
	file: File;
	type: "medical-report" | "surgery-transcript" | "lab-result" | "imaging";
	uploadProgress: number;
	status: "uploading" | "completed" | "error";
	preview?: string;
}

const Transcript: React.FC = () => {
	const { t } = useLanguage();

	const navigate = useNavigate();
	const { toast } = useToast();

	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [isDragActive, setIsDragActive] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [notes, setNotes] = useState("");
	const [selectedFileType, setSelectedFileType] =
		useState<UploadedFile["type"]>("medical-report");
	const [error, setError] = useState<string | null>(null);

	// File type configurations
	const fileTypeConfig = {
		"medical-report": {
			label: "Medical Reports",
			description: "Pre-surgery medical reports, doctor's notes",
			icon: FileText,
			color: "bg-blue-100 text-blue-800",
			acceptedTypes: ".pdf,.doc,.docx,.txt",
		},
		"surgery-transcript": {
			label: "Surgery Transcripts",
			description: "Operative reports, surgery notes",
			icon: FileText,
			color: "bg-green-100 text-green-800",
			acceptedTypes: ".pdf,.doc,.docx,.txt",
		},
		"lab-result": {
			label: "Lab Results",
			description: "Blood tests, pathology reports",
			icon: FileText,
			color: "bg-purple-100 text-purple-800",
			acceptedTypes: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
		},
		imaging: {
			label: "Medical Imaging",
			description: "X-rays, MRI, CT scans",
			icon: Image,
			color: "bg-orange-100 text-orange-800",
			acceptedTypes: ".jpg,.jpeg,.png,.pdf,.dcm",
		},
	};

	// Handle file upload
	const handleFileUpload = async (files: File[]) => {
		setError(null);

		for (const file of files) {
			const validationError = validateFile(file);
			if (validationError) {
				setError(validationError);
				continue;
			}

			const fileId =
				Date.now().toString() + Math.random().toString(36).substr(2, 9);
			const newFile: UploadedFile = {
				id: fileId,
				file,
				type: selectedFileType,
				uploadProgress: 0,
				status: "uploading",
			};

			// Generate preview for images
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e) => {
					setUploadedFiles((prev) =>
						prev.map((f) =>
							f.id === fileId
								? { ...f, preview: e.target?.result as string }
								: f
						)
					);
				};
				reader.readAsDataURL(file);
			}

			setUploadedFiles((prev) => [...prev, newFile]);

			// Simulate upload progress
			await simulateUpload(fileId);
		}
	};

	// Handle file drag and drop
	const onDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);
	}, []);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragActive(false);

			const files = Array.from(e.dataTransfer.files);
			handleFileUpload(files);
		},
		[selectedFileType, handleFileUpload]
	);

	// Handle file selection
	const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		handleFileUpload(files);
	};

	// Validate file
	const validateFile = (file: File): string | null => {
		const maxSize = 10 * 1024 * 1024; // 10MB
		const config = fileTypeConfig[selectedFileType];
		const allowedTypes = config.acceptedTypes
			.split(",")
			.map((type) => type.trim());

		if (file.size > maxSize) {
			return "File size must be less than 10MB";
		}

		const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
		if (!allowedTypes.includes(fileExtension)) {
			return `Invalid file type. Allowed types: ${config.acceptedTypes}`;
		}

		return null;
	};

	// Simulate file upload progress
	const simulateUpload = async (fileId: string) => {
		return new Promise<void>((resolve) => {
			let progress = 0;
			const interval = setInterval(() => {
				progress += Math.random() * 30;
				if (progress >= 100) {
					progress = 100;
					clearInterval(interval);
					setUploadedFiles((prev) =>
						prev.map((f) =>
							f.id === fileId
								? { ...f, uploadProgress: 100, status: "completed" }
								: f
						)
					);
					resolve();
				} else {
					setUploadedFiles((prev) =>
						prev.map((f) =>
							f.id === fileId ? { ...f, uploadProgress: progress } : f
						)
					);
				}
			}, 200);
		});
	};

	// Remove file
	const removeFile = (fileId: string) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
	};

	// Format file size
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	// Handle form submission
	const handleSubmit = async () => {
		try {
			if (uploadedFiles.length === 0) {
				setError("Please upload at least one medical document");
				return;
			}

			setIsUploading(true);
			// Show loading toast
			toast({
				title: "Uploading documents...",
				description: "Please wait while we process your files.",
			});

			// Simulate or perform actual upload
			const uploadResults = await Promise.all(
				uploadedFiles.map(
					(uploadedFile) =>
						// Replace with your actual upload logic
						new Promise((resolve) => {
							setTimeout(() => {
								resolve({
									url: `https://storage.com/${uploadedFile.file.name}`,
									id: uploadedFile.id,
									filename: uploadedFile.file.name,
								});
							}, 1000);
						})
				)
			);

			// Process files for storage
			const processedFiles = uploadedFiles.map((f) => ({
				name: f.file.name,
				type: f.type,
				size: f.file.size,
				id: f.id,
				uploadedAt: new Date().toISOString(),
			}));

			// Store in localStorage for later retrieval during registration
			localStorage.setItem("medicalDocuments", JSON.stringify(processedFiles));
			localStorage.setItem("additionalNotes", notes);
			setIsUploading(false);
			// Show success toast
			toast({
				title: "Documents uploaded successfully! ✅",
				description: `${uploadedFiles.length} document(s) have been uploaded and saved.`,
				variant: "default",
			});

			// Small delay for better UX (optional)
			setTimeout(() => {
				navigate("/recovery-plan");
			}, 1000);
		} catch (error) {
			console.error("Upload failed:", error);
			toast({
				title: "Upload failed",
				description: "Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleBack = () => {
		navigate("/surgery-selection");
	};

	// ...existing code...

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
						Upload Medical Documents
					</h1>
					<p className="text-muted-foreground">
						Upload your medical reports, surgery transcripts, and related
						documents
					</p>
				</div>

				{/* Error Alert */}
				{error && (
					<Alert className="mb-6 border-destructive/50 bg-destructive/5">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="text-destructive">
							{error}
						</AlertDescription>
					</Alert>
				)}

				{/* File Type Selection */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Document Type
						</CardTitle>
						<CardDescription>
							Select the type of medical document you want to upload
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{Object.entries(fileTypeConfig).map(([type, config]) => {
								const IconComponent = config.icon;
								return (
									<button
										key={type}
										onClick={() =>
											setSelectedFileType(type as UploadedFile["type"])
										}
										className={`p-4 rounded-lg border-2 transition-all ${
											selectedFileType === type
												? "border-primary bg-primary/5"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<IconComponent className="h-6 w-6 mx-auto mb-2 text-primary" />
										<div className="text-sm font-medium">{config.label}</div>
										<div className="text-xs text-muted-foreground mt-1">
											{config.description}
										</div>
									</button>
								);
							})}
						</div>
					</CardContent>
				</Card>

				{/* Upload Area */}
				<Card className="mb-6">
					<CardContent className="p-0">
						<div
							className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
								isDragActive
									? "border-primary bg-primary/5"
									: "border-gray-300 hover:border-gray-400"
							}`}
							onDragEnter={onDragEnter}
							onDragLeave={onDragLeave}
							onDragOver={onDragOver}
							onDrop={onDrop}
						>
							<Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
							<h3 className="text-lg font-semibold mb-2">
								Drop your {fileTypeConfig[selectedFileType].label.toLowerCase()}{" "}
								here
							</h3>
							<p className="text-muted-foreground mb-4">
								or click to browse files
							</p>
							<input
								type="file"
								multiple
								accept={fileTypeConfig[selectedFileType].acceptedTypes}
								onChange={handleFileSelection}
								className="hidden"
								id="file-upload"
							/>
							<Button asChild>
								<label htmlFor="file-upload" className="cursor-pointer">
									<Upload className="h-4 w-4 mr-2" />
									Browse Files
								</label>
							</Button>
							<p className="text-xs text-muted-foreground mt-2">
								Accepted formats:{" "}
								{fileTypeConfig[selectedFileType].acceptedTypes} (Max 10MB)
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Uploaded Files */}
				{uploadedFiles.length > 0 && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Uploaded Documents ({uploadedFiles.length})</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{uploadedFiles.map((file) => {
									const config = fileTypeConfig[file.type];
									const IconComponent = config.icon;

									return (
										<div
											key={file.id}
											className="flex items-center gap-4 p-4 border rounded-lg"
										>
											{/* File Icon/Preview */}
											<div className="flex-shrink-0">
												{file.preview ? (
													<img
														src={file.preview}
														alt={file.file.name}
														className="w-12 h-12 object-cover rounded"
													/>
												) : (
													<div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
														<IconComponent className="h-6 w-6 text-gray-500" />
													</div>
												)}
											</div>

											{/* File Info */}
											<div className="flex-grow">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-medium truncate">
														{file.file.name}
													</span>
													<Badge className={config.color}>{config.label}</Badge>
												</div>
												<div className="text-sm text-muted-foreground">
													{formatFileSize(file.file.size)}
												</div>

												{/* Progress Bar */}
												{file.status === "uploading" && (
													<Progress
														value={file.uploadProgress}
														className="mt-2"
													/>
												)}
											</div>

											{/* Status & Actions */}
											<div className="flex items-center gap-2">
												{file.status === "completed" && (
													<CheckCircle className="h-5 w-5 text-green-500" />
												)}
												{file.status === "error" && (
													<AlertCircle className="h-5 w-5 text-red-500" />
												)}
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeFile(file.id)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Additional Notes */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Additional Notes (Optional)</CardTitle>
						<CardDescription>
							Add any additional context or notes about your medical documents
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Textarea
							placeholder="e.g., Specific concerns, questions for your recovery team, important dates..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={4}
						/>
					</CardContent>
				</Card>

				{/* Navigation */}
				<div className="flex justify-between items-center">
					<Button variant="outline" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>

					<Button
						onClick={handleSubmit}
						disabled={uploadedFiles.length === 0 || isUploading}
						className="min-w-[120px]"
					>
						{isUploading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Uploading...
							</>
						) : (
							<>
								Continue
								<ArrowRight className="h-4 w-4 ml-2" />
							</>
						)}
					</Button>
				</div>

				{/* Language Toggle */}
				<div className="mt-8 flex justify-center">
					<LanguageToggle />
				</div>
			</div>
		</div>
	);
};

export default Transcript;
