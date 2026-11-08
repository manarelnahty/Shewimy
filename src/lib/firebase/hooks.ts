"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, productsData } from "@/data/products";
import { BRANCHES_LIST, BranchExtended } from "@/data/branches";
import {
  MainSection,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  InspectionRequest,
} from "@/types/shewimy";
import {
  fetchProducts,
  fetchBranches,
  fetchProductBySlug,
  fetchAllProductsAdmin,
  fetchInspectionRequests,
  fetchSiteSettings,
  getDb,
} from "./firestore";
import { isFirebaseConfigured } from "./config";
import { subscribeToAuth, signInAdmin, signOutAdmin } from "./auth";
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

/**
 * React hook for dynamic Site Settings (trust bar, contact numbers, headline).
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (e) {
      console.warn("Error loading site settings:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    const db = getDb();
    if (!db || !isFirebaseConfigured()) return;

    try {
      const docRef = collection(db, "site_settings");
      const unsubscribe = onSnapshot(docRef, () => {
        loadSettings();
      });
      return () => unsubscribe();
    } catch {
      // non-blocking
    }
  }, [loadSettings]);

  return { settings, loading, refetch: loadSettings };
}

/**
 * Hook for Admin Authentication State.
 */
export function useAdminAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local dev admin fallback session
    if (typeof window !== "undefined") {
      const localAdmin = localStorage.getItem("shewimy_admin_session");
      if (localAdmin) {
        try {
          setUser(JSON.parse(localAdmin));
          setLoading(false);
        } catch {
          // ignore
        }
      }
    }

    const unsub = subscribeToAuth((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await signInAdmin(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "shewimy_admin_session",
          JSON.stringify({
            uid: res.user.uid,
            email: res.user.email,
            displayName: res.user.displayName || "مدير النظام",
          })
        );
      }
    }
    return res;
  };

  const logout = async () => {
    await signOutAdmin();
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("shewimy_admin_session");
    }
  };

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
}

/**
 * Hook for Admin Products management.
 */
export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllProductsAdmin();
      setProducts(data);
    } catch (err: any) {
      setError(err?.message || "فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const db = getDb();
    if (!db || !isFirebaseConfigured()) return;

    try {
      const itemsRef = collection(db, "items");
      const unsubscribe = onSnapshot(itemsRef, () => {
        loadData();
      });
      return () => unsubscribe();
    } catch {
      // non-blocking
    }
  }, [loadData]);

  return { products, loading, error, refetch: loadData };
}

/**
 * Hook for Admin Inspection Requests management.
 */
export function useAdminRequests() {
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchInspectionRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err?.message || "فشل تحميل طلبات المعاينة");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();

    const db = getDb();
    if (!db || !isFirebaseConfigured()) return;

    try {
      const colRef = collection(db, "inspection_requests");
      const unsubscribe = onSnapshot(colRef, () => {
        loadRequests();
      });
      return () => unsubscribe();
    } catch {
      // non-blocking
    }
  }, [loadRequests]);

  return { requests, loading, error, refetch: loadRequests };
}

