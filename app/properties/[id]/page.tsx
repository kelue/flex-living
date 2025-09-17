import { PropertyGallery } from "@/components/property-gallery"
import { PropertyDetails } from "@/components/property-details"
import { BookingPanel } from "@/components/booking-panel"
import { ApprovedReviews } from "@/components/approved-reviews"
import { headers } from "next/headers"

async function getProperty(id: number) {
  const h = headers()
  const proto = h.get("x-forwarded-proto") || "http"
  const host = h.get("host")
  const base = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "http://localhost:3000")
  const res = await fetch(`${base}/api/properties/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function getReviewsForProperty(name: string) {
  const h = headers()
  const proto = h.get("x-forwarded-proto") || "http"
  const host = h.get("host")
  const base = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "http://localhost:3000")
  const res = await fetch(`${base}/api/reviews`, { cache: "no-store" })
  if (!res.ok) return { total: 0, publicCount: 0, avg: undefined }
  const list = await res.json()
  const propertyReviews = list.filter((r: any) => r.property === name)
  const publicOnes = propertyReviews.filter((r: any) => r.isPublic)
  const avg = publicOnes.length ? publicOnes.reduce((s: number, r: any) => s + (r.rating || 0), 0) / publicOnes.length : undefined
  return { total: propertyReviews.length, publicCount: publicOnes.length, avg }
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
  const rev = await getReviewsForProperty(property.name)
  const summary = `${property.category} • ${property.guests || 0} guests • ${property.bedrooms || 0} ${property.bedrooms === 1 ? "bedroom" : "bedrooms"} • ${property.bathrooms || 0} ${property.bathrooms === 1 ? "bath" : "baths"}`
  return (
    <div className="space-y-10 mx-[30px] lg:mx-[10rem]">
      <PropertyGallery images={property.gallery} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Details */}
        <div className="lg:col-span-2 space-y-6 mx-[30px] lg:px-[5rem]">
          <PropertyDetails
            name={property.name}
            summary={summary}
            description={property.description}
            amenities={property.amenities || []}
            rating={typeof rev.avg === "number" ? rev.avg : undefined}
            reviewCount={rev.total}
            lat={typeof property.lat === "number" ? property.lat : undefined}
            lng={typeof property.lng === "number" ? property.lng : undefined}
          />
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


