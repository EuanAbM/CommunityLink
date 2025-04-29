import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PrivacyScreen } from "@/components/privacy-screen"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-4">
          <div className="w-full max-w-sm mr-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search students, incidents..." className="w-full pl-8 bg-background" />
            </div>
          </div>
          <PrivacyScreen />
          <UserNav />
        </div>
        <div className="md:hidden flex items-center ml-auto">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

