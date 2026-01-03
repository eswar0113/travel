import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shareId } = await request.json()

    // Find the shared trip
    const sharedTrip = await prisma.sharedTrip.findUnique({
      where: { shareId },
      include: {
        trip: {
          include: {
            stops: {
              include: {
                activities: true,
              },
              orderBy: { order: 'asc' },
            },
            expenses: true,
          },
        },
      },
    })

    if (!sharedTrip) {
      return NextResponse.json(
        { error: 'Shared trip not found' },
        { status: 404 }
      )
    }

    if (!sharedTrip.isPublic) {
      return NextResponse.json(
        { error: 'This trip is private' },
        { status: 403 }
      )
    }

    const originalTrip = sharedTrip.trip

    // Create a copy of the trip for the current user
    const newTrip = await prisma.trip.create({
      data: {
        name: `${originalTrip.name} (Copy)`,
        description: originalTrip.description,
        startDate: originalTrip.startDate,
        endDate: originalTrip.endDate,
        coverImage: originalTrip.coverImage,
        userId: (session.user as any).id,
        stops: {
          create: originalTrip.stops.map((stop) => ({
            cityName: stop.cityName,
            country: stop.country,
            startDate: stop.startDate,
            endDate: stop.endDate,
            order: stop.order,
            notes: stop.notes,
            activities: {
              create: stop.activities.map((activity) => ({
                name: activity.name,
                description: activity.description,
                category: activity.category,
                date: activity.date,
                startTime: activity.startTime,
                endTime: activity.endTime,
                cost: activity.cost,
                location: activity.location,
                notes: activity.notes,
              })),
            },
          })),
        },
        expenses: {
          create: originalTrip.expenses.map((expense) => ({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
          })),
        },
      },
      include: {
        stops: {
          include: {
            activities: true,
          },
        },
        expenses: true,
      },
    })

    return NextResponse.json(newTrip, { status: 201 })
  } catch (error) {
    console.error('Error copying trip:', error)
    return NextResponse.json(
      { error: 'Failed to copy trip' },
      { status: 500 }
    )
  }
}
