import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { stopId, name, description, category, date, startTime, endTime, duration, cost, location, notes } = body

    if (!stopId || !name || !date) {
      return NextResponse.json(
        { error: 'Stop ID, name, and date are required' },
        { status: 400 }
      )
    }

    // Verify the stop belongs to user's trip
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      include: {
        trip: true,
      },
    })

    if (!stop) {
      return NextResponse.json({ error: 'Stop not found' }, { status: 404 })
    }

    if (stop.trip.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        category: category || 'other',
        date: new Date(date),
        startTime,
        endTime,
        duration,
        cost: cost || 0,
        location,
        notes,
        stopId,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
