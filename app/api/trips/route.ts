import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        stops: {
          orderBy: { order: 'asc' },
        },
        expenses: true,
        _count: {
          select: { stops: true, expenses: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, startDate, endDate, coverImage, budgetLimit } = body

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, start date, and end date are required' },
        { status: 400 }
      )
    }

    const trip = await prisma.trip.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverImage,
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : 0,
        userId: (session.user as any).id,
      },
      include: {
        stops: true,
        expenses: true,
      },
    })

    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
