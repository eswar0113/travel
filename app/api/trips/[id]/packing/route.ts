import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Smart packing list generator based on destination, duration, and season
function generatePackingList(destination: string, duration: number, startDate: Date) {
  const month = new Date(startDate).getMonth()
  const isWinter = month >= 11 || month <= 2
  const isSummer = month >= 5 && month <= 8

  const essentials = [
    { item: 'Passport', category: 'Documents', checked: false },
    { item: 'Travel Insurance', category: 'Documents', checked: false },
    { item: 'Phone Charger', category: 'Electronics', checked: false },
    { item: 'Power Bank', category: 'Electronics', checked: false },
    { item: 'Medications', category: 'Health', checked: false },
    { item: 'First Aid Kit', category: 'Health', checked: false },
    { item: 'Toiletries', category: 'Personal Care', checked: false },
    { item: 'Sunscreen', category: 'Personal Care', checked: false },
  ]

  const clothing = []
  const daysOfClothes = Math.min(duration, 7) // Max 1 week of clothes

  // Weather-appropriate clothing
  if (isWinter) {
    clothing.push(
      { item: `${daysOfClothes} Winter Outfits`, category: 'Clothing', checked: false },
      { item: 'Warm Jacket', category: 'Clothing', checked: false },
      { item: 'Gloves & Scarf', category: 'Clothing', checked: false },
      { item: 'Warm Socks', category: 'Clothing', checked: false }
    )
  } else if (isSummer) {
    clothing.push(
      { item: `${daysOfClothes} Summer Outfits`, category: 'Clothing', checked: false },
      { item: 'Swimsuit', category: 'Clothing', checked: false },
      { item: 'Sunglasses', category: 'Accessories', checked: false },
      { item: 'Hat', category: 'Accessories', checked: false }
    )
  } else {
    clothing.push(
      { item: `${daysOfClothes} Casual Outfits`, category: 'Clothing', checked: false },
      { item: 'Light Jacket', category: 'Clothing', checked: false },
      { item: 'Comfortable Shoes', category: 'Clothing', checked: false }
    )
  }

  // Duration-based items
  const durationItems = []
  if (duration > 7) {
    durationItems.push(
      { item: 'Laundry Detergent Packets', category: 'Essentials', checked: false },
      { item: 'Extra Toiletries', category: 'Personal Care', checked: false }
    )
  }

  // Destination-based items
  const destinationItems = []
  const lowerDest = destination.toLowerCase()
  
  if (lowerDest.includes('beach') || lowerDest.includes('hawaii') || lowerDest.includes('miami') || lowerDest.includes('thailand')) {
    destinationItems.push(
      { item: 'Beach Towel', category: 'Beach Essentials', checked: false },
      { item: 'Snorkel Gear', category: 'Beach Essentials', checked: false },
      { item: 'Waterproof Phone Case', category: 'Beach Essentials', checked: false }
    )
  }

  if (lowerDest.includes('europe') || lowerDest.includes('paris') || lowerDest.includes('london') || lowerDest.includes('rome')) {
    destinationItems.push(
      { item: 'Power Adapter (EU)', category: 'Electronics', checked: false },
      { item: 'Comfortable Walking Shoes', category: 'Clothing', checked: false },
      { item: 'Day Backpack', category: 'Accessories', checked: false }
    )
  }

  if (lowerDest.includes('hiking') || lowerDest.includes('mountain') || lowerDest.includes('trek')) {
    destinationItems.push(
      { item: 'Hiking Boots', category: 'Outdoor Gear', checked: false },
      { item: 'Water Bottle', category: 'Outdoor Gear', checked: false },
      { item: 'Rain Jacket', category: 'Outdoor Gear', checked: false }
    )
  }

  return [...essentials, ...clothing, ...durationItems, ...destinationItems]
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        stops: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Get or generate packing list
    let packingList = await prisma.packingList.findFirst({
      where: { tripId: params.id },
      include: {
        items: {
          orderBy: { category: 'asc' },
        },
      },
    });

    if (!packingList) {
      // Generate smart packing list
      const destination = trip.stops.length > 0 ? `${trip.stops[0].cityName}, ${trip.stops[0].country}` : trip.name
      const duration = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))
      const items = generatePackingList(destination, duration, trip.startDate)

      packingList = await prisma.packingList.create({
        data: {
          tripId: params.id,
          items: {
            create: items,
          },
        },
        include: {
          items: {
            orderBy: { category: 'asc' },
          },
        },
      })
    }

    return NextResponse.json(packingList);
  } catch (error) {
    console.error('Error fetching packing list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packing list' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { item, category } = await request.json();

    const packingList = await prisma.packingList.findFirst({
      where: { tripId: params.id },
    });

    if (!packingList) {
      return NextResponse.json({ error: 'Packing list not found' }, { status: 404 });
    }

    const newItem = await prisma.packingItem.create({
      data: {
        item,
        category,
        checked: false,
        packingListId: packingList.id,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error adding packing item:', error);
    return NextResponse.json(
      { error: 'Failed to add item' },
      { status: 500 }
    );
  }
}
