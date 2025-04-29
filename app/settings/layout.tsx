"use client"

import type React from "react"

import type { ReactNode } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Mail, Tag, GitBranch, ShieldAlert, FileText, Layers, Bell, Lock, Database, Bot, Target } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <nav className="relative h-full py-6 pr-6 lg:py-8">
  <div className="space-y-1">
    <SettingsNavItem href="/settings" icon={Shield} exact>
      General
    </SettingsNavItem>
    <SettingsNavItem href="/settings/email" icon={Mail} exact>
      Email Notifications
    </SettingsNavItem>
    <SettingsNavItem href="/settings/categories" icon={Tag} exact>
      Categories & Statuses
    </SettingsNavItem>
    <SettingsNavItem href="/settings/agency" icon={Target} exact>
      3rd Party Agencies
    </SettingsNavItem>
    <SettingsNavItem href="/settings/workflows" icon={GitBranch} exact>
      Workflow Rules
    </SettingsNavItem>
    <SettingsNavItem href="/settings/ai-integration" icon={Bot} exact>
      AI Integration
    </SettingsNavItem>
    <SettingsNavItem href="/settings/policies" icon={ShieldAlert} exact>
      Safeguarding Policies
    </SettingsNavItem>
    <SettingsNavItem href="/settings/reports" icon={FileText} exact>
      Report Templates
    </SettingsNavItem>
    <SettingsNavItem href="/settings/integrations" icon={Layers} exact>
      Integrations
    </SettingsNavItem>
    <SettingsNavItem href="/settings/data" icon={Database} exact>
      Data Management
    </SettingsNavItem>
    <SettingsNavItem href="/settings/alerts" icon={Bell} exact>
      Alerts & Notifications
    </SettingsNavItem>
    <SettingsNavItem href="/settings/security" icon={Lock} exact>
      Security & Audit
    </SettingsNavItem>
  </div>
</nav>
        </aside>
        <main className="relative py-6">{children}</main>
      </div>
    </div>
  )
}

interface SettingsNavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  exact?: boolean
}

function SettingsNavItem({ href, icon: Icon, children, exact }: SettingsNavItemProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  )
}

