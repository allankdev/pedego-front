"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Função para tratar o login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de e-mail
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    // Validação de senha
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);  // Inicia o carregamento
    try {
      // Chama a função de login do hook useAuth
      await login(email, password);
    } catch (err) {
      setError("Credenciais inválidas");
    } finally {
      setIsLoading(false);  // Finaliza o carregamento
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        
        {/* Exibe a mensagem de erro caso haja */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de E-mail */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="E-mail"
            aria-describedby="email-error"
          />

          {/* Campo de Senha */}
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Senha"
          />

          {/* Botão de Envio */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Entrar"}
          </Button>
        </form>

        {/* Link para Cadastro */}
        <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
