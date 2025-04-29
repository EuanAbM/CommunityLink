import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { students, incidents } from "@/lib/data"

export function SafeguardingStats() {
  const totalStudents = students.length
  const studentsWithCP = students.filter((student) => student.safeguardingStatus === "CP").length
  const studentsWithCIN = students.filter((student) => student.safeguardingStatus === "CIN").length
  const studentsWithLAC = students.filter((student) => student.safeguardingStatus === "LAC").length

  const totalIncidents = incidents.length
  const openIncidents = incidents.filter((incident) => incident.status !== "resolved").length
  const urgentIncidents = incidents.filter((incident) => incident.status === "escalated").length

  // Calculate incidents this week
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Start of current week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0)

  const incidentsThisWeek = incidents.filter((incident) => {
    const incidentDate = new Date(incident.reportDate)
    return incidentDate >= startOfWeek
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground pt-1">across all year groups</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Safeguarding Plans</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
            <path d="M12 12 2.2 2.2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentsWithCP + studentsWithCIN + studentsWithLAC}</div>
          <div className="pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded mr-1 bg-red-500"></div>
              <span>CP: {studentsWithCP}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded mr-1 bg-amber-500"></div>
              <span>CIN: {studentsWithCIN}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded mr-1 bg-purple-500"></div>
              <span>LAC: {studentsWithLAC}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Incidents This Week</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{incidentsThisWeek}</div>
          <p className="text-xs text-muted-foreground pt-1">in the current week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openIncidents}</div>
          <div className="pt-2">
            <div className="flex items-center text-xs text-red-500">
              <span className="font-semibold">{urgentIncidents} urgent</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>requiring follow-up</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

