import { promises as fs } from "fs"
import path from "path"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyDetails } from "@/components/property-details"
import { BookingPanel } from "@/components/booking-panel"
import { ApprovedReviews } from "@/components/approved-reviews"

async function getProperty(id: number) {
  const file = path.join(process.cwd(), "data", "properties.json")
  try {
    const content = await fs.readFile(file, "utf8")
    const list = JSON.parse(content)
    return list.find((p: any) => p.id === id) || null
  } catch {
    return null
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const property = await getProperty(id)
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground">Property not found</div>
      </div>
    )
  }
  const summary = `${property.category} • ${property.guests || 0} guests • ${property.bedrooms || 0} ${property.bedrooms === 1 ? "bedroom" : "bedrooms"} • ${property.bathrooms || 0} ${property.bathrooms === 1 ? "bath" : "baths"}`
  return (
    <div className="space-y-10 mx-[30px] lg:mx-[10rem]">
      <PropertyGallery images={property.gallery} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Details */}
        <div className="lg:col-span-2 space-y-6 mx-[30px] lg:px-[5rem]">
          <PropertyDetails name={property.name} summary={summary} description={property.description} amenities={property.amenities || []} />
        </div>

        {/* Right side - Booking Panel and Approved Reviews */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
          <BookingPanel />
          <ApprovedReviews propertyName={property.name} />
        </div>
      </div>
    </div>
  )
}


