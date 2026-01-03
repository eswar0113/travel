'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Trash2, Heart } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface SavedCity {
  id: string
  cityName: string
  country: string
  notes: string | null
  createdAt: string
}

export default function SavedCitiesPage() {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSavedCities()
  }, [])

  const fetchSavedCities = async () => {
    try {
      const response = await fetch('/api/cities/save')
      if (response.ok) {
        const data = await response.json()
        setSavedCities(data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load saved cities',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching saved cities:', error)
      toast({
        title: 'Error',
        description: 'Failed to load saved cities',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const response = await fetch(`/api/cities/save?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSavedCities(prev => prev.filter(city => city.id !== id))
        toast({
          title: 'Success',
          description: 'City removed from saved list',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to remove city',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove city',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Loading saved cities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-3 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Saved Cities
                </span>
              </h1>
              <p className="text-gray-600 text-lg ml-20">
                Cities you've saved for future trips
              </p>
            </div>
            <Link href="/search/cities">
              <Button className="h-12 px-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg">
                <MapPin className="mr-2 h-5 w-5" />
                Discover Cities
              </Button>
            </Link>
          </div>

        {savedCities.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur rounded-2xl shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              No saved cities yet
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Start exploring and save cities you'd like to visit!
            </p>
            <Link href="/search/cities">
              <Button className="h-12 px-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg">
                <MapPin className="mr-2 h-5 w-5" />
                Browse Cities
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedCities.map((city) => (
              <Card key={city.id} className="hover:shadow-2xl transition-all hover:scale-[1.02] border-0 bg-white/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    {city.cityName}, {city.country}
                  </CardTitle>
                  {city.notes && (
                    <CardDescription className="text-base mt-2">{city.notes}</CardDescription>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Saved on {new Date(city.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDelete(city.id)}
                    className="w-full h-11 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    disabled={deleting === city.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting === city.id ? 'Removing...' : 'Remove from Saved'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
