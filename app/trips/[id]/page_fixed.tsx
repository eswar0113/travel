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
import { ArrowLeft, Plus, MapPin, Calendar, DollarSign, Clock, Edit, Loader2, Share2, Sparkles, Zap } from 'lucide-react'
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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', startDate: '', endDate: '' })
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedStopForSuggest, setSelectedStopForSuggest] = useState<any>(null)
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
      setEditForm({
        name: data.name,
        description: data.description || '',
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0],
      })
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

  const handleShareTrip = async () => {
    setSharing(true)
    try {
      const response = await fetch(`/api/trips/${params.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: true }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Share error:', errorData)
        throw new Error(errorData.error || 'Failed to generate share link')
      }

      const data = await response.json()
      const shareUrl = `${window.location.origin}/shared/${data.shareId}`
      
      await navigator.clipboard.writeText(shareUrl)
      
      toast({
        title: 'Share link copied!',
        description: 'Anyone with this link can view your trip',
      })

      setShareDialogOpen(false)
    } catch (error: any) {
      console.error('Share trip error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate share link',
        variant: 'destructive',
      })
    } finally {
      setSharing(false)
    }
  }

  const handleEditTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/trips/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) throw new Error('Failed to update trip')

      toast({
        title: 'Success',
        description: 'Trip updated successfully',
      })

      setEditDialogOpen(false)
      fetchTrip()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update trip',
        variant: 'destructive',
      })
    }
  }

  const handleMagicSuggest = async (stop: any) => {
    setSelectedStopForSuggest(stop)
    setSuggestLoading(true)
    setSuggestDialogOpen(true)

    try {
      // Calculate available time (simplified: 8 hours per day - planned activities)
      const plannedHours = stop.activities.reduce((total: number, act: any) => {
        if (act.startTime && act.endTime) {
          const start = parseFloat(act.startTime.split(':')[0])
          const end = parseFloat(act.endTime.split(':')[0])
          return total + (end - start)
        }
        return total + 2 // Default 2 hours if no time specified
      }, 0)
      const availableHours = Math.max(8 - plannedHours, 1)

      // Calculate remaining budget (total trip budget - expenses)
      const totalBudget = trip.expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
      const plannedForStop = stop.activities.reduce((sum: number, a: any) => sum + (a.cost || 0), 0)
      const budgetRemaining = Math.max(200 - plannedForStop, 0) // Assume $200 per stop

      const response = await fetch(`/api/trips/${params.id}/stops/${stop.id}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableHours,
          budgetRemaining,
          currentTime: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Failed to get suggestions')

      const data = await response.json()
      setSuggestions(data.suggestions)

      if (data.suggestions.length === 0) {
        toast({
          title: 'No suggestions found',
          description: 'Try adjusting your budget or time constraints',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get activity suggestions',
        variant: 'destructive',
      })
    } finally {
      setSuggestLoading(false)
    }
  }

  const handleSelectSuggestion = async (suggestion: any) => {
    if (!selectedStopForSuggest) return

    setNewActivity({
      name: suggestion.name,
      description: suggestion.description || '',
      category: suggestion.category,
      date: new Date(selectedStopForSuggest.startDate).toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      cost: suggestion.estimatedCost,
      location: '',
      notes: '',
    })
    setSelectedStop(selectedStopForSuggest.id)
    setSuggestDialogOpen(false)
    setAddActivityOpen(true)
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
                  Generate a public link that anyone can view
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-gray-600">
                  Click the button below to create a shareable link. The link will be copied to your clipboard.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShareTrip} disabled={sharing}>
                  {sharing ? 'Generating...' : 'Generate Share Link'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Trip Details</DialogTitle>
                <DialogDescription>
                  Update your trip information
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditTrip}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Trip Name *</Label>
                    <Input
                      id="editName"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editStartDate">Start Date *</Label>
                      <Input
                        id="editStartDate"
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editEndDate">End Date *</Label>
                      <Input
                        id="editEndDate"
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => handleMagicSuggest(stop)}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Magic Suggest
                        </Button>
                        <Dialog open={addActivityOpen && selectedStop === stop.id} onOpenChange={(open) => {
                          setAddActivityOpen(open)
                          if (!open) setSelectedStop('')
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedStop(stop.id)}>
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

      {/* Magic Suggest Dialog */}
      <Dialog open={suggestDialogOpen} onOpenChange={setSuggestDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Magic Activity Suggestions
            </DialogTitle>
            <DialogDescription>
              AI-powered activity recommendations based on your available time and budget
            </DialogDescription>
          </DialogHeader>

          {suggestLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600">Finding perfect activities for you...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No suggestions found</h3>
              <p className="text-gray-500">Try adding more budget or free time to your trip</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectSuggestion(suggestion)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{suggestion.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {suggestion.description || 'Explore this amazing activity'}
                        </CardDescription>
                      </div>
                      {suggestion.imageUrl && (
                        <img 
                          src={suggestion.imageUrl} 
                          alt={suggestion.name}
                          className="w-24 h-24 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {suggestion.category}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${suggestion.estimatedCost}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {(suggestion.estimatedDuration / 60).toFixed(1)}h
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic">{suggestion.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSuggestDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
