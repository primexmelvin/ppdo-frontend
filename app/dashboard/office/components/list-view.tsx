// app/dashboard/office/components/list-view.tsx

"use client"

import Link from "next/link"
import type { Office } from "../types"
import { Pin, ChevronRight } from "lucide-react"

interface ListViewProps {
  offices: Office[]
  onToggleFavorite: (code: string) => void
  highlightedCode?: string | null
}

export function ListView({ offices, onToggleFavorite, highlightedCode }: ListViewProps) {
  return (
    <div className="space-y-2">
      {offices.map((office) => (
        <Link
          key={office.code}
          href={`/dashboard/office/${office.code.toLowerCase()}`}
          style={
            highlightedCode === office.code
              ? {
                  animation: "pulse-outline 1.5s ease-in-out forwards",
                  outline: "3px solid rgb(250, 204, 21)",
                  outlineOffset: "2px",
                }
              : {}
          }
          className={`flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 group ${
            office.isFavorite ? "bg-zinc-100 dark:bg-zinc-900" : ""
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Folder Icon Mini */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 7C3 5.34315 4.34315 4 6 4H12L14 7H21C22.6569 7 24 8.34315 24 10V20C24 21.6569 22.6569 23 21 23H3C1.34315 23 0 21.6569 0 20V7Z"
                  className="fill-yellow-400 dark:fill-yellow-500"
                />
              </svg>
            </div>

            {/* Office Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{office.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Code: {office.code}</p>
              {office.createdAt && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(office.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(office.code)
              }}
              className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title={office.isFavorite ? "Remove from favorites" : "Pin to favorites"}
            >
              <Pin size={16} className={office.isFavorite ? "fill-amber-500 text-amber-500" : "text-zinc-400"} />
            </button>
            <ChevronRight
              size={20}
              className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
            />
          </div>
        </Link>
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
