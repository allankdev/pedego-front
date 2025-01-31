export const fetchProducts = async () => {
    const response = await fetch("/api/products");
    return response.json();
  };
  
  export const createProduct = async (product: any) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    return response.json();
  };