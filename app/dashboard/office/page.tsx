// app/dashboard/office/page.tsx

"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAccentColor } from "../contexts/AccentColorContext"
import { ViewControls } from "./components/view-controls"
import { AddOfficeModal } from "./components/add-office-modal"
import { GalleryView } from "./components/gallery-view"
import { ListView } from "./components/list-view"
import type { Office, ViewType, SortBy } from "./types"
import { Plus, Search } from "lucide-react"

const DEFAULT_OFFICES: Office[] = [
  { code: "OPA", name: "Office of the Provincial Administrator", createdAt: "2024-01-15" },
  { code: "HRMO", name: "Provincial Human Resource Management Office", createdAt: "2024-01-14" },
  { code: "PCEDO", name: "Provincial Cooperative & Enterprise Dev't Office", createdAt: "2024-01-13" },
  { code: "PPDO", name: "Provincial Planning & Development Office", createdAt: "2024-01-12" },
  { code: "PTourO", name: "Provincial Tourism Office", createdAt: "2024-01-11" },
  { code: "PENRO", name: "Provincial Environment & Natural Resources Office", createdAt: "2024-01-10" },
  { code: "GSO", name: "Provincial General Services Office", createdAt: "2024-01-09" },
  { code: "PEPO", name: "Provincial Equipment Pool Office", createdAt: "2024-01-08" },
  { code: "PEO", name: "Provincial Engineering Office", createdAt: "2024-01-07" },
  { code: "PIO", name: "Provincial Information Office", createdAt: "2024-01-06" },
  { code: "PAgO", name: "Provincial Agriculture Office", createdAt: "2024-01-05" },
  { code: "PTreasO", name: "Provincial Treasury Office", createdAt: "2024-01-04" },
  { code: "PVO", name: "Provincial Veterinary Office", createdAt: "2024-01-03" },
  { code: "PACCO", name: "Provincial Accounting Office", createdAt: "2024-01-02" },
  { code: "PAssO", name: "Provincial Assessor's Office", createdAt: "2024-01-01" },
  { code: "PLO", name: "Provincial Legal Office", createdAt: "2023-12-31" },
  { code: "PSWDO", name: "Provincial Social Welfare & Development Office", createdAt: "2023-12-30" },
  { code: "TPH", name: "Tarlac Provincial Hospital", createdAt: "2023-12-29" },
  { code: "PHO", name: "Provincial Health Office", createdAt: "2023-12-28" },
]

const PINNED_OFFICES_KEY = "pinned-offices"
const VIEW_PREFERENCE_KEY = "view-preference"

export default function OfficePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [offices, setOffices] = useState<Office[]>(DEFAULT_OFFICES)
  const [pinnedCodes, setPinnedCodes] = useState<string[]>([])
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewType, setViewType] = useState<ViewType>("gallery")
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [showAddModal, setShowAddModal] = useState(false)
  const router = useRouter()
  const { accentColorValue } = useAccentColor()

  useEffect(() => {
    const auth = localStorage.getItem("authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      const saved = localStorage.getItem(PINNED_OFFICES_KEY)
      if (saved) {
        setPinnedCodes(JSON.parse(saved))
      }
      const savedView = localStorage.getItem(VIEW_PREFERENCE_KEY)
      if (savedView && (savedView === "gallery" || savedView === "list")) {
        setViewType(savedView)
      }
    } else {
      router.push("/")
    }
  }, [router])

  const officesWithFavorites = useMemo(() => {
    return offices.map((office) => ({
      ...office,
      isFavorite: pinnedCodes.includes(office.code),
    }))
  }, [offices, pinnedCodes])

  const processedOffices = useMemo(() => {
    const filtered = officesWithFavorites.filter((office) => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return office.name.toLowerCase().includes(query) || office.code.toLowerCase().includes(query)
    })

    const sorted = [...filtered].sort((a, b) => {
      const aIsPinned = pinnedCodes.includes(a.code)
      const bIsPinned = pinnedCodes.includes(b.code)

      if (aIsPinned && !bIsPinned) return -1
      if (!aIsPinned && bIsPinned) return 1

      switch (sortBy) {
        case "code":
          return a.code.localeCompare(b.code)
        case "date":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case "favorites":
          if (a.isFavorite === b.isFavorite) {
            return a.name.localeCompare(b.name)
          }
          return a.isFavorite ? -1 : 1
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [officesWithFavorites, searchQuery, sortBy, pinnedCodes])

  const handleToggleFavorite = (code: string) => {
    setPinnedCodes((prev) => {
      const isCurrentlyPinned = prev.includes(code)
      const updated = isCurrentlyPinned ? prev.filter((c) => c !== code) : [...prev, code]
      localStorage.setItem(PINNED_OFFICES_KEY, JSON.stringify(updated))

      const office = offices.find((o) => o.code === code)
      if (!isCurrentlyPinned) {
        toast.success(`"${office?.name}" pinned to top`)
        setHighlightedCode(code)
        setTimeout(() => setHighlightedCode(null), 1500)
      } else {
        toast.info(`"${office?.name}" unpinned`)
      }

      return updated
    })
  }

  const handleViewChange = (newView: ViewType) => {
    setViewType(newView)
    localStorage.setItem(VIEW_PREFERENCE_KEY, newView)
  }

  const handleAddOffice = async (newOffice: { code: string; name: string }) => {
    const response = await fetch("/api/offices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOffice),
    })

    const data = await response.json()

    if (data.success) {
      setOffices((prev) => [
        ...prev,
        {
          ...newOffice,
          createdAt: new Date().toISOString(),
          isFavorite: false,
        },
      ])
    } else {
      throw new Error(data.error || "Failed to add office")
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Offices</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage and organize all your office departments</p>
      </div>

      {/* Controls Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offices by name or code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>

        {/* View Controls */}
        <ViewControls viewType={viewType} onViewChange={handleViewChange} sortBy={sortBy} onSortChange={setSortBy} />

        {/* Add Office Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 font-medium whitespace-nowrap"
          style={{
            backgroundColor: accentColorValue,
          }}
        >
          <Plus size={18} />
          <span>Add Office</span>
        </button>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Found {processedOffices.length} office{processedOffices.length !== 1 ? "s" : ""}
          {processedOffices.length === 0 && " - Try a different search"}
        </div>
      )}

      {/* View Switch */}
      {processedOffices.length > 0 ? (
        viewType === "gallery" ? (
          <GalleryView 
            offices={processedOffices} 
            onToggleFavorite={handleToggleFavorite}
            highlightedCode={highlightedCode}
          />
        ) : (
          <ListView
            offices={processedOffices}
            onToggleFavorite={handleToggleFavorite}
            highlightedCode={highlightedCode}
          />
        )
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <Search size={32} className="text-zinc-400" />
          </div>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No offices found</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {searchQuery ? "Try adjusting your search terms" : "Get started by adding your first office"}
          </p>
        </div>
      )}

      {/* Add Office Modal */}
      <AddOfficeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddOffice}
        accentColor={accentColorValue}
      />
    </>
  )
}