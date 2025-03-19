// @ts-nocheck

import { create } from "zustand";

interface Product {
  id?: string; // Assuming `id` is added by the server
  name: string;
  price: number;
  image: string;
}

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  createProduct: (
    newProduct: Product
  ) => Promise<{ success: boolean; message: string }>;
  fetchProducts: () => Promise<void>;
  deleteProduct: (
    pid: Product[]
  ) => Promise<{ success: boolean; message: string }>;
  updateProduct: (
    pid: Product[],
    updatedProduct: Product[]
  ) => Promise<{ success: boolean; message: string }>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!res.ok) {
      return { success: false, message: "Failed to create product." };
    }

    const data = await res.json();

    set((state) => ({ products: [...state.products, data.data] }));

    return { success: true, message: "Product Created." };
  },

  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },

  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, message: data.message };
    }

    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    const data = await res.json();
    if (!data.success) return { succes: false, message: data.message };

    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product
      ),
    }));

    return { success: true, message: data.data };
  },
}));
