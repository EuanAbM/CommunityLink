"use client"

import { useState, useRef, useEffect } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import {
  X,
  Plus,
  Save,
  Play,
  Trash2,
  Settings,
  Mail,
  Clock,
  CheckCircle,
  BellRing,
  Search,
  Filter,
  Tag,
  UserCheck,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// Node types
const NODE_TYPES = {
  TRIGGER: "trigger",
  CONDITION: "condition",
  ACTION: "action",
  NOTIFICATION: "notification",
  DELAY: "delay",
  EMAIL: "email",
  ASSIGN: "assign",
  STATUS: "status",
}

// Staff members for search
const STAFF_MEMBERS = [
  { id: "staff-1", name: "Jane Smith", role: "Designated Safeguarding Lead", email: "j.smith@school.edu" },
  { id: "staff-2", name: "Michael Johnson", role: "Head Teacher", email: "m.johnson@school.edu" },
  { id: "staff-3", name: "Sarah Williams", role: "SENCO", email: "s.williams@school.edu" },
  { id: "staff-4", name: "David Brown", role: "Attendance Officer", email: "d.brown@school.edu" },
  { id: "staff-5", name: "Emma Davis", role: "Year 7 Head", email: "e.davis@school.edu" },
  { id: "staff-6", name: "Robert Wilson", role: "Deputy DSL", email: "r.wilson@school.edu" },
  { id: "staff-7", name: "Lisa Taylor", role: "School Nurse", email: "l.taylor@school.edu" },
  { id: "staff-8", name: "James Anderson", role: "Pastoral Lead", email: "j.anderson@school.edu" },
]

// Incident categories
const INCIDENT_CATEGORIES = [
  { id: "cat-1", name: "Attendance", color: "blue" },
  { id: "cat-2", name: "Behavior", color: "amber" },
  { id: "cat-3", name: "Child Protection", color: "red" },
  { id: "cat-4", name: "Physical", color: "orange" },
  { id: "cat-5", name: "Emotional", color: "purple" },
  { id: "cat-6", name: "Neglect", color: "yellow" },
  { id: "cat-7", name: "Sexual", color: "pink" },
  { id: "cat-8", name: "Online Safety", color: "cyan" },
  { id: "cat-9", name: "Bullying", color: "indigo" },
  { id: "cat-10", name: "Mental Health", color: "green" },
]

// Incident statuses
const INCIDENT_STATUSES = [
  { id: "status-1", name: "Open", color: "blue" },
  { id: "status-2", name: "In Progress", color: "amber" },
  { id: "status-3", name: "Pending External", color: "purple" },
  { id: "status-4", name: "Monitoring", color: "cyan" },
  { id: "status-5", name: "Resolved", color: "green" },
  { id: "status-6", name: "Closed", color: "gray" },
  { id: "status-7", name: "Escalated", color: "red" },
  { id: "status-8", name: "Requires Review", color: "orange" },
]

// Student attributes
const STUDENT_ATTRIBUTES = [
  { id: "attr-1", name: "SEN Status", values: ["None", "SEN Support", "EHCP"] },
  {
    id: "attr-2",
    name: "Year Group",
    values: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"],
  },
  { id: "attr-3", name: "Pupil Premium", values: ["Yes", "No"] },
  { id: "attr-4", name: "EAL", values: ["Yes", "No"] },
  { id: "attr-5", name: "Looked After", values: ["Yes", "No"] },
  { id: "attr-6", name: "Previously Looked After", values: ["Yes", "No"] },
  { id: "attr-7", name: "Free School Meals", values: ["Yes", "No"] },
  { id: "attr-8", name: "Attendance %", values: ["Below 85%", "85-90%", "90-95%", "Above 95%"] },
]

// Notification methods
const NOTIFICATION_METHODS = [
  { id: "method-1", name: "In-App Notification" },
  { id: "method-2", name: "Email" },
  { id: "method-3", name: "SMS" },
  { id: "method-4", name: "Push Notification" },
]

// Email templates
const EMAIL_TEMPLATES = [
  { id: "email-1", name: "Incident Notification", description: "Notify staff about a new incident" },
  { id: "email-2", name: "Attendance Follow-up", description: "Follow up on attendance issues" },
  { id: "email-3", name: "Safeguarding Alert", description: "High priority safeguarding alert" },
  { id: "email-4", name: "Action Required", description: "Request action from staff member" },
  { id: "email-5", name: "External Agency Referral", description: "Referral to external agency" },
  { id: "email-6", name: "Parent/Guardian Contact", description: "Contact with parent or guardian" },
  { id: "email-7", name: "Incident Update", description: "Update on incident progress" },
  { id: "email-8", name: "Case Closure", description: "Notification of case closure" },
]

// Condition operators
const CONDITION_OPERATORS = [
  { id: "op-1", name: "Equals (=)", symbol: "=" },
  { id: "op-2", name: "Not Equals (≠)", symbol: "!=" },
  { id: "op-3", name: "Contains", symbol: "contains" },
  { id: "op-4", name: "Does Not Contain", symbol: "not contains" },
  { id: "op-5", name: "Greater Than (>)", symbol: ">" },
  { id: "op-6", name: "Less Than (<)", symbol: "<" },
  { id: "op-7", name: "Greater Than or Equal (≥)", symbol: ">=" },
  { id: "op-8", name: "Less Than or Equal (≤)", symbol: "<=" },
]

// Logical operators
const LOGICAL_OPERATORS = [
  { id: "logic-1", name: "AND", description: "All conditions must be true" },
  { id: "logic-2", name: "OR", description: "At least one condition must be true" },
]

// Initial workflows with safeguarding example
const INITIAL_WORKFLOWS = [
  {
    id: "workflow-1",
    name: "Attendance & SEN Safeguarding Workflow",
    description: "Automatically handle attendance incidents for SEN students",
    active: true,
    nodes: [
      {
        id: "node-1",
        type: NODE_TYPES.TRIGGER,
        x: 100,
        y: 100,
        width: 240,
        height: 120,
        data: {
          event: "incident.created",
          category: "cat-1",
          condition: "Attendance incident created",
        },
      },
      {
        id: "node-2",
        type: NODE_TYPES.CONDITION,
        x: 100,
        y: 300,
        width: 240,
        height: 120,
        data: {
          field: "student.attributes.sen_status",
          operator: "=",
          value: "SEN Support",
          logicalOperator: "AND",
          conditions: [
            {
              field: "student.attributes.sen_status",
              operator: "=",
              value: "SEN Support",
            },
          ],
        },
      },
      {
        id: "node-3",
        type: NODE_TYPES.NOTIFICATION,
        x: 400,
        y: 300,
        width: 240,
        height: 120,
        data: {
          staff: "staff-3",
          method: "method-1",
          message: "SEN student attendance incident requires attention",
        },
      },
      {
        id: "node-4",
        type: NODE_TYPES.STATUS,
        x: 700,
        y: 300,
        width: 240,
        height: 120,
        data: {
          status: "status-2",
        },
      },
      {
        id: "node-5",
        type: NODE_TYPES.DELAY,
        x: 400,
        y: 500,
        width: 240,
        height: 120,
        data: {
          duration: 24,
          unit: "hours",
        },
      },
      {
        id: "node-6",
        type: NODE_TYPES.NOTIFICATION,
        x: 700,
        y: 500,
        width: 240,
        height: 120,
        data: {
          staff: "staff-4",
          method: "method-2",
          message: "Follow-up required for SEN student attendance",
        },
      },
      {
        id: "node-7",
        type: NODE_TYPES.ASSIGN,
        x: 400,
        y: 700,
        width: 240,
        height: 120,
        data: {
          staff: "staff-3",
        },
      },
      {
        id: "node-8",
        type: NODE_TYPES.ACTION,
        x: 700,
        y: 700,
        width: 240,
        height: 120,
        data: {
          action: "Create follow-up meeting",
          notes: "Schedule meeting with SENCO and attendance officer",
        },
      },
    ],
    connections: [
      { source: "node-1", target: "node-2" },
      { source: "node-2", target: "node-3", label: "Yes" },
      { source: "node-3", target: "node-4" },
      { source: "node-4", target: "node-5" },
      { source: "node-5", target: "node-6" },
      { source: "node-6", target: "node-7" },
      { source: "node-7", target: "node-8" },
    ],
  },
  {
    id: "workflow-2",
    name: "Child Protection Escalation",
    description: "Escalate high-priority child protection incidents to DSL",
    active: false,
    nodes: [],
    connections: [],
  },
]

// Sidebar item component
const SidebarItem = ({ type, icon: Icon, label, description }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NODE",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-3 mb-2 rounded-md border cursor-move transition-all ${
        isDragging ? "opacity-50 bg-accent" : "hover:bg-accent"
      }`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
      </div>
    </div>
  )
}

// Node component
const Node = ({ id, type, x, y, width, height, data, isSelected, onSelect, onMove }) => {
  const nodeRef = useRef(null)
  const [position, setPosition] = useState({ x, y })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  // Node styling based on type
  const getNodeStyle = () => {
    switch (type) {
      case NODE_TYPES.TRIGGER:
        return "bg-blue-50 border-blue-300"
      case NODE_TYPES.CONDITION:
        return "bg-amber-50 border-amber-300"
      case NODE_TYPES.ACTION:
        return "bg-green-50 border-green-300"
      case NODE_TYPES.NOTIFICATION:
        return "bg-purple-50 border-purple-300"
      case NODE_TYPES.DELAY:
        return "bg-gray-50 border-gray-300"
      case NODE_TYPES.EMAIL:
        return "bg-indigo-50 border-indigo-300"
      case NODE_TYPES.ASSIGN:
        return "bg-rose-50 border-rose-300"
      case NODE_TYPES.STATUS:
        return "bg-cyan-50 border-cyan-300"
      default:
        return "bg-white border-gray-300"
    }
  }

  // Node icon based on type
  const getNodeIcon = () => {
    switch (type) {
      case NODE_TYPES.TRIGGER:
        return <ShieldAlert className="h-5 w-5 text-blue-500" />
      case NODE_TYPES.CONDITION:
        return <Filter className="h-5 w-5 text-amber-500" />
      case NODE_TYPES.ACTION:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case NODE_TYPES.NOTIFICATION:
        return <BellRing className="h-5 w-5 text-purple-500" />
      case NODE_TYPES.DELAY:
        return <Clock className="h-5 w-5 text-gray-500" />
      case NODE_TYPES.EMAIL:
        return <Mail className="h-5 w-5 text-indigo-500" />
      case NODE_TYPES.ASSIGN:
        return <UserCheck className="h-5 w-5 text-rose-500" />
      case NODE_TYPES.STATUS:
        return <Tag className="h-5 w-5 text-cyan-500" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  // Node title based on type
  const getNodeTitle = () => {
    switch (type) {
      case NODE_TYPES.TRIGGER:
        return "Incident Trigger"
      case NODE_TYPES.CONDITION:
        return "Condition"
      case NODE_TYPES.ACTION:
        return "Action"
      case NODE_TYPES.NOTIFICATION:
        return "Notification"
      case NODE_TYPES.DELAY:
        return "Delay"
      case NODE_TYPES.EMAIL:
        return "Email"
      case NODE_TYPES.ASSIGN:
        return "Assign"
      case NODE_TYPES.STATUS:
        return "Change Status"
      default:
        return "Node"
    }
  }

  // Get staff name by ID
  const getStaffName = (staffId) => {
    const staff = STAFF_MEMBERS.find((s) => s.id === staffId)
    return staff ? staff.name : "Select staff"
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = INCIDENT_CATEGORIES.find((c) => c.id === categoryId)
    return category ? category.name : "Select category"
  }

  // Get status name by ID
  const getStatusName = (statusId) => {
    const status = INCIDENT_STATUSES.find((s) => s.id === statusId)
    return status ? status.name : "Select status"
  }

  // Get notification method name by ID
  const getMethodName = (methodId) => {
    const method = NOTIFICATION_METHODS.find((m) => m.id === methodId)
    return method ? method.name : "Select method"
  }

  // Node content based on type and data
  const getNodeContent = () => {
    switch (type) {
      case NODE_TYPES.TRIGGER:
        return (
          <div className="text-xs">
            <div className="font-medium">
              Event: {data?.event === "incident.created" ? "Incident Created" : data?.event}
            </div>
            {data?.category && (
              <div className="mt-1 flex items-center gap-1">
                <span className="font-medium">Category:</span>
                <span className="text-muted-foreground">{getCategoryName(data.category)}</span>
              </div>
            )}
            <div className="mt-1 text-muted-foreground truncate">
              {data?.condition || "When an incident is created"}
            </div>
          </div>
        )
      case NODE_TYPES.CONDITION:
        return (
          <div className="text-xs">
            <div className="font-medium">If:</div>
            <div className="mt-1 text-muted-foreground">
              {data?.conditions && data.conditions.length > 0 ? (
                <div className="space-y-1">
                  {data.conditions.map((condition, index) => (
                    <div key={index} className="truncate">
                      {index > 0 && <span className="font-medium">{data.logicalOperator || "AND"} </span>}
                      {condition.field?.split(".").pop()} {condition.operator} {condition.value}
                    </div>
                  ))}
                </div>
              ) : (
                <span>Configure condition</span>
              )}
            </div>
          </div>
        )
      case NODE_TYPES.NOTIFICATION:
        return (
          <div className="text-xs">
            <div className="font-medium">Notify:</div>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-medium">Staff:</span>
              <span className="text-muted-foreground">{getStaffName(data?.staff)}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-medium">Method:</span>
              <span className="text-muted-foreground">{getMethodName(data?.method)}</span>
            </div>
            <div className="mt-1 text-muted-foreground truncate">{data?.message || "notification message"}</div>
          </div>
        )
      case NODE_TYPES.DELAY:
        return (
          <div className="text-xs">
            <div className="font-medium">Wait:</div>
            <div className="mt-1 text-muted-foreground">
              {data?.duration || "1"} {data?.unit || "hour"}
            </div>
          </div>
        )
      case NODE_TYPES.EMAIL:
        return (
          <div className="text-xs">
            <div className="font-medium">Email:</div>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-medium">Template:</span>
              <span className="text-muted-foreground">{data?.template || "Select template"}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-medium">To:</span>
              <span className="text-muted-foreground truncate">
                {getStaffName(data?.staff) || data?.to || "recipient"}
              </span>
            </div>
          </div>
        )
      case NODE_TYPES.ASSIGN:
        return (
          <div className="text-xs">
            <div className="font-medium">Assign to:</div>
            <div className="mt-1 text-muted-foreground truncate">
              {getStaffName(data?.staff) || "Select staff member"}
            </div>
          </div>
        )
      case NODE_TYPES.STATUS:
        return (
          <div className="text-xs">
            <div className="font-medium">Change status to:</div>
            <div className="mt-1 text-muted-foreground truncate">{getStatusName(data?.status) || "Select status"}</div>
          </div>
        )
      case NODE_TYPES.ACTION:
        return (
          <div className="text-xs">
            <div className="font-medium">Action:</div>
            <div className="mt-1 text-muted-foreground truncate">{data?.action || "perform action"}</div>
            {data?.notes && <div className="mt-1 text-muted-foreground truncate">Notes: {data.notes}</div>}
          </div>
        )
      default:
        return <div className="text-xs text-muted-foreground">Configure this node</div>
    }
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.button !== 0) return // Only left mouse button
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    e.stopPropagation()
    onSelect(id)
  }

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return

      const newX = e.clientX - startPos.x
      const newY = e.clientY - startPos.y

      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        onMove(id, position.x, position.y)
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, id, startPos, onMove])

  // Update position when x or y props change
  useEffect(() => {
    setPosition({ x, y })
  }, [x, y])

  return (
    <div
      ref={nodeRef}
      className={`absolute rounded-md border shadow-sm ${getNodeStyle()} ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: isDragging ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {getNodeIcon()}
            <span className="text-sm font-medium">{getNodeTitle()}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="border-t pt-2">{getNodeContent()}</div>
      </div>
    </div>
  )
}

// Connection component
const Connection = ({ source, target, sourcePos, targetPos, label }) => {
  // Calculate path
  const path = () => {
    const sourceX = sourcePos.x + sourcePos.width / 2
    const sourceY = sourcePos.y + sourcePos.height
    const targetX = targetPos.x + targetPos.width / 2
    const targetY = targetPos.y

    // Control points for the curve
    const controlPointY = (targetY - sourceY) / 2

    return `M${sourceX},${sourceY} C${sourceX},${sourceY + controlPointY} ${targetX},${targetY - controlPointY} ${targetX},${targetY}`
  }

  // Calculate label position
  const labelPos = () => {
    const sourceX = sourcePos.x + sourcePos.width / 2
    const sourceY = sourcePos.y + sourcePos.height
    const targetX = targetPos.x + targetPos.width / 2
    const targetY = targetPos.y

    return {
      x: (sourceX + targetX) / 2,
      y: (sourceY + targetY) / 2,
    }
  }

  return (
    <>
      <path d={path()} stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
      {label && (
        <g transform={`translate(${labelPos().x - 15}, ${labelPos().y - 10})`}>
          <rect x="0" y="0" width="30" height="20" rx="4" fill="white" stroke="#94a3b8" />
          <text x="15" y="14" textAnchor="middle" fontSize="10" fill="#64748b">
            {label}
          </text>
        </g>
      )}
    </>
  )
}

// Canvas component
const Canvas = ({ workflow, setWorkflow, selectedNodeId, setSelectedNodeId }) => {
  const canvasRef = useRef(null)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "NODE",
    drop: (item, monitor) => {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const dropPoint = monitor.getClientOffset()

      // Calculate position relative to canvas
      const x = dropPoint.x - canvasRect.left
      const y = dropPoint.y - canvasRect.top

      // Add new node
      const newNode = {
        id: `node-${Date.now()}`,
        type: item.type,
        x,
        y,
        width: 240,
        height: 120,
        data: {},
      }

      setWorkflow({
        ...workflow,
        nodes: [...workflow.nodes, newNode],
      })

      // Select the new node
      setSelectedNodeId(newNode.id)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  // Handle node selection
  const handleNodeSelect = (nodeId) => {
    setSelectedNodeId(nodeId)
  }

  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setSelectedNodeId(null)
  }

  // Handle node movement
  const handleNodeMove = (nodeId, x, y) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.map((node) => (node.id === nodeId ? { ...node, x, y } : node)),
    })
  }

  // Find node position by id
  const getNodePosition = (nodeId) => {
    const node = workflow.nodes.find((n) => n.id === nodeId)
    if (!node) return null
    return {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
    }
  }

  return (
    <div
      ref={(el) => {
        canvasRef.current = el
        drop(el)
      }}
      className={`relative w-full h-[600px] border rounded-md overflow-auto bg-white ${isOver ? "bg-accent/20" : ""}`}
      onClick={handleCanvasClick}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThlYyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      {/* SVG for connections */}
      <svg className="absolute inset-0 pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
        {workflow.connections.map((conn) => {
          const sourcePos = getNodePosition(conn.source)
          const targetPos = getNodePosition(conn.target)

          if (!sourcePos || !targetPos) return null

          return (
            <Connection
              key={`${conn.source}-${conn.target}`}
              source={conn.source}
              target={conn.target}
              sourcePos={sourcePos}
              targetPos={targetPos}
              label={conn.label}
            />
          )
        })}
      </svg>

      {/* Nodes */}
      {workflow.nodes.map((node) => (
        <Node
          key={node.id}
          id={node.id}
          type={node.type}
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          data={node.data}
          isSelected={selectedNodeId === node.id}
          onSelect={handleNodeSelect}
          onMove={handleNodeMove}
        />
      ))}
    </div>
  )
}

// Staff selector component
const StaffSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredStaff = search
    ? STAFF_MEMBERS.filter(
        (staff) =>
          staff.name.toLowerCase().includes(search.toLowerCase()) ||
          staff.role.toLowerCase().includes(search.toLowerCase()),
      )
    : STAFF_MEMBERS

  const selectedStaff = STAFF_MEMBERS.find((staff) => staff.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedStaff ? selectedStaff.name : "Select staff member..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search staff..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No staff member found.</CommandEmpty>
            <CommandGroup>
              {filteredStaff.map((staff) => (
                <CommandItem
                  key={staff.id}
                  value={staff.id}
                  onSelect={() => {
                    onChange(staff.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span>{staff.name}</span>
                    <span className="text-xs text-muted-foreground">{staff.role}</span>
                  </div>
                  <CheckCircle className={`ml-auto h-4 w-4 ${value === staff.id ? "opacity-100" : "opacity-0"}`} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Properties panel component
const PropertiesPanel = ({ workflow, setWorkflow, selectedNodeId }) => {
  const selectedNode = workflow.nodes.find((node) => node.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <div className="p-4 border rounded-md bg-muted/50">
        <p className="text-sm text-muted-foreground">Select a node to edit its properties</p>
      </div>
    )
  }

  // Update node data
  const updateNodeData = (key, value) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.map((node) =>
        node.id === selectedNodeId ? { ...node, data: { ...node.data, [key]: value } } : node,
      ),
    })
  }

  // Update condition
  const updateCondition = (index, field, value) => {
    const conditions = [...(selectedNode.data?.conditions || [])]

    if (!conditions[index]) {
      conditions[index] = {}
    }

    conditions[index] = { ...conditions[index], [field]: value }

    updateNodeData("conditions", conditions)
  }

  // Add condition
  const addCondition = () => {
    const conditions = [...(selectedNode.data?.conditions || []), { field: "", operator: "=", value: "" }]
    updateNodeData("conditions", conditions)
  }

  // Remove condition
  const removeCondition = (index) => {
    const conditions = [...(selectedNode.data?.conditions || [])]
    conditions.splice(index, 1)
    updateNodeData("conditions", conditions)
  }

  // Delete selected node
  const deleteNode = () => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.filter((node) => node.id !== selectedNodeId),
      connections: workflow.connections.filter(
        (conn) => conn.source !== selectedNodeId && conn.target !== selectedNodeId,
      ),
    })
  }

  // Render form based on node type
  const renderNodeForm = () => {
    switch (selectedNode.type) {
      case NODE_TYPES.TRIGGER:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event">Event Type</Label>
                <Select
                  value={selectedNode.data?.event || "incident.created"}
                  onValueChange={(value) => updateNodeData("event", value)}
                >
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident.created">Incident Created</SelectItem>
                    <SelectItem value="incident.updated">Incident Updated</SelectItem>
                    <SelectItem value="incident.status_changed">Status Changed</SelectItem>
                    <SelectItem value="incident.assigned">Incident Assigned</SelectItem>
                    <SelectItem value="incident.action_added">Action Added</SelectItem>
                    <SelectItem value="incident.note_added">Note Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Incident Category</Label>
                <Select
                  value={selectedNode.data?.category || ""}
                  onValueChange={(value) => updateNodeData("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition">Description</Label>
                <Input
                  id="condition"
                  placeholder="e.g. When an attendance incident is created"
                  value={selectedNode.data?.condition || ""}
                  onChange={(e) => updateNodeData("condition", e.target.value)}
                />
              </div>
            </div>
          </>
        )

      case NODE_TYPES.CONDITION:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Conditions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Condition
                </Button>
              </div>

              {(selectedNode.data?.conditions || []).length > 0 ? (
                <div className="space-y-4">
                  {(selectedNode.data?.conditions || []).map((condition, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded-md bg-muted/30">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Condition {index + 1}</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor={`field-${index}`}>Field</Label>
                        <Select
                          value={condition.field || ""}
                          onValueChange={(value) => updateCondition(index, "field", value)}
                        >
                          <SelectTrigger id={`field-${index}`}>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="incident.category">Incident Category</SelectItem>
                            <SelectItem value="incident.priority">Incident Priority</SelectItem>
                            <SelectItem value="incident.status">Incident Status</SelectItem>
                            <SelectItem value="student.attributes.sen_status">Student SEN Status</SelectItem>
                            <SelectItem value="student.attributes.year_group">Student Year Group</SelectItem>
                            <SelectItem value="student.attributes.pupil_premium">Student Pupil Premium</SelectItem>
                            <SelectItem value="student.attributes.attendance">Student Attendance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`operator-${index}`}>Operator</Label>
                        <Select
                          value={condition.operator || "="}
                          onValueChange={(value) => updateCondition(index, "operator", value)}
                        >
                          <SelectTrigger id={`operator-${index}`}>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_OPERATORS.map((op) => (
                              <SelectItem key={op.id} value={op.symbol}>
                                {op.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`value-${index}`}>Value</Label>
                        {condition.field === "student.attributes.sen_status" ? (
                          <Select
                            value={condition.value || ""}
                            onValueChange={(value) => updateCondition(index, "value", value)}
                          >
                            <SelectTrigger id={`value-${index}`}>
                              <SelectValue placeholder="Select value" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="SEN Support">SEN Support</SelectItem>
                              <SelectItem value="EHCP">EHCP</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : condition.field === "incident.category" ? (
                          <Select
                            value={condition.value || ""}
                            onValueChange={(value) => updateCondition(index, "value", value)}
                          >
                            <SelectTrigger id={`value-${index}`}>
                              <SelectValue placeholder="Select value" />
                            </SelectTrigger>
                            <SelectContent>
                              {INCIDENT_CATEGORIES.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : condition.field === "incident.status" ? (
                          <Select
                            value={condition.value || ""}
                            onValueChange={(value) => updateCondition(index, "value", value)}
                          >
                            <SelectTrigger id={`value-${index}`}>
                              <SelectValue placeholder="Select value" />
                            </SelectTrigger>
                            <SelectContent>
                              {INCIDENT_STATUSES.map((status) => (
                                <SelectItem key={status.id} value={status.name}>
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={`value-${index}`}
                            placeholder="Enter value"
                            value={condition.value || ""}
                            onChange={(e) => updateCondition(index, "value", e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {(selectedNode.data?.conditions || []).length > 1 && (
                    <div>
                      <Label htmlFor="logicalOperator">Logical Operator</Label>
                      <Select
                        value={selectedNode.data?.logicalOperator || "AND"}
                        onValueChange={(value) => updateNodeData("logicalOperator", value)}
                      >
                        <SelectTrigger id="logicalOperator">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOGICAL_OPERATORS.map((op) => (
                            <SelectItem key={op.id} value={op.name}>
                              {op.name} - {op.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">No conditions added yet</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addCondition}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add First Condition
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

      case NODE_TYPES.NOTIFICATION:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="staff">Staff Member</Label>
              <StaffSelector
                value={selectedNode.data?.staff || ""}
                onChange={(value) => updateNodeData("staff", value)}
              />
            </div>

            <div>
              <Label htmlFor="method">Notification Method</Label>
              <Select
                value={selectedNode.data?.method || ""}
                onValueChange={(value) => updateNodeData("method", value)}
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_METHODS.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Notification message"
                value={selectedNode.data?.message || ""}
                onChange={(e) => updateNodeData("message", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={selectedNode.data?.urgent || false}
                onCheckedChange={(checked) => updateNodeData("urgent", checked)}
              />
              <Label htmlFor="urgent">Mark as urgent</Label>
            </div>
          </div>
        )

      case NODE_TYPES.DELAY:
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={selectedNode.data?.duration || "1"}
                  onChange={(e) => updateNodeData("duration", e.target.value)}
                />
              </div>

              <div className="flex-1">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={selectedNode.data?.unit || "hours"}
                  onValueChange={(value) => updateNodeData("unit", value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="e.g. Wait for response from parent"
                value={selectedNode.data?.description || ""}
                onChange={(e) => updateNodeData("description", e.target.value)}
              />
            </div>
          </div>
        )

      case NODE_TYPES.EMAIL:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Email Template</Label>
              <Select
                value={selectedNode.data?.template || ""}
                onValueChange={(value) => updateNodeData("template", value)}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="staff">Recipient</Label>
              <StaffSelector
                value={selectedNode.data?.staff || ""}
                onChange={(value) => updateNodeData("staff", value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">Or use a dynamic recipient:</p>
              <Select
                value={selectedNode.data?.dynamicRecipient || ""}
                onValueChange={(value) => updateNodeData("dynamicRecipient", value)}
              >
                <SelectTrigger id="dynamicRecipient">
                  <SelectValue placeholder="Select dynamic recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incident.reporter">Incident Reporter</SelectItem>
                  <SelectItem value="student.class_teacher">Student's Class Teacher</SelectItem>
                  <SelectItem value="student.year_head">Student's Year Head</SelectItem>
                  <SelectItem value="school.dsl">School DSL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject Override (Optional)</Label>
              <Input
                id="subject"
                placeholder="Leave blank to use template default"
                value={selectedNode.data?.subject || ""}
                onChange={(e) => updateNodeData("subject", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDetails"
                checked={selectedNode.data?.includeDetails || false}
                onCheckedChange={(checked) => updateNodeData("includeDetails", checked)}
              />
              <Label htmlFor="includeDetails">Include incident details</Label>
            </div>
          </div>
        )

      case NODE_TYPES.ASSIGN:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="staff">Assign To</Label>
              <StaffSelector
                value={selectedNode.data?.staff || ""}
                onChange={(value) => updateNodeData("staff", value)}
              />
            </div>

            <div>
              <Label htmlFor="role">Or Assign By Role</Label>
              <Select value={selectedNode.data?.role || ""} onValueChange={(value) => updateNodeData("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dsl">Designated Safeguarding Lead</SelectItem>
                  <SelectItem value="senco">SENCO</SelectItem>
                  <SelectItem value="attendance-officer">Attendance Officer</SelectItem>
                  <SelectItem value="head-teacher">Head Teacher</SelectItem>
                  <SelectItem value="class-teacher">Class Teacher</SelectItem>
                  <SelectItem value="year-head">Year Head</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Assignment Notes</Label>
              <Textarea
                id="notes"
                placeholder="Optional notes for the assignee"
                value={selectedNode.data?.notes || ""}
                onChange={(e) => updateNodeData("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifyAssignee"
                checked={selectedNode.data?.notifyAssignee || false}
                onCheckedChange={(checked) => updateNodeData("notifyAssignee", checked)}
              />
              <Label htmlFor="notifyAssignee">Notify assignee</Label>
            </div>
          </div>
        )

      case NODE_TYPES.STATUS:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select
                value={selectedNode.data?.status || ""}
                onValueChange={(value) => updateNodeData("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {INCIDENT_STATUSES.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Status Change</Label>
              <Input
                id="reason"
                placeholder="e.g. Automatically progressed by workflow"
                value={selectedNode.data?.reason || ""}
                onChange={(e) => updateNodeData("reason", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="addNote"
                checked={selectedNode.data?.addNote || false}
                onCheckedChange={(checked) => updateNodeData("addNote", checked)}
              />
              <Label htmlFor="addNote">Add note about status change</Label>
            </div>
          </div>
        )

      case NODE_TYPES.ACTION:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action">Action</Label>
              <Input
                id="action"
                placeholder="e.g. Schedule follow-up meeting"
                value={selectedNode.data?.action || ""}
                onChange={(e) => updateNodeData("action", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Action Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional details about the action"
                value={selectedNode.data?.notes || ""}
                onChange={(e) => updateNodeData("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Select
                value={selectedNode.data?.dueDate || ""}
                onValueChange={(value) => updateNodeData("dueDate", value)}
              >
                <SelectTrigger id="dueDate">
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-day">Same Day</SelectItem>
                  <SelectItem value="next-day">Next Day</SelectItem>
                  <SelectItem value="3-days">Within 3 Days</SelectItem>
                  <SelectItem value="1-week">Within 1 Week</SelectItem>
                  <SelectItem value="2-weeks">Within 2 Weeks</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <RadioGroup
                value={selectedNode.data?.priority || "medium"}
                onValueChange={(value) => updateNodeData("priority", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high">High</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireEvidence"
                checked={selectedNode.data?.requireEvidence || false}
                onCheckedChange={(checked) => updateNodeData("requireEvidence", checked)}
              />
              <Label htmlFor="requireEvidence">Require evidence of completion</Label>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="text-sm text-muted-foreground">No properties available for this node type</p>
          </div>
        )
    }
  }

  return (
    <div className="border rounded-md">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Node Properties</h3>
          <Button variant="ghost" size="sm" onClick={deleteNode}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-4">{renderNodeForm()}</div>
    </div>
  )
}

// Workflow settings component
const WorkflowSettings = ({ workflow, setWorkflow }) => {
  return (
    <div className="border rounded-md">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-sm font-medium">Workflow Settings</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <Label htmlFor="workflow-name">Workflow Name</Label>
          <Input
            id="workflow-name"
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea
            id="workflow-description"
            value={workflow.description}
            onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="workflow-active"
            checked={workflow.active}
            onCheckedChange={(checked) => setWorkflow({ ...workflow, active: checked })}
          />
          <Label htmlFor="workflow-active">Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="workflow-log"
            checked={workflow.log || false}
            onCheckedChange={(checked) => setWorkflow({ ...workflow, log: checked })}
          />
          <Label htmlFor="workflow-log">Log workflow execution</Label>
        </div>
      </div>
    </div>
  )
}

// Main workflow page component
export default function WorkflowsSettingsPage() {
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS)
  const [activeWorkflowId, setActiveWorkflowId] = useState(workflows[0]?.id)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Get active workflow
  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0]

  // Update active workflow
  const updateActiveWorkflow = (updatedWorkflow) => {
    setWorkflows(workflows.map((w) => (w.id === activeWorkflowId ? updatedWorkflow : w)))
  }

  // Add new workflow
  const addNewWorkflow = () => {
    if (!newWorkflowName.trim()) return

    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      name: newWorkflowName,
      description: "New workflow",
      active: false,
      nodes: [],
      connections: [],
    }

    setWorkflows([...workflows, newWorkflow])
    setActiveWorkflowId(newWorkflow.id)
    setNewWorkflowName("")
    setShowNewWorkflowDialog(false)
  }

  // Filter nodes by search term
  const filteredNodeTypes =
    searchTerm.trim() === ""
      ? Object.values(NODE_TYPES)
      : Object.values(NODE_TYPES).filter((type) => type.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <DndProvider backend={HTML5Backend}>
      <TooltipProvider>
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Workflow Rules</h1>
            <p className="text-muted-foreground">Configure automated safeguarding workflows and rules</p>
          </div>

          {/* Workflow selector */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Select value={activeWorkflowId} onValueChange={setActiveWorkflowId}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      <div className="flex items-center gap-2">
                        <span>{workflow.name}</span>
                        {workflow.active && (
                          <Badge variant="secondary" className="ml-2">
                            Active
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setShowNewWorkflowDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                New Workflow
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-1" />
                Test
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="col-span-1 space-y-6">
              {/* Node types */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Workflow Elements</CardTitle>
                  <CardDescription>Drag elements to the canvas</CardDescription>
                  <div className="mt-2">
                    <Input
                      placeholder="Search elements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {filteredNodeTypes.includes(NODE_TYPES.TRIGGER) && (
                      <SidebarItem
                        type={NODE_TYPES.TRIGGER}
                        icon={ShieldAlert}
                        label="Incident Trigger"
                        description="Start workflow when incident is created/updated"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.CONDITION) && (
                      <SidebarItem
                        type={NODE_TYPES.CONDITION}
                        icon={Filter}
                        label="Condition"
                        description="Branch based on incident or student attributes"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.ACTION) && (
                      <SidebarItem
                        type={NODE_TYPES.ACTION}
                        icon={CheckCircle}
                        label="Action"
                        description="Create an action item for follow-up"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.NOTIFICATION) && (
                      <SidebarItem
                        type={NODE_TYPES.NOTIFICATION}
                        icon={BellRing}
                        label="Notification"
                        description="Send notification to staff member"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.DELAY) && (
                      <SidebarItem
                        type={NODE_TYPES.DELAY}
                        icon={Clock}
                        label="Delay"
                        description="Wait for specified time period"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.EMAIL) && (
                      <SidebarItem
                        type={NODE_TYPES.EMAIL}
                        icon={Mail}
                        label="Email"
                        description="Send email using template"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.ASSIGN) && (
                      <SidebarItem
                        type={NODE_TYPES.ASSIGN}
                        icon={UserCheck}
                        label="Assign"
                        description="Assign incident to staff member"
                      />
                    )}
                    {filteredNodeTypes.includes(NODE_TYPES.STATUS) && (
                      <SidebarItem
                        type={NODE_TYPES.STATUS}
                        icon={Tag}
                        label="Change Status"
                        description="Update incident status"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Workflow settings */}
              <WorkflowSettings workflow={activeWorkflow} setWorkflow={updateActiveWorkflow} />

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Available Tags</CardTitle>
                  <CardDescription>Use in conditions and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xs font-medium mb-1">Incident</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          incident.id
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          incident.category
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          incident.status
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          incident.priority
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium mb-1">Student</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          student.id
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          student.name
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          student.year
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          student.sen_status
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium mb-1">Staff</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          staff.id
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          staff.name
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          staff.role
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          staff.email
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main canvas and properties */}
            <div className="col-span-3 space-y-6">
              {/* Canvas */}
              <Canvas
                workflow={activeWorkflow}
                setWorkflow={updateActiveWorkflow}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
              />

              {/* Properties panel */}
              <PropertiesPanel
                workflow={activeWorkflow}
                setWorkflow={updateActiveWorkflow}
                selectedNodeId={selectedNodeId}
              />
            </div>
          </div>

          {/* New workflow dialog */}
          {showNewWorkflowDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background rounded-lg shadow-lg w-[400px] p-6">
                <h3 className="text-lg font-medium mb-4">Create New Workflow</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-workflow-name">Workflow Name</Label>
                    <Input
                      id="new-workflow-name"
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                      placeholder="Enter workflow name"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewWorkflowDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewWorkflow}>Create</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </DndProvider>
  )
}