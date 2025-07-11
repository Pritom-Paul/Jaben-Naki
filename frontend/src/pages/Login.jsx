/*************  ✨ Windsurf Command 🌟  *************/
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, ArrowLeft, Globe, Eye, EyeOff } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError("")
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (response.ok && data.access) {
        localStorage.setItem("token", data.access)
        // Optionally redirect or update UI
        window.location.href = "/" // Redirect to home or dashboard
      } else {
        setApiError(data.detail || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      setApiError("Network error. Please try again later.")
    }
    setIsLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md flex flex-col gap-6"
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-indigo-500 dark:text-indigo-300">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground">Login with your Apple or Google account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full bg-indigo-50 dark:bg-gray-900 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-gray-700" type="button">
                    {/* Google SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                    </svg>
                    Login with Google
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-white dark:bg-gray-800 text-muted-foreground relative z-10 px-2">Or continue with</span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="your username"
                      required
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="bg-indigo-50 dark:bg-gray-900 border-indigo-200 dark:border-gray-700 text-indigo-700 dark:text-indigo-200"
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="#" className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="bg-indigo-50 dark:bg-gray-900 border-indigo-200 dark:border-gray-700 text-indigo-700 dark:text-indigo-200 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}
                  <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4 text-indigo-600 hover:text-indigo-700">Sign up</Link>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <Link to="#" className="text-indigo-600 hover:text-indigo-700">Terms of Service</Link> and <Link to="#" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link>.
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

/*******  dbe669a2-9b1e-48cc-b48e-38cea700ab45  *******/