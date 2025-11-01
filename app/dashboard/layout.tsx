"use client";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { SearchProvider, useSearch } from "./contexts/SearchContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AccentColorProvider } from "./contexts/AccentColorContext";
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="min-h-dvh bg-[#f8f8f8] dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <SidebarProvider>
        <AccentColorProvider>
          <BreadcrumbProvider>
            <DashboardContent>{children}</DashboardContent>
          </BreadcrumbProvider>
        </AccentColorProvider>
      </SidebarProvider>
    </SearchProvider>
  );
}
