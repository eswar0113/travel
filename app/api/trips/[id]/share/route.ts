import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = params
    const { isPublic } = await request.json()

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    if (trip.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if shared trip already exists
    let sharedTrip = await prisma.sharedTrip.findUnique({
      where: { tripId: id },
    })

    if (sharedTrip) {
      // Update existing share
      sharedTrip = await prisma.sharedTrip.update({
        where: { tripId: id },
        data: { isPublic },
      })
    } else {
      // Create new share
      const shareId = randomBytes(16).toString('hex')
      sharedTrip = await prisma.sharedTrip.create({
        data: {
          shareId,
          tripId: id,
          isPublic,
        },
      })
    }

    return NextResponse.json({
      shareId: sharedTrip.shareId,
      shareUrl: `${process.env.NEXTAUTH_URL}/shared/${sharedTrip.shareId}`,
      isPublic: sharedTrip.isPublic,
    })
  } catch (error) {
    console.error('Error creating share link:', error)
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = params

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    if (trip.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete shared trip
    await prisma.sharedTrip.deleteMany({
      where: { tripId: id },
    })

    return NextResponse.json({ message: 'Share link deleted' })
  } catch (error) {
    console.error('Error deleting share link:', error)
    return NextResponse.json(
      { error: 'Failed to delete share link' },
      { status: 500 }
    )
  }
}
