import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Users } from "lucide-react"

export function BookingPanel() {
  return (
    <Card className="p-6 rounded-2xl shadow-md">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select dates and number of guests to see the total price per night</p>

        {/* Date and Guest Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-300 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:border-gray-400 bg-white">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Select Dates</span>
          </div>
          <div className="border border-gray-300 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:border-gray-400 bg-white">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">1</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 flex justify-center gap-4">
          <Button className="w-1/3 bg-teal-700 hover:bg-teal-800 text-white rounded-full h-12 text-base">Book now</Button>
          <Button variant="outline" className="w-1/3 bg-white rounded-full h-12 text-base">
            Send Inquiry
          </Button>
        </div>
      </div>
    </Card>
  )
}
