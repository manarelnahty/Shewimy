"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { CartItem } from "@/types/shewimy";
import { Product } from "@/data/products";

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product | CartItem,
    customizations?: { material?: string; dimensions?: string; quantity?: number }
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  estimatedTotal: number;
  hasQuoteOnlyItems: boolean;
  recentlyAddedItem: CartItem | null;
  clearRecentlyAdded: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "shewimy_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage:", e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change after initial hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("shewimy_cart_updated", { detail: items }));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearRecentlyAdded = useCallback(() => setRecentlyAddedItem(null), []);

  const addItem = useCallback(
    (
      product: Product | CartItem,
      customizations?: { material?: string; dimensions?: string; quantity?: number }
    ) => {
      const isCartItem = "coverImage" in product;
      const quantityToAdd = customizations?.quantity || 1;

      const newItem: CartItem = isCartItem
        ? (product as CartItem)
        : {
            id: product.id,
            code: product.code || `SHW-${Math.floor(100 + Math.random() * 900)}`,
            name: product.name,
            slug: product.slug,
            mainSection: product.mainSection,
            categoryLabel: product.categoryLabel,
            coverImage:
              product.coverImage || product.imageUrl ||
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
            price: typeof product.price === "number" ? product.price : 0,
            originalPrice: product.originalPrice ?? null,
            priceDisplay: product.priceDisplay || "حسب المقايسة",
            pricingMode: product.pricingMode || "per_meter",
            selectedMaterial: customizations?.material || product.materialLabel,
            customDimensions: customizations?.dimensions || product.dimensions,
            quantity: quantityToAdd,
            warrantyYears: product.warrantyYears || 15,
          };

      setItems((prev) => {
        const existingIdx = prev.findIndex((it) => it.id === newItem.id);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantityToAdd,
            ...(customizations?.material ? { selectedMaterial: customizations.material } : {}),
            ...(customizations?.dimensions ? { customDimensions: customizations.dimensions } : {}),
          };
          return updated;
        }
        return [...prev, newItem];
      });

      setRecentlyAddedItem(newItem);
      // Auto open drawer to guide user attention smoothly
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity || 1), 0),
    [items]
  );

  const estimatedTotal = useMemo(
    () =>
      items.reduce((acc, it) => {
        if (it.price && it.price > 0) {
          return acc + it.price * (it.quantity || 1);
        }
        return acc;
      }, 0),
    [items]
  );

  const hasQuoteOnlyItems = useMemo(
    () => items.some((it) => it.pricingMode === "whatsapp_quote" || !it.price),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalCount,
      estimatedTotal,
      hasQuoteOnlyItems,
      recentlyAddedItem,
      clearRecentlyAdded,
    }),
    [
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalCount,
      estimatedTotal,
      hasQuoteOnlyItems,
      recentlyAddedItem,
      clearRecentlyAdded,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
