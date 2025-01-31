import { useEffect, useState } from "react";

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const response = await fetch("/api/deliveries");
      const data = await response.json();
      setDeliveries(data);
      setIsLoading(false);
    };

    fetchDeliveries();
  }, []);

  return { deliveries, isLoading };
};