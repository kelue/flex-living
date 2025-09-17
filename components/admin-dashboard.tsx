"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"

const IconSearch = () => (
  <div className="w-4 h-4 border border-current rounded-full relative">
    <div className="absolute -bottom-1 -right-1 w-2 h-0.5 bg-current rotate-45"></div>
  </div>
)
const IconStar = ({ filled = false }: { filled?: boolean }) => (
  <div className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}>★</div>
)
const IconTrendingUp = () => (
  <div className="w-4 h-4 border-l-2 border-b-2 border-current relative">
    <div className="w-2 h-2 border-t-2 border-r-2 border-current absolute top-0 right-0"></div>
  </div>
)
const IconUsers = () => (
  <div className="w-4 h-4 flex space-x-0.5">
    <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
    <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
  </div>
)
const IconBuilding = () => (
  <div className="w-4 h-4 border-2 border-current">
    <div className="w-1 h-1 bg-current m-0.5"></div>
  </div>
)
const IconMessageSquare = () => (
  <div className="w-4 h-4 border-2 border-current rounded">
    <div className="w-2 h-0.5 bg-current m-1"></div>
  </div>
)
const IconEye = () => (
  <div className="w-4 h-4 border border-current rounded-full relative">
    <div className="w-1 h-1 bg-current rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
)
const IconEyeOff = () => (
  <div className="w-4 h-4 border border-current rounded-full relative opacity-50">
    <div className="absolute inset-0 border-t border-current rotate-45"></div>
  </div>
)
const IconSettings = () => (
  <div className="w-4 h-4 border-2 border-current rounded-full relative">
    <div className="w-1 h-1 bg-current rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
)
const IconBell = () => (
  <div className="w-4 h-4 border-2 border-current rounded-t-full border-b-0">
    <div className="w-2 h-0.5 bg-current mx-auto"></div>
  </div>
)

// Mock data for the dashboard
const performanceData = [
  { month: "Jan", reviews: 45, rating: 4.2 },
  { month: "Feb", reviews: 52, rating: 4.3 },
  { month: "Mar", reviews: 48, rating: 4.1 },
  { month: "Apr", reviews: 61, rating: 4.4 },
  { month: "May", reviews: 55, rating: 4.2 },
  { month: "Jun", reviews: 67, rating: 4.5 },
]

const categoryData = [
  { name: "Cleanliness", value: 4.6, color: "#4f46e5" },
  { name: "Location", value: 4.3, color: "#3b82f6" },
  { name: "Value", value: 4.1, color: "#10b981" },
  { name: "Communication", value: 4.4, color: "#f59e0b" },
]

// Simple stopwords for trends
const STOPWORDS = new Set([
  "the",
  "and",
  "a",
  "to",
  "of",
  "it",
  "in",
  "is",
  "for",
  "was",
  "on",
  "with",
  "very",
  "but",
  "had",
  "at",
  "overall",
  "as",
])
const ISSUE_KEYWORDS = [
  "noise",
  "noisy",
  "dirty",
  "clean",
  "heating",
  "cold",
  "smell",
  "broken",
  "delay",
  "wifi",
  "internet",
  "bed",
  "mattress",
  "shower",
  "water",
]

type AdminView = "overview" | "reviews" | "analytics" | "properties"

export function AdminDashboard({ activeView = "overview" }: { activeView?: AdminView }) {
  const [selectedProperty, setSelectedProperty] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [sortBy, setSortBy] = useState("date_desc")
  const [addingProperty, setAddingProperty] = useState(false)
  const [newProperty, setNewProperty] = useState({ name: "", category: "Apartment", channel: "Direct" })

  useEffect(() => {
    loadReviews()
    loadProperties()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/reviews")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Failed to load reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadProperties = async () => {
    try {
      const response = await fetch("/api/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Failed to load properties:", error)
    }
  }

  const togglePublicDisplay = async (reviewId: number) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, isPublic: !review.isPublic } : review,
    )
    setReviews(updatedReviews)

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReviews),
      })
    } catch (error) {
      console.error("Failed to save reviews:", error)
      // Revert on error
      setReviews(reviews)
    }
  }

  const timeframeBoundary = useMemo(() => {
    const now = new Date()
    const boundary = new Date(now)
    if (selectedTimeframe === "1month") boundary.setMonth(boundary.getMonth() - 1)
    if (selectedTimeframe === "3months") boundary.setMonth(boundary.getMonth() - 3)
    if (selectedTimeframe === "6months") boundary.setMonth(boundary.getMonth() - 6)
    if (selectedTimeframe === "1year") boundary.setFullYear(boundary.getFullYear() - 1)
    return boundary
  }, [selectedTimeframe])

  const filteredReviews = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    const result = reviews.filter((review) => {
      const matchesSearch =
        review.guest.toLowerCase().includes(lowerSearch) ||
        review.property.toLowerCase().includes(lowerSearch) ||
        review.comment.toLowerCase().includes(lowerSearch)
      const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating
      const matchesCategory = selectedCategory === "all" || review.category === selectedCategory
      const matchesProperty = selectedProperty === "all" || review.property === selectedProperty
      const matchesChannel = selectedChannel === "all" || (review.channel || "Direct") === selectedChannel
      const matchesTime = (() => {
        try {
          const d = new Date(review.date)
          return isNaN(d.getTime()) ? true : d >= timeframeBoundary
        } catch {
          return true
        }
      })()
      return (
        matchesSearch && matchesRating && matchesCategory && matchesProperty && matchesChannel && matchesTime
      )
    })

    const sorted = [...result]
    sorted.sort((a, b) => {
      if (sortBy === "rating_desc") return b.rating - a.rating
      if (sortBy === "rating_asc") return a.rating - b.rating
      if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime()
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return sorted
  }, [reviews, searchTerm, selectedRating, selectedCategory, selectedProperty, selectedChannel, timeframeBoundary, sortBy])

  const metrics = useMemo(() => {
    const total = reviews.length
    const avg = total > 0 ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(1) : "0.0"
    const publicCount = reviews.filter((r) => r.isPublic).length
    const propsCount = properties.length
    return { total, avg, publicCount, propsCount }
  }, [reviews, properties])

  const propertyStats = useMemo(() => {
    const map: Record<string, { count: number; sum: number; publicCount: number }> = {}
    for (const r of reviews) {
      const key = r.property
      if (!map[key]) map[key] = { count: 0, sum: 0, publicCount: 0 }
      map[key].count += 1
      map[key].sum += r.rating || 0
      if (r.isPublic) map[key].publicCount += 1
    }
    return map
  }, [reviews])

  const trends = useMemo(() => {
    const freq: Record<string, number> = {}
    const issueFreq: Record<string, number> = {}
    for (const r of reviews) {
      const words = String(r.comment || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w && !STOPWORDS.has(w))
      for (const w of words) {
        freq[w] = (freq[w] || 0) + 1
      }
      for (const k of ISSUE_KEYWORDS) {
        if (String(r.comment || "").toLowerCase().includes(k)) {
          issueFreq[k] = (issueFreq[k] || 0) + 1
        }
      }
    }
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
    const topIssues = Object.entries(issueFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
    return { topKeywords, topIssues }
  }, [reviews])

  const addProperty = async () => {
    if (!newProperty.name.trim()) return
    setAddingProperty(true)
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty),
      })
      if (res.ok) {
        const created = await res.json()
        setProperties((p) => [...p, created])
        setNewProperty({ name: "", category: "Apartment", channel: "Direct" })
      }
    } catch (e) {
      console.error("Failed to add property", e)
    } finally {
      setAddingProperty(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <IconBuilding />
            <h1 className="text-xl font-bold text-foreground">Property Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <IconBell />
            </Button>
            <Button variant="ghost" size="icon">
              <IconSettings />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-sidebar">
          <nav className="p-4 space-y-2">
            <Button asChild variant="ghost" className={`w-full justify-start ${activeView === "overview" ? "bg-accent" : ""}`}>
              <Link href="/admin/overview">
                <IconBuilding />
                <span className="ml-2">Overview</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className={`w-full justify-start ${activeView === "reviews" ? "bg-accent" : ""}`}>
              <Link href="/admin/reviews">
                <IconMessageSquare />
                <span className="ml-2">Review Management</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className={`w-full justify-start ${activeView === "analytics" ? "bg-accent" : ""}`}>
              <Link href="/admin/analytics">
                <IconTrendingUp />
                <span className="ml-2">Analytics</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className={`w-full justify-start ${activeView === "properties" ? "bg-accent" : ""}`}>
              <Link href="/admin/properties">
                <IconUsers />
                <span className="ml-2">Property Management</span>
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeView} className="space-y-6">

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                    <IconMessageSquare />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.total}</div>
                    <p className="text-xs text-muted-foreground">
                      Snapshot from loaded data
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <IconStar />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.avg}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all properties
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Public Reviews</CardTitle>
                    <IconEye />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.publicCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.total > 0 ? Math.round((metrics.publicCount / metrics.total) * 100) : 0}% of total reviews
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Properties</CardTitle>
                    <IconBuilding />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.propsCount}</div>
                    <p className="text-xs text-muted-foreground">Active listings</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Trends</CardTitle>
                    <CardDescription>Monthly review count and average rating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      📊 Chart visualization would appear here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rating Categories</CardTitle>
                    <CardDescription>Average ratings by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Cleanliness</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">4.6</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Location</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">4.3</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Value</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">4.1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Reviews</CardTitle>
                  <CardDescription>Filter and sort reviews by various criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-3">
                        <IconSearch />
                      </div>
                      <Input
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        {properties.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="Airbnb">Airbnb</SelectItem>
                        <SelectItem value="Booking.com">Booking.com</SelectItem>
                        <SelectItem value="Direct">Direct</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">Last Month</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date_desc">Newest</SelectItem>
                        <SelectItem value="date_asc">Oldest</SelectItem>
                        <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                        <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{review.property}</h3>
                            <Badge variant="outline">{review.category}</Badge>
                            <Badge variant="secondary">{review.channel || "Direct"}</Badge>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <IconStar key={i} filled={i < review.rating} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {review.guest} on {review.date}
                          </p>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">Public Display</span>
                            <Switch checked={review.isPublic} onCheckedChange={() => togglePublicDisplay(review.id)} />
                            {review.isPublic ? <IconEye /> : <IconEyeOff />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Track review volume and ratings over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      📈 Performance trends chart would appear here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                    <CardDescription>Breakdown of ratings across all properties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      🥧 Rating distribution chart would appear here
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Trends & Recurring Issues</CardTitle>
                  <CardDescription>Top keywords and potential issues mentioned in reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Top Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {trends.topKeywords.length === 0 && (
                          <span className="text-sm text-muted-foreground">No data</span>
                        )}
                        {trends.topKeywords.map(([word, count]) => (
                          <Badge key={word} variant="outline">
                            {word} · {count as number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recurring Issues</h4>
                      <div className="flex flex-wrap gap-2">
                        {trends.topIssues.length === 0 && (
                          <span className="text-sm text-muted-foreground">No issues detected</span>
                        )}
                        {trends.topIssues.map(([word, count]) => (
                          <Badge key={word}>
                            {word} · {count as number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Properties</CardTitle>
                    <CardDescription>Per-property performance at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {properties.map((p) => {
                        const stats = propertyStats[p.name] || { count: 0, sum: 0, publicCount: 0 }
                        const avg = stats.count > 0 ? (stats.sum / stats.count).toFixed(1) : "-"
                        const publicPct = stats.count > 0 ? Math.round((stats.publicCount / stats.count) * 100) : 0
                        return (
                          <div key={p.id} className="border rounded-md p-4 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{p.name}</span>
                                <Badge variant="outline">{p.category}</Badge>
                                <Badge variant="secondary">{p.channel}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">Added {new Date(p.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="text-xl font-semibold">{avg}</div>
                                <div className="text-xs text-muted-foreground">Avg rating</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-semibold">{stats.count}</div>
                                <div className="text-xs text-muted-foreground">Reviews</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-semibold">{publicPct}%</div>
                                <div className="text-xs text-muted-foreground">Public</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {properties.length === 0 && (
                        <div className="text-sm text-muted-foreground">No properties yet</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add New Property</CardTitle>
                    <CardDescription>Create a listing to start tracking performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="Property name"
                        value={newProperty.name}
                        onChange={(e) => setNewProperty((s) => ({ ...s, name: e.target.value }))}
                      />
                      <Select
                        value={newProperty.category}
                        onValueChange={(v) => setNewProperty((s) => ({ ...s, category: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newProperty.channel}
                        onValueChange={(v) => setNewProperty((s) => ({ ...s, channel: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Airbnb">Airbnb</SelectItem>
                          <SelectItem value="Booking.com">Booking.com</SelectItem>
                          <SelectItem value="Direct">Direct</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button disabled={addingProperty || !newProperty.name.trim()} onClick={addProperty}>
                        {addingProperty ? "Adding..." : "Add Property"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
