import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as auth from "@/lib/services/auth";
import { setAuthTokens, clearAuthTokens } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  cashbackBalance?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    type?: "email" | "google",
    code?: string
  ) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verify: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      initialize: async () => {
        try {
          if (auth.isAuthenticated()) {
            const user = await auth.getCurrentUser();
            set({
              user,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error("Failed to initialize auth state:", error);
          clearAuthTokens();
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user && user.id),
        }),

      login: async (email, password, type = "email", code) => {
        try {
          const response = await auth.login({
            email,
            password,
            type,
            code,
          });
          setAuthTokens(response.accessToken, response.refreshToken);
          set({
            user: response.user,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      register: async (email, password) => {
        const response = await auth.register({ email, password });
        setAuthTokens(response.accessToken, response.refreshToken);
        set({
          user: response.user,
          isAuthenticated: Boolean(response.user),
        });
      },

      verify: async (email, otp) => {
        const response = await auth.verify({ email, otp });
        setAuthTokens(response.accessToken, response.refreshToken);
        set({
          user: response.user,
          isAuthenticated: Boolean(response.user),
        });
      },

      logout: async () => {
        await auth.logout();
        clearAuthTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
