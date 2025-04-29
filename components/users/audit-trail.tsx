"use client"

import { formatDateTime } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { auditLogs } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, FileText, Eye, Upload, Download, Edit, Trash } from "lucide-react"
import { useState } from "react"

interface AuditTrailProps {
  userId: string
}

export function AuditTrail({ userId }: AuditTrailProps) {
  // Filter audit logs for this user
  const userAuditLogs = auditLogs
    .filter((log) => log.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Generate mock login history
  const loginHistory = Array.from({ length: 10 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
    return {
      id: `login-${i}`,
      date,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      device: Math.random() > 0.5 ? "Desktop - Chrome" : "Mobile - Safari",
    }
  })

  // Define event types for filtering
  const eventTypes = [
    { name: "login", label: "Login", icon: <LogIn className="h-4 w-4" /> },
    { name: "logout", label: "Logout", icon: <LogOut className="h-4 w-4" /> },
    { name: "view", label: "View", icon: <Eye className="h-4 w-4" /> },
    { name: "create", label: "Create", icon: <FileText className="h-4 w-4" /> },
    { name: "update", label: "Update", icon: <Edit className="h-4 w-4" /> },
    { name: "upload", label: "Upload", icon: <Upload className="h-4 w-4" /> },
    { name: "download", label: "Download", icon: <Download className="h-4 w-4" /> },
  ]

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  // Filter logs based on active filters
  const filteredLogs =
    activeFilters.length > 0 ? userAuditLogs.filter((log) => activeFilters.includes(log.action)) : userAuditLogs

  // Get icon for action type
  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-500" />
      case "logout":
        return <LogOut className="h-4 w-4 text-blue-500" />
      case "view":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "create":
        return <FileText className="h-4 w-4 text-green-500" />
      case "update":
        return <Edit className="h-4 w-4 text-amber-500" />
      case "upload":
        return <Upload className="h-4 w-4 text-purple-500" />
      case "download":
        return <Download className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>Activity history for this user</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((eventType) => (
            <Button
              key={eventType.name}
              variant={activeFilters.includes(eventType.name) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFilter(eventType.name)}
              className="flex items-center gap-1"
            >
              {eventType.icon}
              {eventType.label}
            </Button>
          ))}
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])} className="ml-auto">
              Clear Filters
            </Button>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Login History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((login) => (
                <TableRow key={login.id}>
                  <TableCell>{formatDateTime(login.date)}</TableCell>
                  <TableCell>{login.ip}</TableCell>
                  <TableCell>{login.device}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="font-medium mb-2">Activity Timeline</h3>
          <div className="relative border-l pl-6 ml-3 space-y-6 py-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[30px] top-1 border-4 border-background flex items-center justify-center">
                  {getActionIcon(log.action)}
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <div className="text-sm text-muted-foreground whitespace-nowrap">{formatDateTime(log.timestamp)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {log.action}
                      </Badge>
                      <span className="font-medium">{log.details}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Resource: {log.resourceType} • IP: {log.ipAddress}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

