// src/app/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, MapPin, Clock, Shield, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { getDashboardRoute } from "@/lib/auth";

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  const getDashboardLink = () => {
    if (!user) return '/dashboard/passenger'
    return getDashboardRoute(user.role)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 flex-1 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-6">
          <Bus className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Sri Lanka Bus
          </h1>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
          The modern bus management platform for Sri Lanka. Book tickets, manage fleets, and travel with confidence across the beautiful island.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <>
              <Button size="lg" asChild>
                <Link href={getDashboardLink()}>
                  Go to Dashboard
                </Link>
              </Button>
              {user?.role === 'passenger' && (
                <Button variant="outline" size="lg" asChild>
                  <Link href="/booking/search">
                    Book Tickets
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">
                  Login
                </Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Sri Lanka Bus?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-[600px] mx-auto">
            Join thousands of passengers and bus operators who trust Sri Lanka Bus for their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Create Account
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Sri Lanka Bus Management System. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Live bus locations and arrival times",
    content: "Track your bus in real-time and get accurate arrival estimates. Never miss your ride again with our GPS-enabled tracking system.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Safe and reliable ticket booking",
    content: "Book your tickets with confidence using our secure payment system. Your personal and payment data is always protected.",
  },
  {
    icon: Users,
    title: "Multiple User Roles",
    description: "Designed for all stakeholders",
    content: "Whether you're a passenger, bus owner, driver, or administrator, our platform provides tailored experiences for everyone.",
  },
  {
    icon: MapPin,
    title: "Island-wide Coverage",
    description: "Routes across Sri Lanka",
    content: "From Colombo to Jaffna, Galle to Trincomalee - we cover all major routes across the beautiful island of Sri Lanka.",
  },
  {
    icon: Star,
    title: "Dynamic Seat Selection",
    description: "Choose your perfect seat",
    content: "Visual seat maps with real-time availability. Select your preferred seat type and position for maximum comfort.",
  },
  {
    icon: Bus,
    title: "Fleet Management",
    description: "Complete bus operations",
    content: "Advanced tools for bus owners to manage their fleet, routes, schedules, and revenue all in one comprehensive platform.",
  },
];

const stats = [
  { value: "1,250+", label: "Active Users" },
  { value: "145", label: "Registered Buses" },
  { value: "35", label: "Routes Covered" },
  { value: "50,000+", label: "Trips Completed" },
];