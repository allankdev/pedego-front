export const fetchStock = async () => {
    const response = await fetch("/api/stock");
    return response.json();
  };
  
  export const updateStock = async (itemId: string, quantity: number) => {
    const response = await fetch(`/api/stock/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
    return response.json();
  };