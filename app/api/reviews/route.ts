import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { fetchHostawayReviews, normalizeHostawayReview, computeApprovalKey } from "@/lib/hostaway"

const DATA_DIR = path.join(process.cwd(), "data")
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json")
const APPROVALS_FILE = path.join(DATA_DIR, "review-approvals.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize with default reviews if file doesn't exist (local fallback)
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

async function readApprovals(): Promise<Record<string, boolean>> {
  await ensureDataDir()
  try {
    const raw = await fs.readFile(APPROVALS_FILE, "utf8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeApprovals(map: Record<string, boolean>) {
  await ensureDataDir()
  await fs.writeFile(APPROVALS_FILE, JSON.stringify(map, null, 2))
}

function hasHostawayCreds() {
  return !!(process.env.HOSTAWAY_CLIENT_ID && process.env.HOSTAWAY_CLIENT_SECRET)
}

export async function GET(request: NextRequest) {
  try {
    // If Hostaway is configured, fetch live reviews and overlay approval flags
    if (hasHostawayCreds()) {
      try {
        const { searchParams } = new URL(request.url)
        const listingId = searchParams.get("listingId") || undefined
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined
        const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined
        const remote = await fetchHostawayReviews({ listingId, limit, offset })
        const approvals = await readApprovals()
        const normalized = remote.map((r: any) => {
          const base = normalizeHostawayReview(r)
          const isPublic = approvals[base.approvalKey] ?? false
          return { ...base, isPublic }
        })
        return NextResponse.json(normalized)
      } catch (err) {
        console.error("Hostaway fetch failed, falling back to local reviews:", err)
      }
    }

    // Fallback: local JSON file
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
    const body = await request.json()

    // If Hostaway is configured, interpret POST as approval updates
    if (hasHostawayCreds()) {
      // Supported shapes:
      // 1) Array of reviews [{ id, listingId?, isPublic, ... }]
      // 2) { approvalUpdates: [{ approvalKey, isPublic }] }
      // 3) { approvalKey, isPublic }
      const approvals = await readApprovals()

      const updates: Array<{ key: string; value: boolean }> = []

      if (Array.isArray(body)) {
        for (const item of body) {
          const key = item.approvalKey || computeApprovalKey({ id: item.id, listingId: item.listingId })
          if (typeof item.isPublic === "boolean") updates.push({ key, value: item.isPublic })
        }
      } else if (body && Array.isArray(body.approvalUpdates)) {
        for (const u of body.approvalUpdates) {
          if (u && typeof u.approvalKey === "string" && typeof u.isPublic === "boolean") {
            updates.push({ key: u.approvalKey, value: u.isPublic })
          }
        }
      } else if (body && typeof body.approvalKey === "string" && typeof body.isPublic === "boolean") {
        updates.push({ key: body.approvalKey, value: body.isPublic })
      }

      if (updates.length === 0) {
        return NextResponse.json({ error: "No approval updates provided" }, { status: 400 })
      }

      for (const u of updates) {
        approvals[u.key] = u.value
      }
      await writeApprovals(approvals)
      return NextResponse.json({ success: true, updated: updates.length })
    }

    // Fallback behavior: store full reviews array locally (legacy demo mode)
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(body, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving reviews:", error)
    return NextResponse.json({ error: "Failed to save reviews" }, { status: 500 })
  }
}

