'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users, MapPin, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalCities: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && !(session.user as any).isAdmin) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && (session.user as any).isAdmin) {
      fetchStats()
    }
  }, [status, session])

  const fetchStats = async () => {
    try {
      // Simulate fetching admin stats
      setStats({
        totalUsers: 127,
        totalTrips: 543,
        totalCities: 89,
        totalRevenue: 12450,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <Users className="mr-2 h-6 w-6 text-blue-600" />
              {stats.totalUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Trips</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <MapPin className="mr-2 h-6 w-6 text-green-600" />
              {stats.totalTrips}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cities Available</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-purple-600" />
              {stats.totalCities}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-orange-600" />
              ${stats.totalRevenue.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">User management coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>Most visited cities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Paris, France</span>
                <span className="text-gray-600">142 trips</span>
              </div>
              <div className="flex justify-between">
                <span>Tokyo, Japan</span>
                <span className="text-gray-600">128 trips</span>
              </div>
              <div className="flex justify-between">
                <span>New York, USA</span>
                <span className="text-gray-600">115 trips</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
