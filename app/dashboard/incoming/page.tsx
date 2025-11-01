"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearch } from "../contexts/SearchContext";
import { useAccentColor } from "../contexts/AccentColorContext";
import { incomingCategories, CategoryCard } from "./data";

export default function IncomingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localCategories, setLocalCategories] =
    useState<CategoryCard[]>(incomingCategories);
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

    // Use default document icon URL
    const defaultIconUrl =
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Kxv9xKKFv7t6qa6ee6DvtUeB4OkhrG.png&w=1000&q=75";

    const newCategoryCard: CategoryCard = {
      id: `new-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      count: newCategory.count,
      icon: defaultIconUrl,
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
      <div className="mb-4">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Incoming Documents
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and track incoming requests by category
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={`/dashboard/incoming/${category.id}`}
            className="group bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-8 hover:shadow-xl transition-all cursor-pointer"
            style={{
              borderColor: accentColorValue + "40",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = accentColorValue + "40";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden">
              <img
                src={category.icon}
                alt={category.name}
                className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 text-center">
              {category.name}
            </h3>
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
                    placeholder="e.g., Health Services"
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
