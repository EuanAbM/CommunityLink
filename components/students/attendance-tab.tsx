"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Register {
  student_id: string
  date: string
  session: string
  status: string
}

interface AttendanceSummary {
  id: string
  student_id: string
  present_percentage: string
  unauthorised_absence_percentage: string
  authorised_absence_percentage: string
  late_percentage: string
  recorded_on: string
}

interface AttendanceTabProps {
  studentId: string
  initialRegisters?: Register[]
  initialAttendanceSummary?: AttendanceSummary[]
}

type WeekDay = {
  date: Date
  dayName: string
  formattedDate: string
  sessions: {
    AM: { status: string; color: string } | null
    PM: { status: string; color: string } | null
  }
}

export function AttendanceTab({ studentId, initialRegisters = [], initialAttendanceSummary = [] }: AttendanceTabProps) {
  const [registers, setRegisters] = useState<Register[]>(initialRegisters)
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(
    initialAttendanceSummary.length > 0 ? initialAttendanceSummary[0] : null
  )
  const [isLoading, setIsLoading] = useState(!initialRegisters.length || !initialAttendanceSummary.length)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Start with the current week (Monday)
    const today = new Date()
    const day = today.getDay() // 0 is Sunday, 1 is Monday
    const diff = day === 0 ? -6 : 1 - day // Adjust to get Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)
    monday.setHours(0, 0, 0, 0)
    return monday
  })

  useEffect(() => {
    if (!initialRegisters.length || !initialAttendanceSummary.length) {
      fetchAttendanceData()
    }
  }, [studentId, initialRegisters, initialAttendanceSummary])

  const fetchAttendanceData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/students/${studentId}/attendance`)
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data')
      }
      const data = await response.json()
      setRegisters(data.registers || [])
      setAttendanceSummary(data.attendanceSummary?.length > 0 ? data.attendanceSummary[0] : null)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toUpperCase()) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800'
      case 'LATE':
        return 'bg-amber-100 text-amber-800'
      case 'UNAUTHORIZED ABSENCE':
      case 'UNAUTHORISED ABSENCE':
        return 'bg-red-100 text-red-800'
      case 'AUTHORIZED ABSENCE':
      case 'AUTHORISED ABSENCE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const previousWeek = () => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const nextWeek = () => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay() // 0 is Sunday, 1 is Monday
    const diff = day === 0 ? -6 : 1 - day // Adjust to get Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)
    monday.setHours(0, 0, 0, 0)
    setCurrentWeekStart(monday)
  }

  // Generate days of the week
  const getDaysOfWeek = (): WeekDay[] => {
    const days: WeekDay[] = []
    
    for (let i = 0; i < 5; i++) { // Monday to Friday (5 days)
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const formattedDate = formatDate(date.toISOString())
      
      // Find AM and PM sessions for this date
      const amSession = registers.find(r => {
        const regDate = new Date(r.date)
        return regDate.toDateString() === date.toDateString() && r.session.toUpperCase() === 'AM'
      })
      
      const pmSession = registers.find(r => {
        const regDate = new Date(r.date)
        return regDate.toDateString() === date.toDateString() && r.session.toUpperCase() === 'PM'
      })
      
      days.push({
        date,
        dayName,
        formattedDate,
        sessions: {
          AM: amSession ? { status: amSession.status, color: getStatusColor(amSession.status) } : null,
          PM: pmSession ? { status: pmSession.status, color: getStatusColor(pmSession.status) } : null
        }
      })
    }
    
    return days
  }

  // Get week date range as string
  const getWeekDateRange = (): string => {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 4) // Friday
    
    return `${formatDate(currentWeekStart.toISOString())} - ${formatDate(weekEnd.toISOString())}`
  }

  const weekDays = getDaysOfWeek()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Student attendance summary</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading attendance data...</div>
          ) : attendanceSummary ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-muted text-left">Present</th>
                    <th className="border px-4 py-2 bg-muted text-left">Unauthorised Absence</th>
                    <th className="border px-4 py-2 bg-muted text-left">Authorised Absence</th>
                    <th className="border px-4 py-2 bg-muted text-left">Late</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">
                      <span className="text-lg font-medium text-green-700">{attendanceSummary.present_percentage}%</span>
                    </td>
                    <td className="border px-4 py-2">
                      <span className="text-lg font-medium text-red-700">{attendanceSummary.unauthorised_absence_percentage}%</span>
                    </td>
                    <td className="border px-4 py-2">
                      <span className="text-lg font-medium text-blue-700">{attendanceSummary.authorised_absence_percentage}%</span>
                    </td>
                    <td className="border px-4 py-2">
                      <span className="text-lg font-medium text-amber-700">{attendanceSummary.late_percentage}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">No attendance summary available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>{getWeekDateRange()}</CardDescription>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={previousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Current Week
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 bg-muted">Day</th>
                  <th className="border px-4 py-2 bg-muted">AM</th>
                  <th className="border px-4 py-2 bg-muted">PM</th>
                </tr>
              </thead>
              <tbody>
                {weekDays.map((day) => (
                  <tr key={day.date.toISOString()}>
                    <td className="border px-4 py-2">
                      <div className="font-medium">{day.dayName}</div>
                      <div className="text-sm text-muted-foreground">{day.formattedDate}</div>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {day.sessions.AM ? (
                        <span className={`px-2 py-1 rounded text-xs ${day.sessions.AM.color}`}>
                          {day.sessions.AM.status}
                        </span>
                      ) : (
                        <span className="text-gray-400">No record</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {day.sessions.PM ? (
                        <span className={`px-2 py-1 rounded text-xs ${day.sessions.PM.color}`}>
                          {day.sessions.PM.status}
                        </span>
                      ) : (
                        <span className="text-gray-400">No record</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

