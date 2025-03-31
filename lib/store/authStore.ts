import { create } from 'zustand';

type AuthStore = {
  user: any;
  isLoading: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const authStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
