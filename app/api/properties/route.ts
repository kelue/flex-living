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
    const now = new Date().toISOString()
    const defaults = [
      {
        id: 1,
        name: "Beautiful Pimlico Flat",
        category: "Apartment",
        channel: "Airbnb",
        isActive: true,
        createdAt: now,
        guests: 4,
        bedrooms: 1,
        bathrooms: 1,
        description:
          "Spacious apartment in Pimlico near Victoria Station with quality amenities and great access to transport.",
        amenities: [
          { icon: "wifi", label: "Free WiFi" },
          { icon: "internet", label: "Internet" },
          { icon: "home", label: "Private living room" },
          { icon: "essentials", label: "Essentials" },
          { icon: "bath", label: "Towels" },
          { icon: "kitchen", label: "Kitchen" },
        ],
        gallery: [
          "/modern-living-room-with-green-sofa-and-navy-chair.jpg",
          "/modern-bedroom-with-white-bedding.jpg",
          "/modern-bathroom-with-round-mirror.jpg",
          "/modern-white-kitchen.jpg",
          "/modern-living-space-with-green-accents.jpg",
        ],
        houseRules: { checkIn: "15:00", checkOut: "10:00", petsAllowed: false, smokingAllowed: false },
        cancellationPolicy: "100% refund up to 14 days before arrival",
        address: "Pimlico, London, UK",
        mapImage: "/london-map-showing-pimlico-area-with-red-pin-marke.jpg",
      },
      {
        id: 2,
        name: "Cozy Westminster Studio",
        category: "Studio",
        channel: "Booking.com",
        isActive: true,
        createdAt: now,
        guests: 2,
        bedrooms: 0,
        bathrooms: 1,
        description: "Compact and comfortable studio in Westminster, ideal for short stays.",
        amenities: [
          { icon: "wifi", label: "Free WiFi" },
          { icon: "kitchen", label: "Kitchenette" },
        ],
        gallery: [],
        houseRules: { checkIn: "15:00", checkOut: "10:00", petsAllowed: false, smokingAllowed: false },
        cancellationPolicy: "Flexible",
        address: "Westminster, London, UK",
        mapImage: "/london-map-showing-pimlico-area-with-red-pin-marke.jpg",
      },
      {
        id: 3,
        name: "Luxury Kensington Suite",
        category: "Suite",
        channel: "Direct",
        isActive: true,
        createdAt: now,
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: "Elegant suite in Kensington with premium finishes.",
        amenities: [],
        gallery: [],
        houseRules: { checkIn: "15:00", checkOut: "10:00", petsAllowed: false, smokingAllowed: false },
        cancellationPolicy: "Moderate",
        address: "Kensington, London, UK",
        mapImage: "/london-map-showing-pimlico-area-with-red-pin-marke.jpg",
      },
      {
        id: 4,
        name: "Modern Chelsea Apartment",
        category: "Apartment",
        channel: "Direct",
        isActive: true,
        createdAt: now,
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        description: "Modern apartment in Chelsea with stylish interiors.",
        amenities: [],
        gallery: [],
        houseRules: { checkIn: "15:00", checkOut: "10:00", petsAllowed: false, smokingAllowed: false },
        cancellationPolicy: "Moderate",
        address: "Chelsea, London, UK",
        mapImage: "/london-map-showing-pimlico-area-with-red-pin-marke.jpg",
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
      guests: Number(body.guests) || 0,
      bedrooms: Number(body.bedrooms) || 0,
      bathrooms: Number(body.bathrooms) || 0,
      description: body.description || "",
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      houseRules: body.houseRules || { checkIn: "", checkOut: "", petsAllowed: false, smokingAllowed: false },
      cancellationPolicy: body.cancellationPolicy || "",
      address: body.address || "",
      mapImage: body.mapImage || "",
    }
    const updated = [...properties, newProperty]
    await fs.writeFile(PROPERTIES_FILE, JSON.stringify(updated, null, 2))
    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error("Error saving property:", error)
    return NextResponse.json({ error: "Failed to save property" }, { status: 500 })
  }
}


