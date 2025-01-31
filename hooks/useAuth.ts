"use client";
import { useEffect, useState } from "react";
import { authStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import {jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const { user, setUser, clearUser } = authStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Evita redirecionamento automático se estiver na tela de registro
    if (!token && window.location.pathname !== "/auth/register") {
      clearUser();
      router.push("/auth/login");
      setIsLoading(false);
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        fetchUser(decoded.id, token);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        clearUser();
        localStorage.removeItem("token");
        if (window.location.pathname !== "/auth/register") {
          router.push("/auth/login");
        }
        setIsLoading(false);
      }
    }
  }, [setUser, clearUser, router]);

  // Função para buscar os dados do usuário autenticado
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

      if (!response.ok) throw new Error("Usuário não autenticado ou sessão expirada");

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      clearUser();
      localStorage.removeItem("token");
      if (window.location.pathname !== "/auth/register") {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao fazer login");

      localStorage.setItem("token", data.token);
      setUser(data.user);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao registrar");

      localStorage.setItem("token", data.token);
      setUser(data.user);
      router.push("/");
    } catch (error) {
      console.error("Erro ao registrar:", error);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("token");
    clearUser();
    router.push("/auth/login");
  };

  return { user, isLoading, login, register, logout };
};
