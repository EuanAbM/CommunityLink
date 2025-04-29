"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { StudentCard } from "@/components/students/student-card"
import { StudentFilter } from "@/components/students/student-filter"
import { students } from "@/lib/data"
import { Plus } from "lucide-react"

// For demo purposes, let's give some students SEN, FSM and PP status
const enhancedStudents = students.map((student) => ({
  ...student,
  sen: Math.random() > 0.7, // 30% chance of having SEN
  fsm: Math.random() > 0.8, // 20% chance of having FSM
  pp: Math.random() > 0.75, // 25% chance of having PP
}))

export default function StudentsPage() {
  const [filteredStudents, setFilteredStudents] = useState(enhancedStudents)

  const handleFilter = (filters: any) => {
    let result = [...enhancedStudents]

    if (filters.yearGroup && filters.yearGroup !== "all") {
      result = result.filter((student) => student.yearGroup === filters.yearGroup)
    }

    if (filters.safeguardingStatus && filters.safeguardingStatus.length > 0) {
      result = result.filter((student) => filters.safeguardingStatus.includes(student.safeguardingStatus || "None"))
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      result = result.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm) ||
          student.lastName.toLowerCase().includes(searchTerm) ||
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm) ||
          student.yearGroup.toLowerCase().includes(searchTerm) ||
          student.tutor.toLowerCase().includes(searchTerm),
      )
    }

    // Apply new filters
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

