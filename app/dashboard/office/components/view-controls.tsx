// app/dashboard/office/components/view-controls.tsx

"use client"

import { Grid3x3, List, ChevronDown } from "lucide-react"
import { SortBy, ViewType } from "../types"

interface ViewControlsProps {
  viewType: ViewType
  onViewChange: (view: ViewType) => void
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
}

export function ViewControls({ viewType, onViewChange, sortBy, onSortChange }: ViewControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* View Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => onViewChange("gallery")}
          className={`p-2 rounded-md transition-all ${
            viewType === "gallery" ? "bg-white dark:bg-zinc-800 shadow-sm" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
          title="Gallery View"
        >
          <Grid3x3 size={18} className="text-zinc-700 dark:text-zinc-300" />
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`p-2 rounded-md transition-all ${
            viewType === "list" ? "bg-white dark:bg-zinc-800 shadow-sm" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
          title="List View"
        >
          <List size={18} className="text-zinc-700 dark:text-zinc-300" />
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Sort:{" "}
          <span className="capitalize">
            {sortBy === "date"
              ? "Date Added"
              : sortBy === "code"
                ? "Code"
                : sortBy === "favorites"
                  ? "Favorites"
                  : "Name"}
          </span>
          <ChevronDown size={16} />
        </button>

        {/* Dropdown Menu */}
        <div className="absolute top-full left-0 mt-2 w-40 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          {(["name", "code", "date", "favorites"] as const).map((option) => (
            <button
              key={option}
              onClick={() => onSortChange(option)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                sortBy === option
                  ? "bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-400"
              }`}
            >
              {option === "date"
                ? "Date Added"
                : option === "code"
                  ? "Code"
                  : option === "favorites"
                    ? "Favorites"
                    : "Name"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
