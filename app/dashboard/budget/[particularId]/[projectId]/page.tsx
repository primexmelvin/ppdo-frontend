"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FinancialBreakdownTable } from "./components/FinancialBreakdownTable";
import { getFinancialBreakdownByProject, getProjectById } from "./data";
import { FinancialBreakdownItem, Project } from "../../types";
import { getParticularFullName } from "../data";
import {
  updateItemInHierarchy,
  deleteItemFromHierarchy,
  addItemToHierarchy,
} from "./utils";

export default function ProjectFinancialBreakdownPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [financialBreakdown, setFinancialBreakdown] = useState<
    FinancialBreakdownItem[]
  >([]);
  const [project, setProject] = useState<Project | null>(null);
  const [particular, setParticular] = useState<string>("");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      const particularId = params.particularId as string;
      const projectId = params.projectId as string;

      if (particularId && projectId) {
        setParticular(particularId);
        // In production, fetch from API
        const breakdown = getFinancialBreakdownByProject(projectId);
        setFinancialBreakdown(breakdown);

        // In production, fetch project details from API
        const projectData = getProjectById(projectId, particularId);
        setProject(projectData);
      }
    } else {
      router.push("/");
    }
  }, [router, params]);

  const handleAdd = (item: Omit<FinancialBreakdownItem, "id" | "children">) => {
    // In production, call API
    // For now, add to root level (parentId: null)
    setFinancialBreakdown(addItemToHierarchy(financialBreakdown, null, item));
  };

  const handleEdit = (
    id: string,
    item: Omit<FinancialBreakdownItem, "id" | "children">
  ) => {
    // In production, call API
    setFinancialBreakdown(updateItemInHierarchy(financialBreakdown, id, item));
  };

  const handleDelete = (id: string) => {
    // In production, call API
    setFinancialBreakdown(deleteItemFromHierarchy(financialBreakdown, id));
  };

  if (!isAuthenticated) {
    return null;
  }

  const particularFullName = getParticularFullName(particular);

  return (
    <>
      {/* Back Button and Page Header */}
      <div className="mb-6 no-print">
        <Link
          href={`/dashboard/budget/${encodeURIComponent(particular)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to {particularFullName}
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          {project?.projectName || "Project Financial Breakdown"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {particularFullName} - Balances as of{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Summary Cards */}
      {project && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 no-print">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Allocated Budget
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(project.allocatedBudget)}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Revised Budget
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(project.revisedBudget)}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Utilization Rate
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {project.utilizationRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Project Accomplishment
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {project.projectAccomplishment.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Financial Breakdown Table */}
      <div className="mb-6">
        <FinancialBreakdownTable
          items={financialBreakdown}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
