export const fetchUsers = async () => {
    const response = await fetch("/api/users");
    return response.json();
  };
  
  export const updateUser = async (userId: string, data: any) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };