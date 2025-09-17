import { Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t mt-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-teal-700 rounded flex items-center justify-center">
              <div className="text-white font-bold text-xs">
                <div>FLEX</div>
                <div>LIVING</div>
              </div>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Terms and conditions
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+447723745646</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@theflexliving.com</span>
            </div>
          </div>
        </div>
    </footer>
  )
}
