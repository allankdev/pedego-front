import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Lista de rotas públicas (acessíveis sem login)
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/register-as-store',
    '/checkout',
    '/store',
    '/', // landing page
  ];

  // Libera rotas públicas
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  // Protege rotas /admin/** se não tiver token
  if (!token && pathname.startsWith('/admin')) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Se tiver token, validar o papel
  if (token) {
    try {
      const decoded = jwtDecode<{ role: string }>(token);
      const role = decoded.role;

      // Protege /admin/monitoring => apenas SUPER_ADMIN
      if (pathname === '/admin/monitoring' && role !== 'SUPER_ADMIN') {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
      }

      // Protege qualquer /admin/** => apenas ADMIN ou SUPER_ADMIN
      if (pathname.startsWith('/admin') && !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.error('Token inválido no middleware');
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', // Middleware roda apenas para rotas admin
  ],
};
