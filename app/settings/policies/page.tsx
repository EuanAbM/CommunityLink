"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Upload, StickyNote, Info } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface Policy {
  id: number
  name: string
  url: string
  expiryDate?: string
  hasExpiryDate?: boolean
  notes?: string
  lastReviewDate?: string
  internalReviewBy?: string
}

const reviewerOptions = [
  "Alice Smith",
  "John Doe",
  "Karen Blake",
  "Samuel O'Neill",
  "Rebecca White"
]

export default function PoliciesSettingsPage() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 1,
      name: "Child Protection Policy.pdf",
      url: "/files/child-protection-policy.pdf",
      expiryDate: "2026-01-01",
      hasExpiryDate: true,
      lastReviewDate: "2024-01-01",
      internalReviewBy: "Alice Smith",
      notes: "Reviewed Jan 2024. Next update due in 2 years.",
    },
    {
      id: 2,
      name: "Staff Conduct Guidelines.pdf",
      url: "/files/staff-conduct-guidelines.pdf",
      hasExpiryDate: false,
    },
  ])

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null)

  const [tempNote, setTempNote] = useState("")
  const [showNoteDialog, setShowNoteDialog] = useState(false)

  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [tempLastReviewDate, setTempLastReviewDate] = useState("")
  const [tempInternalReviewBy, setTempInternalReviewBy] = useState("")
  const [tempExpiryDate, setTempExpiryDate] = useState("")
  const [tempHasExpiry, setTempHasExpiry] = useState(true)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      const newPolicy: Policy = {
        id: Date.now(),
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        hasExpiryDate: true,
      }
      setPolicies([...policies, newPolicy])
      setSelectedFile(null)
    }
  }

  const handleDelete = (id: number) => {
    setPolicies(policies.filter(policy => policy.id !== id))
  }

  const handleExpiryChange = (id: number, date: string) => {
    setPolicies(policies.map(policy =>
      policy.id === id ? { ...policy, expiryDate: date } : policy
    ))
  }

  const openNoteDialog = (policy: Policy) => {
    setSelectedPolicyId(policy.id)
    setTempNote(policy.notes || "")
    setShowNoteDialog(true)
  }

  const saveNote = () => {
    if (selectedPolicyId !== null) {
      setPolicies(policies.map(policy =>
        policy.id === selectedPolicyId ? { ...policy, notes: tempNote } : policy
      ))
      setShowNoteDialog(false)
    }
  }

  const openDetailsDialog = (policy: Policy) => {
    setSelectedPolicyId(policy.id)
    setTempLastReviewDate(policy.lastReviewDate || "")
    setTempInternalReviewBy(policy.internalReviewBy || "")
    setTempExpiryDate(policy.expiryDate || "")
    setTempHasExpiry(policy.hasExpiryDate ?? true)
    setShowDetailsDialog(true)
  }

  const saveDetails = () => {
    if (selectedPolicyId !== null) {
      setPolicies(policies.map(policy =>
        policy.id === selectedPolicyId
          ? {
              ...policy,
              lastReviewDate: tempLastReviewDate,
              internalReviewBy: tempInternalReviewBy,
              expiryDate: tempHasExpiry ? tempExpiryDate : undefined,
              hasExpiryDate: tempHasExpiry,
            }
          : policy
      ))
      setShowDetailsDialog(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Safeguarding Policies</h1>
        <p className="text-muted-foreground">Manage safeguarding policies and procedures</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Policy</CardTitle>
          <CardDescription>Add a new PDF policy document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="policyUpload">Policy File (PDF)</Label>
              <Input
                id="policyUpload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Policies</CardTitle>
          <CardDescription>View, manage and set expiry dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {policies.map(policy => (
            <div
              key={policy.id}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 border rounded-md gap-3"
            >
              <div className="flex-1">
                <a
                  href={policy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline block"
                >
                  {policy.name}
                </a>

                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                  {policy.lastReviewDate && (
                    <div>
                      <strong>Last Reviewed:</strong>{" "}
                      {format(new Date(policy.lastReviewDate), "dd/MM/yyyy")}
                    </div>
                  )}
                  {policy.hasExpiryDate && policy.expiryDate && (
                    <div>
                      <strong>Expires:</strong>{" "}
                      {format(new Date(policy.expiryDate), "dd/MM/yyyy")}
                    </div>
                  )}
                  {policy.internalReviewBy && (
                    <div>
                      <strong>Internal Review By:</strong> {policy.internalReviewBy}
                    </div>
                  )}
                </div>

                {policy.notes && (
                  <div className="mt-2 text-sm text-muted-foreground bg-muted rounded-md p-2 whitespace-pre-wrap">
                    <strong className="block mb-1 text-xs text-muted">Notes:</strong>
                    {policy.notes}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:items-end sm:justify-between">
                {policy.hasExpiryDate && (
                  <Input
                    type="date"
                    value={policy.expiryDate || ""}
                    onChange={e => handleExpiryChange(policy.id, e.target.value)}
                    className="w-44"
                  />
                )}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => openNoteDialog(policy)}
                  >
                    <StickyNote className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDetailsDialog(policy)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(policy.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Policy Notes</DialogTitle>
            <DialogDescription>Add or update notes for this policy document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="policy-note">Notes</Label>
              <Textarea
                id="policy-note"
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveNote}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Policy Details</DialogTitle>
            <DialogDescription>Manage review information and metadata for this policy.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="last-review-date">Last Review Date</Label>
              <Input
                type="date"
                id="last-review-date"
                value={tempLastReviewDate}
                onChange={(e) => setTempLastReviewDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-expiry"
                  checked={tempHasExpiry}
                  onCheckedChange={setTempHasExpiry}
                />
                <Label htmlFor="has-expiry">This document has an expiry date</Label>
              </div>
              <Input
                type="date"
                id="expires-date"
                value={tempExpiryDate}
                disabled={!tempHasExpiry}
                onChange={(e) => setTempExpiryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Internal Review By</Label>
              <Select
                value={tempInternalReviewBy}
                onValueChange={setTempInternalReviewBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer..." />
                </SelectTrigger>
                <SelectContent>
                  {reviewerOptions.map((reviewer) => (
                    <SelectItem key={reviewer} value={reviewer}>
                      {reviewer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveDetails}>Save Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
