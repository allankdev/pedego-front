"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Minha Plataforma
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <Link href="/orders" className="hover:text-blue-500">
                    Pedidos
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:text-blue-500">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login" className="hover:text-blue-500">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-blue-500">
                    Cadastre-se
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};