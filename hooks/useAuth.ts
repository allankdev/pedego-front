// hooks/useAuth.ts
'use client';

import { authStore } from '@/lib/store/authStore';

export const useAuth = () => {
  const { user, setUser, clearUser } = authStore();

  return {
    user,
    setUser,
    clearUser,
    isLoggedIn: !!user,
    isLoading: false, // garante compatibilidade com componentes antigos
  };
};
