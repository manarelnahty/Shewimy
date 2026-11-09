"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BranchExtended, BRANCHES_LIST } from "@/data/branches";
import { fetchBranches, getDb } from "@/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export interface BranchesContextValue {
  branches: BranchExtended[];
  loading: boolean;
  error?: string | null;
  refetch: () => Promise<void>;
}

export const BranchesContext = createContext<BranchesContextValue | null>(null);

export function BranchesProvider({
  initialBranches,
  children,
}: {
  initialBranches?: BranchExtended[];
  children: React.ReactNode;
}) {
  // Always initialize with server-provided initialBranches or fallback to eliminate SSR hydration mismatch.
  // NEVER read localStorage inside useState initializer.
  const [branches, setBranches] = useState<BranchExtended[]>(initialBranches || BRANCHES_LIST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBranches();
      setBranches(data);
    } catch (e) {
      console.warn("Error refetching branches:", e);
      setError(e instanceof Error ? e.message : "Failed to load branches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Sync from local cache after client mount (safely after hydration)
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

    // 2. Cross-tab and custom events listener
    const handleUpdate = (e: any) => {
      if (e?.detail?.branches) {
        setBranches(e.detail.branches);
      } else {
        refetch();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_branches_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    // 3. Firestore snapshot listener if configured
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
      const colRef = collection(db, "branches");
      const unsubscribe = onSnapshot(colRef, () => {
        refetch();
      });
      return () => {
        unsubscribe();
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_branches_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    } catch {
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("shewimy_branches_updated", handleUpdate);
          window.removeEventListener("storage", handleUpdate);
        }
      };
    }
  }, [refetch]);

  return (
    <BranchesContext.Provider value={{ branches, loading, error, refetch }}>
      {children}
    </BranchesContext.Provider>
  );
}

export function useBranchesContext(): BranchesContextValue | null {
  return useContext(BranchesContext);
}
