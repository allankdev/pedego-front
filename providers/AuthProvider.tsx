'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { authStore } from '@/lib/store/authStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearUser, setLoading } = authStore();

  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/register-as-store',
    '/store',
    '/checkout',
    '/checkout/cart',
    '/checkout/identify',
    '/checkout/confirm',
    '/checkout/success',
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const token = Cookie.get('token');
    setLoading(true);

    if (!token || token.split('.').length !== 3) {
      clearUser();
      if (!isPublic) router.push('/auth/login');
      else setLoading(false);
      return;
    }

    const decoded = jwtDecode<{ sub: string }>(token);
    const userId = decoded.sub;

    fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Sessão inválida');
        const user = await res.json();

        // ⚠️ Verifica se o user realmente tem loja (pra admins)
        if (user.role === 'ADMIN' && !user.store) {
          throw new Error('Admin sem loja');
        }

        setUser(user); // ✅ salva no Zustand
      })
      .catch(() => {
        clearUser();
        if (!isPublic) router.push('/auth/login');
      });
  }, [pathname]);

  return <>{children}</>;
};
