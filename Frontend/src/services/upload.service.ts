export interface UploadResult {
	url: string;
	id: string;
	filename: string;
}

export const uploadService = {
	uploadFile: async (file: File): Promise<UploadResult> => {
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			return await response.json();
		} catch (error) {
			console.error("Upload error:", error);
			throw error;
		}
	},
};
