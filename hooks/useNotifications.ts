import { useEffect, useState } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data);
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  return { notifications, isLoading };
};