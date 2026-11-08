"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteSettings } from "@/types/shewimy";
import { fetchSiteSettings, getDb } from "@/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: SiteSettings;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (e) {
      console.warn("Error refetching site settings:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Same-tab and cross-tab update listener
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        refetch();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("shewimy_settings_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    // 2. Real-time Firestore sync if configured
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
        refetch();
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
  }, [refetch]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refetch }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext(): SiteSettingsContextValue | null {
  return useContext(SiteSettingsContext);
}
