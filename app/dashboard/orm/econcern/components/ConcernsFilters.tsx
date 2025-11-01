"use client";

import { Filters, Concern, categoryLabels } from "../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";

interface ConcernsFiltersProps {
  filters: Filters;
  showFilters: boolean;
  activeFilterCount: number;
  onToggleFilters: () => void;
  onFilterChange: (filterType: keyof Filters, value: string | string[]) => void;
}

export function ConcernsFilters({
  filters,
  showFilters,
  activeFilterCount,
  onToggleFilters,
  onFilterChange,
}: ConcernsFiltersProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <>
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: accentColorValue }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Category
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category.includes(value)}
                      onChange={() => onFilterChange("category", value)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                      style={{
                        accentColor: accentColorValue,
                      }}
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {(
                  [
                    "pending",
                    "in-progress",
                    "resolved",
                    "closed",
                  ] as Concern["status"][]
                ).map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => onFilterChange("status", status)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                      style={{
                        accentColor: accentColorValue,
                      }}
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {(["low", "medium", "high"] as Concern["priority"][]).map(
                  (priority) => (
                    <label
                      key={priority}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(priority)}
                        onChange={() => onFilterChange("priority", priority)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                        style={{
                          accentColor: accentColorValue,
                        }}
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                        {priority}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange("dateTo", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
