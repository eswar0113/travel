import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const city = searchParams.get('city') || ''

    const where: any = {}

    if (query) {
      where.name = { contains: query, mode: 'insensitive' }
    }

    if (category) {
      where.category = category
    }

    if (city) {
      where.cityName = city
    }

    const activities = await prisma.activityTemplate.findMany({
      where,
      orderBy: { popularity: 'desc' },
      take: 30,
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
