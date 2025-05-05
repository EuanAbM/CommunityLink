import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A"
  const d = new Date(date)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string | undefined): string {
  if (!date) return "N/A"
  const d = new Date(date)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getInitials(firstName: string | undefined, lastName: string | undefined): string {
  const firstInitial = firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

export function getAgeFromDOB(dob: Date): number {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function daysSince(date: Date | undefined): number | null {
  if (!date) return null

  const today = new Date()
  const pastDate = new Date(date)

  // Calculate the time difference in milliseconds
  const timeDiff = today.getTime() - pastDate.getTime()

  // Convert the time difference to days
  return Math.floor(timeDiff / (1000 * 3600 * 24))
}

export function getSafeguardingStatusColor(status: string | undefined): string {
  if (!status) return "bg-gray-100 text-gray-800"

  switch (status) {
    case "None":
      return "bg-gray-100 text-gray-800"
    case "CP":
      return "bg-red-100 text-red-800"
    case "CIN":
      return "bg-amber-100 text-amber-800"
    case "LAC":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-amber-100 text-amber-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "reported":
      return "bg-blue-100 text-blue-800"
    case "in_progress":
      return "bg-amber-100 text-amber-800"
    case "escalated":
      return "bg-red-100 text-red-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}
