import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function PropertyGallery({ images }: { images?: string[] }) {
  return (
    <div className="relative">
      {/* Overlay badges positioned relative to gallery */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1">All listings</Badge>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-3 py-1 flex items-center gap-1">
          4.85 <Star className="w-3 h-3 fill-current" />
        </Badge>
      </div>
      <div className="absolute bottom-3 right-3 z-10">
        <Badge className="bg-white/90 text-gray-900 hover:bg-white rounded-full px-3 py-1">📷 + 39 photos</Badge>
      </div>

      {/* Main gallery grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 rounded-2xl overflow-hidden">
        {/* Large left image */}
        <div className="col-span-2 row-span-2">
          <img
            src={(images && images[0]) || "/modern-living-room-with-green-sofa-and-navy-chair.jpg"}
            alt="Living room"
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Right column images */}
        <img
          src={(images && images[1]) || "/modern-bedroom-with-white-bedding.jpg"}
          alt="Bedroom"
          className="w-full h-[196px] object-cover"
        />
        <img
          src={(images && images[2]) || "/modern-bathroom-with-round-mirror.jpg"}
          alt="Bathroom"
          className="w-full h-[196px] object-cover"
        />
        <img
          src={(images && images[3]) || "/modern-white-kitchen.jpg"}
          alt="Kitchen"
          className="w-full h-[196px] object-cover"
        />
        <img
          src={(images && images[4]) || "/modern-living-space-with-green-accents.jpg"}
          alt="Living space"
          className="w-full h-[196px] object-cover"
        />
      </div>
    </div>
  )
}
