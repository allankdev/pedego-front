export const fetchDeliveries = async () => {
    const response = await fetch("/api/deliveries");
    return response.json();
  };
  
  export const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    const response = await fetch(`/api/deliveries/${deliveryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  };