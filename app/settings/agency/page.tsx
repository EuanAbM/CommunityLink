"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, UserPlus, Users, Phone, Mail, MapPin, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { Agency, AgencyContact } from "@/lib/types"

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: "1",
      name: "MASH (Multi-Agency Safeguarding Hub)",
      address: "County Hall, St Anne's Crescent, Lewes, East Sussex, BN7 1UE",
      phone: "01273 470101",
      email: "mash@example.gov.uk",
      details:
        "The Multi-Agency Safeguarding Hub (MASH) brings key professionals together to facilitate early, better quality information sharing, analysis and decision-making.",
      contacts: [
        {
          id: "1-1",
          name: "Sarah Johnson",
          phone: "01273 470102",
          email: "sarah.johnson@example.gov.uk",
          role: "Safeguarding Lead",
        },
        {
          id: "1-2",
          name: "Michael Chen",
          phone: "01273 470103",
          email: "michael.chen@example.gov.uk",
          role: "Case Manager",
        },
      ],
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-06-22"),
    },
    {
      id: "2",
      name: "Prevent",
      address: "Home Office, 2 Marsham Street, London, SW1P 4DF",
      phone: "020 7035 4848",
      email: "prevent@example.gov.uk",
      details:
        "Prevent is part of the UK's counter-terrorism strategy, preventing people from becoming involved in terrorism or supporting terrorism.",
      contacts: [
        {
          id: "2-1",
          name: "David Williams",
          phone: "020 7035 4849",
          email: "david.williams@example.gov.uk",
          role: "Regional Coordinator",
        },
      ],
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-05-18"),
    },
    {
      id: "3",
      name: "Children's Social Care",
      address: "County Hall North, Chart Way, Horsham, West Sussex, RH12 1XH",
      phone: "01403 229900",
      email: "childrens.socialcare@example.gov.uk",
      details: "Children's Social Care provides support to children and families in need of assistance.",
      contacts: [
        {
          id: "3-1",
          name: "Emma Thompson",
          phone: "01403 229901",
          email: "emma.thompson@example.gov.uk",
          role: "Team Manager",
        },
        {
          id: "3-2",
          name: "James Wilson",
          phone: "01403 229902",
          email: "james.wilson@example.gov.uk",
          role: "Social Worker",
        },
        {
          id: "3-3",
          name: "Olivia Martinez",
          phone: "01403 229903",
          email: "olivia.martinez@example.gov.uk",
          role: "Family Support Worker",
        },
      ],
      createdAt: new Date("2023-03-05"),
      updatedAt: new Date("2023-07-12"),
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false)
  const [isEditAgencyOpen, setIsEditAgencyOpen] = useState(false)
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<AgencyContact | null>(null)
  const [isEditContactOpen, setIsEditContactOpen] = useState(false)

  // New agency form state
  const [newAgency, setNewAgency] = useState<Partial<Agency>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    details: "",
    contacts: [],
  })

  // New contact form state
  const [newContact, setNewContact] = useState<Partial<AgencyContact>>({
    name: "",
    phone: "",
    email: "",
    role: "",
  })

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contacts.some(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const handleAddAgency = () => {
    const agency: Agency = {
      id: Date.now().toString(),
      name: newAgency.name || "Unnamed Agency",
      address: newAgency.address,
      phone: newAgency.phone,
      email: newAgency.email,
      details: newAgency.details,
      contacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setAgencies([...agencies, agency])
    setNewAgency({
      name: "",
      address: "",
      phone: "",
      email: "",
      details: "",
      contacts: [],
    })
    setIsAddAgencyOpen(false)
  }

  const handleEditAgency = () => {
    if (!selectedAgency) return

    const updatedAgencies = agencies.map((agency) =>
      agency.id === selectedAgency.id
        ? {
            ...selectedAgency,
            updatedAt: new Date(),
          }
        : agency,
    )

    setAgencies(updatedAgencies)
    setIsEditAgencyOpen(false)
  }

  const handleDeleteAgency = (id: string) => {
    setAgencies(agencies.filter((agency) => agency.id !== id))
  }

  const handleAddContact = () => {
    if (!selectedAgency) return

    const contact: AgencyContact = {
      id: `${selectedAgency.id}-${Date.now()}`,
      name: newContact.name || "Unnamed Contact",
      phone: newContact.phone,
      email: newContact.email,
      role: newContact.role,
    }

    const updatedAgency = {
      ...selectedAgency,
      contacts: [...selectedAgency.contacts, contact],
      updatedAt: new Date(),
    }

    const updatedAgencies = agencies.map((agency) => (agency.id === selectedAgency.id ? updatedAgency : agency))

    setAgencies(updatedAgencies)
    setSelectedAgency(updatedAgency)
    setNewContact({
      name: "",
      phone: "",
      email: "",
      role: "",
    })
    setIsAddContactOpen(false)
  }

  const handleEditContact = () => {
    if (!selectedAgency || !selectedContact) return

    const updatedContacts = selectedAgency.contacts.map((contact) =>
      contact.id === selectedContact.id ? selectedContact : contact,
    )

    const updatedAgency = {
      ...selectedAgency,
      contacts: updatedContacts,
      updatedAt: new Date(),
    }

    const updatedAgencies = agencies.map((agency) => (agency.id === selectedAgency.id ? updatedAgency : agency))

    setAgencies(updatedAgencies)
    setSelectedAgency(updatedAgency)
    setIsEditContactOpen(false)
  }

  const handleDeleteContact = (contactId: string) => {
    if (!selectedAgency) return

    const updatedAgency = {
      ...selectedAgency,
      contacts: selectedAgency.contacts.filter((contact) => contact.id !== contactId),
      updatedAt: new Date(),
    }

    const updatedAgencies = agencies.map((agency) => (agency.id === selectedAgency.id ? updatedAgency : agency))

    setAgencies(updatedAgencies)
    setSelectedAgency(updatedAgency)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">3rd Party Agencies</h1>
          <p className="text-muted-foreground mt-1">
            Manage external agencies and their key contacts for safeguarding coordination
          </p>
        </div>
        <Dialog open={isAddAgencyOpen} onOpenChange={setIsAddAgencyOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agency
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Agency</DialogTitle>
              <DialogDescription>
                Enter the details of the external agency. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="agency-name">Agency Name *</Label>
                <Input
                  id="agency-name"
                  value={newAgency.name}
                  onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                  placeholder="e.g. MASH, Prevent, Children's Social Care"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="agency-address">Address</Label>
                <Textarea
                  id="agency-address"
                  value={newAgency.address}
                  onChange={(e) => setNewAgency({ ...newAgency, address: e.target.value })}
                  placeholder="Full address including postcode"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="agency-phone">Phone Number</Label>
                  <Input
                    id="agency-phone"
                    value={newAgency.phone}
                    onChange={(e) => setNewAgency({ ...newAgency, phone: e.target.value })}
                    placeholder="Main contact number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-email">Email</Label>
                  <Input
                    id="agency-email"
                    type="email"
                    value={newAgency.email}
                    onChange={(e) => setNewAgency({ ...newAgency, email: e.target.value })}
                    placeholder="Main contact email"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="agency-details">Details</Label>
                <Textarea
                  id="agency-details"
                  value={newAgency.details}
                  onChange={(e) => setNewAgency({ ...newAgency, details: e.target.value })}
                  placeholder="Description of the agency's role and services"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAgencyOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAgency}>Save Agency</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search agencies or contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-start">
                <span className="truncate">{agency.name}</span>
                <div className="flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedAgency(agency)
                          setIsEditAgencyOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Edit Agency</DialogTitle>
                        <DialogDescription>Update the details of this external agency.</DialogDescription>
                      </DialogHeader>
                      {selectedAgency && (
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-agency-name">Agency Name *</Label>
                            <Input
                              id="edit-agency-name"
                              value={selectedAgency.name}
                              onChange={(e) => setSelectedAgency({ ...selectedAgency, name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-agency-address">Address</Label>
                            <Textarea
                              id="edit-agency-address"
                              value={selectedAgency.address}
                              onChange={(e) => setSelectedAgency({ ...selectedAgency, address: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-agency-phone">Phone Number</Label>
                              <Input
                                id="edit-agency-phone"
                                value={selectedAgency.phone}
                                onChange={(e) => setSelectedAgency({ ...selectedAgency, phone: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-agency-email">Email</Label>
                              <Input
                                id="edit-agency-email"
                                type="email"
                                value={selectedAgency.email}
                                onChange={(e) => setSelectedAgency({ ...selectedAgency, email: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-agency-details">Details</Label>
                            <Textarea
                              id="edit-agency-details"
                              value={selectedAgency.details}
                              onChange={(e) => setSelectedAgency({ ...selectedAgency, details: e.target.value })}
                              rows={4}
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditAgencyOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditAgency}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => handleDeleteAgency(agency.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="line-clamp-2">{agency.details || "No description provided"}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                {agency.address && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span className="flex-1">{agency.address}</span>
                  </div>
                )}
                {agency.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{agency.phone}</span>
                  </div>
                )}
                {agency.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{agency.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-2">
              <div className="flex justify-between items-center w-full mb-2">
                <h4 className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Key Contacts ({agency.contacts.length})
                </h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      onClick={() => {
                        setSelectedAgency(agency)
                        setIsAddContactOpen(true)
                      }}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                      <DialogDescription>Add a key contact person for {selectedAgency?.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="contact-name">Name *</Label>
                        <Input
                          id="contact-name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact-role">Role</Label>
                        <Input
                          id="contact-role"
                          value={newContact.role}
                          onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                          placeholder="e.g. Safeguarding Lead, Case Manager"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact-phone">Phone Number</Label>
                        <Input
                          id="contact-phone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          placeholder="Direct contact number"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          placeholder="Direct email address"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddContact}>Add Contact</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {agency.contacts.length > 0 ? (
                <div className="w-full space-y-2">
                  {agency.contacts.map((contact) => (
                    <div key={contact.id} className="text-sm p-2 rounded-md border bg-muted/40">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{contact.name}</span>
                        <div className="flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  setSelectedAgency(agency)
                                  setSelectedContact(contact)
                                  setIsEditContactOpen(true)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Contact</DialogTitle>
                                <DialogDescription>Update the details for this contact.</DialogDescription>
                              </DialogHeader>
                              {selectedContact && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-contact-name">Name *</Label>
                                    <Input
                                      id="edit-contact-name"
                                      value={selectedContact.name}
                                      onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-contact-role">Role</Label>
                                    <Input
                                      id="edit-contact-role"
                                      value={selectedContact.role}
                                      onChange={(e) => setSelectedContact({ ...selectedContact, role: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-contact-phone">Phone Number</Label>
                                    <Input
                                      id="edit-contact-phone"
                                      value={selectedContact.phone}
                                      onChange={(e) =>
                                        setSelectedContact({ ...selectedContact, phone: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-contact-email">Email</Label>
                                    <Input
                                      id="edit-contact-email"
                                      type="email"
                                      value={selectedContact.email}
                                      onChange={(e) =>
                                        setSelectedContact({ ...selectedContact, email: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditContactOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditContact}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      {contact.role && <div className="text-xs text-muted-foreground mb-1">{contact.role}</div>}
                      <div className="space-y-1">
                        {contact.phone && (
                          <div className="flex items-center text-xs">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center text-xs">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full text-center py-2 text-sm text-muted-foreground">No contacts added yet</div>
              )}
            </CardFooter>
          </Card>
        ))}

        {filteredAgencies.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No agencies found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Add your first external agency to get started"}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setIsAddAgencyOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Agency
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

