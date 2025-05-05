"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { users, permissionGroups } from "@/lib/data"
import { getInitials, formatDate, getStatusColor } from "@/lib/utils"
import { PlusCircle, MoreHorizontal, Upload, FileText, Lock, Eye, Trash } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [staffList, setStaffList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Try-catch to handle any errors with the data import
    try {
      // Use setTimeout to simulate API loading and avoid any race conditions
      setTimeout(() => {
        setStaffList(users || [])
        setIsLoading(false)
      }, 100)
    } catch (err) {
      console.error("Error loading user data:", err)
      setError("Failed to load user data")
      setIsLoading(false)
    }
  }, [])

  // Safe access to user properties with fallbacks
  const safeGetInitials = (firstName, lastName) => {
    try {
      return getInitials(firstName, lastName)
    } catch (err) {
      return "??"
    }
  }

  const safeFormatDate = (date) => {
    try {
      return date ? formatDate(date) : "—"
    } catch (err) {
      return "Invalid Date"
    }
  }

  const safeGetStatusColor = (status) => {
    try {
      return status ? getStatusColor(status) : ""
    } catch (err) {
      return ""
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container py-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-red-600">Error</h2>
                  <p>{error}</p>
                  <Button className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Users</h1>
              <p className="text-muted-foreground">Manage staff accounts and permissions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Users
              </Button>
              <Button asChild variant="outline">
                <Link href="/users/groups">Manage Groups</Link>
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>View and manage all staff with access to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading user data...</div>
              ) : staffList.length === 0 ? (
                <div className="text-center py-4">No users found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>User Group</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Last Report</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((user) => (
                      <TableRow key={user?.id || Math.random().toString()}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.profileImage} alt={`${user?.firstName || ''} ${user?.lastName || ''}`} />
                              <AvatarFallback>{safeGetInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link href={`/users/${user?.id || ''}`} className="font-medium hover:underline">
                                {user?.firstName || ''} {user?.lastName || ''}
                              </Link>
                              <p className="text-xs text-muted-foreground">{user?.jobTitle || ''}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user?.email || '—'}</TableCell>
                        <TableCell>{user?.department || '—'}</TableCell>
                        <TableCell>
                          <Select defaultValue={user?.permissionGroups?.[0] || ''}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                              {(permissionGroups || []).map((group) => (
                                <SelectItem key={group?.id || Math.random().toString()} value={group?.id || ''}>
                                  {group?.name || 'Unnamed Group'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{user?.lastLogin ? safeFormatDate(user.lastLogin) : "Never"}</TableCell>
                        <TableCell>
                          {Math.random() > 0.5 ? safeFormatDate(new Date(Date.now() - Math.random() * 10000000000)) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={safeGetStatusColor(user?.status)}>
                            {user?.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/users/${user?.id || ''}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Audit Logs
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Lock className="mr-2 h-4 w-4" />
                                Revoke Login
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

