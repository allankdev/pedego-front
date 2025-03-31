'use client';

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { authStore } from '@/lib/store/authStore';
import { login as loginApi, registerAsStore as registerStoreApi } from '@/lib/api/auth';

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser, clearUser, isLoading } = authStore();

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    Cookie.set('token', data.access_token, { expires: 1 });
    setUser(data.user);
    router.push('/admin');
  };

  const registerAsStore = async ({
    name,
    email,
    password,
    storeName,
    subdomain,
    description,
  }: {
    name: string;
    email: string;
    password: string;
    storeName: string;
    subdomain: string;
    description: string;
  }) => {
    const data = await registerStoreApi({
      name,
      email,
      password,
      storeName,
      subdomain,
      description,
    });
    Cookie.set('token', data.access_token, { expires: 1 });
    setUser(data.user);
    router.push('/admin');
  };

  const logout = () => {
    Cookie.remove('token');
    clearUser();
    router.push('/');
  };

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    setUser,
    clearUser,
    login,
    logout,
    registerAsStore,
  };
};
