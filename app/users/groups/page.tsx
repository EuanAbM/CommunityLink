"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { permissionGroups } from "@/lib/data"
import { PlusCircle, Trash, Save, Edit, Users, FileText, Settings, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UserGroupsPage() {
  const [groups, setGroups] = useState([...permissionGroups])
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [isAddingGroup, setIsAddingGroup] = useState(false)

  // Add demo groups if they don't exist
  const ensureDemoGroups = () => {
    const demoGroups = [
      { name: "Staff", description: "Regular teaching staff with basic access" },
      { name: "DSL", description: "Designated Safeguarding Leads with full access" },
      { name: "SLT", description: "Senior Leadership Team with management access" },
      { name: "Admin", description: "Administrative staff with system configuration access" },
    ]

    demoGroups.forEach((demoGroup) => {
      if (!groups.some((g) => g.name === demoGroup.name)) {
        const newGroup = {
          id: `group-${Date.now()}-${demoGroup.name.toLowerCase()}`,
          name: demoGroup.name,
          description: demoGroup.description,
          permissions: [],
          schoolId: "school-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setGroups((prev) => [...prev, newGroup])
      }
    })
  }

  // Ensure demo groups exist on component mount
  useEffect(() => {
    ensureDemoGroups()
  }, []) // Empty dependency array ensures it only runs once

  const resources = [
    { id: "incidents", name: "Incidents", icon: <FileText className="h-4 w-4" /> },
    { id: "students", name: "Students", icon: <Users className="h-4 w-4" /> },
    { id: "confidential", name: "Confidential Data", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "agencies", name: "Agencies", icon: <Shield className="h-4 w-4" /> },
    { id: "reports", name: "Reports", icon: <FileText className="h-4 w-4" /> },
    { id: "users", name: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "settings", name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ]

  const actions = ["create", "read", "update", "delete"]

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        description: "New permission group",
        permissions: [],
        schoolId: "school-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setGroups([...groups, newGroup])
      setNewGroupName("")
      setIsAddingGroup(false)
      setEditingGroup(newGroup.id)
    }
  }

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter((group) => group.id !== id))
    if (editingGroup === id) {
      setEditingGroup(null)
    }
  }

  const togglePermission = (groupId: string, resource: string, action: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const permissionExists = group.permissions.some((p) => p.resource === resource && p.action === action)

          let updatedPermissions = [...group.permissions]

          if (permissionExists) {
            updatedPermissions = updatedPermissions.filter((p) => !(p.resource === resource && p.action === action))
          } else {
            updatedPermissions.push({ resource, action })
          }

          return {
            ...group,
            permissions: updatedPermissions,
            updatedAt: new Date(),
          }
        }
        return group
      }),
    )
  }

  const hasPermission = (groupId: string, resource: string, action: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.permissions.some((p) => p.resource === resource && p.action === action) || false
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">User Groups</h1>
              <p className="text-muted-foreground">Manage permission groups for staff access</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/users">View Users</Link>
              </Button>
              <Button onClick={() => setIsAddingGroup(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Permission Groups</CardTitle>
              <CardDescription>Define what different user groups can access in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingGroup && (
                <div className="mb-6 p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Add New Group</h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Group name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <Button onClick={handleAddGroup}>Add</Button>
                    <Button variant="outline" onClick={() => setIsAddingGroup(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.id} className="border rounded-md overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.description || `${group.permissions.length} permissions`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingGroup(editingGroup === group.id ? null : group.id)}
                        >
                          {editingGroup === group.id ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </>
                          ) : (
                            <>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {editingGroup === group.id && (
                      <div className="p-4">
                        <Tabs defaultValue="table">
                          <TabsList className="mb-4">
                            <TabsTrigger value="table">Table View</TabsTrigger>
                            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
                          </TabsList>

                          <TabsContent value="table">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Resource</TableHead>
                                  {actions.map((action) => (
                                    <TableHead key={action} className="text-center capitalize">
                                      {action}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {resources.map((resource) => (
                                  <TableRow key={resource.id}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        {resource.icon}
                                        <span>{resource.name}</span>
                                      </div>
                                    </TableCell>
                                    {actions.map((action) => (
                                      <TableCell key={action} className="text-center">
                                        <Checkbox
                                          checked={hasPermission(group.id, resource.id, action)}
                                          onCheckedChange={() => togglePermission(group.id, resource.id, action)}
                                        />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TabsContent>

                          <TabsContent value="detailed">
                            <div className="space-y-6">
                              {resources.map((resource) => (
                                <div key={resource.id} className="border rounded-md p-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    {resource.icon}
                                    <h3 className="font-medium">{resource.name}</h3>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {actions.map((action) => (
                                      <div key={action} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${group.id}-${resource.id}-${action}`}
                                          checked={hasPermission(group.id, resource.id, action)}
                                          onCheckedChange={() => togglePermission(group.id, resource.id, action)}
                                        />
                                        <Label htmlFor={`${group.id}-${resource.id}-${action}`} className="capitalize">
                                          {action}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

