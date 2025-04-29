"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye } from "lucide-react"
import { users } from "@/lib/data"
import { getInitials } from "@/lib/utils"

interface ViewNotificationsDialogProps {
  incidentId: string
}

export function ViewNotificationsDialog({ incidentId }: ViewNotificationsDialogProps) {
  const [open, setOpen] = useState(false)

  // Mock notification data - in a real app, this would be fetched from the database
  const notifications = [
    {
      userId: "user-1",
      notifiedAt: "2024-03-20T14:30:00",
      firstViewedAt: "2024-03-20T15:10:00",
      markedAsReadAt: "2024-03-20T15:15:00",
    },
    {
      userId: "user-2",
      notifiedAt: "2024-03-20T14:30:00",
      firstViewedAt: "2024-03-20T16:45:00",
      markedAsReadAt: null,
    },
    {
      userId: "user-3",
      notifiedAt: "2024-03-20T14:30:00",
      firstViewedAt: null,
      markedAsReadAt: null,
    },
  ]

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View notifications</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Notification Status</DialogTitle>
          <DialogDescription>Track who has been notified and viewed this incident.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Notified</TableHead>
                <TableHead>First Viewed</TableHead>
                <TableHead>Marked as Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => {
                const user = users.find((u) => u.id === notification.userId)
                if (!user) return null

                return (
                  <TableRow key={notification.userId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDateTime(notification.notifiedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {notification.firstViewedAt ? (
                          <>
                            <span className="text-green-600">✓</span>
                            <span>{formatDateTime(notification.firstViewedAt)}</span>
                          </>
                        ) : (
                          "Not viewed"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {notification.markedAsReadAt ? (
                          <>
                            <span className="text-green-600">✓</span>
                            <span>{formatDateTime(notification.markedAsReadAt)}</span>
                          </>
                        ) : (
                          "Not read"
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

