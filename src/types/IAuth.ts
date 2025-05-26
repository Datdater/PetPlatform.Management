import { IUser } from "./IUser";

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  error: string | null; // Add an error field to track authentication-related errors
  setAuth: (user: IUser | null, token: string | null) => void; 
  register: (
    email: string, 
    password: string, 
    name: string, 
    phone: string
  ) => Promise<{
    success: boolean;
    error?: string; // Optional error message
  }>;
  login: (
    email: string, 
    password: string
  ) => Promise<{
    success: boolean;
    error?: string; // Optional error message
  }>;
  logout: () => void;
  clearError: () => void; // Method to clear any stored errors
  updateProfile: (
    id: number,
    email: string, 
    name: string, 
    phoneNumber: string
  ) => Promise<{
    success: boolean;
    error?: string; // Optional error message
  }>;
  changePassword: (
    oldPassword: string, 
    newPassword: string
  ) => Promise<{
    success: boolean;
    error?: string; // Optional error message
  }>;
}