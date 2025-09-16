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
      property: "Cozy Westminster Studio",
      guest: "Mike Chen",
      rating: 4,
      date: "2025-09-08",
      comment: "Great location, minor issues with heating but overall good experience.",
      isPublic: false,
      category: "Studio",
      channel: "Booking.com",
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
      channel: "Direct",
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
      channel: "Direct",
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
