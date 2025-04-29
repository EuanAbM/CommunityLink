"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Info, ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CategoriesSettingsPage() {
  const [activeTab, setActiveTab] = useState("student")
  const [showAddStudentCategory, setShowAddStudentCategory] = useState(false)
  const [showAddIncidentCategory, setShowAddIncidentCategory] = useState(false)
  const [showAddSubcategory, setShowAddSubcategory] = useState(false)
  const [showAddStatus, setShowAddStatus] = useState(false)
  const [showAddWorkflowRule, setShowAddWorkflowRule] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Student categories
  const studentCategories = [
    { id: "01", name: "Looked After Child (LAC)", description: "Currently in local authority care" },
    {
      id: "02",
      name: "Previously Looked After Child (PLAC)",
      description: "Was in care but now adopted or under special guardianship",
    },
    { id: "03", name: "Child in Need (CiN)", description: "Under a CiN plan with local authority support" },
    { id: "04", name: "Child Protection Plan (CP Plan)", description: "Subject to formal safeguarding plan" },
    { id: "05", name: "Young Carer", description: "Has significant caring responsibilities at home" },
    { id: "06", name: "Special Educational Needs and Disabilities (SEND)", description: "" },
    { id: "07", name: "Education, Health and Care Plan (EHCP)", description: "Formal support plan for SEND" },
    { id: "08", name: "Gifted and Talented", description: "Identified as high potential or exceeding expectations" },
    { id: "09", name: "Free School Meals (FSM) / Pupil Premium", description: "Financial indicator of need" },
    { id: "10", name: "English as an Additional Language (EAL)", description: "" },
    { id: "11", name: "Elective Home Education (EHE)", description: "Previously Home Schooled" },
    {
      id: "12",
      name: "Child Missing Education (CME)",
      description: "Chronically absent or off-roll without formal education",
    },
    { id: "13", name: "Refugee / Asylum Seeker", description: "" },
    { id: "14", name: "Traveller / Roma / Gypsy Child", description: "" },
    { id: "15", name: "Mental Health Needs", description: "" },
    {
      id: "16",
      name: "Behavioural Concerns / PRU Attendee",
      description: "Attending or referred to a Pupil Referral Unit",
    },
    { id: "17", name: "Medical Condition / Long-Term Illness", description: "" },
    { id: "18", name: "In Foster Care", description: "Either short or long-term placement" },
    { id: "19", name: "Child of Service Personnel / Forces Child", description: "" },
    { id: "20", name: "Subject to Court Orders / Parental Restrictions", description: "" },
    { id: "21", name: "Lives in Temporary Accommodation / Homelessness", description: "" },
    { id: "22", name: "Victim of Abuse / Trauma History", description: "" },
    { id: "23", name: "Bereaved / Significant Loss", description: "" },
    { id: "24", name: "Adopted", description: "Distinct from LAC but relevant for attachment needs" },
    { id: "25", name: "High Mobility", description: "Frequent school moves or instability" },
    { id: "26", name: "NEET Risk", description: "Not in Education, Employment or Training - For older pupils" },
    { id: "27", name: "Undergoing Transition", description: "e.g. Year 6–7, PRU to Mainstream" },
    { id: "28", name: "Sibling with Safeguarding Concerns", description: "Family context is known risk factor" },
    {
      id: "29",
      name: "Subject of Immigration Proceedings / NRPF",
      description: "No Recourse to Public Funds",
    },
    { id: "30", name: "Non-Resident Parent / Contact Centre Use", description: "Court-defined contact" },
    { id: "31", name: "Part-Time Timetable", description: "" },
    { id: "32", name: "Excluded / Suspended", description: "Fixed-term or permanent" },
  ]

  // Incident categories
  const incidentCategories = [
    {
      id: "abuse",
      name: "Abuse",
      accessCode: "01",
      subcategories: [
        {
          id: "physical-abuse",
          name: "Physical Abuse",
          description: "Bruising, marks, hitting, injuries",
          accessCode: "01",
        },
        {
          id: "emotional-abuse",
          name: "Emotional Abuse",
          description: "Verbal cruelty, shaming, control",
          accessCode: "01",
        },
        { id: "sexual-abuse", name: "Sexual Abuse", description: "Allegation or disclosure", accessCode: "01" },
        {
          id: "neglect",
          name: "Neglect",
          description: "Poor hygiene, unmet medical needs, unsafe home",
          accessCode: "01",
        },
        { id: "fii", name: "Fabricated or Induced Illness (FII)", description: "", accessCode: "01" },
      ],
    },
    {
      id: "domestic",
      name: "Domestic Abuse",
      accessCode: "01",
      subcategories: [
        { id: "witness", name: "Witness to Domestic Violence", description: "", accessCode: "01" },
        { id: "victim", name: "Direct Victim of Domestic Abuse", description: "", accessCode: "01" },
        { id: "coercive", name: "Coercive Control in Household", description: "", accessCode: "01" },
        { id: "police", name: "Police-attended Domestic Incident", description: "", accessCode: "01" },
      ],
    },
    {
      id: "exploitation",
      name: "Exploitation",
      accessCode: "01",
      subcategories: [
        { id: "cse", name: "Child Sexual Exploitation (CSE)", description: "", accessCode: "01" },
        { id: "cce", name: "Child Criminal Exploitation (CCE)", description: "", accessCode: "01" },
        { id: "county-lines", name: "County Lines Activity", description: "", accessCode: "01" },
        { id: "grooming", name: "Grooming / Online Luring", description: "", accessCode: "01" },
        { id: "trafficking", name: "Human Trafficking Concerns", description: "", accessCode: "01" },
      ],
    },
    {
      id: "mental-health",
      name: "Mental Health",
      accessCode: "02",
      subcategories: [
        { id: "anxiety", name: "Anxiety / Depression", description: "", accessCode: "02" },
        { id: "self-harm", name: "Self-Harm (actual or attempted)", description: "", accessCode: "01" },
        { id: "suicidal", name: "Suicidal Thoughts / Attempt", description: "", accessCode: "01" },
        { id: "eating", name: "Eating Disorders / Body Image", description: "", accessCode: "02" },
        { id: "camhs", name: "CAMHS or Mental Health Referral", description: "", accessCode: "02" },
        { id: "trauma", name: "Trauma symptoms / PTSD", description: "", accessCode: "01" },
      ],
    },
    {
      id: "online",
      name: "Online Safety",
      accessCode: "03",
      subcategories: [
        { id: "cyberbullying", name: "Cyberbullying", description: "", accessCode: "03" },
        { id: "sexting", name: "Sexting / Image Sharing", description: "", accessCode: "01" },
        { id: "online-grooming", name: "Online Grooming", description: "", accessCode: "01" },
        { id: "inappropriate", name: "Exposure to Inappropriate Content", description: "", accessCode: "03" },
        { id: "addiction", name: "Internet Addiction / Overuse", description: "", accessCode: "03" },
      ],
    },
    {
      id: "bullying",
      name: "Bullying & Peer Issues",
      accessCode: "03",
      subcategories: [
        { id: "verbal-bullying", name: "Verbal Bullying", description: "", accessCode: "03" },
        { id: "physical-bullying", name: "Physical Bullying", description: "", accessCode: "03" },
        { id: "racist-bullying", name: "Racist Bullying", description: "", accessCode: "03" },
        { id: "homophobic-bullying", name: "Homophobic / Transphobic Bullying", description: "", accessCode: "03" },
        { id: "peer-isolation", name: "Peer Isolation / Exclusion", description: "", accessCode: "03" },
        { id: "gang-pressure", name: "Gang-related peer pressure", description: "", accessCode: "01" },
      ],
    },
  ]

  // Access codes
  const accessCodes = [
    { code: "01", roles: "DSL, Deputy DSL, Headteacher, Safeguarding Governor" },
    { code: "02", roles: "DSL, SENCO, Pastoral Lead, Headteacher" },
    { code: "03", roles: "DSL, SLT, Class Teacher, Pastoral Lead" },
    { code: "04", roles: "DSL, SLT, Class Teacher (View Only)" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Categories & Statuses</h1>
        <p className="text-muted-foreground">Configure student categories and incident types</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="student">Student Categories</TabsTrigger>
          <TabsTrigger value="incident">Incident Categories</TabsTrigger>
          <TabsTrigger value="status">Status Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Categories</CardTitle>
                <CardDescription>Define categories for classifying students</CardDescription>
              </div>
              <Button onClick={() => setShowAddStudentCategory(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 w-8 text-center">
                        {category.id}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id={`active-${category.id}`} defaultChecked />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Student Category Dialog */}
          <Dialog open={showAddStudentCategory} onOpenChange={setShowAddStudentCategory}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Student Category</DialogTitle>
                <DialogDescription>Create a new category for classifying students.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-id">Category ID</Label>
                  <Input id="category-id" placeholder="e.g., 33" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" placeholder="e.g., Child in Need (CiN)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Input id="category-description" placeholder="Brief description of this category" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="category-active" defaultChecked />
                  <Label htmlFor="category-active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddStudentCategory(false)}>
                  Cancel
                </Button>
                <Button>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="incident" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Incident Categories</CardTitle>
                <CardDescription>Define categories and subcategories for incidents</CardDescription>
              </div>
              <Button onClick={() => setShowAddIncidentCategory(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-2">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-400">Access Control Codes</p>
                    <ul className="mt-1 space-y-1 text-amber-700 dark:text-amber-300">
                      {accessCodes.map((code) => (
                        <li key={code.code}>
                          <strong>[{code.code}]</strong>: {code.roles}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Accordion type="multiple" className="w-full">
                  {incidentCategories.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <span>{category.name}</span>
                          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                            {category.accessCode}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Subcategories</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(category.id)
                                setShowAddSubcategory(true)
                              }}
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              Add Subcategory
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex items-center justify-between p-2 border rounded-md"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{subcategory.name}</span>
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                      {subcategory.accessCode}
                                    </Badge>
                                  </div>
                                  {subcategory.description && (
                                    <p className="text-xs text-muted-foreground">{subcategory.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>

          {/* Add Incident Category Dialog */}
          <Dialog open={showAddIncidentCategory} onOpenChange={setShowAddIncidentCategory}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Incident Category</DialogTitle>
                <DialogDescription>Create a new category for classifying incidents.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-category-name">Category Name</Label>
                  <Input id="incident-category-name" placeholder="e.g., Bullying" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-code">Access Control Level</Label>
                  <Select>
                    <SelectTrigger id="access-code">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessCodes.map((code) => (
                        <SelectItem key={code.code} value={code.code}>
                          [{code.code}] {code.roles}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="incident-category-active" defaultChecked />
                  <Label htmlFor="incident-category-active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddIncidentCategory(false)}>
                  Cancel
                </Button>
                <Button>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Subcategory Dialog */}
          <Dialog open={showAddSubcategory} onOpenChange={setShowAddSubcategory}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Subcategory</DialogTitle>
                <DialogDescription>
                  Add a subcategory to{" "}
                  {incidentCategories.find((c) => c.id === selectedCategory)?.name || "selected category"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input id="subcategory-name" placeholder="e.g., Verbal Bullying" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-description">Description (Optional)</Label>
                  <Input id="subcategory-description" placeholder="Brief description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-access-code">Access Control Level</Label>
                  <Select>
                    <SelectTrigger id="subcategory-access-code">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessCodes.map((code) => (
                        <SelectItem key={code.code} value={code.code}>
                          [{code.code}] {code.roles}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddSubcategory(false)}>
                  Cancel
                </Button>
                <Button>Add Subcategory</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Workflows</CardTitle>
              <CardDescription>Configure incident status options and workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Available Statuses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "new", name: "New", color: "bg-blue-100 text-blue-800", isDefault: true },
                      {
                        id: "in_progress",
                        name: "In Progress",
                        color: "bg-amber-100 text-amber-800",
                        isDefault: false,
                      },
                      { id: "escalated", name: "Escalated", color: "bg-red-100 text-red-800", isDefault: false },
                      { id: "resolved", name: "Resolved", color: "bg-green-100 text-green-800", isDefault: false },
                      { id: "closed", name: "Closed", color: "bg-gray-100 text-gray-800", isDefault: false },
                      {
                        id: "monitoring",
                        name: "Monitoring",
                        color: "bg-purple-100 text-purple-800",
                        isDefault: false,
                      },
                    ].map((status) => (
                      <div key={status.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={status.color}>
                            {status.name}
                          </Badge>
                          {status.isDefault && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" disabled={status.isDefault}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-2" onClick={() => setShowAddStatus(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Status
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Status Workflow Rules</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Automatic Escalation</h4>
                        <Switch id="auto-escalation" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Automatically escalate incidents that remain in "New" status for more than 24 hours
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          New
                        </Badge>
                        <ChevronDown className="h-4 w-4" />
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Escalated
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">DSL Approval for Resolution</h4>
                        <Switch id="dsl-approval" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Require DSL approval before incidents can be marked as "Resolved"
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          In Progress
                        </Badge>
                        <ChevronDown className="h-4 w-4" />
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          Pending Approval
                        </Badge>
                        <ChevronDown className="h-4 w-4" />
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Resolved
                        </Badge>
                      </div>
                    </div>

                    <Button className="mt-2" onClick={() => setShowAddWorkflowRule(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Workflow Rule
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Status Dialog */}
          <Dialog open={showAddStatus} onOpenChange={setShowAddStatus}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Status</DialogTitle>
                <DialogDescription>Create a new status for incidents</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="status-name">Status Name</Label>
                  <Input id="status-name" placeholder="e.g., Pending Review" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-color">Color</Label>
                  <Select>
                    <SelectTrigger id="status-color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="amber">Amber</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="status-default" />
                  <Label htmlFor="status-default">Set as default status</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddStatus(false)}>
                  Cancel
                </Button>
                <Button>Add Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Workflow Rule Dialog */}
          <Dialog open={showAddWorkflowRule} onOpenChange={setShowAddWorkflowRule}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Workflow Rule</DialogTitle>
                <DialogDescription>Create a new workflow rule for incident statuses</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="e.g., Auto-close after 30 days" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-status">From Status</Label>
                  <Select>
                    <SelectTrigger id="from-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-status">To Status</Label>
                  <Select>
                    <SelectTrigger id="to-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Time in status</SelectItem>
                      <SelectItem value="approval">Approval received</SelectItem>
                      <SelectItem value="action">Action completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-period">Time Period (hours)</Label>
                  <Input id="time-period" type="number" placeholder="e.g., 24" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddWorkflowRule(false)}>
                  Cancel
                </Button>
                <Button>Add Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}

