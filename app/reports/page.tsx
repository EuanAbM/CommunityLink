import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BarChart, PieChart, Search, Download, Database } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-muted-foreground">View and generate safeguarding reports and analytics</p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Incident Summary</CardTitle>
                    <CardDescription>Incident reports by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                      <PieChart className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>Incident volume over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                      <BarChart className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Safeguarding Status</CardTitle>
                    <CardDescription>Students with safeguarding plans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                      <PieChart className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Common Reports</CardTitle>
                        <CardDescription>Frequently used report templates</CardDescription>
                      </div>
                      <Button>Generate New Report</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">Student Chronology</h3>
                            <p className="text-sm text-muted-foreground">Complete incident history for a student</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href="/reports/chronology">
                            <Search className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">Query Search</h3>
                            <p className="text-sm text-muted-foreground">Advanced search with multiple criteria</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href="/reports/query-search">
                            <Search className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">Incidents by Category</h3>
                            <p className="text-sm text-muted-foreground">Breakdown of incidents by type</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">Safeguarding Overview</h3>
                            <p className="text-sm text-muted-foreground">Summary of all safeguarding cases</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">Year Group Analysis</h3>
                            <p className="text-sm text-muted-foreground">Incidents by year group</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">Staff Activity</h3>
                            <p className="text-sm text-muted-foreground">Incident reporting by staff member</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="incidents">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Reports</CardTitle>
                  <CardDescription>Generate detailed incident reports with filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mb-4 text-muted-foreground/30" />
                    <p>Build your incident report by selecting the filters below</p>
                    <Button className="mt-4">Configure Report</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reports</CardTitle>
                  <CardDescription>Generate student-focused reports and chronologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mb-4 text-muted-foreground/30" />
                    <p>Build your student report by selecting the filters below</p>
                    <Button className="mt-4">Configure Report</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Reports</CardTitle>
                  <CardDescription>Build custom reports with advanced filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mb-4 text-muted-foreground/30" />
                    <p>Create a custom report with your own fields and filters</p>
                    <Button className="mt-4">Create Custom Report</Button>
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

