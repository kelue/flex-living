import { PropertyGallery } from "@/components/property-gallery"
import { PropertyDetails } from "@/components/property-details"
import { BookingPanel } from "@/components/booking-panel"
import { ApprovedReviews } from "@/components/approved-reviews"

export function PropertyListing() {
  return (
    <div className="">
      <PropertyGallery />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Gallery and Details */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyDetails />
        </div>

        {/* Right side - Booking Panel and Approved Reviews */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
          <BookingPanel />
          <ApprovedReviews /> 
        </div>
      </div>
    </div>
  )
}
