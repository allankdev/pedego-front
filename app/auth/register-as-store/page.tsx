'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { registerAsStore } from "@/lib/api/auth"; // ✅ importa aqui
import Cookie from "js-cookie";
import { authStore } from "@/lib/store/authStore";

export default function RegisterAsStorePage() {
  const router = useRouter();
  const setUser = authStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await registerAsStore({ name, email, password, storeName, subdomain, description });
      Cookie.set("token", data.access_token, { expires: 1 });
      setUser(data.user);
      router.push("/admin"); // ✅ redireciona pro painel
    } catch (err: any) {
      setError(err.message || "Erro ao registrar loja. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold">Cadastrar Loja</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          <Input type="text" placeholder="Nome da loja" value={storeName} onChange={(e) => setStoreName(e.target.value)} required disabled={isLoading} />
          <Input type="text" placeholder="Subdomínio da loja (ex: minha-loja)" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} required disabled={isLoading} />
          <Textarea placeholder="Descrição da loja" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando loja..." : "Cadastrar como loja"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Já tem uma loja?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
