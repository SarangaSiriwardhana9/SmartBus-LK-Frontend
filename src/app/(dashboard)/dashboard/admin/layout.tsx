// src/app/(dashboard)/dashboard/admin/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/tailwind-utils'
import { 
  LayoutDashboard,
  Users,
  Bus,
  Route,
  TicketCheck,
  BarChart3,
  Settings,
  CheckSquare,
  Menu,
  X
} from 'lucide-react'

const adminRoutes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard/admin',
    color: 'text-sky-500'
  },
  {
    label: 'Users',
    icon: Users,
    href: '/dashboard/admin/users',
    color: 'text-violet-500'
  },
  {
    label: 'Buses',
    icon: Bus,
    href: '/dashboard/admin/buses',
    color: 'text-pink-700'
  },
  {
    label: 'Routes',
    icon: Route,
    href: '/dashboard/admin/routes',
    color: 'text-orange-700'
  },
  {
    label: 'Bookings',
    icon: TicketCheck,
    href: '/dashboard/admin/bookings',
    color: 'text-emerald-500'
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/admin/analytics',
    color: 'text-green-700'
  },
  {
    label: 'Approvals',
    icon: CheckSquare,
    href: '/dashboard/admin/approvals',
    color: 'text-blue-600'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/admin/settings',
    color: 'text-gray-700'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-full relative">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed top-0 left-0 w-64 h-full bg-white border-r">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-2">
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                    {route.label}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-50 bg-gray-900">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link href="/dashboard/admin" className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Admin Panel
              </h1>
            </Link>
          </div>
          <div className="flex-1 px-3 pb-4">
            <nav className="space-y-2">
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                    {route.label}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Admin Panel</h1>
        </div>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}