// import { create } from "zustand";
// import { supabase } from "../lib/supabase";
// import type { User } from "@supabase/supabase-js";

// interface AuthState {
//   user: User | null;
//   credits: number;
//   loading: boolean;
//   setUser: (user: User | null) => void;
//   setCredits: (credits: number) => void;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   credits: 0,
//   loading: true,
//   setUser: (user) => set({ user }),
//   setCredits: (credits) => set({ credits }),

//   signIn: async (email, password) => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) throw error;
//   },

//   signUp: async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({ email, password });

//     console.log("Signup Response:", data, error); // Debugging

//     if (error) throw error;
//   },

//   signOut: async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//     set({ user: null });
//   },
// }));

import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  role: string | null;
  credits: number;
  loading: boolean;
  setUser: (user: User | null, role: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  credits: 0,
  loading: true,

  setUser: (user, role) => set({ user, role }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role, credits")
      .eq("id", data.user.id)
      .single();

    set({
      user: data.user,
      role: profileData?.role,
      credits: profileData?.credits,
    });
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role, credits")
      .eq("id", data.user?.id)
      .single();

    set({
      user: data.user,
      role: profileData?.role,
      credits: profileData?.credits,
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null });
  },

  loadUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role, credits")
        .eq("id", data.user.id)
        .single();
      set({
        user: data.user,
        role: profileData?.role,
        credits: profileData?.credits,
      });
    }
  },
}));

useAuthStore.getState().loadUser();
