import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { incidents, students, users } from "@/lib/data"
import { getInitials, formatDateTime, getStatusColor, getFullName } from "@/lib/utils"
import { FileText, Lock, Plus } from "lucide-react"

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Renders the IncidentsPage component, which displays a list of safeguarding incidents.
 * 
 * This page sorts incidents by their report date in descending order and presents them
 * in a table format. Each incident entry includes details such as the date, student 
 * involved, category, reporter, and current status. Users can navigate to the incident
 * details or report a new incident using provided links. The page layout includes a 
 * site header and a main content area with a title and description.
 */

/******  cf892f2c-408d-4f56-a2b0-ec6c358f93eb  *******/
export default function IncidentsPage() {
  // Sort incidents by date (newest first)
  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime(),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Incidents</h1>
              <p className="text-muted-foreground">View and manage safeguarding incidents</p>
            </div>
            <Button asChild className="sm:ml-auto">
              <Link href="/incidents/new">
                <Plus className="mr-2 h-4 w-4" />
                Report Incident
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Incidents</CardTitle>
              <CardDescription>A list of all reported safeguarding incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedIncidents.map((incident) => {
                    const student = students.find((s) => s.id === incident.studentId)
                    const reporter = users.find((u) => u.id === incident.reportedBy)

                    return (
                      <TableRow key={incident.id}>
                        <TableCell>{formatDateTime(incident.reportDate)}</TableCell>
                        <TableCell>
                          {student && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32`}
                                  alt={getFullName(student.firstName, student.lastName)}
                                />
                                <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <Link href={`/students/${student.id}`} className="font-medium hover:underline">
                                  {student.firstName} {student.lastName}
                                </Link>
                                <p className="text-xs text-muted-foreground">{student.yearGroup}</p>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{incident.category}</span>
                            {incident.isConfidential && (
                              <Lock className="h-3 w-3 text-amber-500" title="Confidential" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {reporter && (
                            <div className="text-sm">
                              {reporter.firstName} {reporter.lastName}
                              <p className="text-xs text-muted-foreground">{reporter.jobTitle}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(incident.status)}>
                            {incident.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/incidents/${incident.id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

