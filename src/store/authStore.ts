// import { create } from "zustand";
// import { supabase } from "../lib/supabase";
// import type { User } from "@supabase/supabase-js";

// interface AuthState {
//   user: User | null;
//   role: string | null;
//   credits: number;
//   loading: boolean;
//   setUser: (user: User | null, role: string | null, credits: number) => void;
//   signIn: (email: string, password: string) => Promise<void>;
//   refreshCredits: () => Promise<void>; // ✅ Added refreshCredits
//   signUp: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   loadUser: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   role: null,
//   credits: 0,
//   loading: true,

//   setUser: (user, role, credits) => set({ user, role, credits }),

//   signIn: async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) throw error;
//     if (!data.user) throw new Error("User not found");

//     let { data: profileData } = await supabase
//       .from("profiles")
//       .select("role, credits")
//       .eq("id", data.user.id)
//       .single();

//     if (!profileData) {
//       await supabase.from("profiles").insert({
//         id: data.user.id,
//         role: "user",
//         credits: 20,
//         daily_scans: 0,
//         last_reset: new Date().toISOString(),
//       });

//       profileData = { role: "user", credits: 20 };
//     }

//     set({
//       user: data.user,
//       role: profileData.role,
//       credits: profileData.credits,
//       loading: false,
//     });
//   },

//   signUp: async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({ email, password });

//     if (error) throw error;
//     if (!data.user) throw new Error("User creation failed");

//     // Retry fetching profile for 5 seconds (in case trigger is slow)
//     for (let i = 0; i < 5; i++) {
//       await new Promise((res) => setTimeout(res, 1000));

//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("role, credits")
//         .eq("id", data.user.id)
//         .single();

//       if (profileData) {
//         set({
//           user: data.user,
//           role: profileData.role,
//           credits: profileData.credits,
//           loading: false,
//         });
//         return;
//       }
//     }

//     console.warn("Profile not found after multiple retries");
//   },

//   signOut: async () => {
//     await supabase.auth.signOut();
//     set({ user: null, role: null, credits: 0, loading: false });
//   },

//   loadUser: async () => {
//     const { data, error } = await supabase.auth.getUser();
//     if (error || !data.user) {
//       set({ user: null, role: null, credits: 0, loading: false });
//       return;
//     }

//     let { data: profileData } = await supabase
//       .from("profiles")
//       .select("role, credits")
//       .eq("id", data.user.id)
//       .single();

//     if (!profileData) {
//       await supabase.from("profiles").insert({
//         id: data.user.id,
//         role: "user",
//         credits: 20,
//         daily_scans: 0,
//         last_reset: new Date().toISOString(),
//       });

//       profileData = { role: "user", credits: 20 };
//     }

//     set({
//       user: data.user,
//       role: profileData.role,
//       credits: profileData.credits,
//       loading: false,
//     });
//   },

//   // **NEW: Function to Refresh Credits from Database**
//   refreshCredits: async () => {
//     const { user } = useAuthStore.getState();
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("credits")
//       .eq("id", user.id)
//       .single();

//     if (error) {
//       console.error("Error refreshing credits:", error.message);
//     } else {
//       set({ credits: data?.credits ?? 0 });
//     }
//   },
// }));

// // Load user on startup
// useAuthStore.getState().loadUser();
import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  role: string | null;
  credits: number;
  loading: boolean;
  setUser: (user: User | null, role: string | null, credits: number) => void;
  signIn: (email: string, password: string) => Promise<void>;
  refreshCredits: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  let subscription: RealtimeChannel | null = null;

  return {
    user: null,
    role: null,
    credits: 0,
    loading: true,

    setUser: (user, role, credits) => set({ user, role, credits }),

    signIn: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (!data.user) throw new Error("User not found");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, credits")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profileData) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            role: "user",
            credits: 20,
            daily_scans: 0,
            last_reset: new Date().toISOString(),
          });
          set({ user: data.user, role: "user", credits: 20, loading: false });
        } else {
          set({ user: data.user, role: profileData.role, credits: profileData.credits, loading: false });
        }

        get().loadUser();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Sign-in error:", error.message);
        } else {
          console.error("An unknown error occurred during sign-in:", error);
        }
        throw error;
      }
    },

    signUp: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;
        if (!data.user) throw new Error("User creation failed");

        for (let i = 0; i < 5; i++) {
          await new Promise((res) => setTimeout(res, 1000));
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("role, credits")
            .eq("id", data.user.id)
            .single();

          if (profileError) {
            console.warn(`Retry ${i + 1}: Profile fetch error - ${profileError.message}`);
            continue;
          }

          if (profileData) {
            set({ user: data.user, role: profileData.role, credits: profileData.credits, loading: false });
            get().loadUser();
            return;
          }
        }

        console.warn("Profile not found after retries, creating default profile");
        await supabase.from("profiles").insert({
          id: data.user.id,
          role: "user",
          credits: 20,
          daily_scans: 0,
          last_reset: new Date().toISOString(),
        });
        set({ user: data.user, role: "user", credits: 20, loading: false });
        get().loadUser();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Sign-up error:", error.message);
        } else {
          console.error("An unknown error occurred during sign-up:", error);
        }
        throw error;
      }
    },

    signOut: async () => {
      try {
        await supabase.auth.signOut();
        if (subscription) {
          await supabase.removeChannel(subscription);
          subscription = null;
        }
        set({ user: null, role: null, credits: 0, loading: false });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Sign-out error:", error.message);
        } else {
          console.error("An unknown error occurred during sign-out:", error);
        }
        throw error;
      }
    },

    loadUser: async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          set({ user: null, role: null, credits: 0, loading: false });
          if (subscription) {
            await supabase.removeChannel(subscription);
            subscription = null;
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, credits")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profileData) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            role: "user",
            credits: 20,
            daily_scans: 0,
            last_reset: new Date().toISOString(),
          });
          set({ user: data.user, role: "user", credits: 20, loading: false });
        } else {
          set({ user: data.user, role: profileData.role, credits: profileData.credits, loading: false });
        }

        if (subscription) {
          await supabase.removeChannel(subscription);
        }

        subscription = supabase
          .channel(`profiles:${data.user.id}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${data.user.id}`,
            },
            (payload) => {
              set({ role: payload.new.role, credits: payload.new.credits });
              console.log("Profile updated:", payload.new);
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Subscribed to profile changes for user:", data.user.id);
            } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
              console.warn("Subscription status:", status);
            }
          });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Load user error:", error.message);
        } else {
          console.error("An unknown error occurred during loadUser:", error);
        }
        set({ user: null, role: null, credits: 0, loading: false });
      }
    },

    refreshCredits: async () => {
      const { user } = get();
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error refreshing credits:", error.message);
          return;
        }
        set({ credits: data?.credits ?? 0 });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Refresh credits error:", error.message);
        } else {
          console.error("An unknown error occurred during refreshCredits:", error);
        }
      }
    },
  };
});

// Load user on startup
useAuthStore.getState().loadUser();
