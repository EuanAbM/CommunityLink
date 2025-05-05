"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { StudentCard } from "@/components/students/student-card"
import { StudentFilter } from "@/components/students/student-filter"
import { Plus } from "lucide-react"

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();

        const enriched = data.map((student: any) => ({
          ...student,
          sen: student.sen_status !== "None",
          fsm: Math.random() > 0.7,
          pp: Math.random() > 0.65,
        }));

        setStudents(enriched);
        setFilteredStudents(enriched);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };

    fetchStudents();
  }, []);

  const handleFilter = (filters: any) => {
    let result = [...students]

    if (filters.yearGroup && filters.yearGroup !== "all") {
      result = result.filter((student) => student.yearGroup === filters.yearGroup)
    }

    if (filters.safeguardingStatus && filters.safeguardingStatus.length > 0) {
      result = result.filter((student) =>
        filters.safeguardingStatus.includes(student.safeguarding_status || "None")
      )
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      result = result.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchTerm) ||
          student.last_name.toLowerCase().includes(searchTerm) ||
          `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm) ||
          student.year_group.toLowerCase().includes(searchTerm) ||
          student.tutor.toLowerCase().includes(searchTerm),
      )
    }

    if (filters.sen) {
      result = result.filter((student) => student.sen)
    }

    if (filters.fsm) {
      result = result.filter((student) => student.fsm)
    }

    if (filters.pp) {
      result = result.filter((student) => student.pp)
    }

    setFilteredStudents(result)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Students</h1>
              <p className="text-muted-foreground">Manage and view student profiles and records</p>
            </div>
            <Button asChild className="sm:ml-auto">
              <Link href="/students/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            <StudentFilter onFilter={handleFilter} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}

              {filteredStudents.length === 0 && (
                <div className="col-span-full flex justify-center py-12 text-muted-foreground">
                  No students match your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
