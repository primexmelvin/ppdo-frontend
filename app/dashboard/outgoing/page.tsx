"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearch } from "../contexts/SearchContext";
import { useAccentColor } from "../contexts/AccentColorContext";
import { outgoingCategories, CategoryCard } from "./data";

export default function OutgoingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localCategories, setLocalCategories] =
    useState<CategoryCard[]>(outgoingCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    count: 0,
  });
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();
  const { accentColorValue } = useAccentColor();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  // Filter categories based on search query
  const filteredCategories = localCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name.trim() === "") return;

    const categoryIcon = (
      <svg
        className="w-8 h-8"
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
    );

    const newCategoryCard: CategoryCard = {
      id: `new-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      count: newCategory.count,
      icon: categoryIcon,
    };

    setLocalCategories([...localCategories, newCategoryCard]);
    setNewCategory({ name: "", description: "", count: 0 });
    setShowAddModal(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Outgoing Documents
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and track outgoing documents by category
        </p>
      </div>

      {/* Search Bar and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all font-medium hover:shadow-lg text-white"
          style={{
            backgroundColor: accentColorValue,
            borderColor: accentColorValue,
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Cards Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={`/dashboard/outgoing/${category.id}`}
            className="
              bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6
              transition-all duration-200 cursor-pointer
              hover:shadow-lg hover:scale-[1.02]
              group aspect-square flex flex-col
            "
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
              e.currentTarget.style.backgroundColor = `${accentColorValue}08`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.backgroundColor = "";
            }}
          >
            {/* Icon and Count */}
            <div className="flex items-start justify-between mb-4 shrink-0">
              <div
                className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                style={{
                  backgroundColor: `${accentColorValue}10`,
                  color: accentColorValue,
                }}
              >
                {category.icon}
              </div>
              <div className="text-right">
                <p
                  className="text-3xl font-bold mb-1 text-zinc-900 dark:text-zinc-100 transition-colors"
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    color: accentColorValue,
                  }}
                >
                  {category.count}
                </p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                  Documents
                </p>
              </div>
            </div>

            {/* Category Name and Description */}
            <div className="flex-1 flex flex-col justify-between">
              <h3
                className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100 transition-colors"
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  color: accentColorValue,
                }}
              >
                {category.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  Add New Category
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="e.g., Official Letters"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the category"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Initial Count
                  </label>
                  <input
                    type="number"
                    value={newCategory.count}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        count: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={newCategory.name.trim() === ""}
                  className="flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{
                    backgroundColor:
                      newCategory.name.trim() === ""
                        ? "#9ca3af"
                        : accentColorValue,
                  }}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
