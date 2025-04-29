// User Types
export type UserRole = "super_user" | "admin" | "responsible_person" | "dsl" | "staff" | "slt"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobTitle?: string
  department?: string
  role: UserRole
  schoolId: string
  profileImage?: string
  lastLogin?: Date
  status: "active" | "pending" | "inactive"
  createdAt: Date
  permissionGroups: string[]
  studentAccess?: string[]
  categoryAccess?: { [studentId: string]: string[] }
}

// School Types
export interface School {
  id: string
  name: string
  phone: string
  email: string
  address: string
  logo?: string
  allowedDomains: string[]
  createdAt: Date
  updatedAt: Date
}

// Student Types
export interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  yearGroup: string
  tutor: string
  schoolId: string
  address?: string
  emergencyContacts: EmergencyContact[]
  safeguardingStatus?: string
  lastIncidentDate?: Date
  hasConfidentialInformation: boolean
  agencies: string[]
  siblings?: string[]
  senStatus?: string
  ehcpStatus?: EHCPStatus
  ethnicity?: string
  nationality?: string
  religion?: string
  eal?: boolean
  languages?: string[]
  createdAt: Date
  updatedAt: Date
}

export type EHCPStatus =
  | "none"
  | "application_ready"
  | "decision_to_assess"
  | "assessment_phase"
  | "draft_issued"
  | "final_issued"
  | "appeal"

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  address?: string
  isRisk?: boolean
  riskNotes?: string
}

// Incident Types
export interface Incident {
  id: string
  studentId: string
  reportedBy: string
  reportDate: Date
  incidentDate: Date
  category: string
  description: string
  bodyMap?: BodyMapMarker[]
  actionsTaken?: string
  followUpRequired: boolean
  followUpNotes?: string
  attachments?: Attachment[]
  isConfidential: boolean
  status: "reported" | "in_progress" | "escalated" | "resolved"
  loggedByStaffId: string
  agencyId?: string
  createdAt: Date
  updatedAt: Date
}

export interface BodyMapMarker {
  x: number
  y: number
  note: string
}

export interface Attachment {
  id: string
  name: string
  type: string
  url: string
  uploadedBy: string
  isConfidential: boolean
  uploadDate: Date
}

// Agency Types
export interface Agency {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  details?: string
  contacts: AgencyContact[]
  createdAt: Date
  updatedAt: Date
}

export interface AgencyContact {
  id: string
  name: string
  phone?: string
  email?: string
  role?: string
}

// Permission Types
export interface PermissionGroup {
  id: string
  name: string
  permissions: Permission[]
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete"
}

// Workflow Types
export interface WorkflowRule {
  id: string
  name: string
  condition: {
    yearGroups?: string[]
    categories?: string[]
    severity?: string[]
  }
  steps: WorkflowStep[]
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowStep {
  id: string
  type: "notify" | "condition" | "select_person"
  config: any
  nextStepId?: string
}

// Audit Types
export interface AuditLog {
  id: string
  userId: string
  action: string
  details: string
  resourceType: string
  resourceId: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

