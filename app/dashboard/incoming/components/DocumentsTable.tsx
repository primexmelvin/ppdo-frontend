"use client";

import { Document, DocumentFilters } from "../types";
import { getStatusColor, getPriorityColor } from "../utils/documentUtils";
import { useAccentColor } from "../../contexts/AccentColorContext";

interface DocumentsTableProps {
  documents: Document[];
  sortField: keyof Document | null;
  sortDirection: "asc" | "desc";
  startIndex: number;
  deleteConfirmId: string | null;
  onSort: (field: keyof Document) => void;
  onDelete: (documentId: string) => void;
  onConfirmDelete: (documentId: string) => void;
  onCancelDelete: () => void;
}

export function DocumentsTable({
  documents,
  sortField,
  sortDirection,
  startIndex,
  deleteConfirmId,
  onSort,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}: DocumentsTableProps) {
  const { accentColorValue } = useAccentColor();

  const SortIcon = ({ field }: { field: keyof Document }) => {
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
              <th className="px-4 sm:px-6 py-4 text-left w-16">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  No.
                </span>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <button
                  onClick={() => onSort("documentNumber")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Document Number
                  <SortIcon field="documentNumber" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Title
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <button
                  onClick={() => onSort("requester")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Requester
                  <SortIcon field="requester" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <button
                  onClick={() => onSort("dateSubmitted")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Date Submitted
                  <SortIcon field="dateSubmitted" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <button
                  onClick={() => onSort("priority")}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="px-4 sm:px-6 py-4 text-left">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {documents.length > 0 ? (
              documents.map((document, index) => (
                <tr
                  key={document.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {startIndex + index + 1}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 font-mono">
                      {document.documentNumber}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {document.title}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {document.requester}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {document.dateSubmitted}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        document.status
                      )}`}
                    >
                      {document.status.charAt(0).toUpperCase() +
                        document.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getPriorityColor(
                        document.priority
                      )}`}
                    >
                      {document.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {deleteConfirmId === document.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onConfirmDelete(document.id)}
                          className="px-2 py-1 text-xs font-medium rounded text-white transition-colors"
                          style={{ backgroundColor: accentColorValue }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={onCancelDelete}
                          className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onDelete(document.id)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4 text-red-600 dark:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 sm:px-6 py-12 text-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No documents found matching your search.
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
