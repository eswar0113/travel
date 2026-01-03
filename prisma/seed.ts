import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.com' },
    update: {},
    create: {
      email: 'demo@globetrotter.com',
      password: hashedPassword,
      name: 'Demo User',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    },
  })

  // Create admin user
  const adminPassword = await bcrypt.hash('admin1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.com' },
    update: {},
    create: {
      email: 'admin@globetrotter.com',
      password: adminPassword,
      name: 'Admin User',
      isAdmin: true,
    },
  })

  // Seed cities
  const cities = [
    { name: 'Paris', country: 'France', region: 'Europe', costIndex: 75, popularity: 950, description: 'The City of Light', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
    { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 70, popularity: 920, description: 'Modern metropolis meets tradition', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
    { name: 'New York', country: 'USA', region: 'North America', costIndex: 85, popularity: 940, description: 'The city that never sleeps', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
    { name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 65, popularity: 880, description: 'Gaudí\'s architectural masterpiece', imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800' },
    { name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 40, popularity: 850, description: 'Island paradise', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
    { name: 'London', country: 'UK', region: 'Europe', costIndex: 80, popularity: 930, description: 'Historic and cosmopolitan', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
    { name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 75, popularity: 820, description: 'Luxury and innovation', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
    { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 65, popularity: 910, description: 'The Eternal City', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
    { name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 35, popularity: 870, description: 'Vibrant street life and temples', imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800' },
    { name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 70, popularity: 860, description: 'Harbor city with iconic landmarks', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800' },
  ]

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name_country: { name: city.name, country: city.country } },
      update: {},
      create: city,
    })
  }

  // Seed activity templates
  const activities = [
    { name: 'Eiffel Tower Visit', category: 'sightseeing', estimatedCost: 30, estimatedDuration: 180, cityName: 'Paris', country: 'France', popularity: 95 },
    { name: 'Louvre Museum', category: 'culture', estimatedCost: 20, estimatedDuration: 240, cityName: 'Paris', country: 'France', popularity: 90 },
    { name: 'Seine River Cruise', category: 'relaxation', estimatedCost: 40, estimatedDuration: 120, cityName: 'Paris', country: 'France', popularity: 85 },
    { name: 'Tokyo Tower', category: 'sightseeing', estimatedCost: 15, estimatedDuration: 120, cityName: 'Tokyo', country: 'Japan', popularity: 88 },
    { name: 'Sushi Making Class', category: 'food', estimatedCost: 80, estimatedDuration: 180, cityName: 'Tokyo', country: 'Japan', popularity: 82 },
    { name: 'Statue of Liberty Tour', category: 'sightseeing', estimatedCost: 25, estimatedDuration: 180, cityName: 'New York', country: 'USA', popularity: 92 },
    { name: 'Broadway Show', category: 'culture', estimatedCost: 120, estimatedDuration: 150, cityName: 'New York', country: 'USA', popularity: 89 },
    { name: 'Sagrada Familia', category: 'sightseeing', estimatedCost: 35, estimatedDuration: 120, cityName: 'Barcelona', country: 'Spain', popularity: 94 },
    { name: 'Beach Day', category: 'relaxation', estimatedCost: 0, estimatedDuration: 360, cityName: 'Bali', country: 'Indonesia', popularity: 87 },
    { name: 'Scuba Diving', category: 'adventure', estimatedCost: 75, estimatedDuration: 240, cityName: 'Bali', country: 'Indonesia', popularity: 83 },
  ]

  for (const activity of activities) {
    await prisma.activityTemplate.create({
      data: activity,
    })
  }

  // Create sample trip
  const trip = await prisma.trip.create({
    data: {
      name: 'European Adventure 2026',
      description: 'A wonderful journey through Europe',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-15'),
      userId: user.id,
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      stops: {
        create: [
          {
            cityName: 'Paris',
            country: 'France',
            startDate: new Date('2026-06-01'),
            endDate: new Date('2026-06-05'),
            order: 1,
            activities: {
              create: [
                {
                  name: 'Eiffel Tower Visit',
                  category: 'sightseeing',
                  date: new Date('2026-06-02'),
                  startTime: '10:00',
                  endTime: '13:00',
                  duration: 180,
                  cost: 30,
                  order: 1,
                },
                {
                  name: 'Louvre Museum',
                  category: 'culture',
                  date: new Date('2026-06-03'),
                  startTime: '09:00',
                  endTime: '13:00',
                  duration: 240,
                  cost: 20,
                  order: 2,
                },
              ],
            },
          },
          {
            cityName: 'Barcelona',
            country: 'Spain',
            startDate: new Date('2026-06-06'),
            endDate: new Date('2026-06-10'),
            order: 2,
            activities: {
              create: [
                {
                  name: 'Sagrada Familia',
                  category: 'sightseeing',
                  date: new Date('2026-06-07'),
                  startTime: '10:00',
                  endTime: '12:00',
                  duration: 120,
                  cost: 35,
                  order: 1,
                },
              ],
            },
          },
          {
            cityName: 'Rome',
            country: 'Italy',
            startDate: new Date('2026-06-11'),
            endDate: new Date('2026-06-15'),
            order: 3,
          },
        ],
      },
      expenses: {
        create: [
          { category: 'transport', description: 'Flights', amount: 800, currency: 'USD', date: new Date('2026-06-01') },
          { category: 'accommodation', description: 'Hotels', amount: 1200, currency: 'USD', date: new Date('2026-06-01') },
          { category: 'food', description: 'Restaurants & Cafes', amount: 600, currency: 'USD', date: new Date('2026-06-01') },
        ],
      },
    },
  })

  // Seed activity templates for Magic Suggest feature
  const activityTemplates = [
    // Paris
    { name: 'Eiffel Tower Visit', description: 'Iconic monument with views of the city', category: 'sightseeing', estimatedCost: 15, estimatedDuration: 120, cityName: 'Paris', country: 'France', popularity: 100 },
    { name: 'Louvre Museum', description: 'World\'s largest art museum', category: 'culture', estimatedCost: 18, estimatedDuration: 180, cityName: 'Paris', country: 'France', popularity: 95 },
    { name: 'Seine River Cruise', description: 'Scenic boat tour along the Seine', category: 'sightseeing', estimatedCost: 12, estimatedDuration: 90, cityName: 'Paris', country: 'France', popularity: 85 },
    { name: 'French Cuisine Dinner', description: 'Fine dining experience at a Michelin restaurant', category: 'food', estimatedCost: 80, estimatedDuration: 180, cityName: 'Paris', country: 'France', popularity: 80 },
    // New York
    { name: 'Statue of Liberty', description: 'Visit the iconic statue with harbor views', category: 'sightseeing', estimatedCost: 24, estimatedDuration: 180, cityName: 'New York', country: 'United States', popularity: 100 },
    { name: 'Broadway Show', description: 'Experience a world-class theatrical production', category: 'entertainment', estimatedCost: 120, estimatedDuration: 180, cityName: 'New York', country: 'United States', popularity: 90 },
    { name: 'Central Park Walk', description: 'Stroll through NYC\'s most famous park', category: 'relaxation', estimatedCost: 0, estimatedDuration: 120, cityName: 'New York', country: 'United States', popularity: 85 },
    { name: 'Times Square', description: 'Visit the bustling heart of NYC', category: 'sightseeing', estimatedCost: 0, estimatedDuration: 60, cityName: 'New York', country: 'United States', popularity: 80 },
    // Tokyo
    { name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa', category: 'culture', estimatedCost: 5, estimatedDuration: 90, cityName: 'Tokyo', country: 'Japan', popularity: 95 },
    { name: 'Shibuya Crossing Experience', description: 'Watch the world\'s busiest intersection', category: 'sightseeing', estimatedCost: 0, estimatedDuration: 60, cityName: 'Tokyo', country: 'Japan', popularity: 90 },
    { name: 'Sushi Making Class', description: 'Learn to make authentic Japanese sushi', category: 'food', estimatedCost: 100, estimatedDuration: 150, cityName: 'Tokyo', country: 'Japan', popularity: 85 },
    { name: 'Mount Fuji Day Trip', description: 'Visit Japan\'s most iconic mountain', category: 'adventure', estimatedCost: 60, estimatedDuration: 480, cityName: 'Tokyo', country: 'Japan', popularity: 80 },
    // London
    { name: 'Big Ben & Parliament', description: 'Historic government buildings and clock tower', category: 'sightseeing', estimatedCost: 0, estimatedDuration: 90, cityName: 'London', country: 'United Kingdom', popularity: 95 },
    { name: 'Tower of London', description: 'Historic fortress with Crown Jewels', category: 'sightseeing', estimatedCost: 28, estimatedDuration: 120, cityName: 'London', country: 'United Kingdom', popularity: 90 },
    { name: 'British Museum', description: 'Comprehensive history and culture museum', category: 'culture', estimatedCost: 0, estimatedDuration: 240, cityName: 'London', country: 'United Kingdom', popularity: 85 },
    { name: 'Tea Time at Ritz', description: 'Traditional English afternoon tea', category: 'food', estimatedCost: 75, estimatedDuration: 120, cityName: 'London', country: 'United Kingdom', popularity: 75 },
    // Barcelona
    { name: 'Sagrada Familia', description: 'Iconic basilica by Antoni Gaudí', category: 'culture', estimatedCost: 26, estimatedDuration: 120, cityName: 'Barcelona', country: 'Spain', popularity: 100 },
    { name: 'Park Güell', description: 'Colorful modernist park with city views', category: 'sightseeing', estimatedCost: 14, estimatedDuration: 120, cityName: 'Barcelona', country: 'Spain', popularity: 95 },
    { name: 'La Rambla Walk', description: 'Vibrant tree-lined promenade', category: 'sightseeing', estimatedCost: 0, estimatedDuration: 90, cityName: 'Barcelona', country: 'Spain', popularity: 85 },
    { name: 'Tapas Bar Crawl', description: 'Experience Spanish small plates and drinks', category: 'food', estimatedCost: 45, estimatedDuration: 180, cityName: 'Barcelona', country: 'Spain', popularity: 80 },
    // Rome
    { name: 'Colosseum Tour', description: 'Ancient Roman amphitheater', category: 'culture', estimatedCost: 18, estimatedDuration: 120, cityName: 'Rome', country: 'Italy', popularity: 100 },
    { name: 'Vatican City Visit', description: 'St. Peter\'s Basilica and Museums', category: 'culture', estimatedCost: 30, estimatedDuration: 240, cityName: 'Rome', country: 'Italy', popularity: 98 },
    { name: 'Trevi Fountain', description: 'Iconic baroque fountain', category: 'sightseeing', estimatedCost: 0, estimatedDuration: 60, cityName: 'Rome', country: 'Italy', popularity: 90 },
    { name: 'Italian Cooking Class', description: 'Learn traditional pasta and risotto', category: 'food', estimatedCost: 75, estimatedDuration: 180, cityName: 'Rome', country: 'Italy', popularity: 85 },
    // Bangkok
    { name: 'Grand Palace', description: 'Thailand\'s most sacred building', category: 'culture', estimatedCost: 15, estimatedDuration: 120, cityName: 'Bangkok', country: 'Thailand', popularity: 95 },
    { name: 'Floating Markets', description: 'Traditional riverside markets', category: 'sightseeing', estimatedCost: 20, estimatedDuration: 180, cityName: 'Bangkok', country: 'Thailand', popularity: 90 },
    { name: 'Thai Massage', description: 'Traditional Thai therapeutic massage', category: 'relaxation', estimatedCost: 10, estimatedDuration: 120, cityName: 'Bangkok', country: 'Thailand', popularity: 85 },
    { name: 'Street Food Tour', description: 'Sample authentic Bangkok street food', category: 'food', estimatedCost: 25, estimatedDuration: 150, cityName: 'Bangkok', country: 'Thailand', popularity: 88 },
    // Sydney
    { name: 'Opera House Tour', description: 'Iconic architectural landmark', category: 'sightseeing', estimatedCost: 45, estimatedDuration: 120, cityName: 'Sydney', country: 'Australia', popularity: 95 },
    { name: 'Bondi Beach', description: 'Famous beach with golden sands', category: 'relaxation', estimatedCost: 0, estimatedDuration: 180, cityName: 'Sydney', country: 'Australia', popularity: 90 },
    { name: 'Harbor Bridge Climb', description: 'Climb the iconic Sydney Harbor Bridge', category: 'adventure', estimatedCost: 330, estimatedDuration: 180, cityName: 'Sydney', country: 'Australia', popularity: 85 },
    { name: 'Seafood at Quay', description: 'Michelin-starred seafood restaurant', category: 'food', estimatedCost: 200, estimatedDuration: 180, cityName: 'Sydney', country: 'Australia', popularity: 80 },
    // Generic worldwide activities
    { name: 'Local Food Tour', description: 'Discover authentic local cuisine and restaurants', category: 'food', estimatedCost: 50, estimatedDuration: 150, popularity: 85 },
    { name: 'City Walking Tour', description: 'Guided tour of main attractions and history', category: 'sightseeing', estimatedCost: 25, estimatedDuration: 180, popularity: 80 },
    { name: 'Hiking Adventure', description: 'Outdoor hiking in nearby natural areas', category: 'adventure', estimatedCost: 0, estimatedDuration: 240, popularity: 75 },
    { name: 'Cooking Class', description: 'Learn to cook traditional local dishes', category: 'food', estimatedCost: 80, estimatedDuration: 180, popularity: 70 },
    { name: 'Spa & Relaxation', description: 'Traditional spa experience and massage', category: 'relaxation', estimatedCost: 60, estimatedDuration: 120, popularity: 70 },
    { name: 'Museum Visit', description: 'Explore local art and history museum', category: 'culture', estimatedCost: 15, estimatedDuration: 180, popularity: 75 },
    { name: 'Shopping District', description: 'Browse local shops and markets', category: 'shopping', estimatedCost: 40, estimatedDuration: 120, popularity: 65 },
    { name: 'Nightlife & Clubs', description: 'Experience local bars and nightclubs', category: 'entertainment', estimatedCost: 50, estimatedDuration: 180, popularity: 70 },
  ]

  for (const activity of activityTemplates) {
    await prisma.activityTemplate.upsert({
      where: { id: `template-${activity.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: {},
      create: {
        name: activity.name,
        description: activity.description,
        category: activity.category,
        estimatedCost: activity.estimatedCost,
        estimatedDuration: activity.estimatedDuration,
        cityName: activity.cityName || null,
        country: activity.country || null,
        popularity: activity.popularity,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📍 Added ${activityTemplates.length} activity templates for Magic Suggest`)
  console.log('\n📧 Demo credentials:')
  console.log('   Email: demo@globetrotter.com')
  console.log('   Password: demo1234')
  console.log('\n👤 Admin credentials:')
  console.log('   Email: admin@globetrotter.com')
  console.log('   Password: admin1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
