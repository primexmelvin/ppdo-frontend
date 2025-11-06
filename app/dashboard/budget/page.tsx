"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BudgetTrackingTable } from "./components/BudgetTrackingTable";
import { mockBudgetData } from "./data";
import { BudgetItem } from "./types";

export default function BudgetTrackingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      // In production, fetch from API
      setBudgetData(mockBudgetData);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleAdd = (item: Omit<BudgetItem, "id">) => {
    // In production, call API
    const newItem: BudgetItem = {
      ...item,
      id: Date.now().toString(),
    };
    setBudgetData([...budgetData, newItem]);
  };

  const handleEdit = (id: string, item: Omit<BudgetItem, "id">) => {
    // In production, call API
    setBudgetData(
      budgetData.map((budgetItem) =>
        budgetItem.id === id ? { ...item, id } : budgetItem
      )
    );
  };

  const handleDelete = (id: string) => {
    // In production, call API
    setBudgetData(budgetData.filter((item) => item.id !== id));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 no-print">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Budget Tracking
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Monitor budget allocation, utilization, and project status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 no-print">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Total Budget Allocated
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(
              budgetData.reduce(
                (sum, item) => sum + item.totalBudgetAllocated,
                0
              )
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Total Budget Utilized
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(
              budgetData.reduce(
                (sum, item) => sum + item.totalBudgetUtilized,
                0
              )
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Average Utilization Rate
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {budgetData.length > 0
              ? (
                  budgetData.reduce(
                    (sum, item) => sum + item.utilizationRate,
                    0
                  ) / budgetData.length
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
            {budgetData.length}
          </p>
        </div>
      </div>

      {/* Budget Tracking Table */}
      <div className="mb-6">
        <BudgetTrackingTable
          budgetItems={budgetData}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
