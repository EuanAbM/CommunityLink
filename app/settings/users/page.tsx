"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, Mail, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { users } from "@/lib/data"
import { getInitials } from "@/lib/utils"

export default function UsersSettingsPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.jobTitle && user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Example user groups
  const userGroups = [
    {
      id: "group-1",
      name: "Safeguarding Team",
      description: "DSL and deputy DSLs",
      members: 4,
      permissions: "Full access to all safeguarding data",
    },
    {
      id: "group-2",
      name: "Senior Leadership Team",
      description: "Headteacher and senior leaders",
      members: 6,
      permissions: "Access to most safeguarding data",
    },
    {
      id: "group-3",
      name: "Pastoral Team",
      description: "Heads of year and pastoral staff",
      members: 8,
      permissions: "Limited access to safeguarding data",
    },
    {
      id: "group-4",
      name: "Teaching Staff",
      description: "All teaching staff",
      members: 45,
      permissions: "View-only access to relevant student data",
    },
    {
      id: "group-5",
      name: "Admin Staff",
      description: "Administrative personnel",
      members: 12,
      permissions: "Limited access to student data",
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Users & Permissions</h1>
        <p className="text-muted-foreground">Manage users, groups, and access permissions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">User Groups</TabsTrigger>
          <TabsTrigger value="permissions">Permission Sets</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Invite Users
                </Button>
                <Button onClick={() => setShowAddUser(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-3 hidden md:block">Role</div>
                    <div className="col-span-3 hidden md:block">Status</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email ||
                                `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@example.com`}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3 hidden md:block">
                          <p className="text-sm">{user.jobTitle || "Teacher"}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.role === "admin"
                              ? "Administrator"
                              : user.role === "super_user"
                                ? "Super User"
                                : "Standard User"}
                          </p>
                        </div>
                        <div className="col-span-3 hidden md:block">
                          <Badge
                            variant={
                              user.status === "active" ? "success" : user.status === "pending" ? "warning" : "secondary"
                            }
                          >
                            {user.status === "active" ? "Active" : user.status === "pending" ? "Pending" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add User Dialog */}
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>Create a new user account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.smith@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" placeholder="Teacher" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard User</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="super_user">Super User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-group">User Group</Label>
                  <Select>
                    <SelectTrigger id="user-group">
                      <SelectValue placeholder="Select user group" />
                    </SelectTrigger>
                    <SelectContent>
                      {userGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Groups</CardTitle>
                <CardDescription>Manage user groups and their permissions</CardDescription>
              </div>
              <Button onClick={() => setShowAddGroup(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                    <div className="col-span-3">Group Name</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Members</div>
                    <div className="col-span-2">Permissions</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y">
                    {userGroups.map((group) => (
                      <div key={group.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-3">
                          <p className="font-medium">{group.name}</p>
                        </div>
                        <div className="col-span-4">
                          <p className="text-sm">{group.description}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm">{group.members} users</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm truncate" title={group.permissions}>
                            {group.permissions}
                          </p>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Group</DropdownMenuItem>
                              <DropdownMenuItem>Edit Group</DropdownMenuItem>
                              <DropdownMenuItem>Manage Members</DropdownMenuItem>
                              <DropdownMenuItem>Set Permissions</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete Group</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Group Dialog */}
          <Dialog open={showAddGroup} onOpenChange={setShowAddGroup}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add User Group</DialogTitle>
                <DialogDescription>Create a new user group</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input id="group-name" placeholder="e.g., Safeguarding Team" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Input id="group-description" placeholder="Brief description of this group" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permission-set">Permission Set</Label>
                  <Select>
                    <SelectTrigger id="permission-set">
                      <SelectValue placeholder="Select permission set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="standard">Standard Access</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddGroup(false)}>
                  Cancel
                </Button>
                <Button>Add Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Sets</CardTitle>
              <CardDescription>Configure permission sets for different user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Permission sets define what actions users can perform and what data they can access.
                </p>

                {/* Permission sets content would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

