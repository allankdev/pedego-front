import { create } from 'zustand';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CustomerInfo = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  deliveryType?: 'retirada' | 'entrega';
  paymentMethod?: 'pix' | 'dinheiro' | 'cartao';
};

type Coupon = {
  code: string;
  discountPercentage: number;
};

type CartState = {
  items: CartItem[];
  customerInfo: CustomerInfo | null;
  coupon: Coupon | null;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  updateCustomerInfo: (info: CustomerInfo) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customerInfo: null,
  coupon: null,
  total: 0,

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      const newItems = exists
        ? state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        : [...state.items, item];

      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const discount = state.coupon ? subtotal * (state.coupon.discountPercentage / 100) : 0;

      return {
        items: newItems,
        total: subtotal - discount,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const discount = state.coupon ? subtotal * (state.coupon.discountPercentage / 100) : 0;
      return {
        items: newItems,
        total: subtotal - discount,
      };
    }),

  increaseQuantity: (id) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const discount = state.coupon ? subtotal * (state.coupon.discountPercentage / 100) : 0;
      return {
        items: newItems,
        total: subtotal - discount,
      };
    }),

  decreaseQuantity: (id) =>
    set((state) => {
      const newItems = state.items
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        );
      const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const discount = state.coupon ? subtotal * (state.coupon.discountPercentage / 100) : 0;
      return {
        items: newItems,
        total: subtotal - discount,
      };
    }),

  updateCustomerInfo: (info) => set({ customerInfo: info }),

  applyCoupon: (coupon) =>
    set((state) => {
      const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const discount = subtotal * (coupon.discountPercentage / 100);
      return {
        coupon,
        total: subtotal - discount,
      };
    }),

  clearCart: () =>
    set({
      items: [],
      customerInfo: null,
      coupon: null,
      total: 0,
    }),
}));
