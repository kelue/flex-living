import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import { Badge } from "@/components/ui/badge"

async function getProperties() {
  const file = path.join(process.cwd(), "data", "properties.json")
  try {
    const content = await fs.readFile(file, "utf8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

export default async function PropertiesPage() {
  const properties = await getProperties()
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/" className="text-sm underline">Home</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p: any) => (
          <Link key={p.id} href={`/properties/${p.id}`} className="group border rounded-lg overflow-hidden bg-card">
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={p.gallery?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-red-500 text-white">All listings</Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-teal-700 text-white">{p.rating?.toFixed?.(2) || "4.60"}</Badge>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-semibold text-lg leading-snug">{p.name}</div>
              <div className="text-sm text-muted-foreground">
                {p.guests || 0} guests • {p.bedrooms || 0} {p.bedrooms === 1 ? "bedroom" : "bedrooms"} • {p.bathrooms || 0} {p.bathrooms === 1 ? "bath" : "baths"}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(p.amenities || []).slice(0, 3).map((a: any) => (
                  <Badge key={a.label} variant="outline">{a.label}</Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


