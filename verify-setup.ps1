# GlobeTrotter Setup Verification

Write-Host "🌍 GlobeTrotter Setup Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

# Check .env file
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check if DATABASE_URL is set
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL=") {
        Write-Host "✅ DATABASE_URL configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DATABASE_URL not configured in .env" -ForegroundColor Yellow
    }
    
    if ($envContent -match "NEXTAUTH_SECRET=") {
        Write-Host "✅ NEXTAUTH_SECRET configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  NEXTAUTH_SECRET not configured in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env file not found. Copy from .env.example" -ForegroundColor Yellow
}

# Check Prisma
Write-Host ""
Write-Host "Checking database setup..." -ForegroundColor Yellow
if (Test-Path "prisma\schema.prisma") {
    Write-Host "✅ Prisma schema exists" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma schema not found" -ForegroundColor Red
}

if (Test-Path "node_modules\.prisma\client") {
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma client not generated. Run: npx prisma generate" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. If dependencies not installed:" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set up your database:" -ForegroundColor White
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor Gray
Write-Host "   npx prisma db seed" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open http://localhost:3000 in your browser! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "📖 For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host ""
