"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { users, incidents, students, auditLogs } from "@/lib/data"
import { formatDate, formatDateTime, getInitials, getStatusColor } from "@/lib/utils"
import { ArrowLeft, FileText, Lock, Mail, Phone, Upload, User, Search } from "lucide-react"
import { AuditTrail } from "@/components/users/audit-trail"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const user = users.find((u) => u.id === params.id)
  const [searchTerm, setSearchTerm] = useState("")
  const [studentResults, setStudentResults] = useState<typeof students>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [categoryAccess, setCategoryAccess] = useState<{ [studentId: string]: string[] }>({})

  // Initialize state variables to avoid conditional hook calls
  const [initialStudentAccess, setInitialStudentAccess] = useState<string[]>([])
  const [initialCategoryAccess, setInitialCategoryAccess] = useState<{ [studentId: string]: string[] }>({})

  if (!user) {
    return notFound()
  }

  // Initialize with user data
  useEffect(() => {
    if (user.studentAccess) {
      setInitialStudentAccess(user.studentAccess)
    }

    if (user.categoryAccess) {
      setInitialCategoryAccess(user.categoryAccess)
    }
  }, [user.studentAccess, user.categoryAccess])

  useEffect(() => {
    setSelectedStudents(initialStudentAccess)
    setCategoryAccess(initialCategoryAccess)
  }, [initialStudentAccess, initialCategoryAccess])

  // Filter incidents reported by this user
  const userIncidents = incidents
    .filter((incident) => incident.reportedBy === user.id)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
    .slice(0, 6)

  // Generate fake login history
  const loginHistory = Array.from({ length: 10 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
    return {
      id: `login-${i}`,
      date,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      device: Math.random() > 0.5 ? "Desktop - Chrome" : "Mobile - Safari",
    }
  })

  // Get user audit logs
  const userAuditLogs = auditLogs
    .filter((log) => log.userId === user.id)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const incidentCategories = [
    "Bullying",
    "Physical Abuse",
    "Emotional Abuse",
    "Neglect",
    "Sexual Abuse",
    "Disclosure",
    "Self-Harm",
    "Attendance",
    "Mental Health",
    "Online Safety",
    "Peer-on-Peer",
    "Other",
  ]

  const handleStudentSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 1) {
      const results = students.filter((student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(term.toLowerCase()),
      )
      setStudentResults(results)
    } else {
      setStudentResults([])
    }
  }

  const toggleStudentAccess = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
      // Remove category access for this student
      const newCategoryAccess = { ...categoryAccess }
      delete newCategoryAccess[studentId]
      setCategoryAccess(newCategoryAccess)
    } else {
      setSelectedStudents([...selectedStudents, studentId])
      // Initialize category access for this student
      setCategoryAccess({
        ...categoryAccess,
        [studentId]: [],
      })
    }
  }

  const toggleCategoryAccess = (studentId: string, category: string) => {
    const currentCategories = categoryAccess[studentId] || []

    if (currentCategories.includes(category)) {
      setCategoryAccess({
        ...categoryAccess,
        [studentId]: currentCategories.filter((c) => c !== category),
      })
    } else {
      setCategoryAccess({
        ...categoryAccess,
        [studentId]: [...currentCategories, category],
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center text-muted-foreground gap-2 mt-1">
                    <span>{user.jobTitle}</span>
                    <span>•</span>
                    <span>{user.department}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {user.role.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="students">Student Access</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {user.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Job Title</p>
                        <p>{user.jobTitle}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p>{user.department || "Not assigned"}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Permissions</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">User Role</p>
                          <p className="capitalize">{user.role.replace("_", " ")}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Permission Group</p>
                          <p>{user.permissionGroups.length > 0 ? "DSL Full Access" : "None"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                          <p>{user.lastLogin ? formatDateTime(user.lastLogin) : "Never"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                          <p>{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Image</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-2xl">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Image
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button className="w-full justify-start" variant="outline">
                          <User className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Lock className="mr-2 h-4 w-4" />
                          Reset Password
                        </Button>
                        <Button className="w-full justify-start text-red-600" variant="outline">
                          <Lock className="mr-2 h-4 w-4" />
                          Revoke Login
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incidents">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Incidents</CardTitle>
                  <CardDescription>Incidents reported by this staff member</CardDescription>
                </CardHeader>
                <CardContent>
                  {userIncidents.length > 0 ? (
                    <div className="space-y-6">
                      {userIncidents.map((incident) => {
                        const student = students.find((s) => s.id === incident.studentId)

                        return (
                          <div key={incident.id} className="border-b pb-4 last:border-0">
                            <Link href={`/incidents/${incident.id}`} className="text-lg font-medium hover:underline">
                              {incident.category} Incident
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{formatDateTime(incident.reportDate)}</span>
                              <Badge variant="outline" className={getStatusColor(incident.status)}>
                                {incident.status.replace("_", " ")}
                              </Badge>
                              {incident.isConfidential && (
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                  Confidential
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2">
                              Student: {student ? `${student.firstName} ${student.lastName}` : "Unknown"}
                            </p>
                            <p className="mt-1">{incident.description.substring(0, 100)}...</p>
                          </div>
                        )
                      })}
                      <div className="flex justify-center">
                        <Button asChild variant="outline">
                          <Link href={`/incidents?reportedBy=${user.id}`}>View All Incidents</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-4 opacity-30" />
                      <p>No incidents reported by this staff member</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Student Access</CardTitle>
                  <CardDescription>
                    Manage which students this staff member can access and what categories they can view
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="student-search">Search Students</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="student-search"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => handleStudentSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {searchTerm && studentResults.length > 0 && (
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Search Results</h3>
                      <div className="space-y-2">
                        {studentResults.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">{student.yearGroup}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`full-access-${student.id}`}
                                  checked={selectedStudents.includes(student.id)}
                                  onCheckedChange={() => toggleStudentAccess(student.id)}
                                />
                                <Label htmlFor={`full-access-${student.id}`} className="text-sm">
                                  Add Student
                                </Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Students with Access Granted</h3>
                    {selectedStudents.length > 0 ? (
                      <div className="space-y-6">
                        {selectedStudents.map((studentId) => {
                          const student = students.find((s) => s.id === studentId)
                          if (!student) return null

                          return (
                            <Card key={student.id} className="overflow-hidden">
                              <CardHeader className="bg-muted/50 pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {getInitials(student.firstName, student.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {student.firstName} {student.lastName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{student.yearGroup}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleStudentAccess(student.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    Remove Access
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <h4 className="text-sm font-medium mb-2">Incident Categories Access</h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                  Select which incident categories this staff member can access for this student
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {incidentCategories.map((category) => (
                                    <div key={category} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${student.id}-${category}`}
                                        checked={(categoryAccess[student.id] || []).includes(category)}
                                        onCheckedChange={() => toggleCategoryAccess(student.id, category)}
                                      />
                                      <Label htmlFor={`${student.id}-${category}`} className="text-sm">
                                        {category}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-muted-foreground">No students with access granted</p>
                        <p className="text-sm text-muted-foreground mt-1">Search for students above to grant access</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <AuditTrail userId={user.id} />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage user account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={user.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input id="job-title" defaultValue={user.jobTitle} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue={user.department} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Account Actions</h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Reset Password</h4>
                          <p className="text-sm text-muted-foreground">Send a password reset link to the user</p>
                        </div>
                        <Button variant="outline">Send Reset Link</Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Revoke Login</h4>
                          <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                        </div>
                        <Button variant="outline" className="text-red-600">
                          Revoke Access
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">Permanently delete this user account</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
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

