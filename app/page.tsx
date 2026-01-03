import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plane, MapPin, Calendar, DollarSign, Compass, Users, Globe, Sparkles, TrendingUp, Camera, Map, Cloud, Package } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Your Adventure Starts Here</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Explore. Plan. Travel.
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-2xl mx-auto leading-relaxed">
              Transform your travel dreams into reality with intelligent trip planning, 
              real-time insights, and a community of adventurers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 h-auto shadow-xl">
                  <Globe className="mr-2 h-5 w-5" />
                  Start Planning Free
                </Button>
              </Link>
              <Link href="/search/cities">
                <Button size="lg" variant="outline" className="text-lg border-2 border-white text-white hover:bg-white/10 px-8 py-6 h-auto backdrop-blur-sm">
                  <Compass className="mr-2 h-5 w-5" />
                  Explore Destinations
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>1000+ Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Smart Budget Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span>Collaborative Planning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Plane className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce" style={{ animationDelay: '300ms' }}>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Camera className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Travel Better</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make trip planning effortless and enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <MapPin className="h-14 w-14 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Smart Destination Discovery</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore 1000+ cities with AI-powered recommendations, cost insights, and popularity ratings
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <Calendar className="h-14 w-14 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Interactive Itineraries</h3>
            <p className="text-gray-600 leading-relaxed">
              Build detailed day-by-day plans with activities, maps, and timeline views
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <DollarSign className="h-14 w-14 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Budget Intelligence</h3>
            <p className="text-gray-600 leading-relaxed">
              Track expenses in real-time with automatic categorization and spending insights
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <Map className="h-14 w-14 text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Interactive Maps</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize your journey with beautiful maps showing routes and points of interest
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-rose-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <Users className="h-14 w-14 text-rose-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Share & Collaborate</h3>
            <p className="text-gray-600 leading-relaxed">
              Share your trips with friends and family, or discover others' amazing adventures
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <TrendingUp className="h-14 w-14 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Travel Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Get insights on your travel patterns, spending habits, and favorite destinations
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-teal-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <Cloud className="h-14 w-14 text-teal-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Weather Forecasts</h3>
            <p className="text-gray-600 leading-relaxed">
              Check weather conditions for your destinations to pack and plan accordingly
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <Package className="h-14 w-14 text-yellow-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Smart Packing Lists</h3>
            <p className="text-gray-600 leading-relaxed">
              Get personalized packing suggestions based on your destination and trip duration
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-pink-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <Camera className="h-14 w-14 text-pink-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Photo Galleries</h3>
            <p className="text-gray-600 leading-relaxed">
              Document your journey with beautiful photo galleries for each destination
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-gray-300">Cities Worldwide</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-gray-300">Happy Travelers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-gray-300">Trips Planned</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9★</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who are already planning their dream trips with GlobeTrotter
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg bg-white text-blue-600 hover:bg-blue-50 px-10 py-7 h-auto shadow-2xl text-xl">
              <Sparkles className="mr-2 h-6 w-6" />
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
