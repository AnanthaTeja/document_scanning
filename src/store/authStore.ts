import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  role: string | null;
  credits: number;
  loading: boolean;
  setUser: (user: User | null, role: string | null, credits: number) => void;
  signIn: (email: string, password: string) => Promise<void>;
  refreshCredits: () => Promise<void>; // ✅ Added refreshCredits
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

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
// }));

// // Load user on startup
// useAuthStore.getState().loadUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  credits: 0,
  loading: true,

  setUser: (user, role, credits) => set({ user, role, credits }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("User not found");

    let { data: profileData } = await supabase
      .from("profiles")
      .select("role, credits")
      .eq("id", data.user.id)
      .single();

    if (!profileData) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        role: "user",
        credits: 20,
        daily_scans: 0,
        last_reset: new Date().toISOString(),
      });

      profileData = { role: "user", credits: 20 };
    }

    set({
      user: data.user,
      role: profileData.role,
      credits: profileData.credits,
      loading: false,
    });
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;
    if (!data.user) throw new Error("User creation failed");

    // Retry fetching profile for 5 seconds (in case trigger is slow)
    for (let i = 0; i < 5; i++) {
      await new Promise((res) => setTimeout(res, 1000));

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role, credits")
        .eq("id", data.user.id)
        .single();

      if (profileData) {
        set({
          user: data.user,
          role: profileData.role,
          credits: profileData.credits,
          loading: false,
        });
        return;
      }
    }

    console.warn("Profile not found after multiple retries");
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null, credits: 0, loading: false });
  },

  loadUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      set({ user: null, role: null, credits: 0, loading: false });
      return;
    }

    let { data: profileData } = await supabase
      .from("profiles")
      .select("role, credits")
      .eq("id", data.user.id)
      .single();

    if (!profileData) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        role: "user",
        credits: 20,
        daily_scans: 0,
        last_reset: new Date().toISOString(),
      });

      profileData = { role: "user", credits: 20 };
    }

    set({
      user: data.user,
      role: profileData.role,
      credits: profileData.credits,
      loading: false,
    });
  },

  // **NEW: Function to Refresh Credits from Database**
  refreshCredits: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error refreshing credits:", error.message);
    } else {
      set({ credits: data?.credits ?? 0 });
    }
  },
}));

// Load user on startup
useAuthStore.getState().loadUser();
