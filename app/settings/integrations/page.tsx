"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bot, Database, Globe, Key, RefreshCw, Server, Webhook } from "lucide-react"

export default function IntegrationsSettingsPage() {
  const [openAIKey, setOpenAIKey] = useState("sk-••••••••••••••••••••••••••••••")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-muted-foreground">Connect with other systems and services</p>
      </div>

      {/* AI Integration Section */}
      <Card className="mb-8 overflow-hidden relative bg-gradient-to-r from-primary/5 to-background border-primary/20">
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="star absolute h-1 w-1 rounded-full bg-primary/60 top-[15%] right-[10%] animate-pulse"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="star absolute h-1.5 w-1.5 rounded-full bg-primary/60 top-[35%] right-[25%] animate-pulse"
            style={{ animationDelay: "0.5s", animationDuration: "4s" }}
          ></div>
          <div
            className="star absolute h-1 w-1 rounded-full bg-primary/60 top-[65%] right-[15%] animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "3.5s" }}
          ></div>
          <div
            className="star absolute h-2 w-2 rounded-full bg-primary/60 top-[20%] right-[40%] animate-pulse"
            style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}
          ></div>
          <div
            className="star absolute h-1 w-1 rounded-full bg-primary/60 top-[80%] right-[35%] animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "3s" }}
          ></div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">AI Integration</CardTitle>
          </div>
          <CardDescription className="text-xs">Enhance your safeguarding system with AI assistance</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">A</span>
                </div>
                <span>
                  <span className="font-medium">Ask</span> policy questions
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">E</span>
                </div>
                <span>
                  <span className="font-medium">Enhance</span> reports
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">C</span>
                </div>
                <span>
                  <span className="font-medium">Comply</span> with regulations
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="openai-key" className="text-xs">
                  OpenAI API Key
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="openai-key"
                      value={openAIKey}
                      onChange={(e) => setOpenAIKey(e.target.value)}
                      type="password"
                      className="h-8 text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </div>
                  <span className="text-xs font-medium">Connection Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ai-enabled" defaultChecked />
                  <Label htmlFor="ai-enabled" className="text-xs">
                    Enable AI
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button size="sm" className="text-xs">
            Save AI Settings
          </Button>
        </CardFooter>
      </Card>

      {/* Main Integration Tabs */}
      <Tabs defaultValue="mis" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="mis">MIS Integrations</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* MIS Integrations Tab */}
        <TabsContent value="mis" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 border border-border p-1">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KcbHYpSXs4gBsGkizBmTHcBGUR9YMo.png"
                      alt="SIMS Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle>SIMS Integration</CardTitle>
                    <CardDescription>Connect to SIMS for student data synchronization</CardDescription>
                  </div>
                </div>
                <Switch id="sims-enabled" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sims-server">SIMS Server</Label>
                    <Input id="sims-server" placeholder="server.school.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sims-database">Database Name</Label>
                    <Input id="sims-database" placeholder="SIMS" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sims-username">Username</Label>
                    <Input id="sims-username" placeholder="service_account" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sims-password">Password</Label>
                    <Input id="sims-password" type="password" placeholder="••••••••••••" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sync Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="sync-students" defaultChecked />
                      <Label htmlFor="sync-students">Student Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sync-staff" defaultChecked />
                      <Label htmlFor="sync-staff">Staff Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sync-attendance" />
                      <Label htmlFor="sync-attendance">Attendance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sync-timetable" />
                      <Label htmlFor="sync-timetable">Timetables</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Test Connection</Button>
              <Button>Save & Connect</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Add New MIS Integration</CardTitle>
                  <CardDescription>Connect to other school management systems</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Database className="h-8 w-8" />
                  <span>Arbor</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Database className="h-8 w-8" />
                  <span>Bromcom</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Database className="h-8 w-8" />
                  <span>ScholarPack</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Globe className="h-8 w-8" />
                  <span>Custom MIS</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and access for external systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">
                      Your API endpoint:{" "}
                      <code className="bg-background px-1 py-0.5 rounded">
                        https://api.communitylink.app/v1/your-school
                      </code>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Keys</Label>
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Production Key</h3>
                          <p className="text-sm text-muted-foreground">Last used: 2 hours ago</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </div>
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Input value="cl_prod_••••••••••••••••••••••••••••••" readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Development Key</h3>
                          <p className="text-sm text-muted-foreground">Last used: 5 days ago</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </div>
                          <span className="text-sm">Testing</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Input value="cl_dev_••••••••••••••••••••••••••••••" readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="api-read-students" defaultChecked />
                      <Label htmlFor="api-read-students">Read Students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="api-write-students" />
                      <Label htmlFor="api-write-students">Write Students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="api-read-incidents" defaultChecked />
                      <Label htmlFor="api-read-incidents">Read Incidents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="api-write-incidents" />
                      <Label htmlFor="api-write-incidents">Write Incidents</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create New API Key</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Configure event notifications to external systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">
                      Webhooks allow external systems to receive real-time notifications when events occur in
                      CommunityLink.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Active Webhooks</Label>
                    <Button variant="outline" size="sm">
                      Add Webhook
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Incident Notifications</h3>
                          <p className="text-sm text-muted-foreground">Triggers when new incidents are created</p>
                        </div>
                        <Switch id="webhook-incidents" defaultChecked />
                      </div>
                      <div className="mt-2">
                        <Input
                          value="https://school-alerts.example.com/webhook/incidents"
                          readOnly
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Student Updates</h3>
                          <p className="text-sm text-muted-foreground">Triggers when student records are modified</p>
                        </div>
                        <Switch id="webhook-students" defaultChecked />
                      </div>
                      <div className="mt-2">
                        <Input
                          value="https://school-system.example.com/api/student-updates"
                          readOnly
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Webhook Security</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="webhook-signing" defaultChecked />
                    <Label htmlFor="webhook-signing">Sign webhook payloads</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value="whsec_••••••••••••••••••••••••••••••" type="password" className="font-mono text-sm" />
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this secret to verify webhook signatures in your application.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Test Webhooks</Button>
              <Button>Save Webhook Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

