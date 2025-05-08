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
  
// Fetch the list of students when the component loads
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
      setFilteredStudents(data); // Initialize filtered students
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  }

  fetchStudents();
}, []);

// Fetch student details when a student is selected
useEffect(() => {
  async function fetchStudentDetailsAndContacts() {
    if (!selectedStudent) {
      setEmergencyContacts([]);
      return;
    }

    setIsLoadingContacts(true);
    try {
      // Use the existing full-profile endpoint which includes both student details and emergency contacts
      const response = await fetch(`/api/students/${selectedStudent}/full-profile`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch student profile: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const profileData = await response.json();
      console.log("Fetched student profile:", profileData);

      // Update student details if needed
      if (profileData.student) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === selectedStudent ? { ...student, ...profileData.student } : student
          )
        );
      }

      // Set emergency contacts directly from the profile data
      if (Array.isArray(profileData.emergencyContacts)) {
        setEmergencyContacts(profileData.emergencyContacts);
      } else {
        console.warn("No emergency contacts found in profile data");
        setEmergencyContacts([]);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
      setError("Failed to load student details or emergency contacts. Please try again.");
      setEmergencyContacts([]);
    } finally {
      setIsLoadingContacts(false);
    }
  }

  fetchStudentDetailsAndContacts();
}, [selectedStudent]);

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
    
    // Generate a UUID for the incident
    const incidentId = uuidv4();

    // Format the data according to the expected structure for the API
    // Try a completely different payload structure that doesn't nest students inside incident
    const formValues = {
      id: incidentId, // <-- Add this line
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
              
              {/* Hidden field to ensure student role is always 'involved' */}
              <input type="hidden" name="studentRole" value="involved" />
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
                                {contact.town && contact.postcode && (
                                  <p>{contact.town}, {contact.postcode}</p>
                                )}
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
          
          {response && (
            <Card className={`mt-6 ${response.status === "Success" ? "bg-green-50 border-green-200" : 
                                    response.status === "Error" ? "bg-red-50 border-red-200" : 
                                    "bg-blue-50 border-blue-200"}`}>
              <CardHeader>
                <CardTitle className={`${
                  response.status === "Success" ? "text-green-800" : 
                  response.status === "Error" ? "text-red-800" : 
                  "text-blue-800"
                }`}>
                  {response.status === "Success" ? "Success!" : 
                   response.status === "Error" ? "Error Details" : 
                   "Submission Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Request Payload */}
                  <div>
                    <h4 className="font-medium mb-1">Request Payload:</h4>
                    <pre className="p-2 bg-white rounded text-sm overflow-auto max-h-40 border">
                      {JSON.stringify(response.requestPayload, null, 2)}
                    </pre>
                  </div>
                  
                  {/* Response Data */}
                  {response.responseData && (
                    <div>
                      <h4 className="font-medium mb-1">Response Data:</h4>
                      <pre className="p-2 bg-white rounded text-sm overflow-auto max-h-40 border">
                        {JSON.stringify(response.responseData, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* Error Information */}
                  {response.status === "Error" && (
                    <>
                      {response.responseStatus && (
                        <p className="text-red-700">Status Code: {response.responseStatus}</p>
                      )}
                      {response.responseText && (
                        <div>
                          <h4 className="font-medium mb-1">Raw Response:</h4>
                          <pre className="p-2 bg-white rounded text-sm overflow-auto max-h-40 border">
                            {response.responseText}
                          </pre>
                        </div>
                      )}
                      {response.parsedResponse && (
                        <div>
                          <h4 className="font-medium mb-1">Parsed Response:</h4>
                          <pre className="p-2 bg-white rounded text-sm overflow-auto max-h-40 border">
                            {JSON.stringify(response.parsedResponse, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
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
      </div>
    </div>
  );
}