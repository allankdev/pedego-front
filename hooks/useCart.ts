"use client";

import { useEffect, useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    // Recupera o carrinho do localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Salva o carrinho no localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return { cart, addToCart, removeFromCart, clearCart };
};