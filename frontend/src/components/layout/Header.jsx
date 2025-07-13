"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useTheme } from "../theme-provider"
import { ThemeToggle } from "../theme-toggle"
import { Link } from "react-router-dom"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check auth status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    // Optional: redirect to home page
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/50 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-500">Jaben Naki?</h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-sm font-medium text-foreground hover:text-indigo-500">Home</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-indigo-500">Features</a>
            <a href="/trips" className="text-sm font-medium text-muted-foreground hover:text-indigo-500">Explore Trips</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-indigo-500">Contact</a>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-muted-foreground hover:text-foreground p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t mt-2">
            <div className="py-3 space-y-2">
              <a href="#home" className="block px-3 py-2 text-base text-foreground hover:text-indigo-500">Home</a>
              <a href="#features" className="block px-3 py-2 text-base text-muted-foreground hover:text-indigo-500">Features</a>
              <Link to="/trips" className="block px-3 py-2 text-base text-muted-foreground hover:text-indigo-500">Explore Trips</Link>
              <a href="#contact" className="block px-3 py-2 text-base text-muted-foreground hover:text-indigo-500">Contact</a>
              <div className="flex space-x-2 px-3">
                {isLoggedIn ? (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <Button size="sm" className="w-full bg-indigo-500 hover:bg-indigo-600">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}