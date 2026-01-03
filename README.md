# GlobeTrotter 🌍

A personalized, intelligent, collaborative travel-planning web app that helps users plan multi-city trips end-to-end.

## Features

- **Trip Management**: Create, edit, and organize multi-city trips
- **Itinerary Builder**: Add stops, activities, and build detailed day-by-day plans
- **Budget Tracking**: Automatic cost estimation with detailed breakdowns
- **City & Activity Search**: Discover destinations and activities with filters
- **Multiple Views**: Timeline, calendar, and list views for itineraries
- **Sharing**: Share trips publicly or with friends
- **User Profiles**: Manage preferences and saved destinations
- **Admin Dashboard**: Analytics and user management (admin only)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update DATABASE_URL with your PostgreSQL connection string
   - Update NEXTAUTH_SECRET with a secure random string

3. **Set up database**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Database Schema

- **User**: User accounts with authentication
- **Trip**: Trip containers with metadata
- **Stop**: Cities/destinations within trips
- **Activity**: Things to do at each stop
- **Expense**: Budget items and costs
- **SharedTrip**: Public sharing links

## Project Structure

```
/app                # Next.js app router
  /api             # API routes
  /auth            # Authentication pages
  /dashboard       # Main dashboard
  /trips           # Trip management
  /itinerary       # Itinerary builder & views
  /search          # City & activity search
  /budget          # Budget tracking
  /profile         # User profile
  /admin           # Admin analytics
/components        # React components
/lib               # Utilities and configurations
/prisma            # Database schema and migrations
```

## License

MIT
