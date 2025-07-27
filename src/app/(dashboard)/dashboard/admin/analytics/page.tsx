// src/app/(dashboard)/dashboard/admin/analytics/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient } from '@/lib/api'
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart,
  Calendar,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

export default function Analytics() {
  const [period, setPeriod] = useState('monthly')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>({
    revenue: {},
    bookings: {},
    performance: {},
    occupancy: {},
    financial: {}
  })

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const params = { period }
      
      const [revenue, bookings, performance, occupancy, financial] = await Promise.all([
        apiClient.analytics.getRevenueReport(params),
        apiClient.analytics.getBookingAnalytics(params),
        apiClient.analytics.getPerformanceReport(params),
        apiClient.analytics.getOccupancyAnalysis(params),
        apiClient.analytics.getFinancialSummary(params)
      ])

      setAnalytics({
        revenue,
        bookings,
        performance,
        occupancy,
        financial
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
            <p className="text-muted-foreground">System performance insights</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">System performance insights</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {analytics.revenue.total?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{analytics.revenue.growth || 0}% from last {period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.bookings.total?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +{analytics.bookings.growth || 0}% from last {period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.occupancy.average || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 75%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.performance.activeRoutes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.performance.newRoutes || 0} new this {period}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Revenue performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted rounded">
              <p className="text-muted-foreground">Revenue Chart Placeholder</p>
              {/* You would integrate a charting library here like recharts */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Distribution</CardTitle>
            <CardDescription>
              Bookings by bus type and route
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted rounded">
              <p className="text-muted-foreground">Booking Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Routes</CardTitle>
            <CardDescription>
              Highest revenue generating routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.performance.topRoutes?.slice(0, 5).map((route: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{route.name || `Route ${index + 1}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {route.bookings || 0} bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">LKR {route.revenue?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-muted-foreground">
                      {route.occupancy || 0}% occupied
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>
              Key financial metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Gross Revenue</span>
                <span className="font-medium">
                  LKR {analytics.financial.grossRevenue?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fees</span>
                <span className="font-medium">
                  LKR {analytics.financial.platformFees?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Operator Share</span>
                <span className="font-medium">
                  LKR {analytics.financial.operatorShare?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Net Revenue</span>
                  <span>
                    LKR {analytics.financial.netRevenue?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}