"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  // Fetch student data from the database
  useEffect(() => {
    async function fetchStudents() {
      setIsLoadingStudents(true);
      try {
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        // Fallback to mock data if API fails
        const mockStudents: Student[] = [
          { id: "1001", first_name: "Thompson", last_name: "", year_group: "Year 9" },
          { id: "1002", first_name: "Liam", last_name: "Khan", year_group: "Year 8" },
          { id: "1003", first_name: "Freya", last_name: "Owen", year_group: "Year 7" },
          { id: "1004", first_name: "Noah", last_name: "Singh", year_group: "Year 10" },
          { id: "1005", first_name: "Isla", last_name: "Owen", year_group: "Year 9" },
        ];
        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
      } finally {
        setIsLoadingStudents(false);
      }
    }

    fetchStudents();
  }, []);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(student => 
        student.first_name?.toLowerCase().includes(query) ||
        student.last_name?.toLowerCase().includes(query) ||
        student.id?.includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  // Fetch emergency contacts when a student is selected
  useEffect(() => {
    async function fetchEmergencyContacts() {
      if (!selectedStudent) {
        setEmergencyContacts([]);
        return;
      }

      setIsLoadingContacts(true);
      try {
        const response = await fetch(`/api/students/${selectedStudent}/emergency-contacts`);
        if (!response.ok) {
          throw new Error("Failed to fetch emergency contacts");
        }
        
        const data = await response.json();
        setEmergencyContacts(data);
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
        // Mock data if API fails
        if (selectedStudent === "1002") {
          // Example emergency contact from your data structure
          setEmergencyContacts([{
            id: "ec-1002a",
            student_id: "1002",
            first_name: "Yusuf",
            last_name: "Khan",
            relationship: "Father",
            phone: "07988 998877",
            email: "yusuf.khan@example.com",
            address_line_1: "45 Wostenholm Road",
            address_line_2: "Flat 2B",
            town: "Sheffield",
            county: "South Yorkshire",
            postcode: "S7 1LE",
            country: "United Kingdom"
          }]);
        } else {
          setEmergencyContacts([]);
        }
      } finally {
        setIsLoadingContacts(false);
      }
    }

    fetchEmergencyContacts();
  }, [selectedStudent]);

  const getSelectedStudentDetails = () => {
    if (!selectedStudent) return null;
    return students.find(student => student.id === selectedStudent);
  };

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
    const formValues = {
      details: formData.get("details"),
      incidentDate: formData.get("incidentDate"),
      incidentTime: formData.get("incidentTime"),
      actionsTaken: formData.get("actionsTaken"),
      requiresFollowUp: formData.has("requiresFollowUp"),
      isConfidential: formData.has("isConfidential"),
      urgent: formData.has("urgent"),
      primaryStudent: selectedStudent
    };

    try {
      console.log("Submitting data:", formValues);
      
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }
      
      setResponse(data);
      console.log("Success:", data);
      
      // Reset form on success
      event.currentTarget.reset();
      setSelectedStudent(null);
      setEmergencyContacts([]);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting the form");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const selectedStudentDetails = getSelectedStudentDetails();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Test Incident Form</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple Incident Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="test-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Student Search */}
              <div className="space-y-2">
                <Label htmlFor="studentSearch">Student Search</Label>
                <Input 
                  id="studentSearch"
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
                
                <Select 
                  value={selectedStudent || ''} 
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingStudents ? "Loading students..." : "Select a student"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details">Incident Details</Label>
                <Textarea 
                  id="details" 
                  name="details" 
                  placeholder="Describe the incident..." 
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Date</Label>
                  <Input 
                    id="incidentDate" 
                    name="incidentDate" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incidentTime">Time</Label>
                  <Input 
                    id="incidentTime" 
                    name="incidentTime" 
                    type="time" 
                    defaultValue="12:00" 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actionsTaken">Actions Taken</Label>
                <Textarea 
                  id="actionsTaken" 
                  name="actionsTaken" 
                  placeholder="What actions have been taken so far?"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="requiresFollowUp" name="requiresFollowUp" />
                <Label htmlFor="requiresFollowUp">Requires follow-up</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="isConfidential" name="isConfidential" />
                <Label htmlFor="isConfidential">Confidential</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="urgent" name="urgent" />
                <Label htmlFor="urgent">Urgent</Label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="reset" 
              form="test-form" 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedStudent(null);
                setEmergencyContacts([]);
              }}
            >
              Reset
            </Button>
            <Button type="submit" form="test-form" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Test Submit"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Student Information and Emergency Contacts */}
        <div className="space-y-6">
          {selectedStudentDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Student ID:</div>
                    <div>{selectedStudentDetails.id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Name:</div>
                    <div>{selectedStudentDetails.first_name} {selectedStudentDetails.last_name}</div>
                  </div>
                  {selectedStudentDetails.year_group && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Year Group:</div>
                      <div>{selectedStudentDetails.year_group}</div>
                    </div>
                  )}
                  {selectedStudentDetails.tutor && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Tutor:</div>
                      <div>{selectedStudentDetails.tutor}</div>
                    </div>
                  )}
                  {selectedStudentDetails.date_of_birth && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Date of Birth:</div>
                      <div>{new Date(selectedStudentDetails.date_of_birth).toLocaleDateString()}</div>
                    </div>
                  )}
                  {selectedStudentDetails.safeguarding_status && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Safeguarding:</div>
                      <div>{selectedStudentDetails.safeguarding_status}</div>
                    </div>
                  )}
                  {selectedStudentDetails.sen_status && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">SEN Status:</div>
                      <div>{selectedStudentDetails.sen_status}</div>
                    </div>
                  )}
                  {selectedStudentDetails.has_confidential_information === 1 && (
                    <div className="bg-yellow-50 p-2 border border-yellow-200 rounded mt-2">
                      <div className="text-amber-700 font-medium">
                        This student has confidential information
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingContacts ? (
                  <p>Loading emergency contacts...</p>
                ) : emergencyContacts.length > 0 ? (
                  <div className="space-y-4">
                    {emergencyContacts.map(contact => (
                      <div key={contact.id} className="border-b pb-3 last:border-0">
                        <h4 className="font-medium">
                          {contact.first_name} {contact.last_name} ({contact.relationship})
                        </h4>
                        <div className="grid grid-cols-1 gap-1 mt-2 text-sm">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Phone:</div>
                            <div>{contact.phone}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Email:</div>
                            <div>{contact.email}</div>
                          </div>
                          {contact.address_line_1 && (
                            <div className="mt-1">
                              <div className="font-medium">Address:</div>
                              <div className="pl-4">
                                <p>{contact.address_line_1}</p>
                                {contact.address_line_2 && <p>{contact.address_line_2}</p>}
                                {contact.town && contact.postcode && 
                                  <p>{contact.town}, {contact.postcode}</p>}
                                {contact.county && <p>{contact.county}</p>}
                                {contact.country && <p>{contact.country}</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No emergency contacts found for this student
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {response && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-green-800">Success!</h3>
            <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Card className="mt-6 bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="mt-2">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}