"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { MoreVertical, Trash, GitMerge, History, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface IncidentActionsMenuProps {
  incidentId: string
}

export function IncidentActionsMenu({ incidentId }: IncidentActionsMenuProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)

  const handleDelete = () => {
    // In a real app, this would delete the incident from the database
    console.log("Deleting incident:", incidentId)
    setDeleteDialogOpen(false)
    // Navigate back to incidents list
    router.push("/incidents")
  }

  const handleMerge = () => {
    // In a real app, this would merge the incidents
    console.log("Merging incident:", incidentId)
    setMergeDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Incident Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/incidents/${incidentId}/edit`)}>
            <FileText className="mr-2 h-4 w-4" />
            Edit Incident
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/incidents/${incidentId}/audit`)}>
            <History className="mr-2 h-4 w-4" />
            View Audit Log
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMergeDialogOpen(true)}>
            <GitMerge className="mr-2 h-4 w-4" />
            Merge with Another Incident
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete Incident
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Incident</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this incident? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Incidents</DialogTitle>
            <DialogDescription>
              Select another incident to merge with this one. All information will be combined into a single record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Merging is useful when multiple incidents are related or duplicates of the same event.
            </p>
            {/* In a real app, this would be a searchable list of incidents */}
            <div className="border rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">Search functionality would be implemented here</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMerge} disabled={true}>
              Merge Incidents
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

