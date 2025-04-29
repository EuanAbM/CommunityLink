"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { users } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Search } from "lucide-react"

interface AddActionDialogProps {
  incidentId: string
  onActionAdded?: () => void
}

export function AddActionDialog({ incidentId, onActionAdded }: AddActionDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof users>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedUserDetails, setSelectedUserDetails] = useState<(typeof users)[0] | null>(null)
  const [actionNotes, setActionNotes] = useState("")

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 1) {
      const results = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
          (user.jobTitle && user.jobTitle.toLowerCase().includes(term.toLowerCase())),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSelectUser = (user: (typeof users)[0]) => {
    setSelectedUser(user.id)
    setSelectedUserDetails(user)
    setSearchTerm(`${user.firstName} ${user.lastName}`)
    setSearchResults([])
  }

  const handleSubmit = () => {
    // In a real app, this would save the action to the database
    console.log("Adding action:", { incidentId, selectedUser, actionNotes })

    // Close the dialog and reset form
    setOpen(false)
    setSelectedUser(null)
    setSelectedUserDetails(null)
    setSearchTerm("")
    setActionNotes("")

    // Notify parent component
    if (onActionAdded) {
      onActionAdded()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Assign User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign User to Incident</DialogTitle>
          <DialogDescription>Assign a staff member to take action on this incident.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-search">Assign To</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-search"
                placeholder="Search staff members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {searchResults.length > 0 && !selectedUser && (
              <div className="border rounded-md shadow-sm max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.jobTitle && <p className="text-xs text-muted-foreground">{user.jobTitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedUserDetails && (
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(selectedUserDetails.firstName, selectedUserDetails.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {selectedUserDetails.firstName} {selectedUserDetails.lastName}
                    </p>
                    {selectedUserDetails.jobTitle && (
                      <p className="text-xs text-muted-foreground">{selectedUserDetails.jobTitle}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null)
                    setSelectedUserDetails(null)
                    setSearchTerm("")
                  }}
                >
                  Change
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action-notes">Action Details</Label>
            <Textarea
              id="action-notes"
              placeholder="Describe the action required..."
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={!selectedUser || !actionNotes}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

