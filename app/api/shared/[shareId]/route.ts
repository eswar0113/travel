import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = params

    const sharedTrip = await prisma.sharedTrip.findUnique({
      where: { shareId },
      include: {
        trip: {
          include: {
            stops: {
              include: {
                activities: {
                  orderBy: { date: 'asc' },
                },
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

    // Check if trip is public or if user has access
    if (!sharedTrip.isPublic) {
      return NextResponse.json(
        { error: 'This trip is private' },
        { status: 403 }
      )
    }

    return NextResponse.json(sharedTrip)
  } catch (error) {
    console.error('Error fetching shared trip:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
