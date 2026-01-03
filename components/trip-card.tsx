import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { formatDate, getDaysBetween } from '@/lib/utils'
import { Calendar, MapPin, Trash2, Eye, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface TripCardProps {
  trip: {
    id: string
    name: string
    description?: string | null
    startDate: Date
    endDate: Date
    coverImage?: string | null
    stops: any[]
    expenses?: any[]
  }
  onDelete?: (id: string) => void
}

// City to Unsplash image mapping for beautiful backgrounds
const getCityImage = (cityName: string): string => {
  const cityImages: { [key: string]: string } = {
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
    'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
    'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop',
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
    'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
    'Los Angeles': 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=800&h=600&fit=crop',
    'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'
  }

  for (const [city, image] of Object.entries(cityImages)) {
    if (cityName.includes(city)) return image
  }
  return cityImages.default
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const duration = getDaysBetween(trip.startDate, trip.endDate)
  const totalExpenses = trip.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  const firstCity = trip.stops && trip.stops.length > 0 ? trip.stops[0].cityName : ''
  const coverImage = trip.coverImage || getCityImage(firstCity)

  const isUpcoming = new Date(trip.startDate) > new Date()
  const isPast = new Date(trip.endDate) < new Date()

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
      <div className="relative h-48 overflow-hidden">
        <div 
          className="h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" 
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {isUpcoming && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Upcoming
          </div>
        )}
        {isPast && (
          <div className="absolute top-3 right-3 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Completed
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-xl mb-1 line-clamp-1">{trip.name}</h3>
          {trip.description && (
            <p className="text-white/90 text-sm line-clamp-1">{trip.description}</p>
          )}
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-700 font-medium">
            <Calendar className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-xs">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <MapPin className="mr-2 h-4 w-4 text-purple-600" />
              {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'} · {duration} {duration === 1 ? 'day' : 'days'}
            </div>
            {totalExpenses > 0 && (
              <div className="flex items-center text-gray-700 font-semibold">
                <DollarSign className="h-4 w-4 text-green-600" />
                ${totalExpenses.toFixed(0)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Link href={`/trips/${trip.id}`} className="flex-1">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" variant="default">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
        {onDelete && (
          <Button variant="outline" size="icon" onClick={() => onDelete(trip.id)} className="hover:bg-red-50 hover:text-red-600 hover:border-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
