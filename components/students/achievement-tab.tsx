import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Trophy } from "lucide-react"
import { AddAchievementDialog } from "./add-achievement-dialog"

interface AchievementData {
  subjects: {
    name: string
    predicted: string
    workingAt: string
    expected: string
  }[]
  awards: {
    name: string
    date: string
    description: string
  }[]
}

interface AchievementTabProps {
  studentId: string
}

export function AchievementTab({ studentId }: AchievementTabProps) {
  // This would normally be fetched from an API
  const achievementData: AchievementData = {
    subjects: [
      { name: "English", predicted: "B", workingAt: "C", expected: "B" },
      { name: "Mathematics", predicted: "A", workingAt: "A", expected: "A" },
      { name: "Science", predicted: "B", workingAt: "B", expected: "B" },
      { name: "History", predicted: "C", workingAt: "C", expected: "B" },
      { name: "Geography", predicted: "B", workingAt: "B", expected: "B" },
      { name: "Art", predicted: "A", workingAt: "A", expected: "A" },
      { name: "Physical Education", predicted: "B", workingAt: "B", expected: "B" },
      { name: "Computing", predicted: "A", workingAt: "B", expected: "A" },
    ],
    awards: [
      { name: "Star of the Week", date: "2024-02-15", description: "Excellence in Mathematics" },
      { name: "Sports Achievement", date: "2023-11-10", description: "Outstanding contribution to school sports" },
    ],
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription>Current academic performance by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Predicted Grade</TableHead>
                <TableHead>Working At</TableHead>
                <TableHead>Expected Grade</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievementData.subjects.map((subject) => {
                const isOnTrack = subject.workingAt >= subject.expected
                const isExceeding = subject.workingAt > subject.expected

                return (
                  <TableRow key={subject.name}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.predicted}</TableCell>
                    <TableCell>{subject.workingAt}</TableCell>
                    <TableCell>{subject.expected}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isExceeding
                            ? "bg-green-100 text-green-800"
                            : isOnTrack
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {isExceeding ? "Exceeding" : isOnTrack ? "On Track" : "Below Target"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Awards & Achievements</CardTitle>
            <CardDescription>Recognition and accomplishments</CardDescription>
          </div>
          <AddAchievementDialog studentId={studentId} />
        </CardHeader>
        <CardContent>
          {achievementData.awards.length > 0 ? (
            <div className="space-y-4">
              {achievementData.awards.map((award, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{award.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(award.date)}</p>
                      <p className="text-sm mt-1">{award.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No awards or achievements recorded</p>
              <AddAchievementDialog studentId={studentId} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracurricular Activities</CardTitle>
          <CardDescription>Clubs and additional participation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>No extracurricular activities recorded</p>
            <Button className="mt-4" variant="outline">
              Add Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

