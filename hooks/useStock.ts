import { useEffect, useState } from "react";

export const useStock = () => {
  const [stock, setStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      const response = await fetch("/api/stock");
      const data = await response.json();
      setStock(data);
      setIsLoading(false);
    };

    fetchStock();
  }, []);

  return { stock, isLoading };
};