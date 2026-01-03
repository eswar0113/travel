import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { cityName, country, notes } = await request.json();

    if (!cityName || !country) {
      return NextResponse.json(
        { error: 'City name and country are required' },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedCity.findFirst({
      where: {
        userId: user.id,
        cityName,
        country,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'City already saved' },
        { status: 400 }
      );
    }

    const savedCity = await prisma.savedCity.create({
      data: {
        cityName,
        country,
        notes: notes || null,
        userId: user.id,
      },
    });

    return NextResponse.json(savedCity);
  } catch (error) {
    console.error('Error saving city:', error);
    return NextResponse.json(
      { error: 'Failed to save city' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const savedCities = await prisma.savedCity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(savedCities);
  } catch (error) {
    console.error('Error fetching saved cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved cities' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'City ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const savedCity = await prisma.savedCity.findUnique({
      where: { id },
    });

    if (!savedCity || savedCity.userId !== user.id) {
      return NextResponse.json(
        { error: 'City not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.savedCity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved city:', error);
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500 }
    );
  }
}
