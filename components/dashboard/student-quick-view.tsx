import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { students } from "@/lib/data"
import { getInitials, getSafeguardingStatusColor, daysSince } from "@/lib/utils"
import { AlertTriangle, ChevronRight } from "lucide-react"

export function StudentQuickView() {
  // Filter to only show students with safeguarding statuses
  const safeguardingStudents = students.filter(
    (student) => student.safeguardingStatus && student.safeguardingStatus !== "None",
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Safeguarding Overview</CardTitle>
          <CardDescription>Students with active safeguarding plans</CardDescription>
        </div>
        <Button asChild variant="ghost" className="ml-auto gap-1">
          <Link href="/students">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {safeguardingStudents.map((student) => (
            <div key={student.id} className="flex items-center">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage
                  src={`/placeholder.svg?height=36&width=36`}
                  alt={`${student.firstName} ${student.lastName}`}
                />
                <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Link href={`/students/${student.id}`} className="font-medium leading-none hover:underline">
                  {student.firstName} {student.lastName}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {student.yearGroup} • Tutor: {student.tutor}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className={getSafeguardingStatusColor(student.safeguardingStatus)}>
                  {student.safeguardingStatus}
                </Badge>
                {student.lastIncidentDate &&
                  daysSince(student.lastIncidentDate) !== null &&
                  daysSince(student.lastIncidentDate)! < 7 && (
                    <span className="text-amber-500" title="Recent incident">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

