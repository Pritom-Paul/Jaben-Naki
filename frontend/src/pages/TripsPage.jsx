"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/skeleton"
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  Globe,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Clock,
  X,
  ArrowUpDown,
} from "lucide-react"
import Header from "@/components/layout/Header";
import Footer from  "@/components/layout/Footer"
import { motion } from "framer-motion"
import mockTrips from "@/mock/trips"

const interests = [
  "Adventure Sports",
  "Cultural Sites",
  "Food & Dining",
  "Photography",
  "Mountains & Hiking",
  "Nature & Wildlife",
  "Beach & Water",
  "City Exploration",
  "Budget Travel",
  "Luxury Travel",
]

const budgetRanges = ["Under $500", "$500 - $1,000", "$1,000 - $1,500", "$1,500 - $2,000", "Over $2,000"]

const interestColors = {
  "Adventure Sports": "bg-rose-500 border-rose-500",
  "Cultural Sites": "bg-amber-500 border-amber-500",
  "Food & Dining": "bg-purple-500 border-purple-500",
  "Photography": "bg-cyan-500 border-cyan-500",
  "Mountains & Hiking": "bg-emerald-500 border-emerald-500",
  "Nature & Wildlife": "bg-emerald-400 border-emerald-400",
  "Beach & Water": "bg-cyan-400 border-cyan-400",
  "City Exploration": "bg-indigo-500 border-indigo-500",
  "Budget Travel": "bg-teal-500 border-teal-500",
  "Luxury Travel": "bg-purple-400 border-purple-400",
}
const budgetColors = {
  "Under $500": "bg-emerald-100 text-emerald-800",
  "$500 - $1,000": "bg-teal-100 text-teal-800",
  "$1,000 - $1,500": "bg-amber-100 text-amber-800",
  "$1,500 - $2,000": "bg-orange-100 text-orange-800",
  "Over $2,000": "bg-rose-100 text-rose-800"
}

export default function TripsPage() {
  const tripsPerPage = 6
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState(mockTrips)
  const [filteredTrips, setFilteredTrips] = useState(mockTrips)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    destination: "",
    dateFrom: "",
    dateTo: "",
    budget: "",
    interests: [],
  })
  const [sortBy, setSortBy] = useState("")
  const [savedTrips, setSavedTrips] = useState([])
  const [visibleTrips, setVisibleTrips] = useState(tripsPerPage)

  // Saved trips logic
  useEffect(() => {
    const saved = localStorage.getItem("savedTrips")
    if (saved) setSavedTrips(JSON.parse(saved))
  }, [])
  const toggleSave = (tripId) => {
    const updated = savedTrips.includes(tripId)
      ? savedTrips.filter((id) => id !== tripId)
      : [...savedTrips, tripId]
    localStorage.setItem("savedTrips", JSON.stringify(updated))
    setSavedTrips(updated)
  }
  const isSaved = (tripId) => savedTrips.includes(tripId)

  // Helper for budget sorting
  const parseBudget = (budget) => {
    // Extract lowest number from budget string
    const match = budget.match(/\$(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }
  // Helper for date parsing
  const parseDateString = (str) => {
    // Handles formats like "Mar 15" or "Apr 10"
    const [month, day] = str.split(" ")
    const year = new Date().getFullYear()
    return `${month} ${day}, ${year}`
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter trips based on current filters
    let filtered = trips

    if (filters.destination) {
      filtered = filtered.filter(
        (trip) =>
          trip.location.toLowerCase().includes(filters.destination.toLowerCase()) ||
          trip.title.toLowerCase().includes(filters.destination.toLowerCase()),
      )
    }

    if (filters.budget) {
      // Simple budget filtering - in real app, you'd parse budget ranges
      filtered = filtered.filter((trip) => trip.budget.includes(filters.budget.split(" - ")[0]))
    }
    if (filters.interests.length > 0) {
      filtered = filtered.filter((trip) => filters.interests.includes(trip.primaryInterest))
    }
    // Date filtering
    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter((trip) => {
        const tripStartStr = trip.dates.split("-")[0].trim()
        const tripStart = new Date(parseDateString(tripStartStr))
        return (
          tripStart >= new Date(filters.dateFrom) &&
          tripStart <= new Date(filters.dateTo)
        )
      })
    }
    setFilteredTrips(filtered)
    setCurrentPage(1)
  }, [filters, trips])

  // Sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "budget-low") return parseBudget(a.budget) - parseBudget(b.budget)
    return 0 // Default: newest first (already sorted)
  })
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage)
  const startIndex = (currentPage - 1) * tripsPerPage
  const currentTrips = sortedTrips.slice(startIndex, startIndex + tripsPerPage)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleInterest = (interest) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter((i) => i !== interest)
      : [...filters.interests, interest]
    handleFilterChange("interests", newInterests)
  }

  const clearFilters = () => {
    setFilters({
      destination: "",
      dateFrom: "",
      dateTo: "",
      budget: "",
      interests: [],
    })
  }

  const cardHover = {
    rest: { scale: 1, rotateX: 0, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" },
    hover: {
      scale: 1.04,
      rotateX: 8,
      boxShadow: "0 12px 32px 0 rgba(80,80,180,0.10)",
      transition: { type: "spring", stiffness: 300, damping: 18 }
    }
  }

  useEffect(() => {
    setVisibleTrips(tripsPerPage)
  }, [filteredTrips])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        visibleTrips < filteredTrips.length
      ) {
        setVisibleTrips((prev) => Math.min(prev + tripsPerPage, filteredTrips.length))
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [visibleTrips, filteredTrips])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Discover Your Next <span className="text-indigo-500">Adventure</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join amazing trips created by fellow travelers or find inspiration for your own adventure
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-indigo-500" />
                <CardTitle className="text-lg">Find Your Perfect Trip</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="budget-low">Budget (Low→High)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="Search destinations..."
                    className="pl-10"
                    value={filters.destination}
                    onChange={(e) => handleFilterChange("destination", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateFrom"
                    type="date"
                    className="pl-10"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateTo"
                    type="date"
                    className="pl-10"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select value={filters.budget} onValueChange={(value) => handleFilterChange("budget", value)}>
                <SelectTrigger className="w-full md:w-64">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select budget range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={filters.interests.includes(interest) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      filters.interests.includes(interest)
                        ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{isLoading ? "Loading..." : `${filteredTrips.length} trips found (Updated: 2 hours ago)`}</p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button className="bg-indigo-500 hover:bg-indigo-600" asChild>
              <Link href="/create-trip">Create Trip</Link>
            </Button>
          </div>
        </div>

        {/* Trip Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4 animate-pulse" />
                  <Skeleton className="h-4 w-1/2 animate-pulse" />
                  <Skeleton className="h-4 w-full animate-pulse" />
                  <Skeleton className="h-4 w-full animate-pulse" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-8 rounded-full animate-pulse" />
                    <Skeleton className="h-8 w-24 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedTrips.slice(0, visibleTrips).map((trip) => (
              <motion.div
                key={trip.id}
                variants={cardHover}
                whileHover="hover"
                animate="rest"
                style={{ perspective: 800 }}
              >
                <Card
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 border-t-4 ${interestColors[trip.primaryInterest]?.split(' ')[1] || 'border-indigo-500'} bg-white dark:bg-gray-800`}
                >
                  <div className="relative">
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={trip.coverImage || "/placeholder.svg"}
                      alt={trip.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      size="sm"
                      variant={isSaved(trip.id) ? "default" : "secondary"}
                      onClick={() => toggleSave(trip.id)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved(trip.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`}
                        fill={isSaved(trip.id) ? "#f43f5e" : "none"}
                        stroke={isSaved(trip.id) ? "#f43f5e" : "currentColor"}
                      />
                    </Button>
                    <div className="absolute bottom-3 left-3">
                      <Badge className={`${interestColors[trip.primaryInterest]?.split(' ')[0] || 'bg-indigo-500'} text-white`}>{trip.primaryInterest}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{trip.title}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {trip.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {trip.dates}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          {trip.budget}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={trip.creator.avatar || "/placeholder.svg"}
                            alt={trip.creator.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">{trip.creator.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              {trip.rating}
                            </div>
                          </div>
                        </div>
                        <span className={`flex items-center text-sm ${trip.participants / trip.maxParticipants > 0.8 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          <Users className="w-4 h-4 mr-1" />
                          {trip.participants}/{trip.maxParticipants}
                        </span>
                      </div>

                      <Button className="bg-indigo-500 hover:bg-indigo-600 text-white w-full" asChild>
                        <Link href={`/trips/${trip.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-rose-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search for different destinations
            </p>
            <Button variant="outline" className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 bg-transparent" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
