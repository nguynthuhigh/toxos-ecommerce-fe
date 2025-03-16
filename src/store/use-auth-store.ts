import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as auth from "@/lib/services/auth";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verify: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user && user.id),
          token: user ? get().token : null,
        }),

      setToken: (token) =>
        set({
          token,
          isAuthenticated: Boolean(token),
          user: token ? get().user : null,
        }),

      login: async (email, password) => {
        const response = await auth.login({ email, password, type: "email" });
        set({
          user: response.user,
          token: response.accessToken || null,
          isAuthenticated: Boolean(response.accessToken),
        });
      },

      register: async (email, password) => {
        const response = await auth.register({ email, password });
        set({ user: response.user, isAuthenticated: Boolean(response.user) });
      },

      verify: async (email, otp) => {
        const response = await auth.verify({ email, otp });
        set({ user: response.user, isAuthenticated: Boolean(response.user) });
      },

      logout: async () => {
        await auth.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
