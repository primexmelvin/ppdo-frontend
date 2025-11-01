"use client";

import { Document, DocumentFilters } from "../types";
import { useAccentColor } from "../../contexts/AccentColorContext";

interface DocumentsSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: DocumentFilters;
  showFilters: boolean;
  activeFilterCount: number;
  onToggleFilters: () => void;
  onFilterChange: (filterType: keyof DocumentFilters, value: string | string[]) => void;
  onResetFilters: () => void;
  onAddDocument: () => void;
}

export function DocumentsSearchAndFilters({
  searchQuery,
  onSearchChange,
  filters,
  showFilters,
  activeFilterCount,
  onToggleFilters,
  onFilterChange,
  onResetFilters,
  onAddDocument,
}: DocumentsSearchAndFiltersProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all"
            style={
              {
                "--tw-ring-color": accentColorValue,
              } as React.CSSProperties
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>

        {/* Add Document Button */}
        <button
          onClick={onAddDocument}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium whitespace-nowrap transition-all hover:shadow-lg text-white"
          style={{
            backgroundColor: accentColorValue,
            borderColor: accentColorValue,
          }}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Document</span>
        </button>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:shadow-lg transition-all font-medium whitespace-nowrap"
          style={{
            borderColor: activeFilterCount > 0 ? accentColorValue : undefined,
            color: activeFilterCount > 0 ? accentColorValue : undefined,
          }}
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
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Reset Filters Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-medium whitespace-nowrap"
          >
            Reset
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    "completed",
                    "rejected",
                  ] as Document["status"][]
                ).map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => onFilterChange("status", status)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 transition-all"
                      style={
                        {
                          accentColor: accentColorValue,
                          "--tw-ring-color": accentColorValue,
                        } as React.CSSProperties
                      }
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
                {(["low", "medium", "high"] as Document["priority"][]).map(
                  (priority) => (
                    <label
                      key={priority}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(priority)}
                        onChange={() => onFilterChange("priority", priority)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 transition-all"
                        style={
                          {
                            accentColor: accentColorValue,
                            "--tw-ring-color": accentColorValue,
                          } as React.CSSProperties
                        }
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
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
                style={
                  {
                    "--tw-ring-color": accentColorValue,
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = accentColorValue;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
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
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
                style={
                  {
                    "--tw-ring-color": accentColorValue,
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = accentColorValue;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

