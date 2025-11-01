"use client";

import { Concern, categoryLabels, getPriorityColor } from "../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";

interface ConcernDetailModalProps {
  concern: Concern;
  onClose: () => void;
  onStatusUpdate: (concernId: string, newStatus: Concern["status"]) => void;
  onNotesUpdate: (concernId: string, notes: string) => void;
}

export function ConcernDetailModal({
  concern,
  onClose,
  onStatusUpdate,
  onNotesUpdate,
}: ConcernDetailModalProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {concern.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                {concern.trackingNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Category
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {categoryLabels[concern.category]}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      value={concern.status}
                      onChange={(e) =>
                        onStatusUpdate(
                          concern.id,
                          e.target.value as Concern["status"]
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
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
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Priority
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getPriorityColor(
                        concern.priority
                      )}`}
                    >
                      {concern.priority}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Date Submitted
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.dateSubmitted}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Description
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {concern.description}
              </p>
            </div>

            {/* Submitter Information */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Submitter Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.submitterName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.submitterEmail}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Phone
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.submitterPhone}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Location
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Assignment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Department
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.assignedDepartment}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Assigned To
                  </label>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {concern.assignedTo}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Notes
              </h3>
              <textarea
                value={concern.notes}
                onChange={(e) => onNotesUpdate(concern.id, e.target.value)}
                placeholder="Add notes or updates about this concern..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 resize-none transition-all"
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

          {/* Modal Footer */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: accentColorValue }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

