import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSafeguardingStatusColor, formatDate, getInitials, getAgeFromDOB } from "@/lib/utils"
import { AlertTriangle, ChevronRight, FileText } from "lucide-react"

type Student = {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  year_group: string
  tutor: string
  safeguarding_status: string
  has_confidential_information: boolean
}

export function StudentCard({ student }: { student: Student }) {
  const studentName = `${student.first_name} ${student.last_name}`
  const age = getAgeFromDOB(student.date_of_birth)

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-slate-50">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <Avatar className="h-12 w-12 mr-4 border-2 border-primary/10 group-hover:border-primary/30">
            <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={studentName} />
            <AvatarFallback>{getInitials(student.first_name, student.last_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium leading-none text-lg group-hover:text-primary">
                {studentName}
              </h3>
              {student.has_confidential_information && (
                <span className="text-amber-500" title="Contains confidential information">
                  <AlertTriangle className="h-4 w-4" />
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {student.year_group} • Age: {age}
            </p>
          </div>
        </div>
        <div className="px-4 py-3 bg-muted/30 border-t border-b">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">DOB:</span>{" "}
              <span className="font-medium">{formatDate(student.date_of_birth)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Tutor:</span>{" "}
              <span className="font-medium">{student.tutor}</span>
            </div>
            <div className="text-sm col-span-2">
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant="outline" className={getSafeguardingStatusColor(student.safeguarding_status)}>
                {student.safeguarding_status || "None"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2 bg-background group-hover:bg-slate-100">
        <Button asChild variant="ghost" size="sm" className="text-xs gap-1 hover:bg-primary/10 hover:text-primary">
          <Link href={`/incidents?studentId=${student.id}`}>
            <FileText className="h-3 w-3 mr-1" />
            View Incidents
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-xs gap-1 hover:bg-primary/10 hover:text-primary">
          <Link href={`/students/${student.id}`}>
            View Profile
            <ChevronRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}