import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Update with your backend URL

// Create axios instance
const authApi = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface OTPResponse {
    success: boolean;
    message: string;
    expiresIn?: number;
}

export interface VerifyOTPResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        verified: boolean;
    };
}

export const authApiService = {
    sendOTP: async (email: string): Promise<OTPResponse> => {
        const response = await authApi.post("/send-otp", { email });
        return response.data;
    },

    verifyOTP: async (email: string, otp: string): Promise<VerifyOTPResponse> => {
        const response = await authApi.post("/verify-otp", { email, otp });
        return response.data;
    },

    resendOTP: async (email: string): Promise<OTPResponse> => {
        const response = await authApi.post("/resend-otp", { email });
        return response.data;
    },
};