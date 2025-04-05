import { axiosInstance } from "../axios";
import Cookies from "js-cookie";

const isClient = typeof window !== "undefined";

interface RegisterData {
  email: string;
  password: string;
}

interface VerifyData {
  email: string;
  otp: string;
}

interface LoginData {
  email: string;
  password: string;
  type: "email" | "google";
  code?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  cashbackBalance: number;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
  status: number;
}

const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  GET_USER: "/auth/user",
  REFRESH: "/auth/refresh",
} as const;

const TOKEN_EXPIRY = 7;

export async function register(data: RegisterData): Promise<AuthResponse> {
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.REGISTER,
    data
  );
  if (isClient) {
    Cookies.set("accessToken", response.accessToken, { expires: TOKEN_EXPIRY });
    Cookies.set("refreshToken", response.refreshToken, {
      expires: TOKEN_EXPIRY,
    });
  }
  return response;
}

export async function verify(data: VerifyData): Promise<AuthResponse> {
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.VERIFY,
    data
  );
  if (isClient) {
    Cookies.set("accessToken", response.accessToken, { expires: TOKEN_EXPIRY });
    Cookies.set("refreshToken", response.refreshToken, {
      expires: TOKEN_EXPIRY,
    });
  }
  return response;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    console.log("Attempting login with data:", {
      ...data,
      password: "[REDACTED]",
    });
    const { data: response } = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      data
    );
    console.log("Login successful:", {
      user: response.user,
      hasToken: !!response.accessToken,
    });
    if (isClient) {
      Cookies.set("accessToken", response.accessToken, {
        expires: TOKEN_EXPIRY,
      });
      Cookies.set("refreshToken", response.refreshToken, {
        expires: TOKEN_EXPIRY,
      });
    }
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data: user } = await axiosInstance.get<User>(API_ENDPOINTS.GET_USER);
  return user;
}

export async function logout(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  if (isClient) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = Cookies.get("refreshToken");
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.REFRESH,
    { refreshToken }
  );
  if (isClient && response.accessToken) {
    Cookies.set("accessToken", response.accessToken, { expires: TOKEN_EXPIRY });
    Cookies.set("refreshToken", response.refreshToken, {
      expires: TOKEN_EXPIRY,
    });
  }
  return response;
}

export function isAuthenticated(): boolean {
  return isClient ? !!Cookies.get("accessToken") : false;
}
