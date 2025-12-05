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
            {/* Folder Icon - Windows Style */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg
                className="w-full h-full drop-shadow-md"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 48C10.3431 48 9 46.6569 9 45V16C9 14.3431 10.3431 13 12 13H26L28 17H52C53.6569 17 55 18.3431 55 20V45C55 46.6569 53.6569 48 52 48H12Z"
                  className="fill-black/10 translate-x-0.5 translate-y-0.5"
                />
                <path
                  d="M8 44C8 45.6569 9.34315 47 11 47H50C51.6569 47 53 45.6569 53 44V19C53 17.3431 51.6569 16 50 16H26L24 12H11C9.34315 12 8 13.3431 8 15V44Z"
                  className="fill-yellow-400 dark:fill-yellow-500 group-hover:fill-yellow-500 dark:group-hover:fill-yellow-400 transition-colors"
                />
                <path
                  d="M8 15C8 13.3431 9.34315 12 11 12H26L28 16H50C51.6569 16 53 17.3431 53 19V21H8V15Z"
                  className="fill-yellow-300 dark:fill-yellow-600 group-hover:fill-yellow-400 dark:group-hover:fill-yellow-500 transition-colors"
                />
                <path
                  d="M11 12H26L28 16H50C51.6569 16 53 17.3431 53 19V20H8V15C8 13.3431 9.34315 12 11 12Z"
                  className="fill-white/30"
                />
                <path
                  d="M8 15V44C8 45.6569 9.34315 47 11 47H12V15C12 13.3431 10.6569 12 9 12H8V15Z"
                  className="fill-white/20"
                />
                <path
                  d="M11 46H50C51.6569 46 53 44.6569 53 43V44C53 45.6569 51.6569 47 50 47H11C9.34315 47 8 45.6569 8 44V43C8 44.6569 9.34315 46 11 46Z"
                  className="fill-black/15"
                />
              </svg>
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