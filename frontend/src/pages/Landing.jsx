"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Users,
  MessageCircle,
  Shield,
  UserPlus,
  Search,
  Calendar,
  Star,
  ArrowRight,
  Plane,
  Globe,
  Heart,
} from "lucide-react"
import Header from "@/components/layout/Header";
import Footer from  "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

// Card hover animation variants
const cardHover = {
  rest: { scale: 1, rotateX: 0, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" },
  hover: {
    scale: 1.04,
    rotateX: 8,
    boxShadow: "0 12px 32px 0 rgba(80,80,180,0.10)",
    transition: { type: "spring", stiffness: 300, damping: 18 }
  }
}

const cardDetails = [
  {
    title: "Sundarbans Adventure",
    date: "15-22 March, 2024",
    budget: "৳6,000 - ৳8,000",
    activities: ["Culture", "Food", "প্রকৃতি"],
  },
  {
    title: "Cox's Bazar Beach Trip",
    date: "5-8 April, 2024",
    budget: "৳4,500 - ৳7,000",
    activities: ["Sea", "Beach Sports", "Fish Fry"],
  },
  {
    title: "Srimangal Tea Tour",
    date: "20-23 May, 2024",
    budget: "৳3,000 - ৳5,000",
    activities: ["Tea Garden", "Cycling", "Nature"],
  },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % cardDetails.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {/* Hero Section */}
      <motion.section
        id="home"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            >
              <Badge
                variant="secondary"
                className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
              >
                <Plane className="w-4 h-4 mr-2" />
                Travel Smarter Together
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Find your next <span className="text-indigo-500">travel buddy</span>.{" "}
                <span className="text-cyan-500">Plan. Connect. Go.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Solo travel, made social and safe. Connect with like-minded travelers, plan amazing adventures, and
                create memories that last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Trips
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 bg-transparent"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Create a Trip
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative h-[300px]"> {/* Adjust height as needed */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cardIndex}
                    initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -40, scale: 0.96, filter: "blur(6px)" }}
                    transition={{ duration: 0.7, ease: [0.4, 0.2, 0.2, 1] }}
                    className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cardDetails[cardIndex].title}</h3>
                        <p className="text-sm text-muted-foreground">{cardDetails[cardIndex].date}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Travelers</span>
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-white">
                            +3
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Budget</span>
                        <span className="text-sm font-medium">{cardDetails[cardIndex].budget}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Activities</span>
                        <div className="flex space-x-1">
                          {cardDetails[cardIndex].activities.map((act, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{act}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need for <span className="text-indigo-500">amazing trips</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From planning to execution, we've got all the tools to make your travel dreams come true
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[0,1,2,3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                variants={cardHover}
                whileHover="hover"
                animate="rest"
                style={{ perspective: 800 }}
              >
                {/* Card content: replace with actual Card JSX below */}
                {{
                  0: <Card className="text-center transition-shadow border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
                    <CardHeader>
                      <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-indigo-700 dark:text-indigo-300">Create Trips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        Plan trips with full control over destinations, dates, budget, and activities. Your adventure, your
                        way.
                      </CardDescription>
                    </CardContent>
                  </Card>,

                  1: <Card className="text-center transition-shadow border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900">
                    <CardHeader>
                      <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-cyan-700 dark:text-cyan-300">Join Adventures</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        Discover trips that match your interests, budget, and travel style. Find your perfect travel
                        companions.
                      </CardDescription>
                    </CardContent>
                  </Card>,

                  2: <Card className="text-center transition-shadow border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-green-700 dark:text-green-300">Real-time Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        Coordinate with your crew through integrated messaging. Share updates, photos, and excitement in
                        real-time.
                      </CardDescription>
                    </CardContent>
                  </Card>,

                  3: <Card className="text-center transition-shadow border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                    <CardHeader>
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Build Trust</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        Verified profiles, reviews, and shared interests help you connect with trustworthy travel companions.
                      </CardDescription>
                    </CardContent>
                  </Card>
                }[i]}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How <span className="text-indigo-500">Jaben Naki?</span> works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Three simple steps to your next adventure</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[0,1,2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                {/* How It Works step: replace with actual JSX below */}
                {{
                  0: <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto">
                      <UserPlus className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Sign up & create a profile</h3>
                  <p className="text-muted-foreground text-lg">
                    Tell us about your travel style, interests, and preferences. Build a profile that attracts the right
                    travel buddies.
                  </p>
                </div>,

                  1: <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Discover or create trips</h3>
                  <p className="text-muted-foreground text-lg">
                    Browse existing adventures or create your own. Filter by destination, dates, budget, and activities to
                    find perfect matches.
                  </p>
                </div>,

                  2: <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Chat, plan, and travel together</h3>
                  <p className="text-muted-foreground text-lg">
                    Connect with your travel group, finalize plans, and embark on unforgettable adventures with new friends.
                  </p>
                </div>
                }[i]}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What travelers are saying</h2>
            <p className="text-xl text-muted-foreground">Real stories from real adventures</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[0,1,2].map((i) => (
              <motion.div
                key={i}
                variants={cardHover}
                whileHover="hover"
                animate="rest"
                style={{ perspective: 800 }}
              >
                {/* Testimonial card content: replace with actual Card JSX below */}
                { {
                  0: <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
                        <div>
                          <CardTitle className="text-lg">Sabina Rahman</CardTitle>
                          <CardDescription>Backpacker from Dhaka</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        “Got amazing travel buddies for my Sundarbans trip! The planning tools were super easy, and I felt safe the whole journey.”
                      </p>
                    </CardContent>
                  </Card>,

                  1: <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                        <div>
                          <CardTitle className="text-lg">Rafi Islam</CardTitle>
                          <CardDescription>Adventure seeker from Chattogram</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        “As a solo traveler, Jaben Naki? changed my experience. Made new friends and explored places in Bangladesh I never knew!”
                      </p>
                    </CardContent>
                  </Card>,

                  2: <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></div>
                        <div>
                          <CardTitle className="text-lg">Nusrat Jahan</CardTitle>
                          <CardDescription>Digital nomad from Sylhet</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        “বিশ্বাস ও নিরাপত্তার ফিচারগুলো আমাকে আত্মবিশ্বাস দিয়েছে অপরিচিতদের সাথে ঘুরতে। প্রতিটি ট্রিপ ছিল দারুণভাবে সংগঠিত ও স্মরণীয়।”
                      </p>
                    </CardContent>
                  </Card>
                }[i]}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Ready to start your journey?
          </motion.h2>
          <motion.p
            className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Join thousands of travelers who've discovered the joy of social, safe, and unforgettable adventures.
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link to="/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
