import { useEffect, useState } from "react";

export const useStores = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      const response = await fetch("/api/stores");
      const data = await response.json();
      setStores(data);
      setIsLoading(false);
    };

    fetchStores();
  }, []);

  return { stores, isLoading };
};