"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
  // Force the loading state to show for at least 3 seconds
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Set a timeout to hide the loading state after 3 seconds
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3000)

    // Clear timeout on component unmount
    return () => clearTimeout(timer)
  }, [])

  // If showLoading is false, don't render the skeleton anymore
  if (!showLoading) return null

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          {/* Header section */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" className="mb-6" disabled>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="mb-6 border-b">
              <div className="flex gap-2">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>
            </div>

            {/* Tab content - Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      ))}
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-36" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="w-full">
                            <Skeleton className="h-5 w-3/4 mb-1" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

