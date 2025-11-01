"use client";

import { useAccentColor } from "../../../contexts/AccentColorContext";

interface ConcernsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ConcernsSearch({
  searchQuery,
  onSearchChange,
}: ConcernsSearchProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div className="flex-1 w-full sm:w-auto">
      <div className="relative">
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
          placeholder="Search by tracking number, title, submitter, or location..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-colors"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = accentColorValue;
            e.currentTarget.style.setProperty(
              "--tw-ring-color",
              accentColorValue
            );
          }}
          onBlur={(e) => {
            if (!searchQuery) {
              e.currentTarget.style.borderColor = "";
            }
          }}
        />
      </div>
    </div>
  );
}

