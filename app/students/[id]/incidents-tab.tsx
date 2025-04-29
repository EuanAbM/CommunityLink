"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { incidents, users } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { FileText, Plus, Paperclip, MapPin, Search, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { AddActionDialog } from "@/components/incidents/add-action-dialog"
import { AddNotesDialog } from "@/components/incidents/add-notes-dialog"
import { ViewNotificationsDialog } from "@/components/incidents/view-notifications-dialog"
import { ChangeStatusDialog } from "@/components/incidents/change-status-dialog"
import { IncidentActionsMenu } from "@/components/incidents/incident-actions-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface IncidentsTabProps {
  studentId: string
}

export function IncidentsTab({ studentId }: IncidentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showAllTimelines, setShowAllTimelines] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState<string[]>([])

  // Get all incidents for this student
  const studentIncidents = incidents.filter((incident) => incident.studentId === studentId)

  // Apply filters
  const filteredIncidents = studentIncidents.filter((incident) => {
    // Search term filter
    if (
      searchTerm &&
      !incident.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !incident.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "all" && incident.category !== categoryFilter) {
      return false
    }

    // Status filter
    if (statusFilter && statusFilter !== "all" && incident.status !== statusFilter) {
      return false
    }

    return true
  })

  // Group incidents by year and month for timeline
  const incidentsByYearMonth = studentIncidents.reduce(
    (acc, incident) => {
      const date = new Date(incident.incidentDate)
      const year = date.getFullYear()
      const month = date.getMonth()

      if (!acc[year]) {
        acc[year] = {}
      }

      if (!acc[year][month]) {
        acc[year][month] = []
      }

      acc[year][month].push(incident)
      return acc
    },
    {} as Record<number, Record<number, (typeof incidents)[0][]>>,
  )

  // Get unique years and sort them
  const years = Object.keys(incidentsByYearMonth)
    .map(Number)
    .sort((a, b) => b - a)

  // Get current year (for demo purposes, we'll use 2025)
  const currentYear = 2025

  // Get unique categories
  const categories = Array.from(new Set(studentIncidents.map((incident) => incident.category)))

  // Get unique statuses
  const statuses = Array.from(new Set(studentIncidents.map((incident) => incident.status)))

  // Generate random incident ID (6 digits)
  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const toggleNotes = (incidentId: string) => {
    if (expandedNotes.includes(incidentId)) {
      setExpandedNotes(expandedNotes.filter((id) => id !== incidentId))
    } else {
      setExpandedNotes([...expandedNotes, incidentId])
    }
  }

  // Example notes for demonstration
  const getIncidentNotes = (incidentId: string) => {
    return [
      {
        id: `note-${incidentId}-1`,
        author: {
          name: "John Smith",
          role: "Designated Safeguarding Lead",
        },
        content:
          "Initial assessment completed. Student appears distressed but willing to talk. Will schedule follow-up meeting tomorrow.",
        timestamp: new Date("2024-03-22T14:30:00"),
        isPrivate: true,
      },
      {
        id: `note-${incidentId}-2`,
        author: {
          name: "Sarah Johnson",
          role: "Head Teacher",
        },
        content:
          "Parents have been contacted and informed of the situation. They will be coming in for a meeting on Friday.",
        timestamp: new Date("2024-03-23T09:15:00"),
        isPrivate: false,
      },
    ]
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "bullying":
        return "bg-red-100 text-red-800"
      case "physical abuse":
        return "bg-orange-100 text-orange-800"
      case "emotional abuse":
        return "bg-yellow-100 text-yellow-800"
      case "neglect":
        return "bg-amber-100 text-amber-800"
      case "sexual abuse":
        return "bg-pink-100 text-pink-800"
      case "disclosure":
        return "bg-purple-100 text-purple-800"
      case "self-harm":
        return "bg-indigo-100 text-indigo-800"
      case "attendance":
        return "bg-blue-100 text-blue-800"
      case "mental health":
        return "bg-cyan-100 text-cyan-800"
      case "online safety":
        return "bg-teal-100 text-teal-800"
      case "peer-on-peer":
      case "peer conflict":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Generate random dots for timeline visualization
  const generateRandomDots = (year: number, month: number) => {
    // Only generate dots for the current year if showAllTimelines is false
    if (!showAllTimelines && year !== currentYear) return []

    const dots = []
    const dotCount = Math.floor(Math.random() * 3) // 0-2 dots per month

    // Categories for dots
    const dotCategories = [
      "Bullying",
      "Physical Abuse",
      "Emotional Abuse",
      "Neglect",
      "Sexual Abuse",
      "Disclosure",
      "Self-Harm",
      "Attendance",
      "Mental Health",
      "Peer Conflict",
    ]

    for (let i = 0; i < dotCount; i++) {
      const randomCategory = dotCategories[Math.floor(Math.random() * dotCategories.length)]
      dots.push({
        id: `dot-${year}-${month}-${i}`,
        category: randomCategory,
        position: Math.random() * 0.8 + 0.1, // Position between 10% and 90% of the month
      })
    }

    return dots
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Incident History</CardTitle>
          <CardDescription>All reported incidents for this student</CardDescription>
        </div>
        <Button asChild>
          <Link href={`/incidents/new?studentId=${studentId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Record Incident
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Timeline visualization */}
        {studentIncidents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Incident Timeline</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTimelines(!showAllTimelines)}
                className="text-xs"
              >
                {showAllTimelines ? (
                  <>
                    Hide Previous Years <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    View More Timelines <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-6">
              {years
                .filter((year) => showAllTimelines || year === currentYear)
                .map((year) => (
                  <div key={year} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">{year}</h4>
                    <div className="relative">
                      <div className="h-12 border-b flex">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="flex-1 border-r px-1 text-xs text-muted-foreground">
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                          </div>
                        ))}
                      </div>
                      <div className="relative h-8">
                        {/* Real incidents */}
                        {Object.entries(incidentsByYearMonth[year] || {}).flatMap(([month, monthIncidents]) =>
                          monthIncidents.map((incident, index) => {
                            const position = (Number.parseInt(month) / 12) * 100
                            const categoryClass = getCategoryColor(incident.category).split(" ")[0]

                            return (
                              <div
                                key={incident.id}
                                className={`absolute top-2 w-4 h-4 rounded-full ${categoryClass} cursor-pointer`}
                                style={{ left: `calc(${position}% - 8px)` }}
                                title={`${incident.category} - ${formatDate(incident.incidentDate)}`}
                              />
                            )
                          }),
                        )}

                        {/* Random dots for demo purposes */}
                        {Array.from({ length: 12 }).flatMap((_, month) => {
                          return generateRandomDots(year, month).map((dot) => {
                            const position = ((month + dot.position) / 12) * 100
                            const categoryClass = getCategoryColor(dot.category).split(" ")[0]

                            return (
                              <div
                                key={dot.id}
                                className={`absolute top-2 w-4 h-4 rounded-full ${categoryClass} cursor-pointer`}
                                style={{ left: `calc(${position}% - 8px)` }}
                                title={`${dot.category} - Demo`}
                              />
                            )
                          })
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Filter and search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search incidents..."
              className="w-full rounded-md border border-input pl-8 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={categoryFilter || "all"}
            onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredIncidents.length > 0 ? (
          <div className="space-y-6">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-4 relative">
                {/* Incident ID */}
                <div className="absolute top-2 right-2 text-xs text-muted-foreground">ID: {generateRandomId()}</div>

                <div className="flex items-center justify-between mb-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getStatusColor(incident.status)}>
                      {incident.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(incident.category)}>
                      {incident.category}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatDate(incident.incidentDate)}</span>
                </div>

                <Link href={`/incidents/${incident.id}`} className="text-lg font-medium hover:underline">
                  {incident.category} Incident
                </Link>

                <p className="mt-2 text-sm">{incident.description}</p>

                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <span>
                    Reported by: {users.find((u) => u.id === incident.reportedBy)?.firstName}{" "}
                    {users.find((u) => u.id === incident.reportedBy)?.lastName}
                  </span>
                  {incident.isConfidential && (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Confidential
                    </Badge>
                  )}
                </div>

                {incident.actionsTaken && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Actions Taken:</p>
                    <p className="text-sm">{incident.actionsTaken}</p>
                  </div>
                )}

                {incident.followUpRequired && (
                  <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
                    <strong>Follow-up required:</strong> {incident.followUpNotes}
                  </div>
                )}

                {/* Notes section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleNotes(incident.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">Notes</span>
                      {expandedNotes.includes(incident.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                    <AddNotesDialog incidentId={incident.id} />
                  </div>

                  {expandedNotes.includes(incident.id) && (
                    <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto border rounded-md p-3">
                      {getIncidentNotes(incident.id).map((note) => (
                        <div key={note.id} className="p-3 bg-muted/50 rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {getInitials(note.author.name.split(" ")[0], note.author.name.split(" ")[1])}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{note.author.name}</p>
                                <p className="text-xs text-muted-foreground">{note.author.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</span>
                              {note.isPrivate && (
                                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                                  Private
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick links for attachments and body maps */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {incident.attachments && incident.attachments.length > 0 && (
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                      <Paperclip className="h-3 w-3" />
                      Attachments ({incident.attachments.length})
                    </Button>
                  )}
                  {incident.bodyMap && incident.bodyMap.length > 0 && (
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      Body Map
                    </Button>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  <div className="flex items-center">
                    <ViewNotificationsDialog incidentId={incident.id} />
                  </div>
                  <div className="flex gap-2">
                    <AddActionDialog incidentId={incident.id} />
                    <ChangeStatusDialog incidentId={incident.id} currentStatus={incident.status} />
                    <Link href={`/incidents/${incident.id}/audit-trail`} passHref>
                      <Button variant="outline" size="sm">
                        Audit Trail
                      </Button>
                    </Link>
                    <IncidentActionsMenu incidentId={incident.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>No incidents found matching your filters</p>
            <Button asChild className="mt-4">
              <Link href={`/incidents/new?studentId=${studentId}`}>Record Incident</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

