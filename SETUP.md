# GlobeTrotter Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# PostgreSQL database connection
DATABASE_URL="postgresql://username:password@localhost:5432/globetrotter?schema=public"

# NextAuth configuration
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

Create the database:
```bash
createdb globetrotter
```

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

Seed the database with sample data:
```bash
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

After seeding, you can log in with:

**Demo User:**
- Email: `demo@globetrotter.com`
- Password: `demo1234`

**Admin User:**
- Email: `admin@globetrotter.com`
- Password: `admin1234`

## Database Management

### View Database in Prisma Studio
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Prisma Client (if needed)
```bash
npx prisma generate
```

## Project Structure

```
globetrotter/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── trips/        # Trip management
│   │   ├── activities/   # Activity management
│   │   └── cities/       # City search
│   ├── auth/             # Auth pages (login, signup)
│   ├── dashboard/        # Main dashboard
│   ├── trips/            # Trip management pages
│   ├── search/           # City & activity search
│   ├── profile/          # User profile
│   └── admin/            # Admin dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation bar
│   ├── footer.tsx        # Footer
│   └── trip-card.tsx     # Trip card component
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static assets
```

## Features Implemented

### ✅ Core Features
- [x] User authentication (login, signup, password reset)
- [x] Dashboard with trip statistics
- [x] Create and manage trips
- [x] Multi-city itinerary builder
- [x] Add stops (cities) to trips
- [x] Add activities to each stop
- [x] Budget tracking and cost breakdown
- [x] Trip list with search
- [x] City search and discovery
- [x] User profile management
- [x] Admin analytics dashboard
- [x] Responsive design (mobile-friendly)

### 📱 Pages Included

1. **Landing Page** - Marketing homepage
2. **Login/Signup** - User authentication
3. **Dashboard** - Central hub with stats and recent trips
4. **My Trips** - List all user trips with search
5. **Create Trip** - Trip creation form
6. **Trip Detail** - Full itinerary with stops and activities
7. **Itinerary Builder** - Add/manage stops and activities
8. **Budget View** - Cost breakdown and analytics
9. **City Search** - Discover destinations
10. **User Profile** - Account settings
11. **Admin Dashboard** - Analytics (admin only)

## Database Schema

### Main Models
- **User** - User accounts with auth
- **Trip** - Trip containers
- **Stop** - Cities/destinations in trips
- **Activity** - Things to do at each stop
- **Expense** - Budget items
- **SharedTrip** - Public sharing
- **City** - City database with metadata
- **ActivityTemplate** - Suggested activities

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **UI:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts (ready for budget analytics)

## Development Tips

### Hot Reload Issues?
Clear `.next` folder:
```bash
rm -rf .next
npm run dev
```

### Database Schema Changes?
```bash
npx prisma migrate dev --name your_migration_name
```

### Type Errors?
Regenerate Prisma types:
```bash
npx prisma generate
```

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Update these in your hosting platform:
- `DATABASE_URL` - Production database URL
- `NEXTAUTH_SECRET` - Strong random secret
- `NEXTAUTH_URL` - Your production domain

### Recommended Hosting
- **Vercel** - Easiest for Next.js
- **Railway** - Great for PostgreSQL + Next.js
- **Render** - Good alternative
- **AWS/GCP/Azure** - Enterprise options

## Troubleshooting

### Port 3000 already in use?
```bash
npx kill-port 3000
npm run dev
```

### Prisma Client errors?
```bash
npx prisma generate
```

### Database connection issues?
Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

## Next Steps

Extend the application with:
- [ ] Real-time collaboration
- [ ] Map integration (Google Maps API)
- [ ] Weather forecasts
- [ ] Flight/hotel booking integration
- [ ] Social sharing with previews
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] AI trip suggestions
- [ ] Currency conversion
- [ ] Photo uploads for activities

## Support

For issues or questions, check:
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://next-auth.js.org

---

**Happy Travel Planning! ✈️**
