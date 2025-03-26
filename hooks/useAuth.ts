'use client';

import { useEffect, useState } from 'react';
import { authStore } from '@/lib/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const { user, setUser, clearUser } = authStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Rotas públicas (não exigem login)
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/register-as-store',
    '/store',
    '/checkout',
  ];

  const isPublic = publicPaths.some((path) =>
    pathname === path || pathname.startsWith(path + '/')
  );

  useEffect(() => {
    const token = Cookie.get('token');

    if (!token) {
      console.warn('Token ausente');
      if (!isPublic) {
        console.warn('Redirecionando para login...');
        clearSession();
      } else {
        setIsLoading(false);
      }
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      if (!decoded.sub) throw new Error('Token sem userId válido');
      fetchUser(decoded.sub, token);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      if (!isPublic) clearSession();
      else setIsLoading(false);
    }
  }, [setUser, clearUser, router, pathname]);

  const fetchUser = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Usuário não autenticado ou sessão expirada');

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      if (!isPublic) clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');

      Cookie.set('token', data.access_token, { expires: 1 });
      setUser(data.user);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao registrar');

      Cookie.set('token', data.access_token, { expires: 1 });
      setUser(data.user);
      router.push('/');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
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
    const response = await fetch('http://localhost:3000/api/auth/register-as-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, storeName, subdomain, description }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao registrar loja');
    }

    Cookie.set('token', data.access_token, { expires: 1 });
    setUser(data.user);
    router.push('/admin');
  };

  const logout = () => {
    clearSession();
  };

  const clearSession = () => {
    Cookie.remove('token');
    clearUser();

    if (!isPublic) {
      router.push('/auth/login');
    }

    setIsLoading(false);
  };

  return { user, isLoading, login, register, registerAsStore, logout };
};
