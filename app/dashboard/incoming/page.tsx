"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "../contexts/SearchContext";
import { useAccentColor } from "../contexts/AccentColorContext";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";

interface CategoryCard {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: React.ReactNode;
}

interface Document {
  id: string;
  documentNumber: string;
  title: string;
  requester: string;
  dateSubmitted: string;
  dateSubmittedRaw: Date;
  status: "pending" | "in-progress" | "completed" | "rejected";
  priority: "low" | "medium" | "high";
}

interface Filters {
  status: string[];
  priority: string[];
  dateFrom: string;
  dateTo: string;
}

const categories: CategoryCard[] = [
  {
    id: "social-service",
    name: "Social Service",
    description: "Community support and welfare services",
    count: 124,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "barangay-affairs",
    name: "Barangay Affairs",
    description: "Local governance and community matters",
    count: 89,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "financial-assistance",
    name: "Financial Assistance",
    description: "Financial aid and support requests",
    count: 156,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "use-of-facilities",
    name: "Use of Facilities",
    description: "Requests for facility usage",
    count: 67,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "use-of-vehicle",
    name: "Use of Vehicle and Ambulance",
    description: "Transportation and ambulance requests",
    count: 43,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "appointment-meeting",
    name: "Appointment/Meeting",
    description: "Scheduling and meeting requests",
    count: 92,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "other-request",
    name: "Other Request",
    description: "Miscellaneous requests and inquiries",
    count: 38,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function IncomingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localCategories, setLocalCategories] = useState<CategoryCard[]>(categories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryCard | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Document | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Filters>({
    status: [],
    priority: [],
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    count: 0,
  });
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();
  const { accentColorValue } = useAccentColor();
  const { setCustomBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  // Update breadcrumbs when category is selected
  useEffect(() => {
    if (selectedCategory) {
      setCustomBreadcrumbs([
        { label: "Home", href: "/dashboard" },
        { label: "Incoming", href: "/dashboard/incoming" },
        { label: selectedCategory.name },
      ]);
    } else {
      setCustomBreadcrumbs(null);
    }
    
    // Cleanup on unmount
    return () => {
      setCustomBreadcrumbs(null);
    };
  }, [selectedCategory, setCustomBreadcrumbs]);

  // Filter categories based on search query
  const filteredCategories = localCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate mock documents for selected category
  const generateMockDocuments = (category: CategoryCard): Document[] => {
    const documents: Document[] = [];
    const statuses: Document["status"][] = ["pending", "in-progress", "completed", "rejected"];
    const priorities: Document["priority"][] = ["low", "medium", "high"];
    const names = ["Juan Dela Cruz", "Maria Santos", "Jose Rizal", "Ana Garcia", "Carlos Mendoza", "Liza Rodriguez", "Pedro Martinez", "Sofia Torres"];

    for (let i = 1; i <= category.count && i <= 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      documents.push({
        id: `${category.id}-doc-${i}`,
        documentNumber: `${category.name.substring(0, 3).toUpperCase()}-${String(i).padStart(4, "0")}-${date.getFullYear()}`,
        title: `${category.name} Request ${i}`,
        requester: names[Math.floor(Math.random() * names.length)],
        dateSubmitted: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        dateSubmittedRaw: date,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
      });
    }
    return documents;
  };

  // Get documents for selected category
  const documents = useMemo(() => {
    if (!selectedCategory) return [];
    return generateMockDocuments(selectedCategory);
  }, [selectedCategory]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter((doc) => {
      // Text search
      const query = tableSearchQuery.toLowerCase();
      const matchesSearch = 
        !query ||
        doc.documentNumber.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.requester.toLowerCase().includes(query) ||
        doc.status.toLowerCase().includes(query) ||
        doc.priority.toLowerCase().includes(query);

      // Status filter
      const matchesStatus = 
        filters.status.length === 0 || 
        filters.status.includes(doc.status);

      // Priority filter
      const matchesPriority = 
        filters.priority.length === 0 || 
        filters.priority.includes(doc.priority);

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && doc.dateSubmittedRaw >= fromDate;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && doc.dateSubmittedRaw <= toDate;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDateRange;
    });

    // Sort
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];
        
        // Handle date sorting
        if (sortField === "dateSubmitted") {
          aValue = a.dateSubmittedRaw.getTime();
          bValue = b.dateSubmittedRaw.getTime();
        }
        
        let comparison = 0;
        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else {
          comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
        
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [documents, tableSearchQuery, filters, sortField, sortDirection]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return (
      filters.status.length +
      filters.priority.length +
      (filters.dateFrom ? 1 : 0) +
      (filters.dateTo ? 1 : 0)
    );
  }, [filters]);

  const handleFilterChange = (type: keyof Filters, value: any) => {
    if (type === "status" || type === "priority") {
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      priority: [],
      dateFrom: "",
      dateTo: "",
    });
    setTableSearchQuery("");
  };

  const handleSort = (field: keyof Document) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400";
      case "in-progress":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400";
      case "rejected":
        return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
      default:
        return "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-400";
    }
  };

  const getPriorityColor = (priority: Document["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
      case "medium":
        return "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400";
      case "low":
        return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400";
      default:
        return "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-400";
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim() === "") return;

    const categoryIcon = (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

  // If category is selected, show table view
  if (selectedCategory) {
    return (
      <>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            {selectedCategory.name}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {selectedCategory.description}
          </p>
        </div>

        {/* Table Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
              />
            </div>

            {/* Add Document Button */}
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium whitespace-nowrap transition-all hover:shadow-lg text-white"
              style={{
                backgroundColor: accentColorValue,
                borderColor: accentColorValue,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Document</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:shadow-lg transition-all font-medium whitespace-nowrap"
              style={{
                borderColor: activeFilterCount > 0 ? accentColorValue : undefined,
                color: activeFilterCount > 0 ? accentColorValue : undefined,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Reset Filters Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-medium whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {(["pending", "in-progress", "completed", "rejected"] as Document["status"][]).map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={() => handleFilterChange("status", status)}
                          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                          style={{
                            accentColor: accentColorValue,
                          }}
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                          {status.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Priority
                  </label>
                  <div className="space-y-2">
                    {(["low", "medium", "high"] as Document["priority"][]).map((priority) => (
                      <label key={priority} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.priority.includes(priority)}
                          onChange={() => handleFilterChange("priority", priority)}
                          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                          style={{
                            accentColor: accentColorValue,
                          }}
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("documentNumber")}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Document Number
                      {sortField === "documentNumber" && (
                        <svg
                          className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: accentColorValue }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Title
                      {sortField === "title" && (
                        <svg
                          className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: accentColorValue }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("requester")}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Requester
                      {sortField === "requester" && (
                        <svg
                          className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: accentColorValue }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("dateSubmitted")}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Date Submitted
                      {sortField === "dateSubmitted" && (
                        <svg
                          className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: accentColorValue }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Status
                      {sortField === "status" && (
                        <svg
                          className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: accentColorValue }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("priority")}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Priority
                      {sortField === "priority" && (
                        <svg
                          className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: accentColorValue }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredAndSortedDocuments.length > 0 ? (
                  filteredAndSortedDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {doc.documentNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {doc.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {doc.requester}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {doc.dateSubmitted}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}
                        >
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(doc.priority)}`}
                        >
                          {doc.priority}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No documents found matching your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing <span className="font-medium">{filteredAndSortedDocuments.length}</span> of{" "}
              <span className="font-medium">{documents.length}</span> documents
              {activeFilterCount > 0 && (
                <span className="ml-2">
                  (Filtered)
                </span>
              )}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Incoming Documents
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and track incoming requests by category
        </p>
      </div>

      {/* Search Bar and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:shadow-lg transition-all font-medium"
          style={{
            borderColor: accentColorValue,
            color: accentColorValue,
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Cards Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="
              bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6
              transition-all duration-200 cursor-pointer
              hover:shadow-lg hover:scale-[1.02]
              group aspect-square flex flex-col
            "
            style={{
              hover: {
                borderColor: accentColorValue,
                backgroundColor: `${accentColorValue}08`,
              },
            }}
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
            <div className="flex items-start justify-between mb-4 flex-shrink-0">
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
          </div>
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

