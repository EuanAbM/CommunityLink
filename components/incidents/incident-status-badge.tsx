import { Badge } from "@/components/ui/badge"

interface IncidentStatusBadgeProps {
  status: string
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  let className = ""

  switch (status.toLowerCase()) {
    case "new":
      className = "bg-blue-100 text-blue-800"
      break
    case "in_progress":
    case "in progress":
      className = "bg-amber-100 text-amber-800"
      break
    case "escalated":
      className = "bg-red-100 text-red-800"
      break
    case "resolved":
      className = "bg-green-100 text-green-800"
      break
    case "closed":
      className = "bg-gray-100 text-gray-800"
      break
    case "monitoring":
      className = "bg-purple-100 text-purple-800"
      break
    case "pending_approval":
    case "pending approval":
      className = "bg-indigo-100 text-indigo-800"
      break
    default:
      className = "bg-gray-100 text-gray-800"
  }

  return (
    <Badge variant="outline" className={className}>
      {status.replace("_", " ")}
    </Badge>
  )
}

