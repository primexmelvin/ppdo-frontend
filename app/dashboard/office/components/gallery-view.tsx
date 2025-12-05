// app/dashboard/office/components/gallery-view.tsx

"use client"

import Link from "next/link"
import type { Office } from "../types"
import { Pin } from "lucide-react"

interface GalleryViewProps {
  offices: Office[]
  onToggleFavorite: (code: string) => void
  highlightedCode?: string | null
}

export function GalleryView({ offices, onToggleFavorite, highlightedCode }: GalleryViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {offices.map((office) => (
        <div
          key={office.code}
          className="relative group"
          style={
            highlightedCode === office.code
              ? {
                  animation: "pulse-outline 1.5s ease-in-out forwards",
                  outline: "3px solid rgb(250, 204, 21)",
                  outlineOffset: "2px",
                  borderRadius: "0.5rem",
                }
              : {}
          }
        >
          <button
            onClick={() => onToggleFavorite(office.code)}
            className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 transition-all ${
              office.isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            title={office.isFavorite ? "Remove from favorites" : "Pin to favorites"}
          >
            <Pin size={16} className={office.isFavorite ? "fill-amber-500 text-amber-500" : "text-zinc-400"} />
          </button>

          <Link
            href={`/dashboard/office/${office.code.toLowerCase()}`}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-200 cursor-pointer ${
              office.isFavorite ? "bg-zinc-100 dark:bg-zinc-900" : ""
            }`}
          >
            {/* Avatar Circle with 2 Letters */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-2xl shadow-md group-hover:shadow-lg transition-all"
                style={{
                  backgroundColor: `hsl(${(office.code.charCodeAt(0) * 137.5) % 360}, 65%, 55%)`,
                }}
              >
                {office.code.slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Office Name */}
            <div className="w-full text-center">
              <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                {office.name}
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1">{office.code}</p>
            </div>
          </Link>
        </div>
      ))}

      <style>{`
        @keyframes pulse-outline {
          0% {
            outline: 3px solid rgb(250, 204, 21);
            outline-offset: 2px;
          }
          50% {
            outline: 3px solid rgb(250, 204, 21);
            outline-offset: 2px;
          }
          100% {
            outline: 3px solid transparent;
            outline-offset: 2px;
          }
        }
      `}</style>
    </div>
  )
}