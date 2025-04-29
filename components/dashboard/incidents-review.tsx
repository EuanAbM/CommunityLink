import Link from "next/link"
import { formatDateTime, getStatusColor, truncateText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { incidents, students, users } from "@/lib/data"
import { ChevronRight, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

export function IncidentsReview() {
  // Filter incidents that need review (not resolved and have follow-up required)
  const incidentsNeedingReview = incidents
    .filter((incident) => incident.status !== "resolved" && incident.followUpRequired)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Incidents Requiring Review</CardTitle>
          <CardDescription>Incidents that need your attention and follow-up</CardDescription>
        </div>
        <Button asChild variant="ghost" className="ml-auto gap-1">
          <Link href="/incidents?filter=review">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {incidentsNeedingReview.length > 0 ? (
            incidentsNeedingReview.map((incident) => {
              const student = students.find((s) => s.id === incident.studentId)
              const reporter = users.find((u) => u.id === incident.reportedBy)

              return (
                <div key={incident.id} className="flex items-center">
                  <div className="mr-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {student ? getInitials(student.firstName, student.lastName) : "??"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/incidents/${incident.id}`} className="font-medium leading-none hover:underline">
                        {student ? `${student.firstName} ${student.lastName}` : "Unknown Student"}
                      </Link>
                      {incident.isConfidential && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{truncateText(incident.description, 60)}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDateTime(incident.reportDate)}</span>
                      <span>•</span>
                      <span>Reported by: {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Unknown"}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(incident.status)}>
                      {incident.status.replace("_", " ")}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/incidents/${incident.id}`}>Review</Link>
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">No incidents currently require review</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

