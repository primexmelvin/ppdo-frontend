// app/dashboard/office/components/add-office-modal.tsx

"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

interface AddOfficeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (office: { code: string; name: string }) => Promise<void>
  accentColor: string
}

export function AddOfficeModal({ isOpen, onClose, onAdd, accentColor }: AddOfficeModalProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim()) {
      setError("Please fill in both code and name")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await onAdd({ code: code.trim().toUpperCase(), name: name.trim() })
      setCode("")
      setName("")
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add office")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Plus size={20} style={{ color: accentColor }} />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Add New Office</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Office Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., OPA, HRMO"
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Office Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full office name"
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim() || !name.trim()}
            className="flex-1 px-4 py-2 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 font-medium"
            style={{
              backgroundColor: accentColor,
            }}
          >
            {isSubmitting ? "Adding..." : "Add Office"}
          </button>
        </div>
      </div>
    </div>
  )
}
