import { SiteHeader } from "@/components/layout/site-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInitials } from "@/lib/utils"
import { ArrowLeft, Download, Eye, FileText, Lock, Upload } from "lucide-react"
import Link from "next/link"

export default function IncidentDocumentsPage({ params }: { params: { id: string } }) {
  const documents = [
    {
      id: "doc-1",
      name: "Initial Assessment Form.pdf",
      type: "PDF",
      size: "245 KB",
      uploadedBy: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      uploadedAt: "2023-09-16T09:20:00",
      category: "Assessment",
      isConfidential: true,
    },
    {
      id: "doc-2",
      name: "Parent Meeting Notes.docx",
      type: "Word Document",
      size: "78 KB",
      uploadedBy: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
      uploadedAt: "2023-09-17T16:45:00",
      category: "Meeting Notes",
      isConfidential: false,
    },
    {
      id: "doc-3",
      name: "Action Plan.pdf",
      type: "PDF",
      size: "320 KB",
      uploadedBy: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      uploadedAt: "2023-09-20T14:30:00",
      category: "Action Plans",
      isConfidential: false,
    },
    {
      id: "doc-4",
      name: "Children's Services Referral.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      uploadedAt: "2023-09-16T15:10:00",
      category: "External Agency",
      isConfidential: true,
    },
    {
      id: "doc-5",
      name: "Student Statement.docx",
      type: "Word Document",
      size: "65 KB",
      uploadedBy: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "Teacher",
      },
      uploadedAt: "2023-09-15T11:20:00",
      category: "Statements",
      isConfidential: true,
    },
    {
      id: "doc-6",
      name: "Follow-up Meeting Agenda.docx",
      type: "Word Document",
      size: "52 KB",
      uploadedBy: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        role: "Safeguarding Lead",
      },
      uploadedAt: "2023-09-18T15:45:00",
      category: "Meeting Notes",
      isConfidential: false,
    },
    {
      id: "doc-7",
      name: "Support Plan.pdf",
      type: "PDF",
      size: "290 KB",
      uploadedBy: {
        id: "user-3",
        firstName: "Emma",
        lastName: "Wilson",
        role: "Deputy Head",
      },
      uploadedAt: "2023-09-21T10:15:00",
      category: "Action Plans",
      isConfidential: false,
    },
  ]

  const documentCategories = [
    "All Documents",
    "Assessment",
    "Meeting Notes",
    "Action Plans",
    "External Agency",
    "Statements",
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />
      case "Word Document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "Image":
        return <FileText className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
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
                <h1 className="text-2xl font-semibold">Incident Documents</h1>
                <p className="text-muted-foreground">Incident ID: {params.id}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="timeline" asChild>
                  <Link href={`/incidents/${params.id}/timeline`}>Timeline</Link>
                </TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="audit" asChild>
                  <Link href={`/incidents/${params.id}/audit-trail`}>Audit Trail</Link>
                </TabsTrigger>
              </TabsList>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Documents ({documents.length})</CardTitle>
                  <div className="flex gap-2">
                    {documentCategories.map((category, index) => (
                      <Button key={index} variant={index === 0 ? "default" : "outline"} size="sm">
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:border-primary"
                      >
                        <div className="flex items-center gap-4">
                          {getFileIcon(doc.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{doc.name}</p>
                              {doc.isConfidential && (
                                <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Confidential
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>{doc.size}</span>
                              <span>{new Date(doc.uploadedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {getInitials(doc.uploadedBy.firstName, doc.uploadedBy.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                Uploaded by {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
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

