"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Shield,
  Users,
  School,
  Mail,
  Tag,
  GitBranch,
  ShieldAlert,
  FileText,
  Layers,
  Bell,
  Lock,
  Database,
} from "lucide-react"

export function SettingsSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path)
  }

  const navItems = [
    { href: "/settings", icon: Shield, label: "General", exact: true },
    { href: "/settings/users", icon: Users, label: "Users & Permissions" },
    { href: "/settings/school", icon: School, label: "School Information" },
    { href: "/settings/email", icon: Mail, label: "Email Notifications" },
    { href: "/settings/categories", icon: Tag, label: "Categories & Statuses" },
    { href: "/settings/workflows", icon: GitBranch, label: "Workflow Rules" },
    { href: "/settings/policies", icon: ShieldAlert, label: "Safeguarding Policies" },
    { href: "/settings/reports", icon: FileText, label: "Report Templates" },
    { href: "/settings/integrations", icon: Layers, label: "Integrations" },
    { href: "/settings/data", icon: Database, label: "Data Management" },
    { href: "/settings/alerts", icon: Bell, label: "Alerts & Notifications" },
    { href: "/settings/security", icon: Lock, label: "Security & Audit" },
  ]

  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <nav className="relative h-full py-6 pr-6 lg:py-8">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

