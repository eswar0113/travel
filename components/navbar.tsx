'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Plane, User, LogOut, LayoutDashboard, MapPin, Settings, Heart } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:h-16 sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">GlobeTrotter</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/trips">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    My Trips
                  </Button>
                </Link>
                <Link href="/saved-cities">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Saved Cities
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                {(session.user as any).isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-center">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="w-full sm:w-auto justify-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-center">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="w-full sm:w-auto justify-center">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
