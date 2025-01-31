"use client";
import { ReactNode, useEffect } from "react";
import { authStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUser, clearUser } = authStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      clearUser();
      router.push("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Usuário não autenticado ou sessão expirada");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        clearUser();
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, [setUser, clearUser, router]);

  return <>{children}</>;
};
