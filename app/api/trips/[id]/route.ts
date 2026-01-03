import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        stops: {
          include: {
            activities: {
              orderBy: [{ date: 'asc' }, { order: 'asc' }],
            },
          },
          orderBy: { order: 'asc' },
        },
        expenses: {
          orderBy: { date: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // Check if user owns this trip
    if (session?.user && (session.user as any).id !== trip.userId) {
      // For now, allow viewing (can be restricted later based on sharing settings)
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error('Error fetching trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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
    const { name, description, startDate, endDate, coverImage } = body

    const updatedTrip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(coverImage !== undefined && { coverImage }),
      },
      include: {
        stops: true,
        expenses: true,
      },
    })

    return NextResponse.json(updatedTrip)
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    await prisma.trip.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Error deleting trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
