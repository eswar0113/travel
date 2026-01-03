import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const region = searchParams.get('region') || ''

    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (region) {
      where.region = region
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy: { popularity: 'desc' },
      take: 20,
    })

    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
