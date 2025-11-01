"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAccentColor } from "../../contexts/AccentColorContext";
import { Concern, Filters } from "./types";
import { mockConcerns } from "./data";
import { ConcernsSearch } from "./components/ConcernsSearch";
import { ConcernsFilters } from "./components/ConcernsFilters";
import { ConcernsTable } from "./components/ConcernsTable";
import { ConcernsPagination } from "./components/ConcernsPagination";
import { ConcernDetailModal } from "./components/ConcernDetailModal";

export default function EConcernPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Concern | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Filters>({
    category: [],
    status: [],
    priority: [],
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const handleSort = (field: keyof Concern) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string | string[]
  ) => {
    setFilters((prev) => {
      if (filterType === "dateFrom" || filterType === "dateTo") {
        return { ...prev, [filterType]: value as string };
      }
      const currentArray = prev[filterType] as string[];
      const newArray = Array.isArray(value)
        ? value
        : currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [filterType]: newArray };
    });
  };

  const filteredAndSortedConcerns = useMemo(() => {
    let filtered = concerns.filter((concern) => {
      // Text search
      const query = tableSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        concern.trackingNumber.toLowerCase().includes(query) ||
        concern.title.toLowerCase().includes(query) ||
        concern.submitterName.toLowerCase().includes(query) ||
        concern.location.toLowerCase().includes(query);

      // Category filter
      const matchesCategory =
        filters.category.length === 0 ||
        filters.category.includes(concern.category);

      // Status filter
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(concern.status);

      // Priority filter
      const matchesPriority =
        filters.priority.length === 0 ||
        filters.priority.includes(concern.priority);

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange =
          matchesDateRange && concern.dateSubmittedRaw >= fromDate;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange =
          matchesDateRange && concern.dateSubmittedRaw <= toDate;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority &&
        matchesDateRange
      );
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
  }, [concerns, tableSearchQuery, filters, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedConcerns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedConcerns = filteredAndSortedConcerns.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, tableSearchQuery, sortField, sortDirection]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.category.length +
      filters.status.length +
      filters.priority.length +
      (filters.dateFrom ? 1 : 0) +
      (filters.dateTo ? 1 : 0)
    );
  }, [filters]);

  const handleViewDetails = (concern: Concern) => {
    setSelectedConcern(concern);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = (
    concernId: string,
    newStatus: Concern["status"]
  ) => {
    setConcerns((prev) =>
      prev.map((concern) =>
        concern.id === concernId ? { ...concern, status: newStatus } : concern
      )
    );
    if (selectedConcern?.id === concernId) {
      setSelectedConcern({ ...selectedConcern, status: newStatus });
    }
  };

  const handleNotesUpdate = (concernId: string, notes: string) => {
    setConcerns((prev) =>
      prev.map((concern) =>
        concern.id === concernId ? { ...concern, notes } : concern
      )
    );
    if (selectedConcern?.id === concernId) {
      setSelectedConcern({ ...selectedConcern, notes });
    }
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
          E-Concern Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and respond to citizen concerns and feedback
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <ConcernsSearch
            searchQuery={tableSearchQuery}
            onSearchChange={setTableSearchQuery}
          />

          <ConcernsFilters
            filters={filters}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Concerns Table */}
      <div className="mb-6">
        <ConcernsTable
          concerns={paginatedConcerns}
          sortField={sortField}
          sortDirection={sortDirection}
          startIndex={startIndex}
          onSort={handleSort}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <ConcernsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAndSortedConcerns.length}
          itemsPerPage={itemsPerPage}
          activeFilterCount={activeFilterCount}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConcern && (
        <ConcernDetailModal
          concern={selectedConcern}
          onClose={() => setShowDetailModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onNotesUpdate={handleNotesUpdate}
        />
      )}
    </>
  );
}
