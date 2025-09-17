import { Star, Wifi, Globe, Home, Package, Bath, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DualCalendar } from "@/components/dualcalendar"

interface Amenity { icon?: string; label: string }

export function PropertyDetails({
  name = "Beautiful Pimlico Flat near Victoria Station",
  summary = "Apartment • 4 guests • 1 bedroom • 1 bathroom",
  description = "This spacious apartment in Pimlico is ideal for anyone looking for comfort and convenience...",
  amenities = [
    { label: "Free WiFi" },
    { label: "Internet" },
    { label: "Private living room" },
    { label: "Essentials" },
    { label: "Towels" },
    { label: "Kitchen" },
  ] as Amenity[],
  rating,
  reviewCount,
  lat,
  lng,
}: {
  name?: string
  summary?: string
  description?: string
  amenities?: Amenity[]
  rating?: number
  reviewCount?: number
  lat?: number
  lng?: number
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

        <div className="text-gray-600">{summary}</div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{typeof rating === "number" ? rating.toFixed(2) : "—"}</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="text-gray-600">{typeof reviewCount === "number" ? `${reviewCount} reviews` : "No reviews yet"}</span>
        </div>

        <div className="text-gray-700 leading-relaxed">{description}</div>

        <Button variant="ghost" className="p-0 h-auto text-gray-900 underline hover:no-underline">
          Show more
        </Button>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {amenities.map((a, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {/* Simple icon selection by label */}
              {a.label.toLowerCase().includes("wifi") && <Wifi className="w-5 h-5 text-gray-600" />}
              {a.label.toLowerCase().includes("internet") && <Globe className="w-5 h-5 text-gray-600" />}
              {a.label.toLowerCase().includes("living") && <Home className="w-5 h-5 text-gray-600" />}
              {a.label.toLowerCase().includes("essential") && <Package className="w-5 h-5 text-gray-600" />}
              {a.label.toLowerCase().includes("towel") && <Bath className="w-5 h-5 text-gray-600" />}
              {a.label.toLowerCase().includes("kitchen") && <ChefHat className="w-5 h-5 text-gray-600" />}
              <span className="text-gray-700">{a.label}</span>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="p-0 h-auto text-gray-900 underline hover:no-underline">
          Show all 47 amenities
        </Button>
      </div>

      {/* Reviews content is rendered by ApprovedReviews in the right column */}

      <div className="border-t pt-8">
        <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden relative">
          {typeof lat === "number" && typeof lng === "number" ? (
            <>
              <iframe
                title="Property location map"
                className="w-full h-full"
                loading="lazy"
                src={(function () {
                  const d = 0.01
                  const minLon = lng - d
                  const minLat = lat - d
                  const maxLon = lng + d
                  const maxLat = lat + d
                  const bbox = `${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}`
                  const marker = `${lat}%2C${lng}`
                  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`
                })()}
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white bg-opacity-75 px-2 py-1 rounded"
              >
                View on OpenStreetMap
              </a>
            </>
          ) : (
            <img
              src="/london-map-showing-pimlico-area-with-red-pin-marke.jpg"
              alt="Map placeholder"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available days</h2>
        <DualCalendar />
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Good to know</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>Check-in: 3 pm</div>
              <div>Pets: not allowed</div>
              <div>Check-out: 10 am</div>
              <div>Smoking inside: not allowed</div>
            </div>
            <Button variant="ghost" className="p-0 h-auto text-gray-900 underline hover:no-underline mt-4">
              Show more
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
            <div className="text-gray-700">100% refund up to 14 days before arrival</div>
          </div>
        </div>
      </div>
    </div>
  )
}
