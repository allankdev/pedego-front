export const fetchNotifications = async () => {
    const response = await fetch("/api/notifications");
    return response.json();
  };