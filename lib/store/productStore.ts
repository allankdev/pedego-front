import { create } from "zustand";

type ProductStore = {
  products: any[];
  setProducts: (products: any[]) => void;
};

export const productStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));