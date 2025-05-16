"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { getInitials, getSafeguardingStatusColor } from "@/lib/utils"
import { BodyMapMarker } from "@/components/incidents/body-map-marker"
import type { Student } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid';


interface Student {
  id: string;
  first_name: string;
  last_name: string;
  year_group?: string;
  tutor?: string;
  date_of_birth?: string;
  safeguarding_status?: string;
  sen_status?: string;
  has_confidential_information?: number;
  emergencyContacts?: EmergencyContact[]; // Add this for consistency
}

interface EmergencyContact {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  email: string;
  address_line_1?: string;
  address_line_2?: string;
  town?: string;
  county?: string;
  postcode?: string;
  country?: string;
}

interface BodyMapMarkerData {
  id: string;
  x: number;
  y: number;
  note: string;
}

export function IncidentReportForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfidential, setIsConfidential] = useState(false)
  const [needsFollowUp, setNeedsFollowUp] = useState(false)
  
  // Student search state (primary student)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]); // This can be general student list from API
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]); // For primary student search results
  const [isLoadingStudents, setIsLoadingStudents] = useState(false); // For primary student search
  const [searching, setSearching] = useState(false); // For primary student search
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [incidentCategories, setIncidentCategories] = useState<any[]>([])
  const [incidentSubcategories, setIncidentSubcategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [locations, setLocations] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])

  // State for linked students
  const [linkedStudents, setLinkedStudents] = useState<Student[]>([]);
  const [linkedStudentSearchQuery, setLinkedStudentSearchQuery] = useState<string>("");
  const [filteredLinkedStudents, setFilteredLinkedStudents] = useState<Student[]>([]);
  const [isLoadingLinkedStudentSearch, setIsLoadingLinkedStudentSearch] = useState<boolean>(false);
  const [searchingLinked, setSearchingLinked] = useState<boolean>(false);
  const linkedSearchTimeout = useRef<NodeJS.Timeout | null>(null);

  // State for incident date and time
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(undefined);
  const [incidentTime, setIncidentTime] = useState<string>("");

  // State for body map
  const [bodyMapMarkers, setBodyMapMarkers] = useState<BodyMapMarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [markerNote, setMarkerNote] = useState<string>("");


  // AJAX search for primary students
  useEffect(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (searchTerm.length < 2) {
      setFilteredStudents([]);
      setIsLoadingStudents(false);
      return;
    }
    setIsLoadingStudents(true);
    setSearching(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/students?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        const arr = Array.isArray(data) ? data : [];
        // Filter out already selected primary student and already linked students
        const availableStudents = arr.filter((student: Student) => 
          student.id !== selectedStudent?.id && !linkedStudents.find(ls => ls.id === student.id)
        );
        const filtered = availableStudents.filter((student: Student) => 
          (student.first_name?.toLowerCase().startsWith(searchTerm) ||
           student.last_name?.toLowerCase().startsWith(searchTerm) ||
           student.id?.toLowerCase().startsWith(searchTerm))
        );
        // setStudents(arr); // Potentially remove if students are only fetched for filtering
        setFilteredStudents(filtered);
      } catch (error) {
        // setStudents([]); // Potentially remove
        setFilteredStudents([]);
      } finally {
        setIsLoadingStudents(false);
        setSearching(false);
      }
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, selectedStudent, linkedStudents]);

  // AJAX search for linked students
  useEffect(() => {
    const searchTerm = linkedStudentSearchQuery.trim().toLowerCase();
    if (searchTerm.length < 2) {
      setFilteredLinkedStudents([]);
      setIsLoadingLinkedStudentSearch(false);
      return;
    }
    setIsLoadingLinkedStudentSearch(true);
    setSearchingLinked(true);
    if (linkedSearchTimeout.current) clearTimeout(linkedSearchTimeout.current);
    linkedSearchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/students?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error("Failed to fetch students for linking");
        const data = await response.json();
        const arr = Array.isArray(data) ? data : [];
        // Filter out the primary selected student and already linked students
        const availableToLink = arr.filter((student: Student) => 
          student.id !== selectedStudent?.id && 
          !linkedStudents.some(ls => ls.id === student.id)
        );
        const filtered = availableToLink.filter((student: Student) =>
          (student.first_name?.toLowerCase().startsWith(searchTerm) ||
           student.last_name?.toLowerCase().startsWith(searchTerm) ||
           student.id?.toLowerCase().startsWith(searchTerm))
        );
        setFilteredLinkedStudents(filtered);
      } catch (error) {
        setFilteredLinkedStudents([]);
      } finally {
        setIsLoadingLinkedStudentSearch(false);
        setSearchingLinked(false);
      }
    }, 300);
    return () => {
      if (linkedSearchTimeout.current) clearTimeout(linkedSearchTimeout.current);
    };
  }, [linkedStudentSearchQuery, selectedStudent, linkedStudents]);

  // Fetch student details and merge emergency contacts into selectedStudent
  useEffect(() => {
    async function fetchStudentDetailsAndContacts() {
      if (!selectedStudent) return;
      setIsLoadingContacts(true);
      try {
        const response = await fetch(`/api/students/${selectedStudent.id}/full-profile`);
        if (!response.ok) throw new Error("Failed to fetch student profile");
        const profileData = await response.json();
        setSelectedStudent({
          ...selectedStudent,
          ...profileData.student,
          emergencyContacts: profileData.emergencyContacts || [],
        });
      } catch (error) {
        setSelectedStudent(prev => prev ? { ...prev, emergencyContacts: [] } : null);
      } finally {
        setIsLoadingContacts(false);
      }
    }
    if (selectedStudent) fetchStudentDetailsAndContacts();
  }, [selectedStudent?.id]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery(""); // Clear primary search query
    setFilteredStudents([]); // Clear primary search results
  };

  const handleAddLinkedStudent = (student: Student) => {
    if (!linkedStudents.find(ls => ls.id === student.id) && selectedStudent?.id !== student.id) {
      setLinkedStudents(prev => [...prev, student]);
    }
    setLinkedStudentSearchQuery(""); // Clear linked student search query
    setFilteredLinkedStudents([]); // Clear linked student search results
  };

  const handleRemoveLinkedStudent = (studentId: string) => {
    setLinkedStudents(prev => prev.filter(student => student.id !== studentId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const incidentId = uuidv4();

    const formValues = {
      id: incidentId,
      details: formData.get("description"),
      incident_date: incidentDate ? format(incidentDate, "yyyy-MM-dd") : null,
      incident_time: incidentTime,
      actions_taken: formData.get("actions") || "",
      requires_follow_up: needsFollowUp ? 1 : 0,
      is_confidential: isConfidential ? 1 : 0,
      urgent: formData.get("immediate-risk") === "on" ? 1 : 0,
      status_id: 1, // Default status, adjust as needed
      created_by: 1, // Placeholder for logged-in user ID
      student_id: selectedStudent?.id,
      role: "primary", // For the primary student
      // Add linked students, body map markers, etc.
      linked_students: linkedStudents.map(ls => ({ student_id: ls.id, role: "linked" })), // Example structure
      body_map_markers: bodyMapMarkers,
      // ... other fields like category_id, subcategory_id, location_id
    };

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Incident report created successfully",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating incident:", error);
      toast({
        title: "Error",
        description: "Failed to create incident report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  // Helper to get selected student details (match testform.tsx)
  const getSelectedStudentDetails = () => {
    if (!selectedStudent) return null;
    // Assuming 'students' state holds all fetched student details, or fetch if not.
    // For now, it uses the selectedStudent object directly which should be populated by fetchStudentDetailsAndContacts
    return selectedStudent; 
  };

  // Body Map Handlers
  const handleBodyMapClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Calculate click position relative to the image, assuming image fills the div
    // This might need adjustment based on actual image rendering and aspect ratio
    const x = ((event.clientX - rect.left) / rect.width) * 100; // Percentage
    const y = ((event.clientY - rect.top) / rect.height) * 100; // Percentage

    const newMarker: BodyMapMarkerData = {
      id: uuidv4(),
      x,
      y,
      note: "",
    };
    setBodyMapMarkers([...bodyMapMarkers, newMarker]);
    setSelectedMarker(newMarker.id);
    setMarkerNote(""); // Reset note for new marker
  };

  const saveMarkerNote = () => {
    if (!selectedMarker) return;
    setBodyMapMarkers(
      bodyMapMarkers.map((marker) =>
        marker.id === selectedMarker ? { ...marker, note: markerNote } : marker
      )
    );
    // Optionally clear selectedMarker and markerNote after saving
    // setSelectedMarker(null);
    // setMarkerNote("");
    toast({ title: "Note Saved", description: "Marker note has been updated." });
  };

  const removeMarker = (markerIdToRemove: string) => {
    setBodyMapMarkers(bodyMapMarkers.filter((marker) => marker.id !== markerIdToRemove));
    if (selectedMarker === markerIdToRemove) {
      setSelectedMarker(null);
      setMarkerNote("");
    }
    toast({ title: "Marker Removed", description: "The marker has been removed." });
  };


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
              {/* Student Search */}
              <div className="space-y-2">
                <Label htmlFor="student-search">Student Search</Label>
                <Input
                  id="student-search"
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
                {/* Results */}
                <div className="mt-2 space-y-2">
                  {isLoadingStudents ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                  ) : searchQuery.length < 2 ? (
                    <div className="text-sm text-gray-500">Type at least 2 characters to search</div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-sm text-gray-500">No students found</div>
                  ) : (
                    <div className="grid gap-2">
                      {filteredStudents.map(student => (
                        <Card
                          key={student.id}
                          className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedStudent?.id === student.id ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => handleStudentSelect(student)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">
                                  {student.first_name} {student.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {student.id}
                                </div>
                                {student.year_group && (
                                  <div className="text-sm text-gray-500">
                                    Year: {student.year_group}
                                  </div>
                                )}
                              </div>
                              {selectedStudent?.id === student.id && (
                                <div className="text-blue-500">
                                  ✓
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
                {searching && <div className="text-xs text-gray-500 mt-1">Searching...</div>}
              </div>
              
              {selectedStudent && (
                <div className="p-4 border rounded-md bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(selectedStudent.first_name, selectedStudent.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedStudent.first_name} {selectedStudent.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.year_group} • {selectedStudent.tutor}
                      </p>
                    </div>
                    <Badge variant="outline" className={getSafeguardingStatusColor(selectedStudent.safeguarding_status)}>
                      {selectedStudent.safeguarding_status || "None"}
                    </Badge>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Emergency Contacts */}
                  <div className="space-y-2 mt-4">
                    <Label>Emergency Contacts</Label>
                    <div className="space-y-2">
                      {selectedStudent.emergencyContacts && selectedStudent.emergencyContacts.length > 0 ? selectedStudent.emergencyContacts.map((contact) => (
                        <div key={contact.id} className="text-sm border rounded p-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{contact.first_name} {contact.last_name}</span>
                            <span className="text-muted-foreground">{contact.relationship}</span>
                          </div>
                          <div className="text-muted-foreground">{contact.phone} | {contact.email}</div>
                          <div className="text-xs">{contact.address_line_1} {contact.town} {contact.postcode}</div>
                        </div>
                      )) : <div className="text-xs text-muted-foreground">No emergency contacts found.</div>}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Linked Students</Label>
                <p className="text-sm text-muted-foreground">Add any other students involved in this incident</p>

                <div className="space-y-2">
                  {linkedStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(student.first_name, student.last_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.year_group} • {student.tutor}
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

                  {linkedStudents.length === 0 && !selectedStudent && (
                    <div className="text-sm text-muted-foreground italic">Select a primary student first.</div>
                  )}
                  {linkedStudents.length === 0 && selectedStudent && (
                    <div className="text-sm text-muted-foreground italic">No linked students added.</div>
                  )}

                  {selectedStudent && (
                    <div className="relative mt-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search for students to link..."
                          className="pl-8"
                          value={linkedStudentSearchQuery}
                          onChange={(e) => setLinkedStudentSearchQuery(e.target.value)}
                        />
                      </div>
                      {isLoadingLinkedStudentSearch ? (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-auto p-2 text-center text-xs text-muted-foreground">
                          Loading...
                        </div>
                      ) : linkedStudentSearchQuery.length > 0 && filteredLinkedStudents.length === 0 && !searchingLinked ? (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-auto p-2 text-center text-xs text-muted-foreground">
                          No students found.
                        </div>
                      ) : filteredLinkedStudents.length > 0 ? (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-auto">
                          {filteredLinkedStudents.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                              onClick={() => handleAddLinkedStudent(student)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(student.first_name, student.last_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.first_name} {student.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {student.year_group} • {student.tutor}
                                </p>
                              </div>
                              {student.has_confidential_information && (
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                       {searchingLinked && <div className="text-xs text-gray-500 mt-1">Searching linked...</div>}
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
                {/* Incident Category */}
                <div className="space-y-2">
                  <Label htmlFor="incident-category">Incident Category</Label>
                  <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Incident Subcategory */}
                <div className="space-y-2">
                  <Label htmlFor="incident-subcategory">Subcategory</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentSubcategories.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="incident_date">Date of Incident</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !incidentDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {incidentDate ? format(incidentDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={incidentDate}
                        onSelect={setIncidentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {/* Hidden input for form submission if needed, or manage via state */}
                  <Input
                    id="incident_date"
                    name="incident_date" // Ensure name attribute for FormData
                    type="hidden"
                    value={incidentDate ? format(incidentDate, "yyyy-MM-dd") : ""}
                  />
                </div>
                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="incident_time">Time of Incident</Label>
                  <Input
                    id="incident_time"
                    name="incident_time" // Ensure name attribute for FormData
                    type="time"
                    placeholder="Select time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
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

              {/* Witness Staff */}
              <div className="space-y-2">
                <Label>Witness Staff</Label>
                <Select multiple>
                  <SelectTrigger>
                    <SelectValue placeholder="Select witness staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name} ({staff.job_title})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Staff to Notify */}
              <div className="space-y-2">
                <Label>Staff to Notify</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff to notify" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name} ({staff.job_title})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <span className="text-sm">body-map.png</span>
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
                        marker={marker} // Pass the whole marker object
                        index={index + 1}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from bubbling to the parent div
                          setSelectedMarker(marker.id);
                          setMarkerNote(marker.note);
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
                    <AvatarFallback>{getInitials(getSelectedStudentDetails()?.first_name, getSelectedStudentDetails()?.last_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {getSelectedStudentDetails()?.first_name} {getSelectedStudentDetails()?.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getSelectedStudentDetails()?.year_group} • Tutor: {getSelectedStudentDetails()?.tutor}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date of Birth:</span>
                    <span className="text-sm">
                      {format(new Date(getSelectedStudentDetails()?.date_of_birth), "PPP")}
                      <span className="ml-1 text-muted-foreground">
                        (Age: {getAgeFromDOB(getSelectedStudentDetails()?.date_of_birth)})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Safeguarding Status:</span>
                    <Badge variant="outline" className={getSafeguardingStatusColor(getSelectedStudentDetails()?.safeguarding_status)}>
                      {getSelectedStudentDetails()?.safeguarding_status || "None"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SEN Status:</span>
                    <span className="text-sm">{getSelectedStudentDetails()?.sen_status || "None"}</span>
                  </div>
                  {getSelectedStudentDetails()?.has_confidential_information && (
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
                    {getSelectedStudentDetails()?.emergencyContacts && getSelectedStudentDetails()?.emergencyContacts.length > 0 ? (
                      getSelectedStudentDetails()?.emergencyContacts.map((contact) => (
                      <div key={contact.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{contact.first_name} {contact.last_name}</span>
                          <span className="text-muted-foreground">{contact.relationship}</span>
                        </div>
                        <p className="text-muted-foreground">{contact.phone} | {contact.email}</p>
                        {/* Assuming isRisk and riskNotes are part of EmergencyContact if needed */}
                        {/* {contact.isRisk && (
                          <div className="mt-1 p-1 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-600 dark:text-red-400">
                            Risk indicator: {contact.riskNotes}
                          </div>
                        )} */}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No emergency contacts found for this student.</p>
                  )}
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

