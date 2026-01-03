# 🚀 GlobeTrotter - Quick Reference Card

## ⚡ Essential Commands

### First Time Setup
```bash
npm install                              # Install all dependencies
npx prisma migrate dev --name init      # Create database tables
npx prisma db seed                      # Add sample data
npm run dev                             # Start development server
```

### Daily Development
```bash
npm run dev                             # Start dev server (http://localhost:3000)
npx prisma studio                       # View database in browser
```

### Database Operations
```bash
npx prisma migrate dev                  # Create new migration
npx prisma db seed                      # Reseed database
npx prisma migrate reset                # Reset database (DELETES ALL DATA!)
npx prisma generate                     # Regenerate Prisma client
npx prisma studio                       # Database GUI
```

### Production
```bash
npm run build                           # Build for production
npm start                               # Start production server
```

### Troubleshooting
```bash
npx kill-port 3000                     # Kill process on port 3000
rm -r node_modules && npm install      # Reinstall dependencies
npx prisma generate                    # Fix Prisma type errors
```

---

## 🔑 Demo Login Credentials

**Regular User:**
- Email: `demo@globetrotter.com`
- Password: `demo1234`

**Admin User:**
- Email: `admin@globetrotter.com`
- Password: `admin1234`

---

## 📂 Key File Locations

### Pages
- Landing: `app/page.tsx`
- Dashboard: `app/dashboard/page.tsx`
- Trip List: `app/trips/page.tsx`
- Trip Detail: `app/trips/[id]/page.tsx`
- Login: `app/auth/login/page.tsx`
- Profile: `app/profile/page.tsx`
- Admin: `app/admin/page.tsx`

### API Routes
- Trips: `app/api/trips/route.ts`
- Cities: `app/api/cities/route.ts`
- Activities: `app/api/activities/route.ts`
- Auth: `app/api/auth/[...nextauth]/route.ts`

### Configuration
- Database: `prisma/schema.prisma`
- Environment: `.env`
- Auth: `lib/auth.ts`
- Styles: `app/globals.css`

---

## 🎨 Customization Quick Tips

### Change Primary Color
Edit `app/globals.css`:
```css
--primary: 221.2 83.2% 53.3%;  /* Blue - change HSL values */
```

### Add Activity Category
Edit `app/trips/[id]/page.tsx` - look for the category select dropdown

### Modify Database
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change_name`
3. Run `npx prisma generate`

### Add New Page
Create file: `app/your-page/page.tsx`
It will be available at: `http://localhost:3000/your-page`

---

## 🌐 Important URLs

**Local Development:**
- App: http://localhost:3000
- Database GUI: http://localhost:5555 (after `npx prisma studio`)

**After Login:**
- Dashboard: http://localhost:3000/dashboard
- My Trips: http://localhost:3000/trips
- Create Trip: http://localhost:3000/trips/new
- Profile: http://localhost:3000/profile
- City Search: http://localhost:3000/search/cities
- Admin: http://localhost:3000/admin (admin only)

---

## 🐛 Common Issues & Fixes

**"Port 3000 already in use"**
```bash
npx kill-port 3000
```

**"Prisma Client not generated"**
```bash
npx prisma generate
```

**"Cannot connect to database"**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`

**"Module not found" errors**
```bash
rm -r node_modules
npm install
```

**Changes not showing?**
```bash
rm -r .next
npm run dev
```

---

## 📊 Database Models Quick Reference

- **User** - User accounts
- **Trip** - Trip containers
- **Stop** - Cities in trips
- **Activity** - Things to do
- **Expense** - Budget items
- **City** - City database
- **ActivityTemplate** - Suggested activities
- **SharedTrip** - Public sharing
- **SavedCity** - User favorites

---

## 🎯 Feature Checklist

- ✅ User authentication
- ✅ Trip CRUD operations
- ✅ Multi-city itineraries
- ✅ Activity planning
- ✅ Budget tracking
- ✅ City search
- ✅ User profiles
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Toast notifications

---

## 📦 Tech Stack

- Next.js 14 (React)
- TypeScript
- PostgreSQL + Prisma
- NextAuth.js
- Tailwind CSS
- shadcn/ui

---

## 🚢 Quick Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables:
   - `DATABASE_URL` (from Neon/Railway)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel URL)
5. Deploy!

---

## 📞 Help & Documentation

- Full Setup: `SETUP.md`
- Quick Start: `QUICKSTART.md`
- Project Summary: `PROJECT_SUMMARY.md`
- Main Readme: `README.md`

---

**Print this card for easy reference! 📄**
