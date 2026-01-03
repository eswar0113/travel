import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    if (trip.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { cityName, country, startDate, endDate, notes } = body

    if (!cityName || !country || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'City name, country, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Get the current max order
    const maxOrder = await prisma.stop.findFirst({
      where: { tripId: params.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const stop = await prisma.stop.create({
      data: {
        cityName,
        country,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes,
        order: (maxOrder?.order ?? 0) + 1,
        tripId: params.id,
      },
      include: {
        activities: true,
      },
    })

    return NextResponse.json(stop, { status: 201 })
  } catch (error) {
    console.error('Error creating stop:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stops = await prisma.stop.findMany({
      where: { tripId: params.id },
      include: {
        activities: {
          orderBy: [{ date: 'asc' }, { order: 'asc' }],
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(stops)
  } catch (error) {
    console.error('Error fetching stops:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
