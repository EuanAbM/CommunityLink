import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { students, incidents, agencies } from "@/lib/data"
import {
  formatDate,
  formatDateTime,
  getSafeguardingStatusColor,
  getInitials,
  getAgeFromDOB,
  daysSince,
} from "@/lib/utils"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Languages,
  MapPin,
  Phone,
  Users,
  ExternalLink,
} from "lucide-react"
import { AttendanceTab } from "@/components/students/attendance-tab"
import { AchievementTab } from "@/components/students/achievement-tab"
import { IncidentsTab } from "./incidents-tab"

// Define the Incident type
interface Incident {
  id: string
  studentId: string
  category: string
  incidentDate: string
  reportDate: string
  description: string
  status: string
  reportedBy: string
  isConfidential: boolean
  actionsTaken?: string
  followUpRequired?: boolean
  followUpNotes?: string
}

function FlagImage({ flagCode, nationality }: { flagCode: string; nationality: string }) {
  return (
    <Image
      src={`https://flagcdn.com/w20/${flagCode}.png`}
      width={20}
      height={15}
      alt={nationality || "Flag"}
      className="rounded-sm"
    />
  )
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id)

  if (!student) {
    return notFound()
  }

  const studentIncidents = incidents.filter((incident) => incident.studentId === student.id)
  const studentAgencies = student.agencies
    .map((agencyId) => agencies.find((agency) => agency.id === agencyId))
    .filter(Boolean)

  const age = getAgeFromDOB(student.dateOfBirth)
  const daysSinceLastIncident = student.lastIncidentDate ? daysSince(student.lastIncidentDate) : null

  // Flag mapping for nationalities
  const flagMap: Record<string, string> = {
    British: "gb",
    Bangladeshi: "bd",
    Pakistani: "pk",
    Indian: "in",
    Nigerian: "ng",
    Somali: "so",
    Polish: "pl",
    Romanian: "ro",
    Portuguese: "pt",
    Spanish: "es",
    French: "fr",
    Italian: "it",
    German: "de",
    Chinese: "cn",
    Japanese: "jp",
    Korean: "kr",
    American: "us",
    Canadian: "ca",
    Australian: "au",
    "New Zealander": "nz",
    "South African": "za",
    Brazilian: "br",
    Mexican: "mx",
    Turkish: "tr",
    Russian: "ru",
  }

  const flagCode = student.nationality && flagMap[student.nationality] ? flagMap[student.nationality] : "gb"

  // Generate Google Maps URL for the address
  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  // Generate mock attendance data
  const attendanceData = {
    present: 92,
    authorizedAbsence: 5,
    unauthorizedAbsence: 2,
    late: 1,
    weeklyAttendance: [
      { day: "Monday", status: "Present" },
      { day: "Tuesday", status: "Present" },
      { day: "Wednesday", status: "Late" },
      { day: "Thursday", status: "Present" },
      { day: "Friday", status: "Present" },
    ],
    monthlyComparison: {
      thisYear: 94,
      lastYear: 91,
    },
    termlyAttendance: {
      autumn: 95,
      spring: 92,
      summer: 89,
    },
  }

  // Generate mock achievement data
  const achievementData = {
    subjects: [
      { name: "English", predicted: "B", workingAt: "C", expected: "B" },
      { name: "Mathematics", predicted: "A", workingAt: "A", expected: "A" },
      { name: "Science", predicted: "B", workingAt: "B", expected: "B" },
      { name: "History", predicted: "C", workingAt: "C", expected: "B" },
      { name: "Geography", predicted: "B", workingAt: "B", expected: "B" },
      { name: "Art", predicted: "A", workingAt: "A", expected: "A" },
      { name: "Physical Education", predicted: "B", workingAt: "B", expected: "B" },
      { name: "Computing", predicted: "A", workingAt: "B", expected: "A" },
    ],
    awards: [
      { name: "Star of the Week", date: "2024-02-15", description: "Excellence in Mathematics" },
      { name: "Sports Achievement", date: "2023-11-10", description: "Outstanding contribution to school sports" },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Group incidents by year and month for timeline
  const incidentsByYearMonth = studentIncidents.reduce(
    (acc, incident) => {
      const date = new Date(incident.incidentDate)
      const year = date.getFullYear()
      const month = date.getMonth()

      if (!acc[year]) {
        acc[year] = {}
      }

      if (!acc[year][month]) {
        acc[year][month] = []
      }

      acc[year][month].push(incident)
      return acc
    },
    {} as Record<number, Record<number, Incident[]>>,
  )

  // Get unique years and sort them
  const years = Object.keys(incidentsByYearMonth)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/students">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/placeholder.svg?height=64&width=64`}
                    alt={`${student.firstName} ${student.lastName}`}
                  />
                  <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {student.firstName} {student.lastName}
                    </h1>
                    {student.hasConfidentialInformation && (
                      <span className="text-amber-500" title="Contains confidential information">
                        <AlertTriangle className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground gap-2 mt-1">
                    <span>{student.yearGroup}</span>
                    <span>•</span>
                    <span>Tutor: {student.tutor}</span>
                    <span>•</span>
                    <span>Age: {age}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getSafeguardingStatusColor(student.safeguardingStatus)}>
                  {student.safeguardingStatus || "No safeguarding status"}
                </Badge>

                {student.senStatus && student.senStatus !== "None" && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {student.senStatus}
                  </Badge>
                )}

                {student.ehcpStatus && student.ehcpStatus !== "none" && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    EHCP: {student.ehcpStatus.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="agencies">Agencies</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="achievement">Achievement</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(student.dateOfBirth)} (Age: {age})
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Year Group</p>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {student.yearGroup}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Tutor Group</p>
                        <p>{student.tutor}</p>
                      </div>
                      {student.address && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Address</p>
                          <a
                            href={getGoogleMapsUrl(student.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {student.address}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Ethnicity</p>
                        <p>{student.ethnicity || "Not recorded"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                        <div className="flex items-center gap-2">
                          {student.nationality && <FlagImage flagCode={flagCode} nationality={student.nationality} />}
                          <span>{student.nationality || "Not recorded"}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Religion</p>
                        <p>{student.religion || "Not recorded"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Languages</p>
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-muted-foreground" />
                          <div>
                            {student.languages && student.languages.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {student.languages.map((language) => (
                                  <Badge key={language} variant="outline" className="bg-blue-50 text-blue-700">
                                    {language}
                                  </Badge>
                                ))}
                                {student.eal && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                    EAL
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              "Not recorded"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Safeguarding Information</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Safeguarding Status</p>
                          <Badge variant="outline" className={getSafeguardingStatusColor(student.safeguardingStatus)}>
                            {student.safeguardingStatus || "None"}
                          </Badge>
                        </div>
                        {student.lastIncidentDate && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Last Incident</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(student.lastIncidentDate)}</span>
                              {daysSinceLastIncident !== null && daysSinceLastIncident < 7 && (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                  {daysSinceLastIncident} days ago
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">SEN Status</p>
                          <p>{student.senStatus || "None"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">EHCP Status</p>
                          <p className="capitalize">{student.ehcpStatus?.replace(/_/g, " ") || "None"}</p>
                        </div>
                      </div>
                    </div>

                    {student.siblings && student.siblings.length > 0 && (
                      <>
                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Siblings</h3>
                          <div className="space-y-2">
                            {student.siblings.map((siblingId) => {
                              const sibling = students.find((s) => s.id === siblingId)
                              return sibling ? (
                                <div key={siblingId} className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{getInitials(sibling.firstName, sibling.lastName)}</AvatarFallback>
                                  </Avatar>
                                  <Link href={`/students/${siblingId}`} className="hover:underline">
                                    {sibling.firstName} {sibling.lastName}
                                  </Link>
                                  <span className="text-sm text-muted-foreground">{sibling.yearGroup}</span>
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {studentIncidents.length > 0 ? (
                          studentIncidents.slice(0, 3).map((incident) => (
                            <div key={incident.id} className="flex items-start gap-2">
                              <div className="rounded-full bg-primary/10 p-1">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <Link href={`/incidents/${incident.id}`} className="font-medium hover:underline">
                                  {incident.category} incident reported
                                </Link>
                                <p className="text-sm text-muted-foreground">{formatDateTime(incident.reportDate)}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link href={`/incidents/new?studentId=${student.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Record New Incident
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link href={`/students/${student.id}/edit`}>
                            <Users className="mr-2 h-4 w-4" />
                            Edit Student Details
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link href={`/reports/chronology?studentId=${student.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Chronology
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incidents">
              <IncidentsTab studentId={student.id} />
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>Family and emergency contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {student.emergencyContacts.map((contact) => (
                      <div key={contact.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                          </div>
                          {contact.isRisk && (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              Risk Indicator
                            </Badge>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {contact.phone}
                            </p>
                          </div>
                          {contact.email && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p>{contact.email}</p>
                            </div>
                          )}
                          {contact.address && (
                            <div className="space-y-1 sm:col-span-2">
                              <p className="text-sm font-medium text-muted-foreground">Address</p>
                              <a
                                href={getGoogleMapsUrl(contact.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                              >
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {contact.address}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {contact.isRisk && contact.riskNotes && (
                          <div className="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md text-sm">
                            <strong>Risk Notes:</strong> {contact.riskNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agencies">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Agency Involvement</CardTitle>
                    <CardDescription>External agencies involved with this student</CardDescription>
                  </div>
                  <Button className="ml-auto" size="sm">
                    Add Agency
                  </Button>
                </CardHeader>
                <CardContent>
                  {studentAgencies.length > 0 ? (
                    <div className="space-y-6">
                      {studentAgencies.map((agency) => (
                        <div key={agency!.id} className="border rounded-lg p-4 space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">{agency!.name}</h3>
                            <p className="text-sm text-muted-foreground">{agency!.details}</p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            {agency!.phone && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {agency!.phone}
                                </p>
                              </div>
                            )}
                            {agency!.email && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p>{agency!.email}</p>
                              </div>
                            )}
                            {agency!.address && (
                              <div className="space-y-1 sm:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground">Address</p>
                                <a
                                  href={getGoogleMapsUrl(agency!.address)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-primary hover:underline"
                                >
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  {agency!.address}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          {agency!.contacts && agency!.contacts.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="font-medium mb-2">Contacts</h4>
                                <div className="space-y-3">
                                  {agency!.contacts.map((contact) => (
                                    <div key={contact.id} className="flex items-start gap-2 p-2 bg-muted rounded-md">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                          {getInitials(contact.name.split(" ")[0], contact.name.split(" ")[1] || "")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{contact.name}</p>
                                        <div className="text-sm text-muted-foreground">
                                          {contact.role && <span>{contact.role} • </span>}
                                          {contact.phone && <span>{contact.phone}</span>}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <p>No agencies currently involved with this student</p>
                      <Button className="mt-4">Add Agency Involvement</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTab studentId={student.id} />
            </TabsContent>

            <TabsContent value="achievement">
              <AchievementTab studentId={student.id} />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Student documents and attachments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No documents uploaded for this student</p>
                    <Button className="mt-4">Upload Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

