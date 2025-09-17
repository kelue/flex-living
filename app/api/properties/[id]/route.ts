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


