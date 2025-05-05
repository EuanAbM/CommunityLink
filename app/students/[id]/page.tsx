"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Upload,
} from "lucide-react"
import { AttendanceTab } from "@/components/students/attendance-tab"
import { AchievementTab } from "@/components/students/achievement-tab"
import { IncidentsTab } from "./incidents-tab"
import { AcademicTab } from "./academic-tab"

// Define types
interface StudentData {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  year_group: string
  tutor: string
  safeguarding_status: string
  sen_status: string
  has_confidential_information: number
  ethnicity: string
  religion: string
  nationality: string
  languages: string
  address_line_1: string
  address_line_2: string
  town: string
  county: string
  postcode: string
  country: string
  sibling_ids: string
  created_at: string
  updated_at: string
}

interface EmergencyContact {
  id: string
  student_id: string
  first_name: string
  last_name: string
  relationship: string
  phone: string
  email: string
  address_line_1: string
  address_line_2: string
  town: string
  county: string
  postcode: string
  country: string
}

interface AttendanceSummary {
  id: string
  student_id: string
  present_percentage: string
  unauthorised_absence_percentage: string
  authorised_absence_percentage: string
  late_percentage: string
  recorded_on: string
}

interface Register {
  student_id: string
  date: string
  session: string
  status: string
}

interface AcademicProgress {
  id: string
  student_id: string
  subject: string
  predicted_grade: string
  working_at_grade: string
  expected_grade: string
  updated_at: string
}

interface Achievement {
  id: string
  student_id: string
  title: string
  description: string
  date: string
  awarded_by: string
}

interface Extracurricular {
  id: string
  student_id: string
  activity_name: string
  role: string
  description: string
  start_date: string
  end_date: string | null
}

interface Agency {
  id: string
  student_id: string
  agency_name: string
  contact_name: string
  contact_role: string
  contact_phone: string
  contact_email: string
  address_line_1: string
  address_line_2: string
  town: string
  county: string
  postcode: string
  country: string
  notes: string
}

interface Document {
  id: string
  student_id: string
  file_name: string
  file_path: string
  description: string
  uploaded_at: string
  uploaded_by: string
}

interface StudentProfile {
  student: StudentData
  emergencyContacts: EmergencyContact[]
  attendanceSummary: AttendanceSummary[]
  registers: Register[]
  academicProgress: AcademicProgress[]
  achievements: Achievement[]
  extracurricular: Extracurricular[]
  agencies: Agency[]
  documents: Document[]
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
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentProfile() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/students/${params.id}/full-profile`)
        if (!response.ok) {
          throw new Error('Failed to fetch student profile')
        }
        const data = await response.json()
        
        // More detailed logging to inspect the academic progress data
        console.log('Academic progress data from API:', data.academicProgress);
        console.log('Number of academic records:', data.academicProgress?.length || 0);
        console.log('Academic subjects:', data.academicProgress?.map(prog => prog.subject).join(', '));
        
        setStudentProfile(data)
      } catch (err) {
        console.error('Error fetching student profile:', err)
        setError('Failed to load student data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentProfile()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading student profile...</p>
        </main>
      </div>
    )
  }

  if (error || !studentProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error || 'Student not found'}</p>
            <Button className="mt-4" asChild>
              <Link href="/students">Back to Students</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const { student } = studentProfile

  // Get full address
  const getFullAddress = (
    line1: string,
    line2: string,
    town: string,
    county: string,
    postcode: string,
    country: string
  ) => {
    return [line1, line2, town, county, postcode, country].filter(Boolean).join(", ")
  }

  const studentAddress = getFullAddress(
    student.address_line_1,
    student.address_line_2,
    student.town,
    student.county,
    student.postcode,
    student.country
  )

  // Process languages from string to array
  const languagesArray = student.languages ? student.languages.split(",").map(lang => lang.trim()) : []

  const age = getAgeFromDOB(student.date_of_birth)

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

  // Create a weekly attendance structure from registers
  const createWeeklyAttendance = (registers: Register[]) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const weeklyData = days.map(day => {
      const dayRegisters = registers.filter(r => {
        const date = new Date(r.date)
        const weekDay = date.getDay()
        // Convert weekDay (0-6) to match our days array (0-4)
        const adjustedDay = weekDay === 0 ? 6 : weekDay - 1
        return adjustedDay === days.indexOf(day)
      })
      
      // Get the most recent status for this day
      if (dayRegisters.length > 0) {
        // Sort by date descending
        dayRegisters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        return { day, status: dayRegisters[0].status }
      }
      return { day, status: 'N/A' }
    })
    return weeklyData
  }

  // Get siblings data if any
  const siblingIds = student.sibling_ids ? student.sibling_ids.split(',').filter(Boolean) : []

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
                    alt={`${student.first_name} ${student.last_name}`}
                  />
                  <AvatarFallback>{getInitials(student.first_name, student.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {student.first_name} {student.last_name}
                    </h1>
                    {student.has_confidential_information === 1 && (
                      <span className="text-amber-500" title="Contains confidential information">
                        <AlertTriangle className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground gap-2 mt-1">
                    <span>{student.year_group}</span>
                    <span>•</span>
                    <span>Tutor: {student.tutor}</span>
                    <span>•</span>
                    <span>Age: {age}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getSafeguardingStatusColor(student.safeguarding_status)}>
                  {student.safeguarding_status || "No safeguarding status"}
                </Badge>

                {student.sen_status && student.sen_status !== "None" && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {student.sen_status}
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
              <TabsTrigger value="academic">Academic</TabsTrigger>
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
                          {formatDate(student.date_of_birth)} (Age: {age})
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Year Group</p>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {student.year_group}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Tutor Group</p>
                        <p>{student.tutor}</p>
                      </div>
                      {studentAddress && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Address</p>
                          <a
                            href={getGoogleMapsUrl(studentAddress)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {studentAddress}
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
                            {languagesArray.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {languagesArray.map((language) => (
                                  <Badge key={language} variant="outline" className="bg-blue-50 text-blue-700">
                                    {language}
                                  </Badge>
                                ))}
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
                          <Badge variant="outline" className={getSafeguardingStatusColor(student.safeguarding_status)}>
                            {student.safeguarding_status || "None"}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">SEN Status</p>
                          <p>{student.sen_status || "None"}</p>
                        </div>
                      </div>
                    </div>

                    {siblingIds.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2">Siblings</h3>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">To view sibling info, please use the student search feature</p>
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
                        {studentProfile.registers.length > 0 ? (
                          studentProfile.registers.slice(0, 3).map((register, idx) => (
                            <div key={`${register.student_id}-${register.date}-${register.session}`} className="flex items-start gap-2">
                              <div className="rounded-full bg-primary/10 p-1">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{register.status} ({register.session})</p>
                                <p className="text-sm text-muted-foreground">{formatDate(register.date)}</p>
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
                    {studentProfile.emergencyContacts.length > 0 ? (
                      studentProfile.emergencyContacts.map((contact) => {
                        const contactAddress = getFullAddress(
                          contact.address_line_1,
                          contact.address_line_2,
                          contact.town,
                          contact.county,
                          contact.postcode,
                          contact.country
                        )
                        
                        return (
                          <div key={contact.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-medium">{contact.first_name} {contact.last_name}</h3>
                                <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                              </div>
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
                              {contactAddress && (
                                <div className="space-y-1 sm:col-span-2">
                                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                                  <a
                                    href={getGoogleMapsUrl(contactAddress)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                  >
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {contactAddress}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        <p>No emergency contacts recorded for this student</p>
                        <Button className="mt-4">Add Emergency Contact</Button>
                      </div>
                    )}
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
                  {studentProfile.agencies.length > 0 ? (
                    <div className="space-y-6">
                      {studentProfile.agencies.map((agency) => {
                        const agencyAddress = getFullAddress(
                          agency.address_line_1,
                          agency.address_line_2,
                          agency.town,
                          agency.county,
                          agency.postcode,
                          agency.country
                        )
                        
                        return (
                          <div key={agency.id} className="border rounded-lg p-4 space-y-4">
                            <div>
                              <h3 className="text-lg font-medium">{agency.agency_name}</h3>
                              <p className="text-sm text-muted-foreground">{agency.notes}</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              {agency.contact_phone && (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                  <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {agency.contact_phone}
                                  </p>
                                </div>
                              )}
                              {agency.contact_email && (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                                  <p>{agency.contact_email}</p>
                                </div>
                              )}
                              {agencyAddress && (
                                <div className="space-y-1 sm:col-span-2">
                                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                                  <a
                                    href={getGoogleMapsUrl(agencyAddress)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                  >
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {agencyAddress}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                            </div>

                            {agency.contact_name && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-medium mb-2">Contact</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                          {getInitials(agency.contact_name.split(" ")[0], agency.contact_name.split(" ")[1] || "")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{agency.contact_name}</p>
                                        <div className="text-sm text-muted-foreground">
                                          {agency.contact_role && <span>{agency.contact_role} • </span>}
                                          {agency.contact_phone && <span>{agency.contact_phone}</span>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
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
              <AttendanceTab 
                studentId={student.id} 
                initialRegisters={studentProfile.registers} 
                initialAttendanceSummary={studentProfile.attendanceSummary} 
              />
            </TabsContent>

            <TabsContent value="achievement">
              <AchievementTab studentId={student.id} />
            </TabsContent>
            
            <TabsContent value="academic">
              <AcademicTab 
                studentId={student.id}
                initialAcademicProgress={studentProfile.academicProgress}
              />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Student documents and attachments</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentProfile.documents.length > 0 ? (
                    <div className="space-y-4">
                      {studentProfile.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.file_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.description} • {formatDate(doc.uploaded_at)}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={doc.file_path} target="_blank">View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <p>No documents uploaded for this student</p>
                      <Button className="mt-4">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}