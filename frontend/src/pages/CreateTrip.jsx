"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowLeft,
  Globe,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Camera,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"

// Form field configuration
const formFields = [
  { name: "title", type: "text", required: true, maxLength: 100 },
  { name: "destination", type: "text", required: true, maxLength: 100 },
  { name: "description", type: "textarea", required: true },
  { name: "start_date", type: "date", required: true },
  { name: "end_date", type: "date", required: true },
  { name: "budget", type: "number", step: "0.01", min: "0" },
  { name: "tags", type: "tag-input" },
]

// Predefined tag suggestions with color mapping
const tagSuggestions = [
  { name: "Adventure Sports", color: "bg-rose-100 text-rose-800" },
  { name: "Cultural Sites", color: "bg-amber-100 text-amber-800" },
  { name: "Food & Dining", color: "bg-purple-100 text-purple-800" },
  { name: "Photography", color: "bg-cyan-100 text-cyan-800" },
  { name: "Mountains & Hiking", color: "bg-emerald-100 text-emerald-800" },
  { name: "Nature & Wildlife", color: "bg-green-100 text-green-800" },
  { name: "Beach & Water", color: "bg-blue-100 text-blue-800" },
  { name: "City Exploration", color: "bg-indigo-100 text-indigo-800" },
  { name: "Budget Travel", color: "bg-yellow-100 text-yellow-800" },
  { name: "Luxury Travel", color: "bg-pink-100 text-pink-800" },
]

export default function CreateTripPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    tags: [],
    coverImage: null,
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [newTag, setNewTag] = useState("")

  const validateForm = () => {
    const newErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less"
    }

    // Destination validation
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required"
    } else if (formData.destination.length > 100) {
      newErrors.destination = "Destination must be 100 characters or less"
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters"
    }

    // Start date validation
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required"
    } else {
      const startDate = new Date(formData.start_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (startDate < today) {
        newErrors.start_date = "Start date cannot be in the past"
      }
    }

    // End date validation
    if (!formData.end_date) {
      newErrors.end_date = "End date is required"
    } else if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      if (endDate < startDate) {
        newErrors.end_date = "End date must be after start date"
      }
    }

    // Budget validation
    if (formData.budget && (Number.parseFloat(formData.budget) < 0 || isNaN(Number.parseFloat(formData.budget)))) {
      newErrors.budget = "Budget must be a valid positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Prepare form data for API
      const submitData = {
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        description: formData.description.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget ? Number.parseFloat(formData.budget) : null,
        tags: formData.tags,
      }

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          if (Math.random() > 0.2) {
            resolve({ id: Math.floor(Math.random() * 1000) })
          } else {
            reject(new Error("Failed to create trip. Please try again."))
          }
        }, 2000)
      })

      // Success handling
      setShowSuccess(true)
      setTimeout(() => {
        // In real app, redirect to the created trip's detail page
        navigate("/trips")
      }, 2000)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) {
      setApiError("")
    }
  }

  const addTag = (tag) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      handleInputChange("tags", [...formData.tags, trimmedTag])
    }
    setNewTag("")
  }

  const removeTag = (tagToRemove) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(newTag)
    }
  }

  const getTagColor = (tagName) => {
    const tag = tagSuggestions.find(t => t.name === tagName)
    return tag ? tag.color : "bg-indigo-100 text-indigo-800"
  }

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start)
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1 // Include both start and end days
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Create Your <span className="text-indigo-500">Adventure</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your travel plans and connect with like-minded adventurers
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="mb-6 border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800">
              <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <AlertDescription className="text-indigo-800 dark:text-indigo-200">
                Trip created successfully! Redirecting to trips page...
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* API Error */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Trip Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Image Upload */}
                <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/30 dark:to-cyan-900/30 border-2 border-dashed border-indigo-200 dark:border-indigo-700 rounded-lg p-8 text-center transition-colors">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-indigo-400 dark:text-indigo-500" />
                    <p className="text-indigo-800 dark:text-indigo-200 font-medium">Trip cover image</p>
                    <p className="text-indigo-500 dark:text-indigo-400 text-sm">Upload feature coming soon</p>
                </div>
                </div>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Trip Title <span className="text-indigo-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="title"
                      placeholder="e.g., Sundarbans Wildlife Adventure"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      maxLength={100}
                      className={`${errors.title ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-200"} focus:ring-2`}
                    />
                    <div className="absolute right-3 top-3 text-xs text-muted-foreground">
                      {formData.title.length}/100
                    </div>
                  </div>
                  {errors.title && <p className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">{errors.title}</p>}
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination">
                    Destination <span className="text-indigo-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="e.g., Sundarbans, Bangladesh"
                      className={`pl-10 ${errors.destination ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-200"} focus:ring-2`}
                      value={formData.destination}
                      onChange={(e) => handleInputChange("destination", e.target.value)}
                      maxLength={100}
                    />
                    <div className="absolute right-3 top-3 text-xs text-muted-foreground">
                      {formData.destination.length}/100
                    </div>
                  </div>
                  {errors.destination && <p className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">{errors.destination}</p>}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">
                      Start Date <span className="text-indigo-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="start_date"
                        type="date"
                        className={`pl-10 ${errors.start_date ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-200"} focus:ring-2`}
                        value={formData.start_date}
                        onChange={(e) => handleInputChange("start_date", e.target.value)}
                      />
                    </div>
                    {errors.start_date && <p className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">{errors.start_date}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">
                      End Date <span className="text-indigo-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="end_date"
                        type="date"
                        className={`pl-10 ${errors.end_date ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-200"} focus:ring-2`}
                        value={formData.end_date}
                        onChange={(e) => handleInputChange("end_date", e.target.value)}
                      />
                    </div>
                    {errors.end_date && <p className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">{errors.end_date}</p>}
                    {formData.start_date && formData.end_date && !errors.end_date && (
                      <p className="text-sm text-indigo-500">
                        Duration: {calculateDuration(formData.start_date, formData.end_date)} days
                      </p>
                    )}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (BDT)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-0 h-8 w-8 text-2xl text-indigo-500">&#x09F3;</span>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 15000.00"
                      className={`pl-10 ${errors.budget ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-200"} focus:ring-2`}
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                    />
                  </div>
                  {errors.budget && <p className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">{errors.budget}</p>}
                  <p className="text-sm text-muted-foreground">
                    Optional: Estimated budget per person for the entire trip
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-indigo-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your trip plans, what you're looking for in travel companions, activities you want to do, and any other important details..."
                    className={`min-h-[120px] resize-none ${errors.description ? "border-red-500 focus:ring-red-200" : "focus:ring-indigo-200"} focus:ring-2`}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formData.description.length < 50 ? "Minimum 50 characters" : "Looking good!"}</span>
                    <span>{formData.description.length} characters</span>
                  </div>
                  {errors.description && <p className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">{errors.description}</p>}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="space-y-3">
                    {/* Current Tags */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className={`${getTagColor(tag)} hover:opacity-80 transition-opacity`}
                          >
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(tag)} 
                              className="ml-2 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Add New Tag */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag (e.g., Adventure, Food, Culture)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        className="flex-1 focus:ring-2 focus:ring-indigo-200"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(newTag)}
                        disabled={!newTag.trim()}
                        className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Tag Suggestions */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Popular tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {tagSuggestions
                          .filter(tag => !formData.tags.includes(tag.name))
                          .slice(0, 8)
                          .map((tag) => (
                            <Badge
                              key={tag.name}
                              className={`${tag.color} cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => addTag(tag.name)}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => navigate("/trips")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Trip...
                      </>
                    ) : (
                      "Create Trip"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}