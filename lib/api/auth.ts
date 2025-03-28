// lib/api/auth.ts

type AuthResponse = {
  access_token: string;
  user: any; // ou um tipo mais preciso
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');

  return data;
};


export const registerAsStore = async ({
  name,
  email,
  password,
  storeName,
  subdomain,
  description,
}: {
  name: string;
  email: string;
  password: string;
  storeName: string;
  subdomain: string;
  description: string;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/auth/register-as-store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, storeName, subdomain, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao registrar loja');
  }

  return data;
};
