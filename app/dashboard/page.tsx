import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { SafeguardingStats } from "@/components/dashboard/safeguarding-stats"
import { StudentQuickView } from "@/components/dashboard/student-quick-view"
import { RecentIncidents } from "@/components/dashboard/recent-incidents"
import { IncidentsReview } from "@/components/dashboard/incidents-review"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Shield } from "lucide-react"
import Link from "next/link"
import { UsersLast7dayReports } from "@/components/dashboard/UsersLast7dayReports"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-muted-foreground">Chilternwood  safeguarding overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center bg-muted px-3 py-1 rounded-md text-sm text-muted-foreground gap-2">
                <Shield className="h-4 w-4" />
                <span>Last updated: Today, 10:15 AM</span>
              </div>
              <Button asChild>
                <Link href="/incidents/new">New Incident</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <SafeguardingStats />

            <div className="grid gap-6 md:grid-cols-2">
              <StudentQuickView />
              <RecentIncidents />
            </div>

            <IncidentsReview />
            <UsersLast7dayReports />

            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}

