import { create } from "zustand";

type OrderStore = {
  orders: any[];
  setOrders: (orders: any[]) => void;
};

export const orderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
}));