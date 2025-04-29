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
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface AddNotesDialogProps {
  incidentId: string
  onNotesAdded?: () => void
}

export function AddNotesDialog({ incidentId, onNotesAdded }: AddNotesDialogProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  // Example notes for demonstration
  const existingNotes = [
    {
      id: "note-1",
      author: {
        name: "John Smith",
        role: "Designated Safeguarding Lead",
      },
      content:
        "Initial assessment completed. Student appears distressed but willing to talk. Will schedule follow-up meeting tomorrow.",
      timestamp: new Date("2024-03-22T14:30:00"),
      isPrivate: true,
    },
    {
      id: "note-2",
      author: {
        name: "Sarah Johnson",
        role: "Head Teacher",
      },
      content:
        "Parents have been contacted and informed of the situation. They will be coming in for a meeting on Friday.",
      timestamp: new Date("2024-03-23T09:15:00"),
      isPrivate: false,
    },
  ]

  const handleSubmit = () => {
    // In a real app, this would save the notes to the database
    console.log("Adding notes:", { incidentId, notes, isPrivate })

    // Close the dialog and reset form
    setOpen(false)
    setNotes("")
    setIsPrivate(false)

    // Notify parent component
    if (onNotesAdded) {
      onNotesAdded()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Notes</DialogTitle>
          <DialogDescription>Add additional notes or observations to this incident record.</DialogDescription>
        </DialogHeader>

        {/* Existing notes */}
        <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 space-y-3">
          {existingNotes.map((note) => (
            <div key={note.id} className="p-3 bg-muted/50 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {getInitials(note.author.name.split(" ")[0], note.author.name.split(" ")[1])}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{note.author.name}</p>
                    <p className="text-xs text-muted-foreground">{note.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</span>
                  {note.isPrivate && (
                    <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">Private</span>
                  )}
                </div>
              </div>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
            <Label htmlFor="private">Mark as private (only visible to safeguarding team)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={!notes.trim()}>
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

