import { Star, Wifi, Globe, Home, Package, Bath, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar02 } from "@/components/calendar02"

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
}: {
  name?: string
  summary?: string
  description?: string
  amenities?: Amenity[]
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

        <div className="text-gray-600">{summary}</div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.75</span>
          </div>
          <span className="text-gray-600">•</span>
          <a href="#" className="text-gray-600 underline hover:text-gray-900">
            7 reviews
          </a>
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

      <div className="border-t pt-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-lg">4.75</span>
            <span className="text-gray-600">(7)</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Review 1 - Jean-Damien */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-none text-gray-300" />
                <Star className="w-4 h-4 fill-none text-gray-300" />
                <Star className="w-4 h-4 fill-none text-gray-300" />
              </div>
              <span className="font-medium text-gray-900">Jean-Damien</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">August 2025</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Positive: Location is central London and next to the subway. Easy to recover the keys from a lock box in
              the nearby street. Everything listed in the apartment is present. Negative: Unfortunately, the pictures on
              the website versus the reality made the experience very strange. We did not pay enoug...
            </p>
            <Button variant="ghost" className="p-0 h-auto text-gray-900 underline hover:no-underline mt-2">
              Show more
            </Button>
          </div>

          {/* Review 2 - Mariusz */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-none text-gray-300" />
              </div>
              <span className="font-medium text-gray-900">Mariusz</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">August 2025</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Pobyt bardzo udany, zaspokojone oczekiwania, bardzo miłe wspomnienia. Positive: Świetna lokalizacja,
              blisko do ciekawych obiektów a jak brak sił to metro po drugiej stronie ulicy autobus za rogiem. Sklep
              kawalek dalej. Cicha okolica. Lokal spełniał moje potrzeby za kwotę jaką przeznaczyłem do...
            </p>
            <Button variant="ghost" className="p-0 h-auto text-gray-900 underline hover:no-underline mt-2">
              Show more
            </Button>
          </div>

          {/* Review 3 - Elton */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              </div>
              <span className="font-medium text-gray-900">Elton</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">June 2025</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Si propre, si douillet, si bon Positive: Cette unité a redéfini la propreté et le confort pour nous.
              L'ambiance était invitante et les petits extras comme les collations et les articles de toilette ont été
              très appréciés. On sent vraiment que l'hôte se soucie des autres.
            </p>
          </div>

          {/* Review 4 - Noelle */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              </div>
              <span className="font-medium text-gray-900">Noelle</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">June 2025</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Une expérience, pas seulement un séjour Positive: Ce n'était pas seulement un endroit où dormir, c'était
              un des points forts de notre voyage. Les petites attentions et l'atmosphère calme ont laissé une
              impression durable. Nous le recommanderons à tous ceux que nous connaissons.
            </p>
          </div>

          {/* Review 5 - Rosemary */}
          <div className="pb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              </div>
              <span className="font-medium text-gray-900">Rosemary</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">June 2025</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Perfekter Aufenthalt zuhause Positive: Es war gemütlich und perfekt, genau so, wie ich es mag.
            </p>
          </div>
        </div>

        <Button variant="ghost" className="p-0 h-auto text-gray-900 underline hover:no-underline mt-4">
          Show all 7 reviews
        </Button>
      </div>

      <div className="border-t pt-8">
        <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden relative">
          <img
            src="/london-map-showing-pimlico-area-with-red-pin-marke.jpg"
            alt="Map showing property location in Pimlico, London"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <button className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-700 hover:bg-gray-50">
              +
            </button>
            <button className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-700 hover:bg-gray-50">
              −
            </button>
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white bg-opacity-75 px-2 py-1 rounded">
            Leaflet, © OpenStreetMap, Report a map error
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available days</h2>
        <Calendar02 />
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
