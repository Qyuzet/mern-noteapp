// @ts-nocheck

import { create } from "zustand";

interface Product {
  id?: string; // Assuming `id` is added by the server
  task: string;
  priority: number;
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
    if (!newProduct.task || !newProduct.priority || !newProduct.image) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const res = await fetch("http://localhost:7777/api/products", {
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
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  fetchProducts: async () => {
    try {
      const res = await fetch("http://localhost:7777/api/products");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      set({ products: data.data });
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`http://localhost:7777/api/products/${pid}`, {
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
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`http://localhost:7777/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: data.data };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },
}));
