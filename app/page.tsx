import { Header } from "@/components/header"
import { PropertyListing } from "@/components/property-listing"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto lg:px-30 py-8">
        <PropertyListing />
      </main>
    </div>
  )
}
