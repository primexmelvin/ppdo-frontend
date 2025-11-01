"use client";

import { useState, useMemo } from "react";
import { ExtendedSystem } from "../data/systems";
import { SystemCard } from "./SystemCard";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { LogoutButton } from "./LogoutButton";

interface DashboardGridProps {
  systems: ExtendedSystem[];
  onCardClick: (system: ExtendedSystem) => void;
  onLogout: () => void;
}

export function DashboardGrid({
  systems,
  onCardClick,
  onLogout,
}: DashboardGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSystems = useMemo(() => {
    if (!searchQuery.trim()) return systems;

    const query = searchQuery.toLowerCase();
    return systems.filter(
      (system) =>
        system.name.toLowerCase().includes(query) ||
        system.description.toLowerCase().includes(query) ||
        system.status.toLowerCase().includes(query)
    );
  }, [systems, searchQuery]);

  return (
    <div
      className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950 px-4 py-8 sm:py-12 transition-theme relative"
      style={{
        backgroundImage: `url('https://cdn.prod.website-files.com/68a25157e0edb92947ffe4a2/68af49e2f002d2c50022786b_Story%20Image-min.avif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/30 via-black/40 to-zinc-950/30 transition-theme pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#16a34a] mb-2 transition-theme drop-shadow-2xl"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
              >
                System Dashboard
              </h1>
              <p
                className="text-[#16a34a] text-base sm:text-lg transition-theme drop-shadow-lg"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.25)" }}
              >
                Monitor and manage all systems
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              {/* <ThemeToggle /> */}
              <LogoutButton onClick={onLogout} />
            </div>
          </div>
        </header>

        {/* Systems Grid */}
        {filteredSystems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* Decorative background elements */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-yellow-300/10 to-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-amber-50/5 rounded-full blur-3xl pointer-events-none"></div>
            {filteredSystems.map((system, index) => (
              <SystemCard
                key={system.id}
                system={system}
                index={index}
                onClick={() => onCardClick(system)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              No systems found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
