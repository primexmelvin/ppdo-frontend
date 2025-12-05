// app/dashboard/budget/[particularId]/[projectId]/components/FinancialBreakdownCard.tsx

"use client"

import { useState } from "react"
import {
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface FinancialBreakdownCardProps {
  code?: string
  description?: string
  appropriation?: number
  obligation?: number
  balance?: number
}

export function FinancialBreakdownCard({
  code = "A",
  description = "Crime Prevention and law enforcement activities",
  appropriation = 10200000,
  obligation = 950000,
  balance = 9250000,
}: FinancialBreakdownCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Calculate utilization rate
  const utilizationRate = appropriation > 0 
    ? ((obligation / appropriation) * 100).toFixed(2)
    : "0.00"

  const obligatedPercentage = ((obligation / appropriation) * 100).toFixed(1)
  const remainingPercentage = ((balance / appropriation) * 100).toFixed(1)

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-900"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 text-white text-xl font-semibold">
              {code}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">Financial Summary</h3>
              <Badge
                variant="secondary"
                className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
              >
                Budget Overview
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 transition-colors ${isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{description}</p>

        {/* Financial Details */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Appropriation
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ₱{appropriation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Obligation
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ₱{obligation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Balance
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ₱{balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Utilization Rate
            </p>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{utilizationRate}%</p>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(Number(utilizationRate), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Obligated: {obligatedPercentage}%</span>
          </div>

          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Remaining: {remainingPercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}