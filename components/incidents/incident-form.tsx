"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Search, X, AlertTriangle, FileText, Upload } from "lucide-react"
import { students, users } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { getInitials, getSafeguardingStatusColor } from "@/lib/utils"
import type { Student } from "@/lib/types"
import { BodyMapMarker } from "@/components/incidents/body-map-marker"

export function IncidentReportForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfidential, setIsConfidential] = useState(false)
  const [needsFollowUp, setNeedsFollowUp] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [linkedStudents, setLinkedStudents] = useState<Student[]>([])
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(new Date())
  const [incidentTime, setIncidentTime] = useState("")
  const [bodyMapMarkers, setBodyMapMarkers] = useState<
    {
      id: string
      x: number
      y: number
      note: string
      view: "front" | "back"
    }[]
  >([])
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [markerNote, setMarkerNote] = useState("")
  const [witnessStaff, setWitnessStaff] = useState<string[]>([])
  const [staffSearchTerm, setStaffSearchTerm] = useState("")
  const [staffSearchResults, setStaffSearchResults] = useState<typeof users>([])

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

  const locations = [
    "Class1",
    "Playground",
    "Hallway",
    "Cafeteria",
    "Gym",
    "Bathroom",
    "School Bus",
    "Field Trip",
    "Off-site",
    "Online/Digital",
    "Other",
  ]

  // Search students as user types
  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = students.filter(
        (student) =>
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.yearGroup.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  // Search staff as user types
  useEffect(() => {
    if (staffSearchTerm.length > 1) {
      const results = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
          (user.jobTitle && user.jobTitle.toLowerCase().includes(staffSearchTerm.toLowerCase())),
      )
      setStaffSearchResults(results)
    } else {
      setStaffSearchResults([])
    }
  }, [staffSearchTerm])

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student)
    setSearchTerm("")
    setSearchResults([])
  }

  const handleAddLinkedStudent = (student: Student) => {
    if (!linkedStudents.some((s) => s.id === student.id) && student.id !== selectedStudent?.id) {
      setLinkedStudents([...linkedStudents, student])
      setSearchTerm("")
      setSearchResults([])
    }
  }

  const handleRemoveLinkedStudent = (studentId: string) => {
    setLinkedStudents(linkedStudents.filter((s) => s.id !== studentId))
  }

  const handleBodyMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage positions for responsiveness
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    const newMarker = {
      id: `marker-${Date.now()}`,
      x: xPercent,
      y: yPercent,
      note: "",
      view: "front", // Keep this for compatibility but we don't use tabs anymore
    }

    setBodyMapMarkers([...bodyMapMarkers, newMarker])
    setSelectedMarker(newMarker.id)
    setMarkerNote("")
  }

  const saveMarkerNote = () => {
    if (selectedMarker && markerNote.trim()) {
      setBodyMapMarkers(
        bodyMapMarkers.map((marker) => (marker.id === selectedMarker ? { ...marker, note: markerNote } : marker)),
      )
      setSelectedMarker(null)
      setMarkerNote("")
    }
  }

  const removeMarker = (id: string) => {
    setBodyMapMarkers(bodyMapMarkers.filter((marker) => marker.id !== id))
    if (selectedMarker === id) {
      setSelectedMarker(null)
      setMarkerNote("")
    }
  }

  const handleWitnessToggle = (staffId: string) => {
    if (witnessStaff.includes(staffId)) {
      setWitnessStaff(witnessStaff.filter((id) => id !== staffId))
    } else {
      setWitnessStaff([...witnessStaff, staffId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Incident reported successfully",
      description: "The safeguarding team has been notified.",
    })

    setIsLoading(false)
    router.push("/dashboard")
  }

  function getAgeFromDOB(dateOfBirth: string): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student search section */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Search and select the primary student involved in this incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="student-search">Search Student</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="student-search"
                    type="search"
                    placeholder="Search by name or year group..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-auto">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                        onClick={() =>
                          selectedStudent ? handleAddLinkedStudent(student) : handleStudentSelect(student)
                        }
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.yearGroup} • {student.tutor}
                          </p>
                        </div>
                        {student.hasConfidentialInformation && (
                          <AlertTriangle className="h-4 w-4 text-amber-500 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedStudent && (
                <div className="p-4 border rounded-md bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(selectedStudent.firstName, selectedStudent.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.yearGroup} • {selectedStudent.tutor}
                      </p>
                    </div>
                    <Badge variant="outline" className={getSafeguardingStatusColor(selectedStudent.safeguardingStatus)}>
                      {selectedStudent.safeguardingStatus || "None"}
                    </Badge>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Linked Students</Label>
                <p className="text-sm text-muted-foreground">Add any other students involved in this incident</p>

                <div className="space-y-2">
                  {linkedStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-2 p-2 border rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.yearGroup} • {student.tutor}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLinkedStudent(student.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {linkedStudents.length === 0 && (
                    <div className="text-sm text-muted-foreground italic">No linked students added</div>
                  )}

                  {selectedStudent && (
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search for students to link..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident details section */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>Provide information about when and where the incident occurred</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Incident Category</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-bullying" />
                          <Label htmlFor="category-bullying" className="font-medium">
                            Bullying
                          </Label>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-verbal" />
                            <Label htmlFor="category-verbal" className="text-sm">
                              Verbal
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-physical" />
                            <Label htmlFor="category-physical" className="text-sm">
                              Physical
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-cyber" />
                            <Label htmlFor="category-cyber" className="text-sm">
                              Cyber
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-physical-abuse" />
                          <Label htmlFor="category-physical-abuse" className="font-medium">
                            Physical Abuse
                          </Label>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-hitting" />
                            <Label htmlFor="category-hitting" className="text-sm">
                              Hitting
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="category-bruising" />
                            <Label htmlFor="category-bruising" className="text-sm">
                              Bruising
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-emotional-abuse" />
                          <Label htmlFor="category-emotional-abuse" className="font-medium">
                            Emotional Abuse
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-neglect" />
                          <Label htmlFor="category-neglect" className="font-medium">
                            Neglect
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-sexual-abuse" />
                          <Label htmlFor="category-sexual-abuse" className="font-medium">
                            Sexual Abuse
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-self-harm" />
                          <Label htmlFor="category-self-harm" className="font-medium">
                            Self-Harm
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-attendance" />
                          <Label htmlFor="category-attendance" className="font-medium">
                            Attendance
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-mental-health" />
                          <Label htmlFor="category-mental-health" className="font-medium">
                            Mental Health
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="category-other" />
                          <Label htmlFor="category-other" className="font-medium">
                            Other
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="location" type="search" placeholder="Search for location..." className="pl-8" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button type="button" variant="outline" size="sm" className="text-xs">
                      Classroom 3B
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="text-xs">
                      Playground
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="text-xs">
                      Cafeteria
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="text-xs">
                      Gym
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="text-xs">
                      School Bus
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Incident Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {incidentDate ? format(incidentDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={incidentDate} onSelect={setIncidentDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Incident Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Incident Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the incident in detail..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Witness Staff</Label>
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for staff members..."
                    className="pl-8"
                    value={staffSearchTerm}
                    onChange={(e) => setStaffSearchTerm(e.target.value)}
                  />
                </div>

                {staffSearchResults.length > 0 && (
                  <div className="border rounded-md shadow-sm max-h-40 overflow-y-auto mb-4">
                    {staffSearchResults.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                        onClick={() => handleWitnessToggle(staff.id)}
                      >
                        <Checkbox
                          id={`staff-${staff.id}`}
                          checked={witnessStaff.includes(staff.id)}
                          onCheckedChange={() => handleWitnessToggle(staff.id)}
                        />
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(staff.firstName, staff.lastName)}</AvatarFallback>
                        </Avatar>
                        <Label htmlFor={`staff-${staff.id}`} className="text-sm cursor-pointer">
                          {staff.firstName} {staff.lastName} {staff.jobTitle && `(${staff.jobTitle})`}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {witnessStaff.length > 0 && (
                  <div className="border rounded-md p-3">
                    <p className="text-sm font-medium mb-2">Selected Staff:</p>
                    <div className="flex flex-wrap gap-2">
                      {witnessStaff.map((staffId) => {
                        const staff = users.find((u) => u.id === staffId)
                        if (!staff) return null

                        return (
                          <Badge key={staffId} variant="secondary" className="flex items-center gap-1">
                            {staff.firstName} {staff.lastName}
                            <button
                              type="button"
                              className="ml-1 hover:text-destructive"
                              onClick={() => handleWitnessToggle(staffId)}
                            >
                              ×
                            </button>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="actions">Actions Already Taken</Label>
                <Textarea
                  id="actions"
                  placeholder="Describe any immediate actions you've already taken..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="followup" checked={needsFollowUp} onCheckedChange={setNeedsFollowUp} />
                <Label htmlFor="followup">Requires follow-up</Label>
              </div>

              {needsFollowUp && (
                <div className="space-y-2">
                  <Label htmlFor="followup-notes">Follow-up Notes</Label>
                  <Textarea id="followup-notes" placeholder="Notes for follow-up actions..." className="min-h-[80px]" />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="confidential" checked={isConfidential} onCheckedChange={setIsConfidential} />
                <Label htmlFor="confidential">Mark as confidential</Label>
              </div>
              {isConfidential && (
                <p className="text-sm text-muted-foreground">
                  This incident will only be visible to users with appropriate permissions.
                </p>
              )}

              <div className="space-y-2">
                <Label>Staff to Notify</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff to notify" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => user.role !== "super_user")
                      .map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.firstName} {staff.lastName} ({staff.jobTitle})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="p-2 mt-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500 inline mr-1" />
                  <span>This individual wouldn't normally be notified about this case for this child.</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag files here or click to upload</p>
                    <p className="text-xs text-muted-foreground">Support for images, documents, and PDF files</p>
                    <Button type="button" variant="outline" size="sm" className="mt-2">
                      Select Files
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">incident-photo.jpg</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="immediate-risk" />
                <Label htmlFor="immediate-risk" className="font-medium text-red-600 dark:text-red-400">
                  Immediate Risk - Requires urgent attention
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Body map section */}

          <Card>
            <CardHeader>
              <CardTitle>Body Map</CardTitle>
              <CardDescription>Click on the body map to mark and describe any physical concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div
                  className="relative border rounded-md overflow-hidden cursor-crosshair bg-white dark:bg-gray-800 w-full md:w-1/2 h-[400px]"
                  onClick={(e) => handleBodyMapClick(e)}
                >
                  <div className="relative w-full h-full">
                    <Image src="/images/body-map.png" alt="Body map" fill style={{ objectFit: "contain" }} />

                    {/* Place markers */}
                    {bodyMapMarkers.map((marker, index) => (
                      <BodyMapMarker
                        key={marker.id}
                        marker={marker}
                        index={index + 1}
                        onClick={() => {
                          setSelectedMarker(marker.id)
                          setMarkerNote(marker.note)
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {selectedMarker ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="marker-note">
                          Add note for marker {bodyMapMarkers.findIndex((m) => m.id === selectedMarker) + 1}
                        </Label>
                        <Textarea
                          id="marker-note"
                          placeholder="Describe the mark or injury..."
                          value={markerNote}
                          onChange={(e) => setMarkerNote(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" onClick={saveMarkerNote}>
                          Save Note
                        </Button>
                        <Button type="button" variant="outline" onClick={() => removeMarker(selectedMarker)}>
                          Remove Marker
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      <p>Click on the body map to add a marker for injuries or concerns.</p>
                      {bodyMapMarkers.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-medium">Markers:</h4>
                          <ul className="space-y-1">
                            {bodyMapMarkers.map((marker, index) => (
                              <li key={marker.id} className="flex items-start gap-2">
                                <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{marker.note || "No note added"}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Student details and actions */}
        <div className="space-y-6">
          {selectedStudent ? (
            <Card>
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{getInitials(selectedStudent.firstName, selectedStudent.lastName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.yearGroup} • Tutor: {selectedStudent.tutor}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date of Birth:</span>
                    <span className="text-sm">
                      {format(new Date(selectedStudent.dateOfBirth), "PPP")}
                      <span className="ml-1 text-muted-foreground">
                        (Age: {getAgeFromDOB(selectedStudent.dateOfBirth)})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Safeguarding Status:</span>
                    <Badge variant="outline" className={getSafeguardingStatusColor(selectedStudent.safeguardingStatus)}>
                      {selectedStudent.safeguardingStatus || "None"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SEN Status:</span>
                    <span className="text-sm">{selectedStudent.senStatus || "None"}</span>
                  </div>
                  {selectedStudent.hasConfidentialInformation && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Contains confidential information</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Emergency Contacts</h4>
                  <div className="space-y-2">
                    {selectedStudent.emergencyContacts.map((contact) => (
                      <div key={contact.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-muted-foreground">{contact.relationship}</span>
                        </div>
                        <p className="text-muted-foreground">{contact.phone}</p>
                        {contact.isRisk && (
                          <div className="mt-1 p-1 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-600 dark:text-red-400">
                            Risk indicator: {contact.riskNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href={`/students/${selectedStudent.id}`}>View Full Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Search className="h-8 w-8 text-muted-foreground/60" />
                  <h3 className="font-medium">No Student Selected</h3>
                  <p className="text-sm text-muted-foreground">Search and select a student to view their details</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/incidents">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Incidents
                </Link>
              </Button>
              {selectedStudent && (
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href={`/incidents?studentId=${selectedStudent.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Student Incidents
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once submitted, this incident will be recorded in the system and appropriate staff will be notified
                based on your school's workflow rules.
              </p>

              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isLoading || !selectedStudent}>
                  {isLoading ? "Submitting..." : "Submit Incident Report"}
                </Button>
                <Button type="button" variant="secondary">
                  Save Draft
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

