import { SiteHeader } from "@/components/layout/site-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInitials } from "@/lib/utils"
import { ArrowLeft, Clock, FileText, MessageCircle, UserPlus } from "lucide-react"
import Link from "next/link"

export default function IncidentTimelinePage({ params }: { params: { id: string } }) {
  const timelineEvents = [
    {
      id: "event-1",
      type: "create",
      title: "Initial concern",
      description: "Student disclosed concerns about home environment during conversation with teacher.",
      date: "2023-09-15T09:30:00",
      user: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "Teacher",
      },
    },
    {
      id: "event-2",
      type: "note",
      title: "Note added",
      description: "Student mentioned feeling unsafe at home due to frequent arguments between parents.",
      date: "2023-09-15T10:15:00",
      user: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "Teacher",
      },
    },
    {
      id: "event-3",
      type: "status",
      title: "Status updated",
      description: "Status changed from 'Reported' to 'Under Investigation'",
      date: "2023-09-15T11:45:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
    },
    {
      id: "event-4",
      type: "assign",
      title: "Assigned to Safeguarding Lead",
      description: "Case assigned to Michael Chen for further investigation",
      date: "2023-09-15T11:50:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
    },
    {
      id: "event-5",
      type: "document",
      title: "Document uploaded",
      description: "Initial assessment form uploaded",
      date: "2023-09-16T09:20:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
    },
    {
      id: "event-6",
      type: "agency",
      title: "Agency involved",
      description: "Children's Services notified about the case",
      date: "2023-09-16T14:30:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
    },
    {
      id: "event-7",
      type: "note",
      title: "Note added",
      description: "Phone call with parents to discuss concerns. Parents were receptive and agreed to a meeting.",
      date: "2023-09-17T10:00:00",
      user: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
    },
    {
      id: "event-8",
      type: "meeting",
      title: "Meeting scheduled",
      description: "Meeting with parents and Children's Services scheduled for 20th September",
      date: "2023-09-17T11:15:00",
      user: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
    },
    {
      id: "event-9",
      type: "document",
      title: "Document uploaded",
      description: "Meeting agenda and talking points uploaded",
      date: "2023-09-18T15:45:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
    },
    {
      id: "event-10",
      type: "status",
      title: "Status updated",
      description: "Status changed from 'Under Investigation' to 'Action Plan in Place'",
      date: "2023-09-20T16:30:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
    },
  ]

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "create":
        return "bg-blue-500 text-white"
      case "note":
        return "bg-purple-500 text-white"
      case "status":
        return "bg-amber-500 text-white"
      case "assign":
        return "bg-green-500 text-white"
      case "document":
        return "bg-indigo-500 text-white"
      case "agency":
        return "bg-red-500 text-white"
      case "meeting":
        return "bg-teal-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "create":
        return <FileText className="h-4 w-4" />
      case "note":
        return <MessageCircle className="h-4 w-4" />
      case "status":
        return <Clock className="h-4 w-4" />
      case "assign":
        return <UserPlus className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "agency":
        return <UserPlus className="h-4 w-4" />
      case "meeting":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/incidents/${params.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">Incident Timeline</h1>
                <p className="text-muted-foreground">Incident ID: {params.id}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="timeline" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                Export Timeline
              </Button>
            </div>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-8 pb-1">
                    {/* Vertical line connecting timeline events */}
                    <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-border"></div>

                    <div className="space-y-8">
                      {timelineEvents.map((event, index) => (
                        <div
                          key={event.id}
                          className="relative transition-all duration-200 hover:translate-x-1 hover:shadow-md rounded-lg border p-4"
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-8 top-4 h-4 w-4 rounded-full bg-background border-2 border-primary"></div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {getInitials(event.user.firstName, event.user.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {event.user.firstName} {event.user.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{event.user.role}</p>
                                </div>
                              </div>
                              <Badge className={`${getEventTypeColor(event.type)} flex items-center gap-1`}>
                                {getEventTypeIcon(event.type)}
                                <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                              </Badge>
                            </div>

                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm">{event.description}</p>
                            </div>

                            <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

