"use client";

import { Concern, categoryLabels, getStatusColor, getPriorityColor } from "../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";

interface ConcernsTableProps {
  concerns: Concern[];
  sortField: keyof Concern | null;
  sortDirection: "asc" | "desc";
  startIndex: number;
  onSort: (field: keyof Concern) => void;
  onViewDetails: (concern: Concern) => void;
}

export function ConcernsTable({
  concerns,
  sortField,
  sortDirection,
  startIndex,
  onSort,
  onViewDetails,
}: ConcernsTableProps) {
  const { accentColorValue } = useAccentColor();

  const SortIcon = ({ field }: { field: keyof Concern }) => {
    if (sortField !== field) return null;
    return (
      <svg
        className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: accentColorValue }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <th className="px-6 py-4 text-left w-16">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  No.
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("trackingNumber")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Tracking Number
                  <SortIcon field="trackingNumber" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("category")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Category
                  <SortIcon field="category" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Title
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("submitterName")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Submitter
                  <SortIcon field="submitterName" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("dateSubmitted")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Date Submitted
                  <SortIcon field="dateSubmitted" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("priority")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {concerns.length > 0 ? (
              concerns.map((concern, index) => (
                <tr
                  key={concern.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {startIndex + index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 font-mono">
                      {concern.trackingNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {categoryLabels[concern.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {concern.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {concern.submitterName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {concern.dateSubmitted}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        concern.status
                      )}`}
                    >
                      {concern.status.charAt(0).toUpperCase() +
                        concern.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getPriorityColor(
                        concern.priority
                      )}`}
                    >
                      {concern.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewDetails(concern)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                      style={{
                        backgroundColor: accentColorValue,
                        color: "white",
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No concerns found matching your search.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

