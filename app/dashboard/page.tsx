'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TripCard } from '@/components/trip-card'
import { Plus, Loader2, MapPin, Calendar, DollarSign, TrendingUp, Globe, Plane, Heart, Map } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalCities: 0,
    totalBudget: 0,
    avgTripDuration: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [expenseData, setExpenseData] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips()
    }
  }, [status])

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips')
      const data = await response.json()
      setTrips(data)

      // Calculate stats
      const now = new Date()
      const upcoming = data.filter((trip: any) => new Date(trip.startDate) > now)
      const totalCities = data.reduce((sum: number, trip: any) => sum + trip.stops.length, 0)
      const totalBudget = data.reduce((sum: number, trip: any) => {
        const tripBudget = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0)
        return sum + tripBudget
      }, 0)

      const avgDuration = data.length > 0 
        ? data.reduce((sum: number, trip: any) => {
            const days = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))
            return sum + days
          }, 0) / data.length
        : 0

      setStats({
        totalTrips: data.length,
        upcomingTrips: upcoming.length,
        totalCities,
        totalBudget,
        avgTripDuration: Math.round(avgDuration),
      })

      // Prepare chart data - trips by month
      const tripsByMonth: { [key: string]: number } = {}
      data.forEach((trip: any) => {
        const month = new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        tripsByMonth[month] = (tripsByMonth[month] || 0) + 1
      })
      
      const chartData = Object.entries(tripsByMonth).map(([month, count]) => ({
        month,
        trips: count,
      })).slice(-6)
      setChartData(chartData)

      // Expense breakdown
      const expenseByCategory: { [key: string]: number } = {}
      data.forEach((trip: any) => {
        trip.expenses.forEach((expense: any) => {
          expenseByCategory[expense.category] = (expenseByCategory[expense.category] || 0) + expense.amount
        })
      })

      const expenseData = Object.entries(expenseByCategory).map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
      setExpenseData(expenseData)

    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      await fetch(`/api/trips/${id}`, { method: 'DELETE' })
      setTrips(trips.filter(trip => trip.id !== id))
    } catch (error) {
      console.error('Error deleting trip:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your adventures...</p>
        </div>
      </div>
    )
  }

  const recentTrips = trips.slice(0, 3)
  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).slice(0, 3)

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {session?.user?.name}!
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Your travel dashboard awaits ✈️</p>
          </div>
          <Link href="/trips/new">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Plan New Trip
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-100">Total Trips</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                <Plane className="h-8 w-8" />
                {stats.totalTrips}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-100">Upcoming</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                {stats.upcomingTrips}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-pink-100">Cities Explored</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                <MapPin className="h-8 w-8" />
                {stats.totalCities}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-orange-100">Total Spent</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <DollarSign className="h-7 w-7" />
                {formatCurrency(stats.totalBudget).replace('.00', '')}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-teal-100">Avg Duration</CardDescription>
              <CardTitle className="text-4xl flex items-center gap-2">
                <Globe className="h-8 w-8" />
                {stats.avgTripDuration}d
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trips Timeline */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Trip Activity
              </CardTitle>
              <CardDescription>Your travel frequency over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trips" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No trip data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Spending Breakdown
              </CardTitle>
              <CardDescription>Where your travel budget goes</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No expense data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/search/cities">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Discover Cities</CardTitle>
                <CardDescription>Explore 1000+ destinations worldwide</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/saved-cities">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-pink-300">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-600 mb-2" />
                <CardTitle>Saved Cities</CardTitle>
                <CardDescription>View your favorite destinations</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/trips">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-purple-300">
              <CardHeader>
                <Map className="h-12 w-12 text-purple-600 mb-2" />
                <CardTitle>All Trips</CardTitle>
                <CardDescription>Manage all your travel plans</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              Upcoming Adventures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Plane className="h-8 w-8 text-blue-600" />
              Recent Trips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {trips.length === 0 && (
          <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300">
            <Plane className="h-20 w-20 text-blue-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Ready for Your First Adventure?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start planning your dream trip today. Explore destinations, create itineraries, and track your budget!
            </p>
            <Link href="/trips/new">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Trip
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
