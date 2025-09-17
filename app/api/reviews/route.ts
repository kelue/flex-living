import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Initialize with default reviews if file doesn't exist
async function initializeReviews() {
  const defaultReviews = [
    // Beautiful Pimlico Flat (Apartment) – 5 reviews
    {
      id: 1,
      property: "Beautiful Pimlico Flat",
      guest: "Sarah Johnson",
      rating: 5,
      date: "2025-09-10",
      comment: "Amazing stay! The apartment was spotless and exactly as described.",
      isPublic: true,
      category: "Apartment",
      channel: "Airbnb",
    },
    {
      id: 2,
      property: "Beautiful Pimlico Flat",
      guest: "Liam O'Connor",
      rating: 4,
      date: "2025-08-28",
      comment: "Great location near Victoria. A bit warm in the afternoons but otherwise perfect.",
      isPublic: true,
      category: "Apartment",
      channel: "Direct",
    },
    {
      id: 3,
      property: "Beautiful Pimlico Flat",
      guest: "Isabella Rossi",
      rating: 5,
      date: "2025-08-12",
      comment: "Super clean and very cozy. Hosts were responsive.",
      isPublic: true,
      category: "Apartment",
      channel: "Booking.com",
    },
    {
      id: 4,
      property: "Beautiful Pimlico Flat",
      guest: "Noah Williams",
      rating: 4,
      date: "2025-07-21",
      comment: "Exactly as pictured. Street can be a bit noisy at night.",
      isPublic: false,
      category: "Apartment",
      channel: "Airbnb",
    },
    {
      id: 5,
      property: "Beautiful Pimlico Flat",
      guest: "Mia Schneider",
      rating: 5,
      date: "2025-07-02",
      comment: "Loved our stay – comfy bed and fast WiFi!",
      isPublic: true,
      category: "Apartment",
      channel: "Direct",
    },

    // Cozy Westminster Studio (Studio) – 4 reviews
    {
      id: 6,
      property: "Cozy Westminster Studio",
      guest: "Mike Chen",
      rating: 4,
      date: "2025-09-08",
      comment: "Great location, minor issues with heating but overall good.",
      isPublic: true,
      category: "Studio",
      channel: "Booking.com",
    },
    {
      id: 7,
      property: "Cozy Westminster Studio",
      guest: "Amelia Brown",
      rating: 5,
      date: "2025-08-19",
      comment: "Small but very functional studio, perfect for a weekend.",
      isPublic: true,
      category: "Studio",
      channel: "Airbnb",
    },
    {
      id: 8,
      property: "Cozy Westminster Studio",
      guest: "Jorge Alvarez",
      rating: 3,
      date: "2025-07-30",
      comment: "Good value. Could use better soundproofing.",
      isPublic: false,
      category: "Studio",
      channel: "Direct",
    },
    {
      id: 9,
      property: "Cozy Westminster Studio",
      guest: "Hannah Lee",
      rating: 4,
      date: "2025-07-05",
      comment: "Clean and close to transport.",
      isPublic: true,
      category: "Studio",
      channel: "Airbnb",
    },

    // Luxury Kensington Suite (Suite) – 4 reviews
    {
      id: 10,
      property: "Luxury Kensington Suite",
      guest: "Emma Wilson",
      rating: 3,
      date: "2025-09-05",
      comment: "Nice place but quite noisy at night.",
      isPublic: false,
      category: "Suite",
      channel: "Direct",
    },
    {
      id: 11,
      property: "Luxury Kensington Suite",
      guest: "Oliver Martin",
      rating: 5,
      date: "2025-08-18",
      comment: "Beautiful suite, elegant interiors and spotless.",
      isPublic: true,
      category: "Suite",
      channel: "Booking.com",
    },
    {
      id: 12,
      property: "Luxury Kensington Suite",
      guest: "Charlotte Dubois",
      rating: 4,
      date: "2025-08-01",
      comment: "Comfortable bed and great shower pressure.",
      isPublic: true,
      category: "Suite",
      channel: "Direct",
    },
    {
      id: 13,
      property: "Luxury Kensington Suite",
      guest: "Lucas Moretti",
      rating: 4,
      date: "2025-07-10",
      comment: "Premium feel, a little warm during the day.",
      isPublic: true,
      category: "Suite",
      channel: "Airbnb",
    },

    // Modern Chelsea Apartment (Apartment) – 4 reviews
    {
      id: 14,
      property: "Modern Chelsea Apartment",
      guest: "David Brown",
      rating: 5,
      date: "2025-09-03",
      comment: "Exceptional service and beautiful apartment. Highly recommend!",
      isPublic: true,
      category: "Apartment",
      channel: "Direct",
    },
    {
      id: 15,
      property: "Modern Chelsea Apartment",
      guest: "Sofia Petrova",
      rating: 4,
      date: "2025-08-20",
      comment: "Stylish and very clean. WiFi could be faster.",
      isPublic: true,
      category: "Apartment",
      channel: "Airbnb",
    },
    {
      id: 16,
      property: "Modern Chelsea Apartment",
      guest: "Ethan Clark",
      rating: 5,
      date: "2025-08-03",
      comment: "Spacious living room and comfy sofa.",
      isPublic: true,
      category: "Apartment",
      channel: "Booking.com",
    },
    {
      id: 17,
      property: "Modern Chelsea Apartment",
      guest: "Zara Ahmed",
      rating: 4,
      date: "2025-07-14",
      comment: "Great neighborhood, a few stairs to climb.",
      isPublic: false,
      category: "Apartment",
      channel: "Direct",
    },
  ]

  await ensureDataDir()
  try {
    await fs.access(REVIEWS_FILE)
  } catch {
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(defaultReviews, null, 2))
  }
}

export async function GET() {
  try {
    await initializeReviews()
    const data = await fs.readFile(REVIEWS_FILE, "utf8")
    const reviews = JSON.parse(data).map((r: any) => ({
      ...r,
      channel: r.channel || r.source || "Direct",
    }))
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error reading reviews:", error)
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()
    const reviews = await request.json()
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving reviews:", error)
    return NextResponse.json({ error: "Failed to save reviews" }, { status: 500 })
  }
}

