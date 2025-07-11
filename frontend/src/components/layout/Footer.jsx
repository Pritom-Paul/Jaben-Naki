export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-indigo-400 mb-3">Jaben Naki?</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting solo travelers worldwide to create safe, social, and unforgettable adventures together.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 cursor-pointer">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 cursor-pointer">
                <span className="text-sm font-bold">i</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Safety Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Jaben Naki? All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}