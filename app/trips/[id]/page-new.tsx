'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Plus, MapPin, Calendar, DollarSign, Clock, Edit, Loader2, Share2, Copy } from 'lucide-react'
import { formatDate, formatCurrency, getDaysBetween } from '@/lib/utils'

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [addStopOpen, setAddStopOpen] = useState(false)
  const [addActivityOpen, setAddActivityOpen] = useState(false)
  const [selectedStop, setSelectedStop] = useState<string>('')
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [generatingLink, setGeneratingLink] = useState(false)
  
  const [newStop, setNewStop] = useState({
    cityName: '',
    country: '',
    startDate: '',
    endDate: '',
    notes: '',
  })
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    category: 'sightseeing',
    date: '',
    startTime: '',
    endTime: '',
    cost: 0,
    location: '',
    notes: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrip()
    }
  }, [status, params.id])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${params.id}`)
      if (!response.ok) throw new Error('Trip not found')
      const data = await response.json()
      setTrip(data)
    } catch (error) {
      console.error('Error fetching trip:', error)
      toast({
        title: 'Error',
        description: 'Failed to load trip',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateShareLink = async () => {
    setGeneratingLink(true)
    try {
      const response = await fetch(`/api/trips/${params.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
      })

      if (!response.ok) throw new Error('Failed to generate share link')

      const data = await response.json()
      setShareUrl(data.shareUrl)
      toast({
        title: 'Share link created!',
        description: 'Your trip is now shareable',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate share link',
        variant: 'destructive',
      })
    } finally {
      setGeneratingLink(false)
    }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: 'Copied!',
      description: 'Share link copied to clipboard',
    })
  }

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/trips/${params.id}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStop),
      })

      if (!response.ok) throw new Error('Failed to add stop')

      toast({
        title: 'Success',
        description: 'Stop added successfully',
      })

      setAddStopOpen(false)
      setNewStop({ cityName: '', country: '', startDate: '', endDate: '', notes: '' })
      fetchTrip()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stop',
        variant: 'destructive',
      })
    }
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newActivity,
          stopId: selectedStop,
        }),
      })

      if (!response.ok) throw new Error('Failed to add activity')

      toast({
        title: 'Success',
        description: 'Activity added successfully',
      })

      setAddActivityOpen(false)
      setNewActivity({
        name: '',
        description: '',
        category: 'sightseeing',
        date: '',
        startTime: '',
        endTime: '',
        cost: 0,
        location: '',
        notes: '',
      })
      fetchTrip()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add activity',
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

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Trip not found</p>
      </div>
    )
  }

  const duration = getDaysBetween(trip.startDate, trip.endDate)
  const totalCost = trip.expenses.reduce((sum: number, e: any) => sum + e.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/trips">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trips
        </Button>
      </Link>

      {/* Trip Header */}
      {trip.coverImage && (
        <div className="h-64 bg-cover bg-center rounded-lg mb-6" style={{ backgroundImage: `url(${trip.coverImage})` }} />
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
          {trip.description && (
            <p className="text-gray-600 mb-4">{trip.description}</p>
          )}
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({duration} days)
            </span>
            <span className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              {trip.stops.length} stops
            </span>
            <span className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              {formatCurrency(totalCost)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Trip</DialogTitle>
                <DialogDescription>
                  Generate a link to share this trip with others
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isPublic">Make this trip publicly visible</Label>
                </div>
                {!shareUrl ? (
                  <Button onClick={handleGenerateShareLink} disabled={generatingLink} className="w-full">
                    {generatingLink ? 'Generating...' : 'Generate Share Link'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Label>Share URL</Label>
                    <div className="flex gap-2">
                      <Input value={shareUrl} readOnly className="flex-1" />
                      <Button onClick={copyShareLink} variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Anyone with this link can view your trip
                      {isPublic && ' and it will appear in public listings'}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Trip
          </Button>
        </div>
      </div>

      <Tabs defaultValue="itinerary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Stops & Activities</h2>
            <Dialog open={addStopOpen} onOpenChange={setAddStopOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Stop</DialogTitle>
                  <DialogDescription>Add a city or destination to your trip</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStop}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cityName">City *</Label>
                        <Input
                          id="cityName"
                          value={newStop.cityName}
                          onChange={(e) => setNewStop({ ...newStop, cityName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={newStop.country}
                          onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stopStartDate">Start Date *</Label>
                        <Input
                          id="stopStartDate"
                          type="date"
                          value={newStop.startDate}
                          onChange={(e) => setNewStop({ ...newStop, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stopEndDate">End Date *</Label>
                        <Input
                          id="stopEndDate"
                          type="date"
                          value={newStop.endDate}
                          onChange={(e) => setNewStop({ ...newStop, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stopNotes">Notes</Label>
                      <Textarea
                        id="stopNotes"
                        value={newStop.notes}
                        onChange={(e) => setNewStop({ ...newStop, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit">Add Stop</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {trip.stops.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No stops yet</h3>
                <p className="text-gray-600 mb-4">Add your first destination to start building your itinerary</p>
                <Button onClick={() => setAddStopOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Stop
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {trip.stops.map((stop: any, index: number) => (
                <Card key={stop.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          {stop.cityName}, {stop.country}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(stop.startDate)} - {formatDate(stop.endDate)} ({getDaysBetween(stop.startDate, stop.endDate)} days)
                        </CardDescription>
                      </div>
                      <Dialog open={addActivityOpen && selectedStop === stop.id} onOpenChange={(open: boolean) => {
                        setAddActivityOpen(open)
                        if (open) setSelectedStop(stop.id)
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Activity
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Activity to {stop.cityName}</DialogTitle>
                            <DialogDescription>Plan something to do during your stay</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddActivity}>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="activityName">Activity Name *</Label>
                                <Input
                                  id="activityName"
                                  value={newActivity.name}
                                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="activityDescription">Description</Label>
                                <Textarea
                                  id="activityDescription"
                                  value={newActivity.description}
                                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="activityCategory">Category</Label>
                                  <select
                                    id="activityCategory"
                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                    value={newActivity.category}
                                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                                  >
                                    <option value="sightseeing">Sightseeing</option>
                                    <option value="food">Food & Dining</option>
                                    <option value="adventure">Adventure</option>
                                    <option value="culture">Culture</option>
                                    <option value="relaxation">Relaxation</option>
                                    <option value="shopping">Shopping</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="activityDate">Date *</Label>
                                  <Input
                                    id="activityDate"
                                    type="date"
                                    value={newActivity.date}
                                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="activityStartTime">Start Time</Label>
                                  <Input
                                    id="activityStartTime"
                                    type="time"
                                    value={newActivity.startTime}
                                    onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="activityEndTime">End Time</Label>
                                  <Input
                                    id="activityEndTime"
                                    type="time"
                                    value={newActivity.endTime}
                                    onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="activityCost">Cost ($)</Label>
                                  <Input
                                    id="activityCost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newActivity.cost}
                                    onChange={(e) => setNewActivity({ ...newActivity, cost: parseFloat(e.target.value) || 0 })}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="activityLocation">Location</Label>
                                <Input
                                  id="activityLocation"
                                  value={newActivity.location}
                                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter className="mt-6">
                              <Button type="submit">Add Activity</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {stop.activities.length === 0 ? (
                      <p className="text-gray-500 text-sm">No activities planned yet</p>
                    ) : (
                      <div className="space-y-3">
                        {stop.activities.map((activity: any) => (
                          <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{activity.name}</h4>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                )}
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                  {activity.startTime && (
                                    <span className="flex items-center">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {activity.startTime}
                                      {activity.endTime && ` - ${activity.endTime}`}
                                    </span>
                                  )}
                                  {activity.cost > 0 && (
                                    <span className="flex items-center">
                                      <DollarSign className="mr-1 h-3 w-3" />
                                      {formatCurrency(activity.cost)}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                    {activity.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Trip Timeline</CardTitle>
              <CardDescription>Day-by-day view of your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Timeline view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Total estimated cost: {formatCurrency(totalCost)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trip.expenses.map((expense: any) => (
                  <div key={expense.id} className="flex justify-between items-center py-2 border-b">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
