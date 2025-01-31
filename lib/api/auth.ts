export const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  };
  
  export const register = async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  };
  
  export const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    return response.json();
  };
  
  export const fetchUser = async () => {
    const response = await fetch("/api/auth/me");
    return response.json();
  };