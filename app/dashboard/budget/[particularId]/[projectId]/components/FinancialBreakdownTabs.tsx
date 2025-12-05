"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type React from "react"
import { useState, useEffect, type ReactNode } from "react"

// --- Interfaces & Types ---
interface FinancialBreakdownItem {
  id: string
  code?: string
  description: string
  appropriation: number
  obligation: number
  balance: number
  level: number
  children?: FinancialBreakdownItem[]
}

interface StatCardProps {
  label: string
  amount: number
}

interface TransactionCardProps {
  amount: number
  name: string
  email: string
  type: string
}

interface StatItem {
  label: string
  amount: number
}

interface CardProps {
  children: ReactNode
  className?: string
}

interface BarChartItemProps {
  label: string
  value: number
  color: string
  isDashed?: boolean
}

interface OverviewContentProps {
  stats: StatItem[]
  transactions: TransactionCardProps[]
}

interface InspectionContentProps {
  data: FinancialBreakdownItem[]
}

interface ActivityItemProps {
  id: string
  title: string
  category: string
  timestamp: string
  thumbnail: string
  views: string
}

interface NewInspectionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: InspectionFormData) => void
}

interface InspectionFormData {
  programNumber: string
  title: string
  date: string
  remarks: string
  images: File[]
}

// --- Utility Components ---
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 ${className}`}>{children}</div>
)

const StatCard: React.FC<StatCardProps> = ({ label, amount }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        ₱{amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

const TransactionCard: React.FC<TransactionCardProps> = ({ amount, name, email, type }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-0 break-words">
            ₱{amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-white font-semibold mt-2 px-2 py-0.5 rounded-full bg-[#15803D] inline-block w-fit">
            {type}
          </p>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 break-words">{email}</p>
        </div>
      </div>
    </div>
  )
}

const ActivityCard: React.FC<ActivityItemProps> = ({ title, category, timestamp, thumbnail, views }) => {
  return (
    <div className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>
      {/* Activity Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#15803D] transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{category}</p>
        <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-500 mt-2">
          <span>{views}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  )
}

// --- New Inspection Form Component ---
const NewInspectionForm: React.FC<NewInspectionFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState<InspectionFormData>({
    programNumber: "",
    title: "",
    date: new Date().toISOString().split('T')[0],
    remarks: "",
    images: []
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    
    // Revoke the URL and remove preview
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    
    // Reset form
    setFormData({
      programNumber: "",
      title: "",
      date: new Date().toISOString().split('T')[0],
      remarks: "",
      images: []
    })
    
    // Clean up preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    setImagePreviews([])
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            New Inspection
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Fill in the details for the new inspection report. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Inspection Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Community Women Empowerment Workshop"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Inspection Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-sm font-medium">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              name="remarks"
              placeholder="Enter detailed remarks about the inspection..."
              value={formData.remarks}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-sm font-medium">
              Upload Images
            </Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#15803D] transition-colors">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload images or drag and drop
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </span>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#15803D] hover:bg-[#166534] text-white"
            >
              Create Inspection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Mock Data ---
const mockFinancialBreakdown: FinancialBreakdownItem[] = [
  {
    id: "a",
    code: "A",
    description: "Crime Prevention and law enforcement activities",
    appropriation: 10200000,
    obligation: 950000,
    balance: 9250000,
    level: 0,
    children: [
      {
        id: "a1",
        code: "A.1",
        description: "Provision of equipage, supplies and materials...",
        appropriation: 5200000,
        obligation: 0,
        balance: 5200000,
        level: 1,
      },
      {
        id: "a2",
        code: "A.2",
        description: "Provision of fuel, oil and lubricants...",
        appropriation: 3000000,
        obligation: 950000,
        balance: 2050000,
        level: 1,
      },
    ],
  },
  {
    id: "b",
    code: "B",
    description: "Aid and/or capability development/trainings...",
    appropriation: 13835000,
    obligation: 5551645.23,
    balance: 8283354.77,
    level: 0,
    children: [
      {
        id: "b1",
        code: "B.1",
        description: "Providing subsidy and equipage for personnel...",
        appropriation: 4035000,
        obligation: 0,
        balance: 4035000,
        level: 1,
      },
      {
        id: "b2",
        code: "B.2",
        description: "Grants, subsidies and contribution to LEA",
        appropriation: 3450000,
        obligation: 1885040,
        balance: 1564960,
        level: 1,
      },
    ],
  },
  {
    id: "c",
    code: "C",
    description: "Program for anti-illegal drug, illegal gambling...",
    appropriation: 105820000,
    obligation: 85110003.49,
    balance: 20709996.51,
    level: 0,
    children: [
      {
        id: "c1",
        code: "C.1",
        description: "Programs against illegal drugs and surrenderers",
        appropriation: 6044657,
        obligation: 1566998.94,
        balance: 4477658.06,
        level: 1,
      },
      {
        id: "c2",
        code: "C.2",
        description: "Support to LGUs for various peace and order programs",
        appropriation: 38848744,
        obligation: 29428400,
        balance: 9420344,
        level: 1,
      },
    ],
  },
]

const mockActivities: ActivityItemProps[] = [
  {
    id: "1",
    title: "Community Women Empowerment Workshop - Phase 1",
    category: "Skill Development",
    timestamp: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    views: "1.2K views",
  },
  {
    id: "2",
    title: "Agricultural Training Program for Rural Communities",
    category: "Economic Development",
    timestamp: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop",
    views: "856 views",
  },
  {
    id: "3",
    title: "Youth Leadership Forum 2025",
    category: "Leadership",
    timestamp: "2 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    views: "2.4K views",
  },
  {
    id: "5",
    title: "Environmental Conservation Awareness Campaign",
    category: "Environment",
    timestamp: "1 month ago",
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop",
    views: "945 views",
  },
  {
    id: "6",
    title: "Digital Literacy Program for Seniors",
    category: "Technology",
    timestamp: "1 month ago",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    views: "1.8K views",
  },
  {
    id: "8",
    title: "Community Clean-up Day Results and Impact",
    category: "Community Service",
    timestamp: "2 months ago",
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop",
    views: "5.2K views",
  },
]

// --- Tab Content Components ---
const OverviewContent: React.FC<OverviewContentProps> = ({ stats, transactions }) => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Financial Snapshot</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} label={stat.label} amount={stat.amount} />
      ))}
    </div>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Obligations</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((transaction, index) => (
        <TransactionCard
          key={index}
          amount={transaction.amount}
          name={transaction.name}
          email={transaction.email}
          type={transaction.type}
        />
      ))}
    </div>
  </div>
)

const BarChartItem: React.FC<BarChartItemProps> = ({ label, value, color, isDashed = false }) => (
  <div className="flex flex-col items-center mx-2 h-full justify-end">
    <div
      className={`w-6 rounded-t-md transition-all duration-500 ease-out ${color} ${isDashed ? "border-2 border-dashed border-gray-400 bg-transparent" : ""}`}
      style={{ height: `${value}%` }}
    ></div>
    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-semibold">{label}</div>
  </div>
)

const AnalyticsContent: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Utilization & Trend Analysis</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg h-96 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Budget vs. Utilization (YTD)</h3>
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-end p-4">
          <BarChartItem label="Approp." value={85} color="bg-blue-500" />
          <BarChartItem label="Oblig." value={65} color="bg-[#15803D]" />
          <BarChartItem label="Balance" value={20} color="bg-green-500" />
          <BarChartItem label="Target" value={75} color="bg-gray-400" isDashed={true} />
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Appropriation
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-[#15803D] mr-2"></span> Obligation
          </div>
        </div>
      </div>
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg h-96 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Expense Category Breakdown</h3>
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg">
          <div
            className="absolute inset-0 bg-yellow-400"
            style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)" }}
          ></div>
          <div
            className="absolute inset-0 bg-red-600"
            style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }}
          ></div>
          <div
            className="absolute inset-0 bg-teal-500"
            style={{ clipPath: "polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)" }}
          ></div>
          <div
            className="absolute inset-0 bg-purple-500"
            style={{ clipPath: "polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)" }}
          ></div>
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-6 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> Personnel (25%)
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span> MOOE (25%)
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span> Capital (25%)
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span> Transfers (25%)
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InspectionContent: React.FC<InspectionContentProps> = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const galleryImages = [
    { id: 1, url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800", alt: "Community Activity 1" },
    { id: 2, url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800", alt: "Community Activity 2" },
    { id: 3, url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800", alt: "Community Activity 3" },
    { id: 4, url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800", alt: "Community Activity 4" },
  ]

  const handleFormSubmit = (data: InspectionFormData) => {
    console.log("New inspection submitted:", data)
    // Here you would typically send the data to your backend
    alert(`Inspection created successfully!\nProgram: ${data.programNumber}\nTitle: ${data.title}`)
  }

  const openImage = (url: string, index: number) => {
    setSelectedImage(url)
    setCurrentImageIndex(index)
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: "next" | "prev") => {
    if (direction === "next") {
      const newIndex = (currentImageIndex + 1) % galleryImages.length
      setCurrentImageIndex(newIndex)
      setSelectedImage(galleryImages[newIndex].url)
    } else {
      const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
      setCurrentImageIndex(newIndex)
      setSelectedImage(galleryImages[newIndex].url)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === "ArrowRight") {
        navigateImage("next")
      } else if (e.key === "ArrowLeft") {
        navigateImage("prev")
      } else if (e.key === "Escape") {
        closeImage()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, currentImageIndex])

  const renderGallery = () => {
    const heightClass = "h-[300px] md:h-[500px]"

    if (galleryImages.length === 0) return null

    if (galleryImages.length === 1) {
      return (
        <div
          className={`relative cursor-pointer overflow-hidden group w-full ${heightClass}`}
          onClick={() => openImage(galleryImages[0].url, 0)}
        >
          <img
            src={galleryImages[0].url || "/placeholder.svg"}
            alt={galleryImages[0].alt}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
      )
    }

    if (galleryImages.length === 2) {
      return (
        <div className={`grid grid-cols-2 gap-1 w-full ${heightClass}`}>
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="relative cursor-pointer overflow-hidden group h-full"
              onClick={() => openImage(image.url, index)}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      )
    }

    if (galleryImages.length === 3) {
      return (
        <div className={`grid grid-cols-2 gap-1 w-full ${heightClass}`}>
          <div
            className="relative cursor-pointer overflow-hidden group h-full"
            onClick={() => openImage(galleryImages[0].url, 0)}
          >
            <img
              src={galleryImages[0].url || "/placeholder.svg"}
              alt={galleryImages[0].alt}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
          </div>
          <div className="flex flex-col gap-1 h-full">
            {galleryImages.slice(1).map((image, index) => (
              <div
                key={image.id}
                className="relative cursor-pointer overflow-hidden group h-1/2"
                onClick={() => openImage(image.url, index + 1)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className={`grid grid-cols-2 gap-1 w-full ${heightClass}`}>
        <div
          className="relative cursor-pointer overflow-hidden group h-full"
          onClick={() => openImage(galleryImages[0].url, 0)}
        >
          <img
            src={galleryImages[0].url || "/placeholder.svg"}
            alt={galleryImages[0].alt}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
        <div className="grid grid-rows-3 gap-1 h-full">
          {galleryImages.slice(1, 4).map((image, index) => {
            const actualIndex = index + 1
            const isLastDisplayed = index === 2
            const remainingCount = galleryImages.length - 4
            return (
              <div
                key={image.id}
                className="relative cursor-pointer overflow-hidden group h-full"
                onClick={() => openImage(image.url, actualIndex)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                {isLastDisplayed && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-40 transition-all">
                    <span className="text-white text-3xl font-bold">+{remainingCount}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 flex flex-col lg:flex-row gap-0">
      {/* New Inspection Form Dialog */}
      <NewInspectionForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSubmit={handleFormSubmit}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:border-r border-gray-200 dark:border-gray-700">
        {/* Gallery */}
        <div className="w-full">{renderGallery()}</div>

        {/* Text Content */}
        <div className="mt-96 p-6 relative">
          {/* Date and Upload Button Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Inspection for program number 12</h3>
            </div>
          </div>

          {/* Activities Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Remarks:</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Community engagement activities focused on women's empowerment and development. Participants engaged in
                various skill-building workshops and collaborative projects aimed at fostering economic independence and
                social cohesion within the community.
              </p>
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">
            * Data is retrieved using the 'flattenFinancialBreakdown' utility function from mock data.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white dark:bg-gray-900 p-4 lg:p-6 overflow-y-auto max-h-screen lg:max-h-[calc(100vh)]">
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-[#15803D] hover:bg-[#166534]"
          size="lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add new
        </Button>
      
        <h3 className="ml-4 mt-12 text-xl font-bold text-gray-900 dark:text-gray-100 sticky top-0 bg-white dark:bg-gray-900 py-2">
          Activities
        </h3>
        <div className="space-y-2">
          {mockActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              title={activity.title}
              category={activity.category}
              timestamp={activity.timestamp}
              thumbnail={activity.thumbnail}
              views={activity.views}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 outline-none"
          onClick={closeImage}
          tabIndex={-1}
        >
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {galleryImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("prev")
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {galleryImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("next")
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Fullscreen view"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ReportContent: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
      Quarterly Financial Report Summary (Q4 2024)
    </h2>
    <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg border-l-4 border-l-teal-500">
      <h3 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">Executive Summary</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        The fourth quarter has seen significant financial activity, with total obligations reaching $85.11 million
        against an appropriation of $105.82 million in the "Program for anti-illegal drug, illegal gambling,
        counter-insurgency" category. This represents an 80% utilization rate for this critical program.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Overall, the department maintains a healthy $38.2 million balance across all major accounts. A key finding is
        the low obligation rate in the 'Crime Prevention and law enforcement' category (9.3%), indicating potential
        delays in procurement or implementation which should be inspected.
      </p>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <p>
          <strong>Status:</strong> Approved & Filed
        </p>
        <p>
          <strong>Date:</strong> 2024-12-31
        </p>
        <p>
          <strong>Prepared by:</strong> J. Dela Cruz
        </p>
      </div>
    </div>
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Recommendations</h3>
      <div className="space-y-3">
        <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-[#15803D] font-bold">1.</span>
          <p className="text-gray-700 dark:text-gray-300">
            Immediately review procurement schedules for Section A (Crime Prevention) to address the low obligation
            rate.
          </p>
        </div>
        <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-[#15803D] font-bold">2.</span>
          <p className="text-gray-700 dark:text-gray-300">
            Allocate $2 million from the existing surplus to a reserve fund for unallocated capital expenditures.
          </p>
        </div>
        <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-[#15803D] font-bold">3.</span>
          <p className="text-gray-700 dark:text-gray-300">
            Implement stricter spending controls on MOOE in the first quarter to ensure budget conservation.
          </p>
        </div>
      </div>
    </div>
  </div>
)

// --- Main Component ---
export default function FinancialBreakdownTabs() {
  const [activeTab, setActiveTab] = useState("inspection")
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "inspection", label: "Inspection" },
    { id: "report", label: "Report" },
  ]

  const stats: StatItem[] = [
    { label: "Total Appropriation", amount: mockFinancialBreakdown.reduce((sum, item) => sum + item.appropriation, 0) },
    { label: "Total Obligated", amount: mockFinancialBreakdown.reduce((sum, item) => sum + item.obligation, 0) },
    { label: "Remaining Balance", amount: mockFinancialBreakdown.reduce((sum, item) => sum + item.balance, 0) },
  ]

  const transactions: TransactionCardProps[] = [
    { amount: 1566998.94, name: "Project C.1", email: "drugs@gov.ph", type: "Drug Programs" },
    { amount: 29428400.0, name: "Project C.2", email: "lgu_support@gov.ph", type: "LGU Support" },
    { amount: 5551645.23, name: "Project B", email: "training@gov.ph", type: "Capability Dev" },
    { amount: 950000.0, name: "Project A.2", email: "logistics@gov.ph", type: "Fuel & Oil" },
    { amount: 60082199.04, name: "Project C.3", email: "propoor@gov.ph", type: "Indigency Fund" },
    { amount: 1885040.0, name: "Project B.2", email: "grants@gov.ph", type: "Grants & Subsidies" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent stats={stats} transactions={transactions} />
      case "analytics":
        return <AnalyticsContent />
      case "inspection":
        return <InspectionContent data={mockFinancialBreakdown} />
      case "report":
        return <ReportContent />
      default:
        return <InspectionContent data={mockFinancialBreakdown} />
    }
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-all relative
                            ${
                              activeTab === tab.id
                                ? "text-[#15803D] dark:text-[#15803D] bg-white dark:bg-gray-900"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#15803D]"></div>}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-900 rounded-b-lg">{renderContent()}</div>
    </Card>
  )
}