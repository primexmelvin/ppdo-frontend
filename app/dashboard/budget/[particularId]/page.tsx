"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ProjectsTable } from "./components/ProjectsTable";
import { getProjectsByParticular, getParticularFullName } from "./data";
import { Project } from "../types";
import { useAccentColor } from "../../contexts/AccentColorContext";

export default function ParticularProjectsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [particular, setParticular] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const { accentColorValue } = useAccentColor();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      const particularId = params.particularId as string;
      if (particularId) {
        setParticular(particularId);
        // In production, fetch from API
        const fetchedProjects = getProjectsByParticular(particularId as any);
        setProjects(fetchedProjects);
      }
    } else {
      router.push("/");
    }
  }, [router, params]);

  if (!isAuthenticated) {
    return null;
  }

  const particularFullName = getParticularFullName(particular);

  return (
    <>
      {/* Back Button and Page Header */}
      <div className="mb-6 no-print">
        <Link
          href="/dashboard/budget"
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
          Back to Budget Tracking
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          {particularFullName}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Detailed project tracking and budget utilization
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 no-print">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Total Allocated Budget
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(
              projects.reduce(
                (sum, project) => sum + project.allocatedBudget,
                0
              )
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Total Revised Budget
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(
              projects.reduce((sum, project) => sum + project.revisedBudget, 0)
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Average Utilization Rate
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {projects.length > 0
              ? (
                  projects.reduce(
                    (sum, project) => sum + project.utilizationRate,
                    0
                  ) / projects.length
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Total Projects
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {projects.length}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="mb-6">
        <ProjectsTable
          projects={projects}
          particularId={particular}
          onAdd={(project) => {
            const newProject: Project = {
              ...project,
              id: Date.now().toString(),
            };
            setProjects([...projects, newProject]);
          }}
          onEdit={(id, project) => {
            setProjects(
              projects.map((p) => (p.id === id ? { ...project, id } : p))
            );
          }}
          onDelete={(id) => {
            setProjects(projects.filter((p) => p.id !== id));
          }}
        />
      </div>
    </>
  );
}
