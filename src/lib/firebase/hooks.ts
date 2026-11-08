"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, productsData } from "@/data/products";
import { BRANCHES_LIST, BranchExtended } from "@/data/branches";
import { MainSection } from "@/types/shewimy";
import {
  fetchProducts,
  fetchBranches,
  fetchProductBySlug,
  getDb,
} from "./firestore";
import { isFirebaseConfigured } from "./config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface UseProductsOptions {
  section?: MainSection;
  branch?: string;
  featuredOnly?: boolean;
}

/**
 * React hook to dynamically fetch products from Firestore with fallback and real-time updates.
 */
export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Initial optimistic state from DRD data
    let initial = [...productsData];
    if (options?.section) {
      initial = initial.filter((p) => p.mainSection === options.section);
    }
    if (options?.featuredOnly) {
      initial = initial.filter((p) => p.isFeatured || p.featured);
    }
    if (options?.branch && options.branch !== "all") {
      initial = initial.filter((p) => p.branches.includes(options.branch as any));
    }
    return initial;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(options);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [options?.section, options?.branch, options?.featuredOnly]);

  useEffect(() => {
    loadData();

    // Listen to real-time Firestore updates if configured
    const db = getDb();
    if (!db || !isFirebaseConfigured()) return;

    try {
      const itemsRef = collection(db, "items");
      let q = query(itemsRef, where("status", "==", "published"));
      if (options?.section) {
        q = query(q, where("mainSection", "==", options.section));
      }
      if (options?.featuredOnly) {
        q = query(q, where("isFeatured", "==", true));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            loadData();
          }
        },
        (err) => {
          console.warn("Firestore onSnapshot error:", err);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      // non-blocking
    }
  }, [loadData, options?.section, options?.featuredOnly]);

  return { products, loading, error, refetch: loadData };
}

/**
 * React hook to dynamically fetch branches from Firestore `branches` collection.
 */
export function useBranches() {
  const [branches, setBranches] = useState<BranchExtended[]>(BRANCHES_LIST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBranches();
      setBranches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load branches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();

    const db = getDb();
    if (!db || !isFirebaseConfigured()) return;

    try {
      const branchesRef = collection(db, "branches");
      const unsubscribe = onSnapshot(
        branchesRef,
        () => {
          loadBranches();
        },
        (err) => {
          console.warn("Branches onSnapshot error:", err);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      // non-blocking
    }
  }, [loadBranches]);

  return { branches, loading, error, refetch: loadBranches };
}
