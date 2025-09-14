import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Users } from "lucide-react"

export function BookingPanel() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select dates and number of guests to see the total price per night</p>

        {/* Date and Guest Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-gray-400">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Select Dates</span>
          </div>
          <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-gray-400">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">1</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">Book now</Button>
          <Button variant="outline" className="w-full bg-transparent">
            Send Inquiry
          </Button>
        </div>
      </div>
    </Card>
  )
}
