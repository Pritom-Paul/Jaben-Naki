export default function Footer() {
  return (
    <footer className="bg-background text-foreground dark:bg-gray-900 dark:text-white py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-indigo-500 dark:text-indigo-400 mb-3">Jaben Naki?</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
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
            <ul className="space-y-1.5 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About Us</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Press</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground">Safety Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-muted-foreground">
          <p>&copy; 2025 Jaben Naki? All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}