'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, DollarSign, Clock, Copy, Share2, Heart, Map } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

const TripMap = dynamic(() => import('@/components/trip-map'), { ssr: false })

interface SharedTrip {
  id: string
  shareId: string
  trip: {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    coverImage: string | null
    stops: Array<{
      id: string
      cityName: string
      country: string
      startDate: string
      endDate: string
      order: number
      notes: string | null
      activities: Array<{
        id: string
        name: string
        description: string | null
        category: string
        date: string
        startTime: string | null
        endTime: string | null
        cost: number
        location: string | null
      }>
    }>
    expenses: Array<{
      id: string
      description: string
      amount: number
      category: string
    }>
  }
  isPublic: boolean
  createdAt: string
}

export default function SharedTripPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [sharedTrip, setSharedTrip] = useState<SharedTrip | null>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)

  const shareId = params.shareId as string

  useEffect(() => {
    fetchSharedTrip()
  }, [shareId])

  const fetchSharedTrip = async () => {
    try {
      const response = await fetch(`/api/shared/${shareId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: 'Trip not found',
            description: 'This shared trip does not exist or has been removed.',
            variant: 'destructive',
          })
          return
        }
        throw new Error('Failed to fetch shared trip')
      }
      const data = await response.json()
      setSharedTrip(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load shared trip',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToMyTrips = async () => {
    setCopying(true)
    try {
      const response = await fetch('/api/trips/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: 'Login required',
            description: 'Please log in to copy this trip to your account.',
          })
          router.push('/auth/login')
          return
        }
        throw new Error('Failed to copy trip')
      }

      const newTrip = await response.json()
      toast({
        title: 'Success!',
        description: 'Trip copied to your account',
      })
      router.push(`/trips/${newTrip.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy trip',
        variant: 'destructive',
      })
    } finally {
      setCopying(false)
    }
  }

  const copyShareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link copied!',
      description: 'Share link copied to clipboard',
    })
  }

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this amazing trip: ${sharedTrip?.trip.name}`)
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip...</p>
        </div>
      </div>
    )
  }

  if (!sharedTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
            <p className="text-gray-600 mb-6">This shared trip does not exist or has been removed.</p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const trip = sharedTrip.trip
  const totalCost = trip.expenses.reduce((sum, e) => sum + e.amount, 0)
  const duration = getDaysBetween(trip.startDate, trip.endDate)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {trip.coverImage ? (
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${trip.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl font-bold mb-4">{trip.name}</h1>
              {trip.description && (
                <p className="text-xl max-w-2xl mx-auto">{trip.description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{trip.name}</h1>
            {trip.description && (
              <p className="text-xl max-w-2xl mx-auto">{trip.description}</p>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Trip Summary */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6 justify-between items-center">
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({duration} days)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Stops</p>
                    <p className="font-semibold">{trip.stops.length} cities</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Cost</p>
                    <p className="font-semibold">{formatCurrency(totalCost)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={copyShareLink} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button onClick={copyToMyTrips} disabled={copying}>
                  <Heart className="mr-2 h-4 w-4" />
                  {copying ? 'Copying...' : 'Copy to My Trips'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        {trip.stops.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Trip Map
              </CardTitle>
              <CardDescription>
                Geographic visualization of this {trip.stops.length}-stop journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TripMap
                stops={trip.stops}
                height="500px"
                showRoute={true}
              />
            </CardContent>
          </Card>
        )}

        {/* Share Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share this trip
            </CardTitle>
            <CardDescription>Spread the travel inspiration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => shareToSocial('twitter')}>
                Twitter
              </Button>
              <Button variant="outline" onClick={() => shareToSocial('facebook')}>
                Facebook
              </Button>
              <Button variant="outline" onClick={() => shareToSocial('linkedin')}>
                LinkedIn
              </Button>
              <Button variant="outline" onClick={() => shareToSocial('whatsapp')}>
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Itinerary</h2>
          
          {trip.stops.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No stops added yet</p>
              </CardContent>
            </Card>
          ) : (
            trip.stops.map((stop, index) => (
              <Card key={stop.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <span className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{stop.cityName}, {stop.country}</CardTitle>
                      <CardDescription className="mt-2">
                        {formatDate(stop.startDate)} - {formatDate(stop.endDate)} ({getDaysBetween(stop.startDate, stop.endDate)} days)
                      </CardDescription>
                      {stop.notes && (
                        <p className="text-gray-600 mt-2">{stop.notes}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {stop.activities.length === 0 ? (
                    <p className="text-gray-500 text-sm">No activities planned</p>
                  ) : (
                    <div className="space-y-4">
                      {stop.activities.map((activity) => (
                        <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <h4 className="font-semibold text-lg">{activity.name}</h4>
                          {activity.description && (
                            <p className="text-gray-600 mt-1">{activity.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(activity.date)}
                            </span>
                            {activity.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {activity.startTime}
                                {activity.endTime && ` - ${activity.endTime}`}
                              </span>
                            )}
                            {activity.cost > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {formatCurrency(activity.cost)}
                              </span>
                            )}
                            {activity.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {activity.location}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                              {activity.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Budget Breakdown */}
        {trip.expenses.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
              <CardDescription>Total: {formatCurrency(totalCost)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trip.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-2">Love this itinerary?</h3>
            <p className="text-gray-600 mb-6">Copy it to your account and customize it for your own adventure!</p>
            <Button size="lg" onClick={copyToMyTrips} disabled={copying}>
              <Heart className="mr-2 h-5 w-5" />
              {copying ? 'Copying...' : 'Copy to My Trips'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
