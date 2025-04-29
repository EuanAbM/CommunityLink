"use client"

import { useState } from "react"
import { PlusCircle, X, Grip, Save, Eye, Code, Settings, ChevronRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Template types for the predefined templates
type TemplateType = "forgotten-password" | "invite-user" | "assigned-incident" | "action-required" | "custom"

// Email template interface
interface EmailTemplate {
  id: string
  name: string
  subject: string
  from: string
  to: string
  cc: string
  bcc: string
  type: TemplateType
  content: string
  tags: string[]
}

// Sample templates data
const sampleTemplates: EmailTemplate[] = [
  {
    id: "forgotten-password",
    name: "Forgotten Password",
    subject: "Reset your password",
    from: "no-reply@communitylink.org",
    to: "{{user.email}}",
    cc: "",
    bcc: "",
    type: "forgotten-password",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: white;">
        <h2>Password Reset</h2>
    </div>
    <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello {{user.firstName}},</p>
        <p>We received a request to reset your password. Click the button below to reset it.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetLink}}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Regards,<br>CommunityLink Team</p>
    </div>
    <div style="font-size: 12px; color: #6b7280; padding: 10px; text-align: center;">
        <p>© {{currentYear}} CommunityLink. All rights reserved.</p>
    </div>
</div>`,
    tags: ["user.firstName", "user.email", "resetLink", "currentYear"],
  },
  {
    id: "invite-user",
    name: "Invite User",
    subject: "Welcome to CommunityLink",
    from: "invites@communitylink.org",
    to: "{{user.email}}",
    cc: "",
    bcc: "{{admin.email}}",
    type: "invite-user",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: white;">
        <h2>Welcome to CommunityLink</h2>
    </div>
    <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello {{user.firstName}},</p>
        <p>You have been invited to join CommunityLink for {{school.name}}.</p>
        <p>CommunityLink is a safeguarding and incident management platform that helps schools keep their students safe.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{inviteLink}}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Accept Invitation</a>
        </div>
        <p>This invitation will expire in 7 days.</p>
        <p>If you have any questions, please contact your administrator.</p>
        <p>Regards,<br>CommunityLink Team</p>
    </div>
    <div style="font-size: 12px; color: #6b7280; padding: 10px; text-align: center;">
        <p>© {{currentYear}} CommunityLink. All rights reserved.</p>
    </div>
</div>`,
    tags: ["user.firstName", "user.email", "school.name", "inviteLink", "admin.email", "currentYear"],
  },
  {
    id: "assigned-incident",
    name: "Assigned Incident Report",
    subject: "Incident Report Assigned: {{incident.id}}",
    from: "notifications@communitylink.org",
    to: "{{assignee.email}}",
    cc: "{{reporter.email}}",
    bcc: "",
    type: "assigned-incident",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: white;">
        <h2>Incident Report Assigned</h2>
    </div>
    <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello {{assignee.firstName}},</p>
        <p>An incident report has been assigned to you.</p>
        <div style="background-color: #e5e7eb; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Incident ID:</strong> {{incident.id}}</p>
            <p><strong>Student:</strong> {{student.firstName}} {{student.lastName}}</p>
            <p><strong>Reported by:</strong> {{reporter.firstName}} {{reporter.lastName}}</p>
            <p><strong>Date:</strong> {{incident.date}}</p>
            <p><strong>Category:</strong> {{incident.category}}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{incidentLink}}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Incident</a>
        </div>
        <p>Please review and take appropriate action.</p>
        <p>Regards,<br>CommunityLink Team</p>
    </div>
    <div style="font-size: 12px; color: #6b7280; padding: 10px; text-align: center;">
        <p>© {{currentYear}} CommunityLink. All rights reserved.</p>
        <p>This email contains confidential information. Please do not forward.</p>
    </div>
</div>`,
    tags: [
      "assignee.firstName",
      "assignee.email",
      "reporter.firstName",
      "reporter.lastName",
      "reporter.email",
      "incident.id",
      "incident.date",
      "incident.category",
      "student.firstName",
      "student.lastName",
      "incidentLink",
      "currentYear",
    ],
  },
  {
    id: "action-required",
    name: "Action Required",
    subject: "Action Required: {{action.title}}",
    from: "alerts@communitylink.org",
    to: "{{assignee.email}}",
    cc: "",
    bcc: "{{supervisor.email}}",
    type: "action-required",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #ef4444; padding: 20px; text-align: center; color: white;">
        <h2>Action Required</h2>
    </div>
    <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello {{assignee.firstName}},</p>
        <p>This is a reminder that action is required from you regarding:</p>
        <div style="background-color: #fee2e2; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p><strong>{{action.title}}</strong></p>
            <p>{{action.description}}</p>
            <p><strong>Due by:</strong> {{action.dueDate}}</p>
            <p><strong>Student:</strong> {{student.firstName}} {{student.lastName}}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{actionLink}}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Complete Action</a>
        </div>
        <p>Please complete this action as soon as possible.</p>
        <p>Regards,<br>CommunityLink Team</p>
    </div>
    <div style="font-size: 12px; color: #6b7280; padding: 10px; text-align: center;">
        <p>© {{currentYear}} CommunityLink. All rights reserved.</p>
        <p>This email contains confidential information. Please do not forward.</p>
    </div>
</div>`,
    tags: [
      "assignee.firstName",
      "assignee.email",
      "supervisor.email",
      "action.title",
      "action.description",
      "action.dueDate",
      "student.firstName",
      "student.lastName",
      "actionLink",
      "currentYear",
    ],
  },
]

// Define available template tags
const availableTags = [
  { category: "User", tags: ["user.firstName", "user.lastName", "user.email", "user.role"] },
  { category: "Student", tags: ["student.firstName", "student.lastName", "student.id", "student.yearGroup"] },
  { category: "School", tags: ["school.name", "school.address", "school.phone", "school.email"] },
  {
    category: "Incident",
    tags: ["incident.id", "incident.date", "incident.category", "incident.description", "incidentLink"],
  },
  { category: "Action", tags: ["action.title", "action.description", "action.dueDate", "actionLink"] },
  { category: "System", tags: ["currentDate", "currentYear", "resetLink", "inviteLink"] },
  {
    category: "Staff",
    tags: [
      "assignee.firstName",
      "assignee.lastName",
      "assignee.email",
      "reporter.firstName",
      "reporter.lastName",
      "reporter.email",
    ],
  },
]

export default function EmailSettingsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(sampleTemplates)
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0].id)
  const [editMode, setEditMode] = useState<"visual" | "code">("visual")
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(availableTags.map((cat) => [cat.category, false])),
  )
  const [tagSearch, setTagSearch] = useState("")

  // Filter tags based on search term
  const filteredTags =
    tagSearch.trim() === ""
      ? availableTags
      : availableTags
          .map((category) => ({
            category: category.category,
            tags: category.tags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase())),
          }))
          .filter((category) => category.tags.length > 0)
  const [showTestEmailDialog, setShowTestEmailDialog] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState("")

  // Find the active template
  const activeTemplate = templates.find((t) => t.id === activeTemplateId) || templates[0]

  // Handle template save
  const saveTemplate = (updatedTemplate: EmailTemplate) => {
    setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
  }

  // Handle new template creation
  const createNewTemplate = () => {
    if (newTemplateName.trim() === "") return

    const newTemplate: EmailTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      subject: "New Template",
      from: "notifications@communitylink.org",
      to: "",
      cc: "",
      bcc: "",
      type: "custom",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: white;">
            <h2>Email Template</h2>
        </div>
        <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
            <p>Hello,</p>
            <p>This is a new email template.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Click Here</a>
            </div>
            <p>Regards,<br>CommunityLink Team</p>
        </div>
        <div style="font-size: 12px; color: #6b7280; padding: 10px; text-align: center;">
            <p>© {{currentYear}} CommunityLink. All rights reserved.</p>
        </div>
    </div>`,
      tags: ["currentYear"],
    }

    setTemplates([...templates, newTemplate])
    setActiveTemplateId(newTemplate.id)
    setShowNewTemplateForm(false)
    setNewTemplateName("")
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    })
  }

  const sendTestEmail = () => {
    // This would connect to your email sending service
    console.log(`Sending test email to ${testEmailAddress} using template ${activeTemplate.name}`)
    // Show success message or handle errors
    setShowTestEmailDialog(false)
    // Reset test email address
    setTestEmailAddress("")
  }

  // Create an editable component for the email template editor
  const EmailEditor = ({
    template,
    onSave,
  }: { template: EmailTemplate; onSave: (template: EmailTemplate) => void }) => {
    const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>({ ...template })

    const handleContentChange = (content: string) => {
      setEditedTemplate({ ...editedTemplate, content })
    }

    const handleFieldChange = (field: keyof EmailTemplate, value: string) => {
      setEditedTemplate({ ...editedTemplate, [field]: value })
    }

    const handleSave = () => {
      onSave(editedTemplate)
    }

    const insertTag = (tag: string) => {
      if (editMode === "visual") {
        // For visual mode, we'd insert at cursor position, but for simplicity, append to content
        const tagText = `{{${tag}}}`
        handleContentChange(editedTemplate.content + tagText)
      } else {
        // For code mode, append the tag
        const tagText = `{{${tag}}}`
        handleContentChange(editedTemplate.content + tagText)
      }
    }

    return (
      <div className="flex flex-col gap-4">
        {/* Template header with save button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{editedTemplate.name}</h2>
          <div className="flex gap-2">
            <Dialog open={showTestEmailDialog} onOpenChange={setShowTestEmailDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Test Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Email</DialogTitle>
                  <DialogDescription>
                    Send a test email using the current template to verify its appearance.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label className="text-sm font-medium mb-2 block">Recipient Email</label>
                  <Input
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTestEmailDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={sendTestEmail} disabled={!testEmailAddress}>
                    Send Test
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Template
            </Button>
          </div>
        </div>

        {/* Email metadata fields */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Subject</label>
                <div className="relative">
                  <Input
                    value={editedTemplate.subject}
                    onChange={(e) => handleFieldChange("subject", e.target.value)}
                    placeholder="Email subject"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      onValueChange={(value) => handleFieldChange("subject", editedTemplate.subject + `{{${value}}}`)}
                      value=""
                    >
                      <SelectTrigger className="h-7 w-auto border-none bg-transparent">
                        <span className="text-xs text-muted-foreground">+ Add Tag</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((category) => (
                          <SelectGroup key={category.category}>
                            <SelectLabel>{category.category}</SelectLabel>
                            {category.tags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">From</label>
                <div className="relative">
                  <Input
                    value={editedTemplate.from}
                    onChange={(e) => handleFieldChange("from", e.target.value)}
                    placeholder="Sender email"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      onValueChange={(value) => handleFieldChange("from", editedTemplate.from + `{{${value}}}`)}
                      value=""
                    >
                      <SelectTrigger className="h-7 w-auto border-none bg-transparent">
                        <span className="text-xs text-muted-foreground">+ Add Tag</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((category) => (
                          <SelectGroup key={category.category}>
                            <SelectLabel>{category.category}</SelectLabel>
                            {category.tags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">To</label>
                <div className="relative">
                  <Input
                    value={editedTemplate.to}
                    onChange={(e) => handleFieldChange("to", e.target.value)}
                    placeholder="Recipient email or tag"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      onValueChange={(value) => handleFieldChange("to", editedTemplate.to + `{{${value}}}`)}
                      value=""
                    >
                      <SelectTrigger className="h-7 w-auto border-none bg-transparent">
                        <span className="text-xs text-muted-foreground">+ Add Tag</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((category) => (
                          <SelectGroup key={category.category}>
                            <SelectLabel>{category.category}</SelectLabel>
                            {category.tags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">CC</label>
                <div className="relative">
                  <Input
                    value={editedTemplate.cc}
                    onChange={(e) => handleFieldChange("cc", e.target.value)}
                    placeholder="CC recipients (optional)"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      onValueChange={(value) => handleFieldChange("cc", editedTemplate.cc + `{{${value}}}`)}
                      value=""
                    >
                      <SelectTrigger className="h-7 w-auto border-none bg-transparent">
                        <span className="text-xs text-muted-foreground">+ Add Tag</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((category) => (
                          <SelectGroup key={category.category}>
                            <SelectLabel>{category.category}</SelectLabel>
                            {category.tags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">BCC</label>
                <div className="relative">
                  <Input
                    value={editedTemplate.bcc}
                    onChange={(e) => handleFieldChange("bcc", e.target.value)}
                    placeholder="BCC recipients (optional)"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select
                      onValueChange={(value) => handleFieldChange("bcc", editedTemplate.bcc + `{{${value}}}`)}
                      value=""
                    >
                      <SelectTrigger className="h-7 w-auto border-none bg-transparent">
                        <span className="text-xs text-muted-foreground">+ Add Tag</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((category) => (
                          <SelectGroup key={category.category}>
                            <SelectLabel>{category.category}</SelectLabel>
                            {category.tags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor tabs */}
        <div className="flex items-center justify-between border-b">
          <div className="flex gap-4">
            <button
              className={`py-2 px-1 -mb-px font-medium text-sm flex items-center gap-2 ${editMode === "visual" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setEditMode("visual")}
            >
              <Eye className="w-4 h-4" />
              Visual Editor
            </button>
            <button
              className={`py-2 px-1 -mb-px font-medium text-sm flex items-center gap-2 ${editMode === "code" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setEditMode("code")}
            >
              <Code className="w-4 h-4" />
              HTML Editor
            </button>
          </div>
        </div>

        {/* Main editor area */}
        <div className="grid grid-cols-4 gap-4">
          {/* Template tags sidebar */}
          <div className="col-span-1 border rounded-lg p-4">
            <h3 className="font-medium mb-4">Template Tags</h3>

            {/* Search input */}
            <div className="mb-4">
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="text-sm"
              />
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Drag or click these tags to insert them into your template.
            </p>

            <div className="space-y-2">
              {filteredTags.map((category) => (
                <div key={category.category} className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-2 flex items-center justify-between bg-muted/50 hover:bg-muted text-sm font-medium"
                    onClick={() => toggleCategory(category.category)}
                  >
                    {category.category}
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">{category.tags.length}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${expandedCategories[category.category] ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>

                  {expandedCategories[category.category] && (
                    <div className="p-2 bg-background">
                      <div className="flex flex-wrap gap-2">
                        {category.tags.map((tag) => (
                          <div
                            key={tag}
                            className="text-xs px-2 py-1 bg-muted rounded-md flex items-center gap-1 cursor-pointer hover:bg-muted/80 group"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", `{{${tag}}}`)
                            }}
                            onClick={() => insertTag(tag)}
                          >
                            <Grip className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredTags.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No tags found matching "{tagSearch}"
                </div>
              )}
            </div>
          </div>

          {/* Email content editor */}
          <div className="col-span-3 border rounded-lg">
            {editMode === "visual" ? (
              <div className="p-4 h-[500px] overflow-auto">
                <div
                  className="min-h-full outline-none"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: editedTemplate.content }}
                  onBlur={(e) => handleContentChange(e.currentTarget.innerHTML)}
                  onDrop={(e) => {
                    e.preventDefault()
                    const data = e.dataTransfer.getData("text/plain")
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0)
                      range.deleteContents()
                      range.insertNode(document.createTextNode(data))
                      handleContentChange(e.currentTarget.innerHTML)
                    } else {
                      // If no selection, append to the end
                      e.currentTarget.innerHTML += data
                      handleContentChange(e.currentTarget.innerHTML)
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                />
              </div>
            ) : (
              <textarea
                className="p-4 font-mono text-sm w-full h-[500px] outline-none"
                value={editedTemplate.content}
                onChange={(e) => handleContentChange(e.target.value)}
                onDrop={(e) => {
                  e.preventDefault()
                  const data = e.dataTransfer.getData("text/plain")
                  const target = e.target as HTMLTextAreaElement
                  const start = target.selectionStart
                  const end = target.selectionEnd
                  const before = target.value.substring(0, start)
                  const after = target.value.substring(end, target.value.length)
                  const newContent = before + data + after
                  handleContentChange(newContent)
                  // Set cursor position after the inserted text
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + data.length
                  }, 0)
                }}
                onDragOver={(e) => e.preventDefault()}
              />
            )}
          </div>
        </div>

        {/* Preview section */}
        <Card className="mt-4">
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border p-4 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: editedTemplate.content }} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Email Templates</h1>
          <p className="text-muted-foreground">
            Design and manage email templates for notifications and workflow actions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Template selector sidebar */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-sm">Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowNewTemplateForm(!showNewTemplateForm)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* New template form */}
              {showNewTemplateForm && (
                <div className="px-4 py-2 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="New template name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={createNewTemplate}>
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowNewTemplateForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Templates can be configured within Workflow settings
                  </p>
                </div>
              )}

              {/* Template list */}
              <div className="max-h-[400px] overflow-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border-b last:border-0 cursor-pointer ${activeTemplateId === template.id ? "bg-muted" : "hover:bg-muted/50"}`}
                    onClick={() => setActiveTemplateId(template.id)}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{template.subject}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template settings */}
          <Card className="mt-4">
            <CardHeader className="py-3 px-4">
              <h2 className="font-medium text-sm">Settings</h2>
            </CardHeader>
            <CardContent className="px-4 py-2 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Template Type</label>
                <Select disabled defaultValue={activeTemplate.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forgotten-password">Forgotten Password</SelectItem>
                    <SelectItem value="invite-user">Invite User</SelectItem>
                    <SelectItem value="assigned-incident">Assigned Incident</SelectItem>
                    <SelectItem value="action-required">Action Required</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template editor main area */}
        <div className="col-span-3">
          <EmailEditor template={activeTemplate} onSave={saveTemplate} />

          <div className="mt-6 text-sm text-muted-foreground flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Advanced template settings can be configured within the <span className="font-medium mx-1">Workflow</span>{" "}
            section.
          </div>
        </div>
      </div>
    </div>
  )
}

