import { useEffect } from "react";
import { productStore } from "@/lib/store/productStore";

export const useProducts = () => {
  const { products, setProducts } = productStore();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, [setProducts]);

  return { products, isLoading: !products };
};