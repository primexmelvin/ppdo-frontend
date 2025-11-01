"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { useAccentColor } from "../../contexts/AccentColorContext";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";
import { outgoingCategories, CategoryCard } from "../data";

interface Document {
  id: string;
  documentNumber: string;
  title: string;
  recipient: string;
  dateIssued: string;
  dateIssuedRaw: Date;
  status: "draft" | "sent" | "delivered" | "acknowledged";
  priority: "low" | "medium" | "high";
}

interface Filters {
  status: string[];
  priority: string[];
  dateFrom: string;
  dateTo: string;
}

export default function CategoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;
  const { accentColorValue } = useAccentColor();
  const { setCustomBreadcrumbs } = useBreadcrumb();

  // Find category by ID
  const category = outgoingCategories.find((cat) => cat.id === categoryId);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  // Generate mock documents for category
  const generateMockDocuments = (category: CategoryCard): Document[] => {
    const documents: Document[] = [];
    const statuses: Document["status"][] = [
      "draft",
      "sent",
      "delivered",
      "acknowledged",
    ];
    const priorities: Document["priority"][] = ["low", "medium", "high"];
    const recipients = [
      "Provincial Office",
      "City Hall",
      "Barangay Office",
      "Department Head",
      "Mayor's Office",
      "Treasury Department",
      "Legal Department",
      "Administrative Office",
    ];

    for (let i = 1; i <= category.count && i <= 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      documents.push({
        id: `${category.id}-doc-${i}`,
        documentNumber: `${category.name
          .substring(0, 3)
          .toUpperCase()}-${String(i).padStart(4, "0")}-${date.getFullYear()}`,
        title: `${category.name} ${i}`,
        recipient: recipients[Math.floor(Math.random() * recipients.length)],
        dateIssued: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        dateIssuedRaw: date,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
      });
    }
    return documents;
  };

  // Initialize documents when category changes
  useEffect(() => {
    if (category) {
      setDocuments(generateMockDocuments(category));
    }
  }, [category]);

  // Filter and sort documents - must be called before conditional returns
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter((doc) => {
      // Text search
      const query = tableSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        doc.documentNumber.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.recipient.toLowerCase().includes(query) ||
        doc.status.toLowerCase().includes(query) ||
        doc.priority.toLowerCase().includes(query);

      // Status filter
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(doc.status);

      // Priority filter
      const matchesPriority =
        filters.priority.length === 0 ||
        filters.priority.includes(doc.priority);

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && doc.dateIssuedRaw >= fromDate;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && doc.dateIssuedRaw <= toDate;
      }

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesDateRange
      );
    });

    // Sort
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        // Handle date sorting
        if (sortField === "dateIssued") {
          aValue = a.dateIssuedRaw.getTime();
          bValue = b.dateIssuedRaw.getTime();
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

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedDocuments.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearchQuery, filters, sortField, sortDirection]);

  // Count active filters - must be called before conditional returns
  const activeFilterCount = useMemo(() => {
    return (
      filters.status.length +
      filters.priority.length +
      (filters.dateFrom ? 1 : 0) +
      (filters.dateTo ? 1 : 0)
    );
  }, [filters]);

  // Set breadcrumbs
  useEffect(() => {
    if (category) {
      setCustomBreadcrumbs([
        { label: "Home", href: "/dashboard" },
        { label: "Outgoing", href: "/dashboard/outgoing" },
        { label: category.name },
      ]);
    }

    return () => {
      setCustomBreadcrumbs(null);
    };
  }, [category, setCustomBreadcrumbs]);

  // Handle document deletion
  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    setDeleteConfirmId(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!category) {
    notFound();
  }

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
      case "acknowledged":
        return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400";
      case "delivered":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      case "sent":
        return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400";
      case "draft":
        return "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-400";
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

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          {category.name}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {category.description}
        </p>
      </div>

      {/* Table Search and Filters Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
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
                  {(
                    [
                      "draft",
                      "sent",
                      "delivered",
                      "acknowledged",
                    ] as Document["status"][]
                  ).map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer"
                    >
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
                        {status}
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
                  {(["low", "medium", "high"] as Document["priority"][]).map(
                    (priority) => (
                      <label
                        key={priority}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.priority.includes(priority)}
                          onChange={() =>
                            handleFilterChange("priority", priority)
                          }
                          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                          style={{
                            accentColor: accentColorValue,
                          }}
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                          {priority}
                        </span>
                      </label>
                    )
                  )}
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
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
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
                <th className="px-6 py-4 text-left w-16">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    No.
                  </span>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("documentNumber")}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Document Number
                    {sortField === "documentNumber" && (
                      <svg
                        className={`w-4 h-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: accentColorValue }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
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
                        className={`w-4 h-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: accentColorValue }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("recipient")}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Recipient
                    {sortField === "recipient" && (
                      <svg
                        className={`w-4 h-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: accentColorValue }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("dateIssued")}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Date Issued
                    {sortField === "dateIssued" && (
                      <svg
                        className={`w-4 h-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: accentColorValue }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
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
                        className={`w-4 h-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: accentColorValue }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
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
                        className={`w-4 h-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: accentColorValue }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {startIndex + index + 1}
                      </span>
                    </td>
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
                        {doc.recipient}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {doc.dateIssued}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                          doc.priority
                        )}`}
                      >
                        {doc.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {deleteConfirmId === doc.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors"
                            style={{ backgroundColor: "#ef4444" }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(doc.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                          title="Delete document"
                        >
                          <svg
                            className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300"
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
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Showing{" "}
                <span className="font-medium">
                  {paginatedDocuments.length > 0 ? startIndex + 1 : 0}-
                  {Math.min(endIndex, filteredAndSortedDocuments.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredAndSortedDocuments.length}
                </span>{" "}
                documents
                {activeFilterCount > 0 && (
                  <span className="ml-2">(Filtered)</span>
                )}
              </p>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-4 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                style={{
                  accentColor: accentColorValue,
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "text-white"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                        style={
                          currentPage === pageNum
                            ? { backgroundColor: accentColorValue }
                            : {}
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
