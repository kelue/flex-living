export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 mb-5">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-teal-700 rounded flex items-center justify-center">
            <div className="text-white text-sm font-bold">FL</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">
            Flex Living
          </a>
          <a href="/properties" className="text-gray-700 hover:text-gray-900 font-medium">
            All listings
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            About Us
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Contact Us
          </a>
          <a href="/admin" className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 font-medium">
            Admin
          </a>
        </nav>
      </div>
    </header>
  )
}
