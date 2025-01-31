"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold">Bem-vindo à Minha Plataforma</h1>
        {user ? (
          <>
            <p className="text-gray-600">Olá, {user.name}!</p>
            <Button onClick={logout} className="w-full">
              Sair
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-600">Faça login para continuar.</p>
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">Login</Button>
            </Link>
            <Link href="/auth/register" className="w-full">
              <Button variant="outline" className="w-full">
                Cadastre-se
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}