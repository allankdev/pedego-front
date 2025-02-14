"use client";
import { useEffect, useState } from "react";
import { authStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";  // Importando a biblioteca js-cookie
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const { user, setUser, clearUser } = authStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const publicPaths = ["/auth/login", "/auth/register", "/"];

  useEffect(() => {
    const token = Cookie.get("token");  // Usando Cookie.get para pegar o token

    if (!token || token.split(".").length !== 3) {
      console.warn("Token inválido ou ausente, redirecionando para login...");
      clearSession();
      return;
    }

    try {
      // Corrigido: Pegar `sub` do token
      const decoded = jwtDecode<{ sub: string }>(token);

      if (!decoded.sub) {
        throw new Error("Token sem userId válido");
      }

      fetchUser(decoded.sub, token);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      clearSession();
    }
  }, [setUser, clearUser, router]);

  const fetchUser = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Usuário não autenticado ou sessão expirada");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (typeof email !== "string" || typeof password !== "string") {
      console.error("Erro: Os campos devem ser strings!");
      return;
    }

    if (password.length < 6) {
      console.error("Erro: A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Corrigido: Pegando `access_token` corretamente
      const token = data.access_token;
      if (token) {
        Cookie.set("token", token, { expires: 1 });  // Usando Cookie.set para salvar no cookie
      }

      setUser(data.user);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      console.error("Erro: Os campos devem ser strings!");
      return;
    }

    if (password.length < 6) {
      console.error("Erro: A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("Resposta da API (registro):", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar");
      }

      const token = data.access_token;
      if (token) {
        Cookie.set("token", token, { expires: 1 });  // Usando Cookie.set para salvar no cookie
      }

      setUser(data.user);
      router.push("/");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    clearSession();
  };

  const clearSession = () => {
    Cookie.remove("token");  // Usando Cookie.remove para remover o token do cookie
    clearUser();
    if (!publicPaths.includes(window.location.pathname)) {
      router.push("/auth/login");
    }
    setIsLoading(false);
  };

  return { user, isLoading, login, register, logout };
};
