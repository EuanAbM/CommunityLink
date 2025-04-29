import Link from "next/link"
import { formatDateTime, getStatusColor, truncateText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { incidents } from "@/lib/data"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export function RecentIncidents() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Recently reported safeguarding incidents across your school</CardDescription>
        </div>
        <Button asChild variant="ghost" className="ml-auto gap-1">
          <Link href="/incidents">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {incidents.slice(0, 3).map((incident) => (
            <div key={incident.id} className="flex items-center">
              <div className="space-y-1">
                <Link href={`/incidents/${incident.id}`} className="font-medium leading-none hover:underline">
                  {truncateText(incident.description, 50)}
                </Link>
                <p className="text-sm text-muted-foreground">{formatDateTime(incident.reportDate)}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(incident.status)}>
                  {incident.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function UsersLast7dayReports() {
  const recentExamples = incidents.slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your recently reported incidents (Last 7 days)</CardTitle>
        <CardDescription>This is purely for record reporting only.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentExamples.length > 0 ? (
          recentExamples.map((incident) => {
            const ticketID = Math.floor(10000 + Math.random() * 90000)
            const subject = incident.subject || "General safeguarding concern"

            return (
              <div
                key={incident.id}
                className="flex items-center justify-between px-4 py-2 rounded-md transition-all duration-200 border bg-white hover:shadow-xl hover:scale-[1.01]"
              >
                {/* Left side: profile + condensed summary */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className="w-5 h-5 rounded-full bg-gray-300"
                    style={{ minWidth: "20px", minHeight: "20px" }}
                  />
                  <div className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                    <span className="font-medium">{incident.studentName}</span> — {subject} —{" "}
                    <span className="text-muted-foreground">{incident.category}</span>
                  </div>
                </div>

                {/* Right side: status + ticket ID */}
                <div className="flex flex-col items-end gap-1 min-w-[100px]">
                  <Badge variant="outline" className={getStatusColor(incident.status)}>
                    {incident.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">#{ticketID}</span>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-muted-foreground">No incidents reported in the last 7 days.</p>
        )}
      </CardContent>
    </Card>
  )
}
