"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface AcademicProgress {
  id: string
  student_id: string
  subject: string
  predicted_grade: string
  working_at_grade: string
  expected_grade: string
  updated_at: string
}

interface AcademicTabProps {
  studentId: string
  initialAcademicProgress: AcademicProgress[]
}

// Function to determine academic status and return appropriate badge props
function getAcademicStatus(workingAt: string, expected: string): {
  status: string
  variant: "default" | "outline" | "secondary" | "destructive" | null
} {
  // For letter grades (A*-U)
  const letterGrades = ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'U'];
  // For numeric grades (9-1)
  const numericGrades = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];
  
  // Convert grade strings to uppercase for case-insensitive comparison
  const workingAtUpper = workingAt.toUpperCase();
  const expectedUpper = expected.toUpperCase();
  
  // Check if using letter grades
  if (letterGrades.includes(workingAtUpper) && letterGrades.includes(expectedUpper)) {
    const workingAtIndex = letterGrades.indexOf(workingAtUpper);
    const expectedIndex = letterGrades.indexOf(expectedUpper);
    
    // Lower index means better grade for letter grades
    if (workingAtIndex <= expectedIndex) {
      return { status: "On Target", variant: "default" };
    } else if (workingAtIndex === expectedIndex + 1) {
      return { status: "Near Target", variant: "secondary" };
    } else {
      return { status: "Below Target", variant: "destructive" };
    }
  }
  // Check if using numeric grades
  else if (numericGrades.includes(workingAtUpper) && numericGrades.includes(expectedUpper)) {
    const workingAtValue = parseInt(workingAtUpper);
    const expectedValue = parseInt(expectedUpper);
    
    // Higher number means better grade for numeric grades
    if (workingAtValue >= expectedValue) {
      return { status: "On Target", variant: "default" };
    } else if (workingAtValue === expectedValue - 1) {
      return { status: "Near Target", variant: "secondary" };
    } else {
      return { status: "Below Target", variant: "destructive" };
    }
  }
  
  // Default case when grades format is unknown or mixed
  return { status: "Unknown", variant: "outline" };
}

export function AcademicTab({ studentId, initialAcademicProgress }: AcademicTabProps) {
  // Log received data for debugging
  console.log('Initial academic progress received:', initialAcademicProgress);
  
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress[]>(initialAcademicProgress || []);
  const [isLoading, setIsLoading] = useState<boolean>(initialAcademicProgress ? false : true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from API if initial data not provided
  useEffect(() => {
    // If initial data is already provided, no need to fetch
    if (initialAcademicProgress && initialAcademicProgress.length > 0) {
      return;
    }

    async function fetchAcademicProgress() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/students/${studentId}/academic-progress`);
        if (!response.ok) {
          throw new Error('Failed to fetch academic progress');
        }
        const data = await response.json();
        console.log('Academic data fetched from component:', data);
        setAcademicProgress(data);
      } catch (err) {
        console.error('Error fetching academic progress:', err);
        setError('Could not load academic progress data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAcademicProgress();
  }, [studentId, initialAcademicProgress]);

  // Group academic progress by subject
  const subjectGroups = academicProgress.reduce((groups: { [key: string]: AcademicProgress[] }, item) => {
    const subject = item.subject;
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(item);
    return groups;
  }, {});

  // For each subject, sort by updated_at date (newest first)
  Object.keys(subjectGroups).forEach(subject => {
    subjectGroups[subject].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });

  if (isLoading) return <div>Loading academic progress...</div>;
  
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Progress</CardTitle>
        <CardDescription>
          Student's academic performance across subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(subjectGroups).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(subjectGroups).map(([subject, records]) => {
              // Get the most recent record for the subject
              const latestRecord = records[0];
              const academicStatus = getAcademicStatus(
                latestRecord.working_at_grade, 
                latestRecord.expected_grade
              );

              return (
                <div key={subject} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{subject}</h3>
                    <Badge variant={academicStatus.variant}>
                      {academicStatus.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Working At</p>
                      <p className="font-medium">{latestRecord.working_at_grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected</p>
                      <p className="font-medium">{latestRecord.expected_grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Predicted</p>
                      <p className="font-medium">{latestRecord.predicted_grade}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Last updated: {formatDate(latestRecord.updated_at)}
                  </div>
                  
                  {records.length > 1 && (
                    <div className="mt-4">
                      <details className="text-sm">
                        <summary className="font-medium cursor-pointer">
                          View history ({records.length - 1} previous {records.length - 1 === 1 ? 'record' : 'records'})
                        </summary>
                        <div className="mt-2 space-y-2 pl-4 border-l-2">
                          {records.slice(1).map((record) => (
                            <div key={record.id} className="text-sm">
                              <div className="grid grid-cols-3 gap-4">
                                <div>Working At: {record.working_at_grade}</div>
                                <div>Expected: {record.expected_grade}</div>
                                <div>Predicted: {record.predicted_grade}</div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(record.updated_at)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No academic progress data available for this student</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
