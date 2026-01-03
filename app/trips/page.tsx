'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TripCard } from '@/components/trip-card'
import { Input } from '@/components/ui/input'
import { Plus, Search, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function TripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [trips, setTrips] = useState<any[]>([])
  const [filteredTrips, setFilteredTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  useEffect(() => {
    if (searchTerm) {
      const filtered = trips.filter(trip =>
        trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTrips(filtered)
    } else {
      setFilteredTrips(trips)
    }
  }, [searchTerm, trips])

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips')
      const data = await response.json()
      setTrips(data)
      setFilteredTrips(data)
    } catch (error) {
      console.error('Error fetching trips:', error)
      toast({
        title: 'Error',
        description: 'Failed to load trips',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete trip')
      }

      setTrips(trips.filter(trip => trip.id !== id))
      toast({
        title: 'Success',
        description: 'Trip deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting trip:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete trip',
        variant: 'destructive',
      })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">My Trips</h1>
            <p className="text-gray-600 text-lg mt-1">Manage all your travel plans in one place</p>
          </div>
          <Link href="/trips/new">
            <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              New Trip
            </Button>
          </Link>
        </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search trips by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl shadow-sm"
          />
        </div>
      </div>

      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/70 backdrop-blur rounded-2xl shadow-xl">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">
            {searchTerm ? 'No trips found' : 'No trips yet'}
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Start planning your first adventure!'}
          </p>
          {!searchTerm && (
            <Link href="/trips/new">
              <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Trip
              </Button>
            </Link>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
