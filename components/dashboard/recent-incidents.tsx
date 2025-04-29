import Link from "next/link"
import { formatDateTime, getStatusColor, truncateText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { incidents } from "@/lib/data"
import { ChevronRight } from "lucide-react"

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

