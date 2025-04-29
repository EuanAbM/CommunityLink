import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Search, UserPlus, Users } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common safeguarding and administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Button asChild variant="outline" className="h-20 justify-start text-left flex flex-col items-start">
            <Link href="/incidents/new">
              <FileText className="h-5 w-5 mb-1" />
              <div>
                <div className="font-medium">Record Incident</div>
                <div className="text-xs text-muted-foreground">Log a new safeguarding concern</div>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 justify-start text-left flex flex-col items-start">
            <Link href="/students">
              <Search className="h-5 w-5 mb-1" />
              <div>
                <div className="font-medium">Find Student</div>
                <div className="text-xs text-muted-foreground">Search student records</div>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 justify-start text-left flex flex-col items-start">
            <Link href="/students/add">
              <UserPlus className="h-5 w-5 mb-1" />
              <div>
                <div className="font-medium">Add Student</div>
                <div className="text-xs text-muted-foreground">Create a new student record</div>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 justify-start text-left flex flex-col items-start">
            <Link href="/users">
              <Users className="h-5 w-5 mb-1" />
              <div>
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-muted-foreground">View and edit staff accounts</div>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

