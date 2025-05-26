import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAuthState } from "../types/IAuth";

const authAPI = import.meta.env.VITE_BACKEND_URL;

// Define the store type separately
type AuthStore = IAuthState & {
  getToken: () => string | null;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      error: null,

      // Add a method to safely get the token
      getToken: () => get().token,

      setAuth: (user, token) => set({ user, token, error: null }),

      register: async (email, password, name, phone) => {
        try {
          const response = await fetch(`${authAPI}/Auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, phone }),
          });

          const data = await response.json();

          if (!response.ok) {
            const errorMessage =
              data.errors && data.errors.length > 0
                ? data.errors[0]
                : "Registration failed";

            set({ error: errorMessage });

            return {
              success: false,
              error: errorMessage,
            };
          }

          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          set({ error: errorMessage });

          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      login: async (emailOrPhone, password) => {
        try {
          const response = await fetch(`${authAPI}/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrPhone, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            const errorMessage =
              data.errors && data.errors.length > 0
                ? data.errors[0]
                : "Login failed";

            set({ error: errorMessage });

            return {
              success: false,
              error: errorMessage,
            };
          }

          set({
            token: data.accessToken,
            user: data.user,
            error: null,
          });

          localStorage.setItem(
            "auth-storage",
            JSON.stringify({
              state: {
                user: data.user,
                token: data.accessToken,
              },
            })
          );

          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          set({ error: errorMessage });

          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
        });
        localStorage.removeItem("auth-storage");
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: async (id, email, name, phoneNumber) => {
        try {
          const token = get().token;
          const user = get().user; // Ensure user object is retrieved

          if (!user?.id) {
            throw new Error("User ID is missing");
          }

          const response = await fetch(
            `${authAPI}/Profile/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id: user.id, email, name, phoneNumber }),
            }
          );

          console.log(response);

          const text = await response.text();
          const data = text ? JSON.parse(text) : {};

          if (!response.ok) {
            const errorMessage = data.errors?.length
              ? data.errors[0]
              : "Profile update failed";
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
          }

          set({
            user: {
              ...user,
              name,
              phoneNumber,
            },
            error: null
          });

          console.log("data", data);

          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      changePassword: async ( oldPassword, newPassword) => {
        try {
          const token = get().token;
          const user = get().user; // Ensure user object is retrieved

          if (!user?.id) {
            throw new Error("User ID is missing");
          }

          const response = await fetch(
            `${authAPI}/Profile/update-password`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id: user.id, oldPassword, newPassword }),
            }
          );

          const text = await response.text();
          const data = text ? JSON.parse(text) : {};

          if (!response.ok) {
            const errorMessage = data.errors?.length
              ? data.errors[0]
              : "Password change failed";
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
          }

          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }
      }
    }),
    { name: "auth-storage" }
  )
);
