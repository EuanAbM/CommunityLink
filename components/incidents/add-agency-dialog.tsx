"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddAgencyDialogProps {
  trigger: React.ReactNode
}

export function AddAgencyDialog({ trigger }: AddAgencyDialogProps) {
  const [agencyName, setAgencyName] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactRole, setContactRole] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [agencyDetails, setAgencyDetails] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ agencyName, contactName, contactRole, contactPhone, agencyDetails })
    // Reset form and close dialog
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Agency Involvement</DialogTitle>
          <DialogDescription>Record external agency involvement in this incident</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agency-type">Agency Type</Label>
              <Select>
                <SelectTrigger id="agency-type">
                  <SelectValue placeholder="Select agency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social-services">Social Services</SelectItem>
                  <SelectItem value="police">Police</SelectItem>
                  <SelectItem value="health">Health Services</SelectItem>
                  <SelectItem value="camhs">CAMHS</SelectItem>
                  <SelectItem value="early-help">Early Help</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-name">Agency Name</Label>
              <Input
                id="agency-name"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g., Local Authority Children's Services"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-details">Details of Involvement</Label>
              <Textarea
                id="agency-details"
                value={agencyDetails}
                onChange={(e) => setAgencyDetails(e.target.value)}
                placeholder="Describe the nature of the agency's involvement"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Agency Contact</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-xs">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-role" className="text-xs">
                    Role
                  </Label>
                  <Input
                    id="contact-role"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="Contact role"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <Label htmlFor="contact-phone" className="text-xs">
                  Phone
                </Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Contact phone number"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Agency</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

