"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Project } from "../../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";
import { Modal } from "../../components/Modal";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { ProjectForm } from "./ProjectForm";

interface ProjectsTableProps {
  projects: Project[];
  particularId: string;
  onAdd?: (project: Omit<Project, "id">) => void;
  onEdit?: (id: string, project: Omit<Project, "id">) => void;
  onDelete?: (id: string) => void;
}

export function ProjectsTable({
  projects,
  particularId,
  onAdd,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const { accentColorValue } = useAccentColor();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getUtilizationColor = (rate: number): string => {
    if (rate >= 80) return "text-red-600 dark:text-red-400";
    if (rate >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  const getAccomplishmentColor = (rate: number): string => {
    if (rate >= 80) return "text-green-600 dark:text-green-400";
    if (rate >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-zinc-600 dark:text-zinc-400";
  };

  const handleRowClick = (project: Project, e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("td:first-child")
    ) {
      return;
    }
    router.push(
      `/dashboard/budget/${encodeURIComponent(particularId)}/${encodeURIComponent(project.id)}`
    );
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleMenuToggle = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleSave = (formData: Omit<Project, "id">) => {
    if (selectedProject && onEdit) {
      onEdit(selectedProject.id, formData);
    } else if (onAdd) {
      onAdd(formData);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProject(null);
  };

  const handleConfirmDelete = () => {
    if (selectedProject && onDelete) {
      onDelete(selectedProject.id);
    }
    setSelectedProject(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals
  const totals = projects.reduce(
    (acc, project) => ({
      allocatedBudget: acc.allocatedBudget + project.allocatedBudget,
      revisedBudget: acc.revisedBudget + project.revisedBudget,
      balance: acc.balance + project.balance,
      utilizationRate:
        acc.utilizationRate + project.utilizationRate / projects.length,
      projectAccomplishment:
        acc.projectAccomplishment +
        project.projectAccomplishment / projects.length,
    }),
    {
      allocatedBudget: 0,
      revisedBudget: 0,
      balance: 0,
      utilizationRate: 0,
      projectAccomplishment: 0,
    }
  );

  const totalUtilizationRate = totals.utilizationRate;

  return (
    <>
      <div className="print-area bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header with Add Button and Print */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between no-print">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Projects
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
              title="Print"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </div>
            </button>
            {onAdd && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md text-white"
                style={{ backgroundColor: accentColorValue }}
              >
                Add New Project
              </button>
            )}
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print-only p-4 border-b border-zinc-900">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Projects</h2>
          <p className="text-sm text-zinc-700">
            Generated on: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              {(onEdit || onDelete) && (
                <th className="px-3 sm:px-4 py-3 text-center no-print">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    Actions
                  </span>
                </th>
              )}
              <th className="px-3 sm:px-4 py-3 text-left min-w-[200px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Project Name
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-left min-w-[150px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Implementing Office
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-right min-w-[120px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Allocated Budget
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-left min-w-[110px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Date Started
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-left min-w-[110px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Completion Date
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-right min-w-[120px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Revised Budget
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-right min-w-[110px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Utilization Rate (%)
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-right min-w-[110px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Balance
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-right min-w-[130px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Project Accomplishment (%)
                </span>
              </th>
              <th className="px-3 sm:px-4 py-3 text-left min-w-[150px]">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Remarks
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {projects.length > 0 ? (
              <>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={(e) => handleRowClick(project, e)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  >
                    {(onEdit || onDelete) && (
                      <td
                        className="px-3 sm:px-4 py-3 text-center no-print"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative" ref={(el) => { menuRefs.current[project.id] = el; }}>
                          <button
                            onClick={(e) => handleMenuToggle(project.id, e)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Actions"
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
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                          {openMenuId === project.id && (
                            <div className="absolute left-full ml-2 top-0 w-32 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50">
                              {onEdit && (
                                <button
                                  onClick={() => handleEdit(project)}
                                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => handleDelete(project)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                >
                                  <svg
                                    className="w-4 h-4"
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
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {project.projectName}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {project.implementingOffice}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(project.allocatedBudget)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {formatDate(project.dateStarted)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {formatDate(project.completionDate)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(project.revisedBudget)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span
                        className={`text-sm font-semibold ${getUtilizationColor(
                          project.utilizationRate
                        )}`}
                      >
                        {formatPercentage(project.utilizationRate)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(project.balance)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span
                        className={`text-sm font-medium ${getAccomplishmentColor(
                          project.projectAccomplishment
                        )}`}
                      >
                        {formatPercentage(project.projectAccomplishment)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {project.remarks || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="border-t-2 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 font-semibold">
                  {(onEdit || onDelete) && <td className="no-print"></td>}
                  <td className="px-3 sm:px-4 py-3" colSpan={2}>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">
                      TOTAL
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span
                      className="text-sm"
                      style={{ color: accentColorValue }}
                    >
                      {formatCurrency(totals.allocatedBudget)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3" colSpan={2}>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      -
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span
                      className="text-sm"
                      style={{ color: accentColorValue }}
                    >
                      {formatCurrency(totals.revisedBudget)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span
                      className={`text-sm ${getUtilizationColor(
                        totalUtilizationRate
                      )}`}
                    >
                      {formatPercentage(totalUtilizationRate)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span
                      className="text-sm"
                      style={{ color: accentColorValue }}
                    >
                      {formatCurrency(totals.balance)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span
                      className="text-sm"
                      style={{ color: accentColorValue }}
                    >
                      {formatPercentage(totals.projectAccomplishment)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      -
                    </span>
                  </td>
                  {(onEdit || onDelete) && <td className="no-print"></td>}
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan={onEdit || onDelete ? 10 : 10}
                  className="px-4 sm:px-6 py-12 text-center"
                >
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No projects found.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Project"
          size="xl"
        >
          <ProjectForm
            onSave={handleSave}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProject && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          title="Edit Project"
          size="xl"
        >
          <ProjectForm
            project={selectedProject}
            onSave={handleSave}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedProject(null);
            }}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${selectedProject.projectName}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
        />
      )}
    </>
  );
}
