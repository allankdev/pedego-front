import { useEffect, useState } from "react";

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();
      setOrder(data);
      setIsLoading(false);
    };

    fetchOrder();
  }, [id]);

  return { order, isLoading };
};
