import { useEffect, useState } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, isLoading };
};