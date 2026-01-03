# GlobeTrotter - Quick Start Instructions

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
Open PowerShell in this folder and run:
```powershell
npm install
```
This will install all required packages (Next.js, React, Prisma, etc.)

### Step 2: Set Up Database

**Option A: Use Local PostgreSQL**
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a database:
   ```powershell
   createdb globetrotter
   ```
3. The `.env` file is already configured for local PostgreSQL

**Option B: Use Cloud Database (Recommended for Quick Start)**
1. Create a free database at https://railway.app or https://neon.tech
2. Copy your connection string
3. Update `DATABASE_URL` in `.env` file

**Initialize the Database:**
```powershell
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 3: Start the App
```powershell
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

## 🔐 Demo Login Credentials

**Regular User:**
- Email: `demo@globetrotter.com`
- Password: `demo1234`

**Admin User:**
- Email: `admin@globetrotter.com`
- Password: `admin1234`

## 📂 What You Get

✅ **13+ Fully Functional Pages:**
- Landing page with hero section
- Login & Signup with validation
- Dashboard with trip statistics
- My Trips list with search
- Create/Edit trip forms
- Itinerary builder (add cities & activities)
- Budget tracker with cost breakdown
- City search & discovery
- User profile & settings
- Admin analytics dashboard

✅ **Complete Backend:**
- PostgreSQL database with Prisma ORM
- NextAuth authentication
- REST API routes for all operations
- Session management & middleware

✅ **Modern UI:**
- Responsive design (mobile & desktop)
- shadcn/ui components
- Tailwind CSS styling
- Smooth animations

## 🎯 Key Features Demonstrated

1. **Multi-City Trip Planning**
   - Create trips with dates & descriptions
   - Add multiple city stops
   - Organize by order and dates

2. **Itinerary Builder**
   - Add activities to each city
   - Set times, costs, and categories
   - View day-by-day breakdowns

3. **Budget Tracking**
   - Automatic cost calculation
   - Expense categorization
   - Visual breakdown (ready for charts)

4. **Search & Discovery**
   - Browse cities with metadata
   - Cost index and popularity ratings
   - Filter and search capabilities

5. **User Management**
   - Secure authentication
   - Profile customization
   - Admin dashboard access control

## 🛠 Development Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma types
npx prisma generate
```

## 📱 Testing the App

1. **Create an Account**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in your details

2. **Create Your First Trip**
   - From Dashboard, click "Plan New Trip"
   - Add trip name, dates, and description
   - Click "Create Trip"

3. **Build Your Itinerary**
   - Click "Add Stop" to add a city
   - Enter city name, country, and dates
   - Click "Add Activity" to plan activities
   - Fill in activity details (name, time, cost)

4. **View Your Budget**
   - Switch to "Budget" tab
   - See total costs and breakdowns
   - Track expenses by category

5. **Explore Cities**
   - Click "Search Cities" in navbar
   - Browse destinations
   - View cost indices and popularity

## 🎨 Customization

### Change Colors
Edit `app/globals.css` to modify the color scheme:
```css
--primary: 221.2 83.2% 53.3%;  /* Change this for primary color */
```

### Add More Activity Categories
Edit the category dropdown in `app/trips/[id]/page.tsx`

### Modify Database Schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change`
3. Run `npx prisma generate`

## 🐛 Troubleshooting

**"Port 3000 is already in use"**
```powershell
npx kill-port 3000
```

**"Prisma Client is not generated"**
```powershell
npx prisma generate
```

**"Cannot connect to database"**
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Try: `npx prisma db push`

**"Module not found" errors**
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

## 📚 Project Structure Explained

```
app/
├── api/              # Backend API routes
│   ├── auth/        # Login, signup, NextAuth
│   ├── trips/       # CRUD operations for trips
│   ├── activities/  # Activity management
│   └── cities/      # City search
├── auth/            # Authentication pages
├── dashboard/       # Main user dashboard
├── trips/           # Trip management UI
├── search/          # City discovery
├── profile/         # User settings
└── admin/           # Admin analytics

components/
├── ui/              # Reusable UI components
├── navbar.tsx       # Top navigation
├── footer.tsx       # Bottom footer
└── trip-card.tsx    # Trip display card

prisma/
├── schema.prisma    # Database structure
└── seed.ts          # Sample data

lib/
├── auth.ts          # Authentication config
├── prisma.ts        # Database client
└── utils.ts         # Helper functions
```

## 🚢 Deployment

### Deploy to Vercel (Easiest)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL` (from Railway/Neon)
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your Vercel URL)
5. Deploy!

### Database for Production
Use one of these:
- **Neon** (free tier): https://neon.tech
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com

## 💡 Next Enhancement Ideas

- [ ] Google Maps integration for city views
- [ ] Weather API for destination forecasts
- [ ] Real-time collaboration on trips
- [ ] Email sharing with friends
- [ ] Photo uploads for activities
- [ ] Export itinerary to PDF
- [ ] Currency conversion
- [ ] Mobile app version
- [ ] AI-powered trip suggestions
- [ ] Integration with booking platforms

## 📖 Learn More

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## 🎉 You're All Set!

The application is production-ready with:
- ✅ Complete authentication system
- ✅ Full CRUD operations
- ✅ Relational database
- ✅ Responsive UI
- ✅ Admin capabilities
- ✅ Budget tracking
- ✅ Search functionality
- ✅ User management

**Need help?** Check the documentation links above or review the code comments.

**Happy Travel Planning! ✈️🌍**
