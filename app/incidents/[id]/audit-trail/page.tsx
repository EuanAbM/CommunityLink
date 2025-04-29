import { SiteHeader } from "@/components/layout/site-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInitials } from "@/lib/utils"
import { ArrowLeft, Download, Eye, FileText, Search, UserPlus } from "lucide-react"
import Link from "next/link"

export default function IncidentAuditTrailPage({ params }: { params: { id: string } }) {
  const auditTrail = [
    {
      id: "audit-1",
      action: "create",
      description: "Incident created",
      date: "2023-09-15T09:30:00",
      user: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "Teacher",
      },
      device: "Windows PC",
      browser: "Chrome 116.0.5845.111",
      ip: "192.168.1.45",
    },
    {
      id: "audit-2",
      action: "view",
      description: "Incident viewed",
      date: "2023-09-15T10:15:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-3",
      action: "update",
      description: "Status updated from 'Reported' to 'Under Investigation'",
      date: "2023-09-15T11:45:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-4",
      action: "update",
      description: "Assigned to Michael Chen",
      date: "2023-09-15T11:50:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-5",
      action: "upload",
      description: "Document uploaded: 'Student Statement.docx'",
      date: "2023-09-15T11:20:00",
      user: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "Teacher",
      },
      device: "Windows PC",
      browser: "Chrome 116.0.5845.111",
      ip: "192.168.1.45",
    },
    {
      id: "audit-6",
      action: "view",
      description: "Incident viewed",
      date: "2023-09-16T09:10:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "iPhone 13",
      browser: "Mobile Safari 16.5",
      ip: "192.168.5.87",
    },
    {
      id: "audit-7",
      action: "upload",
      description: "Document uploaded: 'Initial Assessment Form.pdf'",
      date: "2023-09-16T09:20:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-8",
      action: "update",
      description: "Agency involved: Children's Services",
      date: "2023-09-16T14:30:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-9",
      action: "upload",
      description: "Document uploaded: 'Children's Services Referral.pdf'",
      date: "2023-09-16T15:10:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-10",
      action: "view",
      description: "Incident viewed",
      date: "2023-09-17T09:45:00",
      user: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
      device: "iPad Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.56",
    },
    {
      id: "audit-11",
      action: "add_note",
      description: "Note added: 'Phone call with parents to discuss concerns'",
      date: "2023-09-17T10:00:00",
      user: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
      device: "iPad Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.56",
    },
    {
      id: "audit-12",
      action: "update",
      description: "Meeting scheduled for 20th September",
      date: "2023-09-17T11:15:00",
      user: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
      device: "iPad Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.56",
    },
    {
      id: "audit-13",
      action: "upload",
      description: "Document uploaded: 'Parent Meeting Notes.docx'",
      date: "2023-09-17T16:45:00",
      user: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
      device: "iPad Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.56",
    },
    {
      id: "audit-14",
      action: "view",
      description: "Incident viewed",
      date: "2023-09-18T15:30:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
    {
      id: "audit-15",
      action: "upload",
      description: "Document uploaded: 'Follow-up Meeting Agenda.docx'",
      date: "2023-09-18T15:45:00",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      device: "MacBook Pro",
      browser: "Safari 16.5",
      ip: "192.168.1.32",
    },
  ]

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-blue-500 text-white"
      case "view":
        return "bg-gray-500 text-white"
      case "update":
        return "bg-amber-500 text-white"
      case "upload":
        return "bg-indigo-500 text-white"
      case "add_note":
        return "bg-purple-500 text-white"
      case "notify":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <FileText className="h-4 w-4" />
      case "view":
        return <Eye className="h-4 w-4" />
      case "update":
        return <FileText className="h-4 w-4" />
      case "upload":
        return <FileText className="h-4 w-4" />
      case "add_note":
        return <FileText className="h-4 w-4" />
      case "notify":
        return <UserPlus className="h-4 w-4" />
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
                <h1 className="text-2xl font-semibold">Audit Trail</h1>
                <p className="text-muted-foreground">Incident ID: {params.id}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="audit" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="timeline" asChild>
                  <Link href={`/incidents/${params.id}/timeline`}>Timeline</Link>
                </TabsTrigger>
                <TabsTrigger value="documents" asChild>
                  <Link href={`/incidents/${params.id}/documents`}>Documents</Link>
                </TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Audit Log
              </Button>
            </div>

            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>System Audit Log</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search audit log..." className="pl-8" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="user-1">Sarah Johnson</SelectItem>
                        <SelectItem value="user-2">Michael Chen</SelectItem>
                        <SelectItem value="user-3">Emma Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="upload">Upload</SelectItem>
                        <SelectItem value="add_note">Add Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-8 pb-1">
                    {/* Vertical line connecting timeline events */}
                    <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-border"></div>

                    <div className="space-y-6">
                      {auditTrail.map((entry) => (
                        <div
                          key={entry.id}
                          className="relative transition-all duration-200 hover:translate-x-1 hover:shadow-md rounded-lg border p-4"
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-8 top-4 h-4 w-4 rounded-full bg-background border-2 border-primary"></div>

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {getInitials(entry.user.firstName, entry.user.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {entry.user.firstName} {entry.user.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{entry.user.role}</p>
                                </div>
                              </div>
                              <Badge className={`${getActionColor(entry.action)} flex items-center gap-1`}>
                                {getActionIcon(entry.action)}
                                <span>
                                  {entry.action.replace("_", " ").charAt(0).toUpperCase() +
                                    entry.action.replace("_", " ").slice(1)}
                                </span>
                              </Badge>
                            </div>

                            <div>
                              <p className="text-sm">{entry.description}</p>
                              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                <p>Device: {entry.device}</p>
                                <p>Browser: {entry.browser}</p>
                                <p>IP Address: {entry.ip}</p>
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</div>
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

