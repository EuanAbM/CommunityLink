"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TestFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData(event.currentTarget);
    const formValues = {
      details: formData.get("details"),
      incidentDate: formData.get("incidentDate"),
      incidentTime: formData.get("incidentTime"),
      actionsTaken: formData.get("actionsTaken"),
      requiresFollowUp: formData.get("requiresFollowUp") === "on",
      isConfidential: formData.get("isConfidential") === "on",
      urgent: formData.get("urgent") === "on",
      primaryStudent: "1001" // Using a hard-coded student ID for testing
    };

    try {
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
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting the form");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Test Incident Form</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Simple Incident Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="test-form" onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="reset" form="test-form" variant="outline">Reset</Button>
          <Button type="submit" form="test-form" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Test Submit"}
          </Button>
        </CardFooter>
      </Card>
      
      {response && (
        <Card className="mt-6 max-w-md mx-auto bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-green-800">Success!</h3>
            <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Card className="mt-6 max-w-md mx-auto bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="mt-2">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}