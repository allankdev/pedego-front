export const fetchOrders = async () => {
    const response = await fetch("/api/orders");
    return response.json();
  };
  
  export const fetchOrderById = async (id: string) => {
    const response = await fetch(`/api/orders/${id}`);
    return response.json();
  };
  
  export const createOrder = async (order: any) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    return response.json();
  };