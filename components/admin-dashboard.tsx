"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const recentReviews = [
  {
    id: 1,
    property: "Beautiful Pimlico Flat",
    guest: "Sarah Johnson",
    rating: 5,
    date: "2025-09-10",
    comment: "Amazing stay! The apartment was spotless and exactly as described.",
    isPublic: true,
    category: "Apartment",
  },
  {
    id: 2,
    property: "Cozy Westminster Studio",
    guest: "Mike Chen",
    rating: 4,
    date: "2025-09-08",
    comment: "Great location, minor issues with heating but overall good experience.",
    isPublic: false,
    category: "Studio",
  },
  {
    id: 3,
    property: "Luxury Kensington Suite",
    guest: "Emma Wilson",
    rating: 3,
    date: "2025-09-05",
    comment: "Nice place but quite noisy at night. Could use better soundproofing.",
    isPublic: false,
    category: "Suite",
  },
  {
    id: 4,
    property: "Modern Chelsea Apartment",
    guest: "David Brown",
    rating: 5,
    date: "2025-09-03",
    comment: "Exceptional service and beautiful apartment. Highly recommend!",
    isPublic: true,
    category: "Apartment",
  },
]

export function AdminDashboard() {
  const [selectedProperty, setSelectedProperty] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
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

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating
    const matchesCategory = selectedCategory === "all" || review.category === selectedCategory

    return matchesSearch && matchesRating && matchesCategory
  })

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
            <Button variant="ghost" className="w-full justify-start">
              <IconTrendingUp />
              <span className="ml-2">Analytics</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <IconMessageSquare />
              <span className="ml-2">Reviews</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <IconEye />
              <span className="ml-2">Display Control</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <IconUsers />
              <span className="ml-2">Properties</span>
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Review Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                    <IconMessageSquare />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">328</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <IconStar />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.3</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+0.2</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Public Reviews</CardTitle>
                    <IconEye />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245</div>
                    <p className="text-xs text-muted-foreground">75% of total reviews</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Properties</CardTitle>
                    <IconBuilding />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
