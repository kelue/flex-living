import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function initializeProperties() {
  await ensureDataDir()
  try {
    await fs.access(PROPERTIES_FILE)
  } catch {
    const defaults = [
      {
        id: 1,
        name: "Beautiful Pimlico Flat",
        category: "Apartment",
        channel: "Airbnb",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Cozy Westminster Studio",
        category: "Studio",
        channel: "Booking.com",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Luxury Kensington Suite",
        category: "Suite",
        channel: "Direct",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Modern Chelsea Apartment",
        category: "Apartment",
        channel: "Direct",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]
    await fs.writeFile(PROPERTIES_FILE, JSON.stringify(defaults, null, 2))
  }
}

export async function GET() {
  try {
    await initializeProperties()
    const content = await fs.readFile(PROPERTIES_FILE, "utf8")
    const properties = JSON.parse(content)
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error reading properties:", error)
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeProperties()
    const body = await request.json()
    const { name, category, channel } = body || {}
    if (!name || !category || !channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const content = await fs.readFile(PROPERTIES_FILE, "utf8")
    const properties = JSON.parse(content)
    const nextId = properties.length > 0 ? Math.max(...properties.map((p: any) => p.id)) + 1 : 1
    const newProperty = {
      id: nextId,
      name,
      category,
      channel,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    const updated = [...properties, newProperty]
    await fs.writeFile(PROPERTIES_FILE, JSON.stringify(updated, null, 2))
    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error("Error saving property:", error)
    return NextResponse.json({ error: "Failed to save property" }, { status: 500 })
  }
}


