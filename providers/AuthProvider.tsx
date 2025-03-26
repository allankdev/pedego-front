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

  // 🟢 Rotas que não exigem token
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/register-as-store',
    '/store',
    '/checkout',
  ];

  const isPublic = publicPaths.some((publicPath) =>
    pathname === publicPath || pathname.startsWith(publicPath + '/')
  );

  useEffect(() => {
    const token = Cookie.get('token');
    console.log('TOKEN:', token);
    console.log('PATHNAME:', pathname);

    // 🔒 Se não tiver token e estiver em rota protegida → redireciona
    if ((!token || token.split('.').length !== 3) && !isPublic) {
      console.warn('🔁 Redirecionando para login...');
      clearUser();
      router.push('/auth/login');
      return;
    }

    // 🟢 Se a rota for pública, não faz mais nada
    if (!token || token.split('.').length !== 3) return;

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
        .then((data) => setUser(data))
        .catch((err) => {
          console.error('Erro ao buscar user:', err);
          if (!isPublic) {
            clearUser();
            router.push('/auth/login');
          }
        });
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
      if (!isPublic) {
        clearUser();
        router.push('/auth/login');
      }
    }
  }, [pathname, setUser, clearUser, router]);

  return <>{children}</>;
};
