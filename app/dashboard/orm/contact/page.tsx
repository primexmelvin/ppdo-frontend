"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccentColor } from "../../contexts/AccentColorContext";

interface SIMCard {
  id: string;
  phoneNumber: string;
  carrier: string;
  smsCredit: number;
  smsCreditUnit: "credits" | "messages";
  callCredit: number;
  callCreditUnit: "credits" | "minutes" | "pesos";
  status: "active" | "low" | "critical" | "inactive";
  lastUpdated: Date;
}

const mockSIMCards: SIMCard[] = [
  {
    id: "sim-1",
    phoneNumber: "+63 917 123 4567",
    carrier: "Smart Communications",
    smsCredit: 1250,
    smsCreditUnit: "messages",
    callCredit: 450,
    callCreditUnit: "minutes",
    status: "active",
    lastUpdated: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "sim-2",
    phoneNumber: "+63 918 234 5678",
    carrier: "Globe Telecom",
    smsCredit: 320,
    smsCreditUnit: "messages",
    callCredit: 125,
    callCreditUnit: "minutes",
    status: "low",
    lastUpdated: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: "sim-3",
    phoneNumber: "+63 919 345 6789",
    carrier: "Smart Communications",
    smsCredit: 50,
    smsCreditUnit: "messages",
    callCredit: 15,
    callCreditUnit: "minutes",
    status: "critical",
    lastUpdated: new Date(Date.now() - 1800000), // 30 minutes ago
  },
  {
    id: "sim-4",
    phoneNumber: "+63 920 456 7890",
    carrier: "Globe Telecom",
    smsCredit: 2100,
    smsCreditUnit: "messages",
    callCredit: 890,
    callCreditUnit: "minutes",
    status: "active",
    lastUpdated: new Date(Date.now() - 900000), // 15 minutes ago
  },
  {
    id: "sim-5",
    phoneNumber: "+63 921 567 8901",
    carrier: "Smart Communications",
    smsCredit: 0,
    smsCreditUnit: "messages",
    callCredit: 0,
    callCreditUnit: "minutes",
    status: "inactive",
    lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "sim-6",
    phoneNumber: "+63 922 678 9012",
    carrier: "Globe Telecom",
    smsCredit: 1850,
    smsCreditUnit: "messages",
    callCredit: 650,
    callCreditUnit: "minutes",
    status: "active",
    lastUpdated: new Date(Date.now() - 600000), // 10 minutes ago
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getStatusColor(status: SIMCard["status"]): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "active":
      return {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
      };
    case "low":
      return {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
      };
    case "critical":
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
      };
    case "inactive":
      return {
        bg: "bg-zinc-50 dark:bg-zinc-900/50",
        text: "text-zinc-500 dark:text-zinc-500",
        border: "border-zinc-200 dark:border-zinc-800",
      };
  }
}

function getCreditColor(credit: number, status: SIMCard["status"]): string {
  if (status === "inactive") return "text-zinc-400 dark:text-zinc-600";
  if (status === "critical") return "text-red-600 dark:text-red-400";
  if (status === "low") return "text-yellow-600 dark:text-yellow-400";
  return "text-zinc-900 dark:text-zinc-100";
}

export default function ContactPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [simCards, setSimCards] = useState<SIMCard[]>(mockSIMCards);
  const router = useRouter();
  const { accentColorValue } = useAccentColor();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  // Simulate real-time updates (in production, this would come from API)
  useEffect(() => {
    const interval = setInterval(() => {
      setSimCards((prev) =>
        prev.map((sim) => ({
          ...sim,
          lastUpdated: new Date(),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const totalSMSCredit = simCards.reduce(
    (sum, sim) => sum + sim.smsCredit,
    0
  );
  const totalCallCredit = simCards.reduce(
    (sum, sim) => sum + sim.callCredit,
    0
  );
  const activeCards = simCards.filter((sim) => sim.status === "active").length;

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Contact System
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Monitor and manage SIM card credits for SMS and call services
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total SMS Credit */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${accentColorValue}15` }}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: accentColorValue }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Total SMS
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalSMSCredit.toLocaleString()}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              messages
            </span>
          </div>
        </div>

        {/* Total Call Credit */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${accentColorValue}15` }}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: accentColorValue }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Total Call
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalCallCredit.toLocaleString()}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              minutes
            </span>
          </div>
        </div>

        {/* Active Cards */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${accentColorValue}15` }}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: accentColorValue }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Active SIMs
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {activeCards}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              of {simCards.length}
            </span>
          </div>
        </div>
      </div>

      {/* SIM Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simCards.map((sim) => {
          const statusColors = getStatusColor(sim.status);
          return (
            <div
              key={sim.id}
              className={`bg-white dark:bg-zinc-900 rounded-xl border-2 p-6 transition-all hover:shadow-lg ${statusColors.border} ${statusColors.bg}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {sim.phoneNumber}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {sim.carrier}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors.text}`}
                  style={{
                    backgroundColor: `${statusColors.text}15`,
                  }}
                >
                  {sim.status}
                </span>
              </div>

              {/* Credits */}
              <div className="space-y-4 mb-4">
                {/* SMS Credit */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        SMS Credit
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${getCreditColor(
                        sim.smsCredit,
                        sim.status
                      )}`}
                    >
                      {sim.smsCredit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (sim.smsCredit / 2000) * 100)}%`,
                        backgroundColor:
                          sim.status === "critical"
                            ? "#ef4444"
                            : sim.status === "low"
                            ? "#f59e0b"
                            : accentColorValue,
                      }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    {sim.smsCreditUnit}
                  </p>
                </div>

                {/* Call Credit */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Call Credit
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${getCreditColor(
                        sim.callCredit,
                        sim.status
                      )}`}
                    >
                      {sim.callCredit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (sim.callCredit / 1000) * 100)}%`,
                        backgroundColor:
                          sim.status === "critical"
                            ? "#ef4444"
                            : sim.status === "low"
                            ? "#f59e0b"
                            : accentColorValue,
                      }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    {sim.callCreditUnit}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Last updated
                  </span>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {formatTimeAgo(sim.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
