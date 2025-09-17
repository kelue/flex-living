import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { fetchHostawayListingById, normalizeHostawayListing, getHostawayAmenityMap } from "@/lib/hostaway"

const DATA_DIR = path.join(process.cwd(), "data")
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readProperties() {
  await ensureDataDir()
  try {
    const content = await fs.readFile(PROPERTIES_FILE, "utf8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

async function writeProperties(list: any[]) {
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(list, null, 2))
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const updates = await request.json()
    const props = await readProperties()
    const idx = props.findIndex((p: any) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const updated = { ...props[idx], ...updates, id }
    props[idx] = updated
    await writeProperties(props)
    return NextResponse.json(updated)
  } catch (e) {
    console.error("Error updating property:", e)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const props = await readProperties()
    const idx = props.findIndex((p: any) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const removed = props[idx]
    props.splice(idx, 1)
    await writeProperties(props)
    return NextResponse.json({ success: true, removed })
  } catch (e) {
    console.error("Error deleting property:", e)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}

function hasHostawayCreds() {
  return !!(process.env.HOSTAWAY_CLIENT_ID && process.env.HOSTAWAY_CLIENT_SECRET)
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (hasHostawayCreds()) {
      try {
        const [item, amenityMap] = await Promise.all([
          fetchHostawayListingById(params.id),
          getHostawayAmenityMap(),
        ])
        if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
        const normalized = normalizeHostawayListing(item, { amenityMap })
        return NextResponse.json(normalized)
      } catch (err) {
        console.error("Hostaway listing fetch failed, falling back to local:", err)
      }
    }

    // Fallback to local file storage
    const DATA_DIR = path.join(process.cwd(), "data")
    const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")
    const content = await fs.readFile(PROPERTIES_FILE, "utf8").catch(() => "[]")
    const list = JSON.parse(content)
    const numId = Number(params.id)
    const found = list.find((p: any) => p.id === numId)
    if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(found)
  } catch (e) {
    console.error("Error reading property:", e)
    return NextResponse.json({ error: "Failed to load property" }, { status: 500 })
  }
}


