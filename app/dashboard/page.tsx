"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KPICard } from "./components/KPICard";
import { LoginTrail } from "./components/LoginTrail";
import { PersonalKPICard } from "./components/PersonalKPICard";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Overview of system performance and activity
        </p>
      </div>

      {/* Dashboard and Personal KPI - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Dashboard KPI Cards */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KPICard
              title="Documents Processed"
              value={1247}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              trend={{ value: 15, isPositive: true }}
              subtitle="Today"
            />
            <KPICard
              title="Active Documents"
              value={8456}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              trend={{ value: 8, isPositive: true }}
              subtitle="In system"
            />
            <KPICard
              title="Pending Reviews"
              value={342}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              }
              trend={{ value: -5, isPositive: true }}
              subtitle="Awaiting approval"
            />
            <KPICard
              title="Archived This Month"
              value={2156}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              }
              trend={{ value: 12, isPositive: true }}
              subtitle="Total archived"
            />
          </div>
        </div>

        {/* Right Column - Personal Key Performance Indicator and Login Trail */}
        <div className="space-y-6">
          <div>
            <PersonalKPICard
              metrics={[
                {
                  title: "Productivity Score",
                  value: 87,
                  icon: (
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  subtitle: "Task completion rate",
                  color: "green",
                },
                {
                  title: "Quality Score",
                  value: 92,
                  icon: (
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  subtitle: "Work accuracy rate",
                  color: "blue",
                },
                {
                  title: "Timeliness Score",
                  value: 81,
                  icon: (
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  subtitle: "On-time completion",
                  color: "orange",
                },
                {
                  title: "Compliance Score",
                  value: 95,
                  icon: (
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  subtitle: "Policy adherence",
                  color: "green",
                },
              ]}
            />
          </div>
          <div>
            <LoginTrail />
          </div>
        </div>
      </div>
    </>
  );
}
