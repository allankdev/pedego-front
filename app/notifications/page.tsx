import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, isLoading } = useNotifications();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notificações</h1>
      <div className="space-y-4">
        {notifications.map((notification: any) => (
          <div key={notification.id} className="p-4 border rounded-lg">
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500">{notification.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}