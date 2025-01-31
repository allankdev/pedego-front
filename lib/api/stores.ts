export const fetchStores = async () => {
    const response = await fetch("/api/stores");
    return response.json();
  };
  
  export const createStore = async (store: any) => {
    const response = await fetch("/api/stores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store),
    });
    return response.json();
  };
  
  export const updateStore = async (storeId: string, data: any) => {
    const response = await fetch(`/api/stores/${storeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };