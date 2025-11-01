"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbContextType {
  customBreadcrumbs: BreadcrumbItem[] | null;
  setCustomBreadcrumbs: (items: BreadcrumbItem[] | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);

  return (
    <BreadcrumbContext.Provider
      value={{
        customBreadcrumbs,
        setCustomBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}

