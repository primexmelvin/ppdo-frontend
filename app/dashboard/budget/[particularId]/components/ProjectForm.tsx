"use client";

import { useState, useEffect } from "react";
import { Project } from "../../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Omit<Project, "id">) => void;
  onCancel: () => void;
}

export function ProjectForm({
  project,
  onSave,
  onCancel,
}: ProjectFormProps) {
  const { accentColorValue } = useAccentColor();
  const [formData, setFormData] = useState({
    projectName: project?.projectName || "",
    implementingOffice: project?.implementingOffice || "",
    allocatedBudget: project?.allocatedBudget || 0,
    dateStarted: project?.dateStarted || "",
    completionDate: project?.completionDate || "",
    revisedBudget: project?.revisedBudget || 0,
    utilizationRate: project?.utilizationRate || 0,
    balance: project?.balance || 0,
    projectAccomplishment: project?.projectAccomplishment || 0,
    remarks: project?.remarks || "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName,
        implementingOffice: project.implementingOffice,
        allocatedBudget: project.allocatedBudget,
        dateStarted: project.dateStarted,
        completionDate: project.completionDate,
        revisedBudget: project.revisedBudget,
        utilizationRate: project.utilizationRate,
        balance: project.balance,
        projectAccomplishment: project.projectAccomplishment,
        remarks: project.remarks,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Implementing Office
        </label>
        <input
          type="text"
          value={formData.implementingOffice}
          onChange={(e) =>
            setFormData({ ...formData, implementingOffice: e.target.value })
          }
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Allocated Budget
          </label>
          <input
            type="number"
            value={formData.allocatedBudget}
            onChange={(e) =>
              setFormData({
                ...formData,
                allocatedBudget: parseFloat(e.target.value) || 0,
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
            Revised Budget
          </label>
          <input
            type="number"
            value={formData.revisedBudget}
            onChange={(e) =>
              setFormData({
                ...formData,
                revisedBudget: parseFloat(e.target.value) || 0,
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
            Date Started
          </label>
          <input
            type="date"
            value={formData.dateStarted}
            onChange={(e) =>
              setFormData({ ...formData, dateStarted: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Completion Date
          </label>
          <input
            type="date"
            value={formData.completionDate}
            onChange={(e) =>
              setFormData({ ...formData, completionDate: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Utilization Rate (%)
          </label>
          <input
            type="number"
            value={formData.utilizationRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                utilizationRate: parseFloat(e.target.value) || 0,
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
            Balance
          </label>
          <input
            type="number"
            value={formData.balance}
            onChange={(e) =>
              setFormData({
                ...formData,
                balance: parseFloat(e.target.value) || 0,
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
            Project Accomplishment (%)
          </label>
          <input
            type="number"
            value={formData.projectAccomplishment}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectAccomplishment: parseFloat(e.target.value) || 0,
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

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Remarks
        </label>
        <textarea
          value={formData.remarks}
          onChange={(e) =>
            setFormData({ ...formData, remarks: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-0"
        />
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
          {project ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

