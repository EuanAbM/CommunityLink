"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, X, AlertTriangle, FileText, Upload } from "lucide-react";
import { getInitials, getSafeguardingStatusColor } from "@/lib/utils";
import { BodyMapMarker } from "@/components/incidents/body-map-marker";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";

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
  emergencyContacts?: EmergencyContact[];
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

export default function TestFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);
  const [needsFollowUp, setNeedsFollowUp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [incidentCategories, setIncidentCategories] = useState<any[]>([]);
  const [incidentSubcategories, setIncidentSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(new Date());
  const [incidentTime, setIncidentTime] = useState("");
  const [bodyMapMarkers, setBodyMapMarkers] = useState<
    {
      id: string;
      x: number;
      y: number;
      note: string;
      view: "front" | "back";
    }[]
  >([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [markerNote, setMarkerNote] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // AJAX search for students
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
        const filtered = arr.filter((student: Student) =>
          (student.first_name?.toLowerCase().startsWith(searchTerm) ||
            student.last_name?.toLowerCase().startsWith(searchTerm) ||
            student.id?.toLowerCase().startsWith(searchTerm))
        );
        setStudents(arr);
        setFilteredStudents(filtered);
      } catch (error) {
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setIsLoadingStudents(false);
        setSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

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
        setEmergencyContacts(profileData.emergencyContacts || []);
      } catch (error) {
        setSelectedStudent(prev => prev ? { ...prev, emergencyContacts: [] } : null);
        setEmergencyContacts([]);
      } finally {
        setIsLoadingContacts(false);
      }
    }
    if (selectedStudent) fetchStudentDetailsAndContacts();
  }, [selectedStudent?.id]);

  // Fetch incident categories from API on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/reporting_categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setIncidentCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setIncidentCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Add this helper to get the selected category/subcategory objects
  const selectedCategoryObj = incidentCategories.find(cat => cat.id === selectedCategory);
  const selectedSubcategoryObj = incidentSubcategories.find(sub => sub.id === selectedSubcategory);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setIncidentSubcategories([]);
      setSelectedSubcategory(null);
      return;
    }
    // Example: fetch subcategories for the selected category
    async function fetchSubcategories() {
      try {
        const res = await fetch(`/api/reporting_subcategories?categoryId=${selectedCategory}`);
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        const data = await res.json();
        setIncidentSubcategories(Array.isArray(data) ? data : []);
        setSelectedSubcategory(null);
      } catch {
        setIncidentSubcategories([]);
        setSelectedSubcategory(null);
      }
    }
    fetchSubcategories();
  }, [selectedCategory]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery("");
  };

  // Body map marker handling
  const handleBodyMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    const newMarker = {
      id: `marker-${Date.now()}`,
      x: xPercent,
      y: yPercent,
      note: "",
      view: "front",
    };
    setBodyMapMarkers([...bodyMapMarkers, newMarker]);
    setSelectedMarker(newMarker.id);
    setMarkerNote("");
  };

  const saveMarkerNote = () => {
    if (selectedMarker && markerNote.trim()) {
      setBodyMapMarkers(
        bodyMapMarkers.map((marker) => (marker.id === selectedMarker ? { ...marker, note: markerNote } : marker))
      );
      setSelectedMarker(null);
      setMarkerNote("");
    }
  };

  const removeMarker = (id: string) => {
    setBodyMapMarkers(bodyMapMarkers.filter((marker) => marker.id !== id));
    if (selectedMarker === id) {
      setSelectedMarker(null);
      setMarkerNote("");
    }
  };

  function getAgeFromDOB(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!selectedStudent) {
      setError("Please select a student");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    
    // Generate a UUID for the incident
    const incidentId = uuidv4();

    // Format the data according to the expected structure for the API
    const formValues = {
      id: incidentId,
      details: formData.get("details"),
      incident_date: formData.get("incidentDate"),
      incident_time: formData.get("incidentTime"),
      actions_taken: formData.get("actionsTaken") || "",
      requires_follow_up: formData.has("requiresFollowUp") ? 1 : 0,
      is_confidential: formData.has("isConfidential") ? 1 : 0,
      urgent: formData.has("urgent") ? 1 : 0,
      status_id: 1, // Default status (e.g., "Open" or "Pending")
      created_by: 1, // Default user ID or fetch from context if available
      
      // Student connection as a separate property
      student_id: selectedStudent,
      role: "involved"
    };

    // Add timestamp for debugging/tracking purposes
    console.log(`Submitting incident at ${new Date().toISOString()}`);

    try {
      // Display the exact payload being sent to help with debugging
      console.log("Submitting data:", JSON.stringify(formValues, null, 2));
      
      // Show the submission data on the UI as well
      setResponse({
        status: "Submitting",
        payload: formValues
      });
      
      // Make the API call to submit the incident report
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      // Log the raw response for debugging
      console.log("Response status:", response.status, response.statusText);
      
      // Get the response data
      let data;
      let responseText = "";
      
      try {
        responseText = await response.text();
        console.log("Raw response text:", responseText);
        
        // Try to parse as JSON if it's valid JSON
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          data = { rawResponse: responseText };
        }
      } catch (e) {
        console.error("Error reading response:", e);
        throw new Error("Failed to read server response");
      }
      
      console.log("Parsed response data:", data);
      
      // Check if the response was successful
      if (!response.ok) {
        // Create a detailed error message with all available information
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          responseData: data,
          responseText: responseText,
          requestPayload: formValues
        };
        
        const errorMessage = 
          (data && data.error) || 
          (data && data.message) || 
          `Server error (${response.status}): ${response.statusText}`;
        
        console.error("Server error details:", errorDetails);
        
        // Set a more detailed error for the user
        setError(`Error ${response.status}: ${errorMessage}\n\nRequest data may be invalid. See console for details.`);
        
        // Also update response state to show the error details in the UI
        setResponse({
          status: "Error",
          requestPayload: formValues,
          responseStatus: response.status,
          responseText: responseText,
          parsedResponse: data
        });
        
        return; // Exit early but don't throw, so we can display the error details
      }
      
      // Handle success scenario
      setResponse({
        status: "Success",
        requestPayload: formValues,
        responseData: data
      });
      console.log("Success:", data);
      
      // Reset form on success
      if (event.currentTarget && typeof event.currentTarget.reset === "function") {
        event.currentTarget.reset();
      }
      setSelectedStudent(null);
      setEmergencyContacts([]);
      setError(null);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      
      // Create a detailed error object for debugging
      const errorObj = {
        message: err.message || "An error occurred while submitting the form",
        stack: err.stack,
        formData: formValues
      };
      
      setError(`${errorObj.message}\n\nCheck the console for more details.`);
      
      // Also set the response with error details
      setResponse({
        status: "Error",
        error: errorObj,
        requestPayload: formValues
      });
    } finally {
      setIsLoading(false);
    }
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
              {/* ...linked students UI if needed... */}
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
                  <Select
                    value={selectedCategory ?? ""}
                    onValueChange={setSelectedCategory}
                  >
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
                  <Select
                    value={selectedSubcategory ?? ""}
                    onValueChange={setSelectedSubcategory}
                    disabled={!selectedCategory || incidentSubcategories.length === 0}
                  >
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
                  <Input
                    id="incident_date"
                    name="incidentDate"
                    type="date"
                    placeholder="Select date"
                    value={incidentDate ? format(incidentDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setIncidentDate(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>
                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="incident_time">Time of Incident</Label>
                  <Input
                    id="incident_time"
                    name="incidentTime"
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
                  name="details"
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
                <Switch 
                  id="followup" 
                  name="requiresFollowUp"
                  checked={needsFollowUp} 
                  onCheckedChange={setNeedsFollowUp} 
                />
                <Label htmlFor="followup">Requires follow-up</Label>
              </div>
              {needsFollowUp && (
                <div className="space-y-2">
                  <Label htmlFor="followup-notes">Follow-up Notes</Label>
                  <Textarea 
                    id="followup-notes"
                    name="followupNotes" 
                    placeholder="Notes for follow-up actions..." 
                    className="min-h-[80px]" 
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="confidential" 
                  name="isConfidential"
                  checked={isConfidential} 
                  onCheckedChange={setIsConfidential} 
                />
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
                <Checkbox id="immediate-risk" name="urgent" />
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
                    <AvatarFallback>{getInitials(selectedStudent.first_name, selectedStudent.last_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.year_group} • Tutor: {selectedStudent.tutor}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date of Birth:</span>
                    <span className="text-sm">
                      {selectedStudent.date_of_birth ? format(new Date(selectedStudent.date_of_birth), "PPP") : ""}
                      <span className="ml-1 text-muted-foreground">
                        {selectedStudent.date_of_birth ? `(Age: ${getAgeFromDOB(selectedStudent.date_of_birth)})` : ""}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Safeguarding Status:</span>
                    <Badge variant="outline" className={getSafeguardingStatusColor(selectedStudent.safeguarding_status)}>
                      {selectedStudent.safeguarding_status || "None"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SEN Status:</span>
                    <span className="text-sm">{selectedStudent.sen_status || "None"}</span>
                  </div>
                  {selectedStudent.has_confidential_information && (
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
                    {selectedStudent.emergencyContacts && selectedStudent.emergencyContacts.length > 0 ? selectedStudent.emergencyContacts.map((contact) => (
                      <div key={contact.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{contact.first_name} {contact.last_name}</span>
                          <span className="text-muted-foreground">{contact.relationship}</span>
                        </div>
                        <p className="text-muted-foreground">{contact.phone}</p>
                      </div>
                    )) : (
                      <div className="text-xs text-muted-foreground">No emergency contacts found.</div>
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
          {error && (
            <Card className="border-red-300">
              <CardContent className="pt-4">
                <p className="text-red-600 whitespace-pre-wrap text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
          {response && (
            <Card className="border-blue-200">
              <CardContent className="pt-4">
                <pre className="text-xs overflow-auto max-h-[200px]">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}