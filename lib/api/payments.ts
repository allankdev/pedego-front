export const fetchPayments = async () => {
    const response = await fetch("/api/payments");
    return response.json();
  };
  
  export const createPayment = async (payment: any) => {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment),
    });
    return response.json();
  };