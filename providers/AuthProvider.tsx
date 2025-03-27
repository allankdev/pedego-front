'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { authStore } from '@/lib/store/authStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearUser } = authStore();

  // 🟢 Rotas públicas — sem autenticação obrigatória
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

  // ✅ Garante que qualquer variação (com / ou query) seja permitida
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const token = Cookie.get('token');
    console.log('📍 PATHNAME:', pathname);
    console.log('🔐 TOKEN:', token);

    // 🛑 Sem token + rota protegida → redireciona
    if (!token || token.split('.').length !== 3) {
      if (!isPublic) {
        clearUser();
        router.push('/auth/login');
      }
      return;
    }

    // ✅ Com token e rota pública → ignora
    if (isPublic) return;

    // 🔄 Busca usuário e valida sessão
    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      const userId = decoded.sub;

      fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Sessão inválida');
          return res.json();
        })
        .then(setUser)
        .catch(() => {
          clearUser();
          if (!isPublic) router.push('/auth/login');
        });
    } catch (err) {
      clearUser();
      if (!isPublic) router.push('/auth/login');
    }
  }, [pathname]);

  return <>{children}</>;
};
