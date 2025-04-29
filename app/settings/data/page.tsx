"use client"

import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function DataSettingsPage() {
  const [syncFrequency, setSyncFrequency] = useState("daily")
  const [retentionSettings, setRetentionSettings] = useState({
    notes: "3",
    attachments: "5",
    logs: "2",
  })

  const restorePoints = [
    "2025-03-28",
    "2025-03-27",
    "2025-03-26",
    "2025-03-25",
    "2025-03-24",
  ]

  const users = [
    { id: "u1", name: "Alice Smith", email: "alice@example.com" },
    { id: "u2", name: "John Doe", email: "john@example.com" },
    { id: "u3", name: "Karen Blake", email: "karen@example.com" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Data Management</h1>
        <p className="text-muted-foreground">Manage data import, export, and retention</p>
      </div>

      <Tabs defaultValue="storage">
        <TabsList className="mb-4">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="external">External Links</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR Tools</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        {/* Storage Tab */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                View your current usage and available space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm mb-2">560GB used of 1TB</p>
                <Progress value={56} className="h-4" />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Documents:</strong> 320GB</p>
                <p><strong>Media Files:</strong> 180GB</p>
                <p><strong>Logs & Metadata:</strong> 60GB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* External Sync Tab */}
        <TabsContent value="external">
          <Card>
            <CardHeader>
              <CardTitle>External Data Sync</CardTitle>
              <CardDescription>Manage sync frequency for linked data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <select
                  id="sync-frequency"
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Last Sync:</strong> 28 March 2025, 02:15 AM</p>
              </div>
              <Button>Run Sync Now</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restore Tab */}
        <TabsContent value="restore">
          <Card>
            <CardHeader>
              <CardTitle>Restore Data</CardTitle>
              <CardDescription>Restore your system to a previous day's snapshot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {restorePoints.map(date => (
                <div key={date} className="flex items-center justify-between border rounded-md px-4 py-2">
                  <span>{date}</span>
                  <Button variant="outline" size="sm">Restore</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GDPR Tab */}
        <TabsContent value="gdpr">
          <Card>
            <CardHeader>
              <CardTitle>GDPR Tools</CardTitle>
              <CardDescription>Manage individual data requests and exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="border rounded-md p-4">
                  <div className="mb-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Export Data</Button>
                    <Button size="sm" variant="destructive">Delete Data</Button>
                    <Button size="sm" variant="outline">View Access Logs</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Settings</CardTitle>
              <CardDescription>Define how long data is stored before deletion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(retentionSettings).map(([type, years]) => (
                <div key={type} className="flex items-center gap-4">
                  <Label className="capitalize w-32">{type}</Label>
                  <Input
                    type="number"
                    min="1"
                    className="w-24"
                    value={years}
                    onChange={(e) => setRetentionSettings({
                      ...retentionSettings,
                      [type]: e.target.value
                    })}
                  />
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
              ))}
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="auto-delete" defaultChecked />
                <Label htmlFor="auto-delete">Enable automatic deletion</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Next Purge:</strong> 01 April 2025
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>    </div>
  )
}
