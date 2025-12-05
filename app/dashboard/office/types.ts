// app/dashboard/office/types.ts

export interface Office {
  code: string
  name: string
  createdAt?: string
  isFavorite?: boolean
}

export type ViewType = "list" | "gallery"
export type SortBy = "name" | "code" | "date" | "favorites"
