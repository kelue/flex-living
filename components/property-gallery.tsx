import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function PropertyGallery() {
  return (
    <div className="relative">
      {/* All listings badge */}
     

      {/* Main gallery grid */}
      <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
        {/* Large left image */}
        <div className="row-span-2">
          <div className="relative top-4 left-4 z-10">
            <Badge className="bg-red-500 hover:bg-red-600 text-white">All listings</Badge>
          </div>

          {/* Rating badge */}
          <div className="relative top-4 right-4 z-10">
            <Badge className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1">
              4.75 <Star className="w-3 h-3 fill-current" />
            </Badge>
          </div>

          {/* Photo count badge */}
          <div className="relative bottom-4 right-4 z-10">
            <Badge className="bg-white/90 text-gray-900 hover:bg-white">📷 + 17 photos</Badge>
          </div>
          <img src="/modern-living-room-with-green-sofa-and-navy-chair.jpg" alt="Living room" className="w-full h-full object-cover" />
        </div>

        {/* Top right images */}
        <div className="grid grid-cols-2 gap-2">
          <img src="/modern-bedroom-with-white-bedding.jpg" alt="Bedroom" className="w-full h-full object-cover" />
          <img src="/modern-bathroom-with-round-mirror.jpg" alt="Bathroom" className="w-full h-full object-cover" />
        </div>

        {/* Bottom right images */}
        <div className="grid grid-cols-2 gap-2">
          <img src="/modern-white-kitchen.jpg" alt="Kitchen" className="w-full h-full object-cover" />
          <img src="/modern-living-space-with-green-accents.jpg" alt="Living space" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
