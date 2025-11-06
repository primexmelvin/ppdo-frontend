"use client";

import { useState, useEffect } from "react";
import { BudgetItem, BUDGET_PARTICULARS } from "../types";
import { useAccentColor } from "../../contexts/AccentColorContext";

interface BudgetItemFormProps {
  item?: BudgetItem | null;
  onSave: (item: Omit<BudgetItem, "id">) => void;
  onCancel: () => void;
}

export function BudgetItemForm({
  item,
  onSave,
  onCancel,
}: BudgetItemFormProps) {
  const { accentColorValue } = useAccentColor();
  const [formData, setFormData] = useState({
    particular: item?.particular || "",
    totalBudgetAllocated: item?.totalBudgetAllocated || 0,
    totalBudgetUtilized: item?.totalBudgetUtilized || 0,
    projectCompleted: item?.projectCompleted || 0,
    projectDelayed: item?.projectDelayed || 0,
    projectsOnTrack: item?.projectsOnTrack || 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        particular: item.particular,
        totalBudgetAllocated: item.totalBudgetAllocated,
        totalBudgetUtilized: item.totalBudgetUtilized,
        projectCompleted: item.projectCompleted,
        projectDelayed: item.projectDelayed,
        projectsOnTrack: item.projectsOnTrack,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const utilizationRate =
      formData.totalBudgetAllocated > 0
        ? (formData.totalBudgetUtilized / formData.totalBudgetAllocated) * 100
        : 0;
    onSave({
      ...formData,
      utilizationRate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Particular
        </label>
        <select
          value={formData.particular}
          onChange={(e) =>
            setFormData({ ...formData, particular: e.target.value })
          }
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
          required
          disabled={!!item}
        >
          <option value="">Select Particular</option>
          {BUDGET_PARTICULARS.map((part) => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Total Budget Allocated
          </label>
          <input
            type="number"
            value={formData.totalBudgetAllocated}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalBudgetAllocated: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Total Budget Utilized
          </label>
          <input
            type="number"
            value={formData.totalBudgetUtilized}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalBudgetUtilized: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Project Completed (%)
          </label>
          <input
            type="number"
            value={formData.projectCompleted}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectCompleted: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Project Delayed (%)
          </label>
          <input
            type="number"
            value={formData.projectDelayed}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectDelayed: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Projects On Track (%)
          </label>
          <input
            type="number"
            value={formData.projectsOnTrack}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectsOnTrack: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md text-white"
          style={{ backgroundColor: accentColorValue }}
        >
          {item ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

