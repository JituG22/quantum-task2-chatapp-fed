// apiService.ts
import axios from "axios";

// Define types for request and response
interface SignupRequest {
  email: string;
  password: string;
  // Add other fields as per your signupSchema
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  userId: string;
  userEmail: string;
  userName: string;
  token: string;
  userProfileImage: string;
}

const API_URL = "http://localhost:5000";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const signup = async (formData: FormData): Promise<any> => {
  const response = await axios.post(`${API_URL}/signup`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  return response.data;
};

interface ChatMessage {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  userProfileImage: string;
  timestamp: Date;
}

// Function to get chat messages
export const getMessages = async (): Promise<ChatMessage[]> => {
  const response = await axios.get(`${API_URL}/messages`);
  return response.data;
};
