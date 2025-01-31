interface NotificationProps {
    message: string;
    date: string;
  }
  
  export const Notification = ({ message, date }: NotificationProps) => {
    return (
      <div className="p-4 border rounded-lg">
        <p>{message}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    );
  };