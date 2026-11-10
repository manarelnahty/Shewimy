"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { Product, productsData } from "@/data/products";
import { BRANCHES_LIST, BranchExtended } from "@/data/branches";
import siteSettingsData from "@/data/siteSettings.json";
import { SiteSettingsContext } from "@/lib/SiteSettingsContext";
import { BranchesContext } from "@/lib/BranchesContext";
import {
  MainSection,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  InspectionRequest,
  CategoryInfo,
  MaterialItem,
} from "@/types/shewimy";
import defaultCategoriesData from "@/data/categories.json";
import defaultMaterialsData from "@/data/materials.json";
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
import {
  subscribeToAuth,
  signInAdmin,
  signOutAdmin,
  changeAdminEmail,
  changeAdminPassword,
} from "./auth";
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

    // Listen to local custom event (same tab) and storage event (cross-tab)
    const handleUpdate = () => {
      loadData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_products_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    // Listen to real-time Firestore updates if configured
    const db = getDb();
    if (!db || !isFirebaseConfigured()) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_products_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }

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

      return () => {
        unsubscribe();
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_products_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    } catch (e) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_products_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }
  }, [loadData, options?.section, options?.featuredOnly]);

  return { products, loading, error, refetch: loadData };
}

/**
 * React hook to dynamically fetch branches from Firestore `branches` collection
 * or from BranchesContext if provided.
 */
export function useBranches(initialBranches?: BranchExtended[]) {
  const context = useContext(BranchesContext);
  if (context) {
    return context;
  }

  // Fallback for standalone usage outside BranchesProvider
  const [branches, setBranches] = useState<BranchExtended[]>(() => {
    // ALWAYS initialize with server-safe initialBranches or fallback.
    // NEVER read localStorage here to prevent SSR hydration mismatch.
    return initialBranches || BRANCHES_LIST;
  });
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
    // Safely load cached branches after hydration has completed
    try {
      const local = localStorage.getItem("shewimy_branches");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBranches(parsed);
        }
      }
    } catch {
      // ignore
    }

    loadBranches();

    // Listen to local custom event (same tab) and storage event (cross-tab)
    const handleUpdate = (e: any) => {
      if (e?.detail?.branches) {
        setBranches(e.detail.branches);
      } else {
        loadBranches();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_branches_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    const db = getDb();
    if (!db || !isFirebaseConfigured()) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_branches_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }

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

      return () => {
        unsubscribe();
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_branches_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    } catch (e) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_branches_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }
  }, [loadBranches]);

  return { branches, loading, error, refetch: loadBranches };
}

/**
 * React hook for dynamic Site Settings (trust bar, contact numbers, headline).
 */
export function useSiteSettings(initialSettings?: SiteSettings) {
  const context = useContext(SiteSettingsContext);
  if (context) {
    return context;
  }

  const [settings, setSettings] = useState<SiteSettings>(() => {
    // ALWAYS initialize with server-safe initialSettings or fallback.
    // NEVER read localStorage here to prevent SSR hydration mismatch.
    return initialSettings || (siteSettingsData as unknown as SiteSettings);
  });
  const [loading, setLoading] = useState(false);

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
    // Safely load cached settings after hydration has completed
    try {
      const local = localStorage.getItem("shewimy_site_settings");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === "object") {
          setSettings((prev) => ({ ...(siteSettingsData as unknown as SiteSettings), ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore
    }

    loadSettings();

    // Listen to local custom event (same tab) and storage event (cross-tab)
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        loadSettings();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_settings_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    const db = getDb();
    if (!db || !isFirebaseConfigured()) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_settings_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }

    try {
      const docRef = collection(db, "site_settings");
      const unsubscribe = onSnapshot(docRef, () => {
        loadSettings();
      });
      return () => {
        unsubscribe();
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_settings_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    } catch {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_settings_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
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

      const handleAdminUpdated = (e: any) => {
        if (e.detail) {
          setUser(e.detail);
        } else {
          setUser(null);
        }
      };

      window.addEventListener("shewimy_admin_updated", handleAdminUpdated);
      return () => {
        window.removeEventListener("shewimy_admin_updated", handleAdminUpdated);
      };
    }
  }, []);

  useEffect(() => {
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

  const changeEmail = async (newEmail: string, currentPass: string) => {
    return await changeAdminEmail(newEmail, currentPass);
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    return await changeAdminPassword(currentPass, newPass);
  };

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    changeEmail,
    changePassword,
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

    const handleUpdate = () => {
      loadData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_products_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    const db = getDb();
    if (!db || !isFirebaseConfigured()) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_products_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }

    try {
      const itemsRef = collection(db, "items");
      const unsubscribe = onSnapshot(itemsRef, () => {
        loadData();
      });
      return () => {
        unsubscribe();
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_products_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    } catch {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_products_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
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

    const handleUpdate = () => {
      loadRequests();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_requests_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    const db = getDb();
    if (!db || !isFirebaseConfigured()) {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_requests_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }

    try {
      const colRef = collection(db, "inspection_requests");
      const unsubscribe = onSnapshot(colRef, () => {
        loadRequests();
      });
      return () => {
        unsubscribe();
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_requests_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    } catch {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_requests_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }
  }, [loadRequests]);

  return { requests, loading, error, refetch: loadRequests };
}

/**
 * Hook for dynamic categories registry (DRD defaults + custom categories added by admin).
 */
export function useCategories() {
  const [categories, setCategories] = useState<CategoryInfo[]>(
    () => defaultCategoriesData as CategoryInfo[]
  );
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (e) {
      console.warn("Could not load categories:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (newCat: {
    key?: string;
    labelAr: string;
    sharePercent?: string;
  }): Promise<{ success: boolean; category?: CategoryInfo; error?: string }> => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) => {
          const exists = prev.some((c) => c.key === data.category.key);
          if (exists) {
            return prev.map((c) => (c.key === data.category.key ? data.category : c));
          }
          return [...prev, data.category];
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("shewimy_categories_updated", { detail: data.category })
          );
        }
        return { success: true, category: data.category };
      }
      return { success: false, error: data.error || "فشل إضافة القسم" };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء إضافة القسم" };
    }
  };

  const updateCategory = async (
    key: string,
    updates: { labelAr?: string; sharePercent?: string; subCategories?: string[] }
  ): Promise<{ success: boolean; category?: CategoryInfo; error?: string }> => {
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) =>
          prev.map((c) => (c.key === key ? data.category : c))
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("shewimy_categories_updated", { detail: data.category })
          );
        }
        return { success: true, category: data.category };
      }
      return { success: false, error: data.error || "فشل تعديل القسم" };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء تعديل القسم" };
    }
  };

  const deleteCategory = async (
    key: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/categories?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.key !== key));
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("shewimy_categories_updated", { detail: { deletedKey: key } })
          );
        }
        return { success: true };
      }
      return { success: false, error: data.error || "فشل حذف القسم" };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء حذف القسم" };
    }
  };

  useEffect(() => {
    loadCategories();

    const handleUpdate = () => {
      loadCategories();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_categories_updated", handleUpdate);
      return () => {
        window.removeEventListener("shewimy_categories_updated", handleUpdate);
      };
    }
  }, [loadCategories]);

  return { categories, loading, addCategory, updateCategory, deleteCategory, refetch: loadCategories };
}

/**
 * Hook for dynamic materials registry (defaults + custom materials added/edited by admin).
 */
export function useMaterials() {
  const [materials, setMaterials] = useState<MaterialItem[]>(
    () => defaultMaterialsData as MaterialItem[]
  );
  const [loading, setLoading] = useState(false);

  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/materials?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.materials)) {
          setMaterials(data.materials);
        }
      }
    } catch (e) {
      console.warn("Could not load materials:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMaterial = async (mat: {
    id?: string;
    name: string;
    origin?: string;
    description?: string;
  }): Promise<{ success: boolean; material?: MaterialItem; error?: string }> => {
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mat),
      });
      const data = await res.json();
      if (data.success && data.material) {
        setMaterials((prev) => {
          const exists = prev.some((m) => m.id === data.material.id);
          if (exists) {
            return prev.map((m) => (m.id === data.material.id ? data.material : m));
          }
          return [...prev, data.material];
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("shewimy_materials_updated", { detail: data.material })
          );
        }
        return { success: true, material: data.material };
      }
      return { success: false, error: data.error || "فشل حفظ الخامة" };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء حفظ الخامة" };
    }
  };

  const deleteMaterial = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/materials?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("shewimy_materials_updated", { detail: { id } })
          );
        }
        return { success: true };
      }
      return { success: false, error: data.error || "فشل حذف الخامة" };
    } catch (err: any) {
      return { success: false, error: err?.message || "حدث خطأ أثناء حذف الخامة" };
    }
  };

  useEffect(() => {
    loadMaterials();

    const handleUpdate = () => {
      loadMaterials();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_materials_updated", handleUpdate);
      return () => {
        window.removeEventListener("shewimy_materials_updated", handleUpdate);
      };
    }
  }, [loadMaterials]);

  return {
    materials,
    loading,
    saveMaterial,
    deleteMaterial,
    refetch: loadMaterials,
  };
}

