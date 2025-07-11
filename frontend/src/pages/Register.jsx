import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowLeft, Globe } from "lucide-react"
import Header from "@/components/layout/Header";
import Footer from  "@/components/layout/Footer"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profilePhoto: null,
    interests: [],
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const apiData = new FormData();
      apiData.append("username", formData.username);
      apiData.append("email", formData.email);
      apiData.append("password", formData.password);
      if (formData.bio.trim()) apiData.append("bio", formData.bio);
      if (formData.profilePhoto) apiData.append("profile_photo", formData.profilePhoto);
      formData.interests.forEach((interest) => {
        apiData.append("interests", interest);
      });
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        body: apiData,
      });
      const data = await response.json();
      if (response.ok && data.access) {
        localStorage.setItem("token", data.access);
        window.location.href = "/";
      } else {
        // Collect all error messages from backend
        let errorMsg = "Registration failed. Please check your details.";
        if (data.detail) errorMsg = data.detail;
        else if (typeof data === "object") {
          errorMsg = Object.values(data).flat().join(" ");
        }
        setApiError(errorMsg);
      }
    } catch (err) {
      setApiError("Network error. Please try again later.");
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl flex flex-col gap-6">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-indigo-500 dark:text-indigo-300">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">Sign up with your Google or Facebook account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full bg-indigo-50 dark:bg-gray-900 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-gray-700" type="button" onClick={() => handleSocialLogin("Google")}> 
                    {/* Google SVG */}
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-white dark:bg-gray-800 text-muted-foreground relative z-10 px-2">Or continue with email</span>
                </div>
                <div className="grid gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="johndoe123"
                        className="pl-10"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                      />
                    </div>
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                    <p className="text-xs text-muted-foreground">Only letters, numbers, and underscores allowed</p>
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
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
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  {/* Bio (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      Bio <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <textarea
                      id="bio"
                      placeholder="Tell other travelers about yourself, your travel experiences, and what you're looking for in a travel buddy..."
                      className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/500 characters</p>
                  </div>
                  {/* Profile Photo (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto">
                      Profile Photo <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {formData.profilePhoto ? (
                          <img
                            src={URL.createObjectURL(formData.profilePhoto) || "/placeholder.svg"}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          id="profilePhoto"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            handleInputChange("profilePhoto", file)
                          }}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  {/* Interests (Optional) */}
                  <div className="space-y-2">
                    <Label>
                      Interests <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select your travel interests to help match with compatible travel buddies
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Adventure Sports",
                        "Cultural Sites",
                        "Food & Dining",
                        "Nightlife",
                        "Photography",
                        "Nature & Wildlife",
                        "Museums & Art",
                        "Beach & Water",
                        "Mountains & Hiking",
                        "Shopping",
                        "Local Experiences",
                        "Budget Travel",
                        "Luxury Travel",
                        "Backpacking",
                        "Road Trips",
                        "City Exploration",
                      ].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange("interests", [...formData.interests, interest])
                            } else {
                              handleInputChange(
                                "interests",
                                formData.interests.filter((i) => i !== interest),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={interest} className="text-sm font-normal cursor-pointer">
                          {interest}
                        </Label>
                      </div>
                    ))}
                    </div>
                    {formData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="agreeToTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link to="#" className="text-indigo-600 hover:text-indigo-700 underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="#" className="text-indigo-600 hover:text-indigo-700 underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </div>
                    {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToMarketing"
                        checked={formData.agreeToMarketing}
                        onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="agreeToMarketing"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I'd like to receive travel tips, destination guides, and special offers via email
                        </Label>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                  {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4 text-indigo-600 hover:text-indigo-700">Sign in</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
