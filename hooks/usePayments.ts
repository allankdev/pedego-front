import { useEffect, useState } from "react";

export const usePayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await fetch("/api/payments");
      const data = await response.json();
      setPayments(data);
      setIsLoading(false);
    };

    fetchPayments();
  }, []);

  return { payments, isLoading };
};