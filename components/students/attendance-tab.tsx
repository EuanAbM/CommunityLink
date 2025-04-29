import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AttendanceData {
  present: number
  authorizedAbsence: number
  unauthorizedAbsence: number
  late: number
  weeklyAttendance: {
    day: string
    status: string
  }[]
  monthlyComparison: {
    thisYear: number
    lastYear: number
  }
  termlyAttendance: {
    autumn: number
    spring: number
    summer: number
  }
}

interface AttendanceTabProps {
  studentId: string
}

export function AttendanceTab({ studentId }: AttendanceTabProps) {
  // This would normally be fetched from an API
  const attendanceData: AttendanceData = {
    present: 92,
    authorizedAbsence: 5,
    unauthorizedAbsence: 2,
    late: 1,
    weeklyAttendance: [
      { day: "Monday", status: "Present" },
      { day: "Tuesday", status: "Present" },
      { day: "Wednesday", status: "Late" },
      { day: "Thursday", status: "Present" },
      { day: "Friday", status: "Present" },
    ],
    monthlyComparison: {
      thisYear: 94,
      lastYear: 91,
    },
    termlyAttendance: {
      autumn: 95,
      spring: 92,
      summer: 89,
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Current academic year attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Pie chart visualization */}
              <div
                className="absolute inset-0 rounded-full border-8 border-primary"
                style={{ clipPath: `inset(0 ${100 - attendanceData.present}% 0 0)` }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-amber-400"
                style={{ clipPath: `inset(0 0 0 ${attendanceData.present}%)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold">{attendanceData.present}%</span>
                <span className="text-sm text-muted-foreground">Attendance</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Present: {attendanceData.present}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="text-sm">Authorized Absence: {attendanceData.authorizedAbsence}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-sm">Unauthorized: {attendanceData.unauthorizedAbsence}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm">Late: {attendanceData.late}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>Current week</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.weeklyAttendance.map((day) => (
                <TableRow key={day.day}>
                  <TableCell>{day.day}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        day.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : day.status === "Late"
                            ? "bg-blue-100 text-blue-800"
                            : day.status === "Absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                      }
                    >
                      {day.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Attendance Comparison</CardTitle>
          <CardDescription>Current vs previous academic year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Monthly Comparison</h3>
              <div className="h-40 border rounded-md p-4 flex items-end gap-4">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-primary h-[60%] rounded-t-md"></div>
                  <span className="text-xs mt-2">This Year</span>
                  <span className="text-xs font-medium">{attendanceData.monthlyComparison.thisYear}%</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-muted-foreground h-[55%] rounded-t-md"></div>
                  <span className="text-xs mt-2">Last Year</span>
                  <span className="text-xs font-medium">{attendanceData.monthlyComparison.lastYear}%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Termly Attendance</h3>
              <div className="h-40 border rounded-md p-4 flex items-end gap-4">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-green-500 h-[95%] rounded-t-md"></div>
                  <span className="text-xs mt-2">Autumn</span>
                  <span className="text-xs font-medium">{attendanceData.termlyAttendance.autumn}%</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-500 h-[92%] rounded-t-md"></div>
                  <span className="text-xs mt-2">Spring</span>
                  <span className="text-xs font-medium">{attendanceData.termlyAttendance.spring}%</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-amber-500 h-[89%] rounded-t-md"></div>
                  <span className="text-xs mt-2">Summer</span>
                  <span className="text-xs font-medium">{attendanceData.termlyAttendance.summer}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

