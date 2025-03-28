'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Pedgo
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/orders" className="text-sm font-medium hover:text-green-600">
                Pedidos
              </Link>
              <Button onClick={logout} variant="outline" className="text-sm">
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium hover:text-green-600">
                Entrar
              </Link>
              <Link href="/auth/register-as-store">
                <Button className="text-sm">Criar loja</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
