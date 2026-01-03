'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Plane } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate password reset email
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      toast({
        title: 'Email sent',
        description: 'Check your inbox for password reset instructions',
      })
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send you reset instructions
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Link href="/auth/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link href="/auth/login">
              <Button className="w-full">
                Return to Login
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
