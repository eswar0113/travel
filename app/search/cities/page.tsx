'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Search, MapPin, DollarSign, TrendingUp, Heart, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'

export default function CitySearchPage() {
  const [cities, setCities] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCities, setFilteredCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<any>(null)
  const [notes, setNotes] = useState('')
  const [savedCityIds, setSavedCityIds] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCities()
    fetchSavedCities()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities(cities)
    }
  }, [searchTerm, cities])

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities')
      const data = await response.json()
      setCities(data)
      setFilteredCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedCities = async () => {
    try {
      const response = await fetch('/api/cities/save')
      if (response.ok) {
        const saved = await response.json()
        const savedIds = new Set(
          saved.map((city: any) => `${city.cityName},${city.country}`)
        )
        setSavedCityIds(savedIds)
      }
    } catch (error) {
      console.error('Error fetching saved cities:', error)
    }
  }

  const handleSaveCity = async (city: any) => {
    setSaving(true)
    try {
      const response = await fetch('/api/cities/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: city.name,
          country: city.country,
          notes,
        }),
      })

      if (response.ok) {
        toast({
          title: 'City saved!',
          description: `${city.name}, ${city.country} has been added to your saved cities.`,
        })
        setSavedCityIds(prev => new Set(prev).add(`${city.name},${city.country}`))
        setSelectedCity(null)
        setNotes('')
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save city',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save city',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const isCitySaved = (city: any) => {
    return savedCityIds.has(`${city.name},${city.country}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Discover Cities</h1>
            <p className="text-gray-600 text-lg">Explore destinations for your next adventure</p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-teal-500 rounded-xl shadow-sm"
              />
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <Card key={city.id} className="hover:shadow-2xl transition-all hover:scale-[1.02] border-0 bg-white/90 backdrop-blur overflow-hidden">
              {city.imageUrl && (
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${city.imageUrl})` }} />
              )}
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  {city.name}, {city.country}
                </CardTitle>
                {city.description && (
                  <CardDescription className="text-base mt-2">{city.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm mb-4">
                  <span className="flex items-center text-gray-600">
                    <DollarSign className="mr-1 h-4 w-4" />
                    Cost Index: {city.costIndex}/100
                  </span>
                  <span className="flex items-center text-gray-600">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    Popularity: {city.popularity}
                  </span>
                </div>
                <Button
                  onClick={() => setSelectedCity(city)}
                  className={`w-full h-11 ${isCitySaved(city) 
                    ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                    : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg'}`}
                  disabled={isCitySaved(city)}
                >
                  {isCitySaved(city) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Save City
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cities found. Try a different search term.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedCity} onOpenChange={(open) => !open && setSelectedCity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save {selectedCity?.name}, {selectedCity?.country}</DialogTitle>
            <DialogDescription>
              Add this city to your saved list. You can add notes for future reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Notes (optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add notes about this city..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setSelectedCity(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveCity(selectedCity)} disabled={saving}>
              {saving ? 'Saving...' : 'Save City'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  )
}
