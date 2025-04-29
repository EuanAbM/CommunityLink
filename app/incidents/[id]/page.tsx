"use client"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { incidents, students, users, agencies } from "@/lib/data"
import { formatDateTime, getStatusColor, getInitials, getFullName } from "@/lib/utils"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Lock,
  Phone,
  Users,
  Edit,
  MessageSquare,
  Paperclip,
  Activity,
  MapPin,
  UserPlus,
  CheckCircle,
  XCircle,
  Laptop,
  Smartphone,
  Eye,
  Download,
  AlertTriangle,
  Filter,
  User,
} from "lucide-react"
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge"
import { ChangeStatusDialog } from "@/components/incidents/change-status-dialog"
import { AddActionDialog } from "@/components/incidents/add-action-dialog"
import { AddNotesDialog } from "@/components/incidents/add-notes-dialog"
import { IncidentActionsMenu } from "@/components/incidents/incident-actions-menu"
import { AddAgencyDialog } from "@/components/incidents/add-agency-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function IncidentPage({ params }: { params: { id: string } }) {
  const incident = incidents.find((i) => i.id === params.id)

  if (!incident) {
    return notFound()
  }

  const student = students.find((s) => s.id === incident.studentId)
  const reporter = users.find((u) => u.id === incident.reportedBy)
  const agency = incident.agencyId ? agencies.find((a) => a.id === incident.agencyId) : null

  // Get contributors (reporter + any staff mentioned in actions/notes)
  const contributors = [reporter, users.find((u) => u.id === "user-2"), users.find((u) => u.id === "user-3")].filter(
    Boolean,
  )

  if (!student) {
    return notFound()
  }

  // Example linked students
  const linkedStudents = [
    students.find((s) => s.id === "student-2"),
    students.find((s) => s.id === "student-3"),
  ].filter(Boolean)

  // Example witness staff
  const witnessStaff = [users.find((u) => u.id === "user-2"), users.find((u) => u.id === "user-4")].filter(Boolean)

  // Example activity log
  const activityLog = [
    {
      id: "activity-1",
      type: "created",
      user: reporter,
      timestamp: incident.reportDate,
      message: "Incident reported",
    },
    {
      id: "activity-2",
      type: "status_change",
      user: users.find((u) => u.id === "user-2"),
      timestamp: new Date(new Date(incident.reportDate).getTime() + 3600000),
      message: "Status changed from New to In Progress",
    },
    {
      id: "activity-3",
      type: "note_added",
      user: users.find((u) => u.id === "user-3"),
      timestamp: new Date(new Date(incident.reportDate).getTime() + 7200000),
      message: "Added a note: Initial assessment completed. Scheduled follow-up meeting with student.",
    },
    {
      id: "activity-4",
      type: "action_assigned",
      user: users.find((u) => u.id === "user-2"),
      timestamp: new Date(new Date(incident.reportDate).getTime() + 10800000),
      message: "Assigned action to Jane Smith: Contact parents to discuss incident",
    },
  ]

  // Example notes
  const notes = [
    {
      id: "note-1",
      user: users.find((u) => u.id === "user-3"),
      timestamp: new Date(new Date(incident.reportDate).getTime() + 7200000),
      content:
        "Initial assessment completed. Scheduled follow-up meeting with student for tomorrow. Student appeared anxious but was willing to discuss the situation. Will need to monitor closely over the next few days.",
    },
  ]

  // Example body map markers
  const bodyMapMarkers = [
    {
      id: "marker-1",
      x: 30,
      y: 25,
      note: "Bruising on right arm, approximately 2cm in diameter. Student reports this happened during PE.",
      view: "front",
    },
    {
      id: "marker-2",
      x: 45,
      y: 60,
      note: "Scratch on left knee, appears to be healing.",
      view: "front",
    },
  ]

  // Example attachments
  const attachments = [
    {
      id: "attachment-1",
      name: "incident-photo.jpg",
      type: "image/jpeg",
      size: "1.2 MB",
      uploadedBy: users.find((u) => u.id === "user-1"),
      uploadedAt: new Date(new Date(incident.reportDate).getTime() + 1800000),
      isConfidential: false,
    },
    {
      id: "attachment-2",
      name: "medical-report.pdf",
      type: "application/pdf",
      size: "450 KB",
      uploadedBy: users.find((u) => u.id === "user-2"),
      uploadedAt: new Date(new Date(incident.reportDate).getTime() + 7200000),
      isConfidential: true,
    },
  ]

  // Example incident categories
  const selectedCategories = {
    bullying: true,
    verbal: true,
    physical: false,
    cyber: false,
    physicalAbuse: false,
    hitting: false,
    bruising: false,
    emotionalAbuse: false,
    neglect: false,
    sexualAbuse: false,
    selfHarm: true,
    attendance: false,
    mentalHealth: true,
    other: false,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/incidents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Incidents
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{incident.category} Incident</h1>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    ID: {incident.id}
                  </Badge>
                  {incident.isConfidential && (
                    <span className="text-amber-500" title="Confidential information">
                      <Lock className="h-5 w-5" />
                    </span>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground gap-2 mt-1">
                  <span>Reported: {formatDateTime(incident.reportDate)}</span>
                  <span>•</span>
                  <IncidentStatusBadge status={incident.status} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 mr-2">
                  {contributors.map(
                    (user, index) =>
                      user && (
                        <Avatar
                          key={index}
                          className="border-2 border-background h-8 w-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-110 cursor-pointer"
                        >
                          <AvatarImage src={user.profileImage} alt={getFullName(user.firstName, user.lastName)} />
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                      ),
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{contributors.length} contributors</span>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <ChangeStatusDialog
                    currentStatus={incident.status}
                    trigger={
                      <Button>
                        <Activity className="mr-2 h-4 w-4" />
                        Update Status
                      </Button>
                    }
                  />
                  <IncidentActionsMenu />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  {/* Student Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Information</CardTitle>
                      <CardDescription>Primary student involved in this incident</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-md bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.yearGroup} • {student.tutor}
                            </p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(student.safeguardingStatus || "None")}>
                            {student.safeguardingStatus || "None"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Linked Students */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Linked Students</CardTitle>
                      <CardDescription>Other students connected to this incident</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {linkedStudents && linkedStudents.length > 0 ? (
                          linkedStudents.map((linkedStudent) => (
                            <div
                              key={linkedStudent.id}
                              className="p-3 border rounded-md flex items-center gap-3 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200"
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40`}
                                  alt={getFullName(linkedStudent.firstName, linkedStudent.lastName)}
                                />
                                <AvatarFallback>
                                  {getInitials(linkedStudent.firstName, linkedStudent.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Link href={`/students/${linkedStudent.id}`} className="font-medium hover:underline">
                                  {linkedStudent.firstName} {linkedStudent.lastName}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                  {linkedStudent.yearGroup} • {linkedStudent.tutor}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`ml-auto ${getStatusColor(linkedStudent.safeguardingStatus || "None")}`}
                              >
                                {linkedStudent.safeguardingStatus || "None"}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-sm">No linked students for this incident.</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Incident Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incident Categories</CardTitle>
                      <CardDescription>Categories and subcategories for this incident</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-bullying" checked={selectedCategories.bullying} disabled />
                              <Label htmlFor="category-bullying" className="font-medium">
                                Bullying
                              </Label>
                            </div>
                            <div className="ml-6 space-y-1">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="category-verbal" checked={selectedCategories.verbal} disabled />
                                <Label htmlFor="category-verbal" className="text-sm">
                                  Verbal
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="category-physical" checked={selectedCategories.physical} disabled />
                                <Label htmlFor="category-physical" className="text-sm">
                                  Physical
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="category-cyber" checked={selectedCategories.cyber} disabled />
                                <Label htmlFor="category-cyber" className="text-sm">
                                  Cyber
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="category-physical-abuse"
                                checked={selectedCategories.physicalAbuse}
                                disabled
                              />
                              <Label htmlFor="category-physical-abuse" className="font-medium">
                                Physical Abuse
                              </Label>
                            </div>
                            <div className="ml-6 space-y-1">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="category-hitting" checked={selectedCategories.hitting} disabled />
                                <Label htmlFor="category-hitting" className="text-sm">
                                  Hitting
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="category-bruising" checked={selectedCategories.bruising} disabled />
                                <Label htmlFor="category-bruising" className="text-sm">
                                  Bruising
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="category-emotional-abuse"
                                checked={selectedCategories.emotionalAbuse}
                                disabled
                              />
                              <Label htmlFor="category-emotional-abuse" className="font-medium">
                                Emotional Abuse
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-neglect" checked={selectedCategories.neglect} disabled />
                              <Label htmlFor="category-neglect" className="font-medium">
                                Neglect
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-sexual-abuse" checked={selectedCategories.sexualAbuse} disabled />
                              <Label htmlFor="category-sexual-abuse" className="font-medium">
                                Sexual Abuse
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-self-harm" checked={selectedCategories.selfHarm} disabled />
                              <Label htmlFor="category-self-harm" className="font-medium">
                                Self-Harm
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-attendance" checked={selectedCategories.attendance} disabled />
                              <Label htmlFor="category-attendance" className="font-medium">
                                Attendance
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="category-mental-health"
                                checked={selectedCategories.mentalHealth}
                                disabled
                              />
                              <Label htmlFor="category-mental-health" className="font-medium">
                                Mental Health
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="category-other" checked={selectedCategories.other} disabled />
                              <Label htmlFor="category-other" className="font-medium">
                                Other
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Incident Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incident Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Incident Date</p>
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDateTime(incident.incidentDate)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Report Date</p>
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDateTime(incident.reportDate)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {incident.location || "School premises"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <IncidentStatusBadge status={incident.status} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Confidentiality</p>
                          <div className="flex items-center gap-2">
                            {incident.isConfidential ? (
                              <>
                                <Lock className="h-4 w-4 text-amber-500" />
                                <span>Confidential</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Standard visibility</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Follow-up Required</p>
                          <div className="flex items-center gap-2">
                            {incident.followUpRequired ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span>Yes</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                <span>No</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <div className="p-4 bg-muted rounded-md">
                          <p>{incident.description}</p>
                        </div>
                      </div>

                      {incident.actionsTaken && (
                        <div>
                          <h3 className="font-medium mb-2">Actions Taken</h3>
                          <div className="p-4 bg-muted rounded-md">
                            <p>{incident.actionsTaken}</p>
                          </div>
                        </div>
                      )}

                      {incident.followUpRequired && incident.followUpNotes && (
                        <div>
                          <h3 className="font-medium mb-2">Follow-up Notes</h3>
                          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                            <p>{incident.followUpNotes}</p>
                          </div>
                        </div>
                      )}

                      {witnessStaff && witnessStaff.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Witness Staff</h3>
                          <div className="border rounded-md p-3">
                            <div className="flex flex-wrap gap-2">
                              {witnessStaff.map((staff) => (
                                <Badge key={staff.id} variant="secondary" className="flex items-center gap-1">
                                  {staff.firstName} {staff.lastName}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {notes && notes.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Notes</h3>
                          <div className="space-y-3">
                            {notes.map((note) => (
                              <div key={note.id} className="p-3 bg-muted rounded-md">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={note.user?.profileImage}
                                      alt={note.user ? getFullName(note.user.firstName, note.user.lastName) : ""}
                                    />
                                    <AvatarFallback>
                                      {note.user ? getInitials(note.user.firstName, note.user.lastName) : ""}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm">
                                    {note.user ? getFullName(note.user.firstName, note.user.lastName) : "Unknown"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDateTime(note.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Body Map */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Body Map</CardTitle>
                      <CardDescription>Physical concerns marked on body map</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative border rounded-md overflow-hidden bg-white dark:bg-gray-800 w-full md:w-1/2 h-[400px]">
                          <div className="relative w-full h-full">
                            <Image src="/images/body-map.png" alt="Body map" fill style={{ objectFit: "contain" }} />

                            {/* Place markers */}
                            {bodyMapMarkers.map((marker, index) => (
                              <div
                                key={marker.id}
                                className="absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                style={{
                                  left: `${marker.x}%`,
                                  top: `${marker.y}%`,
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                {index + 1}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-sm">
                            {bodyMapMarkers.length > 0 ? (
                              <div className="space-y-2">
                                <h4 className="font-medium">Markers:</h4>
                                <ul className="space-y-3">
                                  {bodyMapMarkers.map((marker, index) => (
                                    <li key={marker.id} className="flex items-start gap-2">
                                      <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </span>
                                      <span>{marker.note}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No body map markers added for this incident.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attachments */}
                  {attachments && attachments.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                        <CardDescription>Files and documents attached to this incident</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {attachment.size} • Uploaded {formatDateTime(attachment.uploadedAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {attachment.isConfidential && (
                                  <Badge variant="outline" className="bg-red-100 text-red-800">
                                    Confidential
                                  </Badge>
                                )}
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/placeholder.svg?height=48&width=48`}
                            alt={getFullName(student.firstName, student.lastName)}
                          />
                          <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/students/${student.id}`} className="font-medium text-lg hover:underline">
                            {student.firstName} {student.lastName}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {student.yearGroup} • Tutor: {student.tutor}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Safeguarding Status:</span>
                          <Badge variant="outline" className={getStatusColor(student.safeguardingStatus || "None")}>
                            {student.safeguardingStatus || "None"}
                          </Badge>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">SEN Status:</span>
                          <span>{student.senStatus || "None"}</span>
                        </div>

                        <Button asChild variant="outline" size="sm" className="w-full mt-2">
                          <Link href={`/students/${student.id}`}>View Full Profile</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Reported By</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reporter && (
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={reporter.profileImage}
                              alt={getFullName(reporter.firstName, reporter.lastName)}
                            />
                            <AvatarFallback>{getInitials(reporter.firstName, reporter.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {reporter.firstName} {reporter.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{reporter.jobTitle}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {agency && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Agency Involvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">{agency.name}</h3>
                            <p className="text-sm text-muted-foreground">{agency.details}</p>
                          </div>

                          {agency.contacts && agency.contacts.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Contacts:</p>
                              {agency.contacts.map((contact) => (
                                <div key={contact.id} className="text-sm">
                                  <p className="font-medium">{contact.name}</p>
                                  <p className="text-muted-foreground">{contact.role}</p>
                                  {contact.phone && (
                                    <p className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {contact.phone}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <AddNotesDialog
                            trigger={
                              <Button className="w-full justify-start" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Add Note
                              </Button>
                            }
                          />
                          <AddActionDialog
                            trigger={
                              <Button className="w-full justify-start" variant="outline">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign User
                              </Button>
                            }
                          />
                        </div>
                        <Button className="w-full justify-start" variant="outline">
                          <Paperclip className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                        <AddAgencyDialog
                          trigger={
                            <Button className="w-full justify-start" variant="outline">
                              <Users className="mr-2 h-4 w-4" />
                              Add Agency
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                        <Avatar className="h-8 w-8 mt-0.5">
                          {activity.user && (
                            <>
                              <AvatarImage
                                src={activity.user.profileImage}
                                alt={getFullName(activity.user.firstName, activity.user.lastName)}
                              />
                              <AvatarFallback>
                                {getInitials(activity.user.firstName, activity.user.lastName)}
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {activity.user ? getFullName(activity.user.firstName, activity.user.lastName) : "System"}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm mt-1">{activity.message}</p>
                        </div>
                        {activity.type === "status_change" && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Status Change
                          </Badge>
                        )}
                        {activity.type === "note_added" && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            Note
                          </Badge>
                        )}
                        {activity.type === "action_assigned" && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            Action
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Incident Timeline</CardTitle>
                    <CardDescription>Chronological view of all events related to this incident</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-muted-foreground/20" />
                    <div className="space-y-8">
                      {[...activityLog].reverse().map((activity, index) => (
                        <div
                          key={activity.id}
                          className="relative pl-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-md rounded-lg p-2"
                        >
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-sm">
                            <Avatar className="h-8 w-8">
                              {activity.user && (
                                <>
                                  <AvatarImage
                                    src={activity.user.profileImage}
                                    alt={getFullName(activity.user.firstName, activity.user.lastName)}
                                  />
                                  <AvatarFallback>
                                    {getInitials(activity.user.firstName, activity.user.lastName)}
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {activity.user
                                  ? getFullName(activity.user.firstName, activity.user.lastName)
                                  : "System"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(activity.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm">{activity.message}</p>
                            <div className="flex items-center gap-2">
                              {activity.type === "status_change" && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  Status Change
                                </Badge>
                              )}
                              {activity.type === "note_added" && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                  Note Added
                                </Badge>
                              )}
                              {activity.type === "action_assigned" && (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                  Action Assigned
                                </Badge>
                              )}
                              {activity.type === "created" && (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  Created
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Additional timeline events */}
                      <div className="relative pl-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-md rounded-lg p-2">
                        <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-sm">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Jane Smith</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(new Date(new Date(incident.reportDate).getTime() - 86400000))}
                            </span>
                          </div>
                          <p className="text-sm">
                            Initial concern raised by class teacher during morning registration.
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Initial Concern
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Documents & Attachments</CardTitle>
                    <CardDescription>All files related to this incident</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button>
                      <Paperclip className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Document categories */}
                    <div className="flex border-b">
                      <div className="px-4 py-2 border-b-2 border-primary font-medium text-sm">All Documents</div>
                      <div className="px-4 py-2 text-muted-foreground text-sm">Photos</div>
                      <div className="px-4 py-2 text-muted-foreground text-sm">Reports</div>
                      <div className="px-4 py-2 text-muted-foreground text-sm">Communications</div>
                    </div>

                    {/* Document list */}
                    <div className="space-y-3">
                      {/* Document 1 */}
                      <div className="p-4 border rounded-md transition-all duration-200 hover:shadow-md hover:border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                              <FileText className="h-8 w-8" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Incident Report.pdf</h4>
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                  Confidential
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">PDF Document • 2.4 MB</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback>
                                      {getInitials(reporter?.firstName || "", reporter?.lastName || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    Uploaded by{" "}
                                    {reporter ? getFullName(reporter.firstName, reporter.lastName) : "Unknown"}
                                  </span>
                                </div>
                                <span>•</span>
                                <span>{formatDateTime(incident.reportDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Document 2 */}
                      <div className="p-4 border rounded-md transition-all duration-200 hover:shadow-md hover:border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-md text-purple-700">
                              <Image className="h-8 w-8" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Bruise Photo.jpg</h4>
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                  Confidential
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">JPEG Image • 1.8 MB</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback>
                                      {getInitials(users[1]?.firstName || "", users[1]?.lastName || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    Uploaded by{" "}
                                    {users[1] ? getFullName(users[1].firstName, users[1].lastName) : "Unknown"}
                                  </span>
                                </div>
                                <span>•</span>
                                <span>
                                  {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 3600000))}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Document 3 */}
                      <div className="p-4 border rounded-md transition-all duration-200 hover:shadow-md hover:border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 rounded-md text-green-700">
                              <FileText className="h-8 w-8" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Parent Meeting Notes.docx</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Word Document • 350 KB</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback>
                                      {getInitials(users[2]?.firstName || "", users[2]?.lastName || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    Uploaded by{" "}
                                    {users[2] ? getFullName(users[2].firstName, users[2].lastName) : "Unknown"}
                                  </span>
                                </div>
                                <span>•</span>
                                <span>
                                  {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 7200000))}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Document 4 */}
                      <div className="p-4 border rounded-md transition-all duration-200 hover:shadow-md hover:border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-md text-amber-700">
                              <FileText className="h-8 w-8" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Agency Referral Form.pdf</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">PDF Document • 1.1 MB</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback>
                                      {getInitials(users[0]?.firstName || "", users[0]?.lastName || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    Uploaded by{" "}
                                    {users[0] ? getFullName(users[0].firstName, users[0].lastName) : "Unknown"}
                                  </span>
                                </div>
                                <span>•</span>
                                <span>
                                  {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 10800000))}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>Complete record of all actions taken on this incident</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="upload">Upload</SelectItem>
                        <SelectItem value="add_note">Add Note</SelectItem>
                        <SelectItem value="add_action">Add Action</SelectItem>
                        <SelectItem value="print">Print</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <User className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-muted-foreground/20" />
                      <ul className="space-y-6">
                        {/* Audit entry 1 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(reporter?.firstName || "", reporter?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                <FileText className="h-4 w-4" />
                                <span className="ml-1">Create</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{reporter?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Incident report created</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(incident.reportDate)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.45
                              </div>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3" />
                                Chrome / Windows
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 2 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(reporter?.firstName || "", reporter?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                <FileText className="h-4 w-4" />
                                <span className="ml-1">Upload</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{reporter?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Document 'Incident Report.pdf' uploaded to incident</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 300000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.45
                              </div>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3" />
                                Chrome / Windows
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 3 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[1]?.firstName || "", users[1]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                <Eye className="h-4 w-4" />
                                <span className="ml-1">View</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[1] ? `${users[1].firstName} ${users[1].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[1]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Incident details viewed</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 3600000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.67
                              </div>
                              <div className="flex items-center">
                                <Smartphone className="mr-1 h-3 w-3" />
                                Safari / iOS
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 4 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[1]?.firstName || "", users[1]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                <Edit className="h-4 w-4" />
                                <span className="ml-1">Update</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[1] ? `${users[1].firstName} ${users[1].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[1]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Incident status updated to 'In Progress'</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 3900000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.67
                              </div>
                              <div className="flex items-center">
                                <Smartphone className="mr-1 h-3 w-3" />
                                Safari / iOS
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 5 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[1]?.firstName || "", users[1]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                <FileText className="h-4 w-4" />
                                <span className="ml-1">Upload</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[1] ? `${users[1].firstName} ${users[1].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[1]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Document 'Bruise Photo.jpg' uploaded to incident</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 4200000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.67
                              </div>
                              <div className="flex items-center">
                                <Smartphone className="mr-1 h-3 w-3" />
                                Safari / iOS
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 6 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[2]?.firstName || "", users[2]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-cyan-100 text-cyan-800">
                                <MessageSquare className="h-4 w-4" />
                                <span className="ml-1">Add Note</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[2] ? `${users[2].firstName} ${users[2].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[2]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Note added to incident</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 7200000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.89
                              </div>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3" />
                                Firefox / MacOS
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 7 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[2]?.firstName || "", users[2]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                <FileText className="h-4 w-4" />
                                <span className="ml-1">Upload</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[2] ? `${users[2].firstName} ${users[2].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[2]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Document 'Parent Meeting Notes.docx' uploaded to incident</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 7500000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.89
                              </div>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3" />
                                Firefox / MacOS
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 8 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[0]?.firstName || "", users[0]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="ml-1">Notify</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[0] ? `${users[0].firstName} ${users[0].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[0]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Social worker notified about incident</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 10800000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.45
                              </div>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3" />
                                Chrome / Windows
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Audit entry 9 */}
                        <li className="relative pl-12">
                          <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(users[0]?.firstName || "", users[0]?.lastName || "")}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                <FileText className="h-4 w-4" />
                                <span className="ml-1">Upload</span>
                              </Badge>
                              <span className="text-sm font-medium">
                                {users[0] ? `${users[0].firstName} ${users[0].lastName}` : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">{users[0]?.jobTitle || ""}</span>
                            </div>

                            <p className="text-sm">Document 'Agency Referral Form.pdf' uploaded to incident</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDateTime(new Date(new Date(incident.reportDate).getTime() + 11000000))}
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                192.168.1.45
                              </div>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3" />
                                Chrome / Windows
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
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

