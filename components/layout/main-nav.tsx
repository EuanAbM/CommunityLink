"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/students",
      label: "Students",
      active: pathname === "/students" || pathname.startsWith("/students/"),
    },
    {
      href: "/incidents",
      label: "Incidents",
      active: pathname === "/incidents" || pathname.startsWith("/incidents/"),
    },
    {
      href: "/users",
      label: "Users",
      active: pathname === "/users" || pathname.startsWith("/users/"),
    },
    {
      href: "/reports",
      label: "Reports",
      active: pathname === "/reports" || pathname.startsWith("/reports/"),
    },
    {
      href: "/settings",
      label: "Settings",
      active: pathname === "/settings" || pathname.startsWith("/settings/"),
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Shield className="h-6 w-6" />
        <span className="font-bold inline-block">CommunityLink</span>
      </Link>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

