'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewTripPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: '',
    budgetLimit: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create trip')
      }

      const trip = await response.json()

      toast({
        title: 'Success',
        description: 'Trip created successfully!',
      })

      router.push(`/trips/${trip.id}`)
    } catch (error) {
      console.error('Error creating trip:', error)
      toast({
        title: 'Error',
        description: 'Failed to create trip',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/trips">
          <Button className="mb-6 bg-white/80 hover:bg-white shadow-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
        </Link>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Create New Trip</CardTitle>
            <CardDescription className="text-base mt-2">
              Start planning your next adventure by adding basic trip details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Trip Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., European Summer Adventure"
                  value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your trip plans..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
              <Input
                id="coverImage"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />
              <p className="text-sm text-gray-500">
                Paste a URL to an image that represents your trip
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetLimit">Budget Limit (optional, $)</Label>
              <Input
                id="budgetLimit"
                type="number"
                placeholder="Enter your total trip budget"
                value={formData.budgetLimit}
                onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                min="0"
                step="0.01"
              />
              <p className="text-sm text-gray-500">
                Set a budget to track your spending throughout the trip
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg text-base font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Trip'
                )}
              </Button>
              <Link href="/trips" className="flex-1">
                <Button type="button" className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 text-base font-semibold">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
