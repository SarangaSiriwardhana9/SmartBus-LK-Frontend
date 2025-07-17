// src/app/(dashboard)/passenger/page.tsx
'use client'

import { useAuth } from '@/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ticket, Search, Clock } from 'lucide-react'
import Link from 'next/link'

export default function PassengerDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Passenger Dashboard</h1>
        <p className="text-muted-foreground">
          Hello {user?.profile.firstName}! Ready for your next journey?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Book Tickets
            </CardTitle>
            <CardDescription>
              Find buses for your next trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/booking/search">Start Booking</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              My Bookings
            </CardTitle>
            <CardDescription>
              View your booking history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/bookings">View Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>
            Your confirmed bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming trips</p>
            <Button asChild className="mt-4">
              <Link href="/booking/search">Book Your First Trip</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}