import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; stopId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { availableHours, budgetRemaining, currentTime } = await request.json();

    // Get the stop details
    const stop = await prisma.stop.findUnique({
      where: { id: params.stopId },
      include: {
        activities: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!stop) {
      return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
    }

    // Find activity templates for this city
    const templates = await prisma.activityTemplate.findMany({
      where: {
        OR: [
          { cityName: stop.cityName },
          { country: stop.country },
          { cityName: null }, // Generic activities
        ],
      },
      orderBy: [
        { popularity: 'desc' },
      ],
    });

    // Filter activities based on criteria
    const suggestions = templates
      .filter(template => {
        // Check if activity fits in available time
        const activityDuration = (template.estimatedDuration || 120) / 60 // Convert minutes to hours
        if (activityDuration > availableHours) return false;

        // Check if activity fits in budget
        if (template.estimatedCost > budgetRemaining) return false;

        // Check if not already planned
        const alreadyPlanned = stop.activities.some(
          activity => activity.name.toLowerCase() === template.name.toLowerCase()
        );
        if (alreadyPlanned) return false;

        return true;
      })
      .slice(0, 5) // Top 5 suggestions
      .map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        estimatedCost: template.estimatedCost,
        estimatedDuration: template.estimatedDuration,
        imageUrl: template.imageUrl,
        popularity: template.popularity,
        reason: generateReason(template, availableHours, budgetRemaining),
      }));

    return NextResponse.json({
      suggestions,
      context: {
        location: `${stop.cityName}, ${stop.country}`,
        availableHours,
        budgetRemaining,
      },
    });
  } catch (error) {
    console.error('Error suggesting activities:', error);
    return NextResponse.json(
      { error: 'Failed to suggest activities' },
      { status: 500 }
    );
  }
}

function generateReason(template: any, hours: number, budget: number): string {
  const reasons = [];
  
  const duration = (template.estimatedDuration || 120) / 60;
  reasons.push(`Takes ${duration.toFixed(1)}h of your ${hours}h free time`);
  
  if (template.estimatedCost === 0) {
    reasons.push('Free activity!');
  } else {
    reasons.push(`Costs $${template.estimatedCost} (You have $${budget.toFixed(0)} left)`);
  }
  
  if (template.popularity > 800) {
    reasons.push('Very popular!');
  } else if (template.popularity > 500) {
    reasons.push('Popular choice');
  }
  
  return reasons.join(' • ');
}
