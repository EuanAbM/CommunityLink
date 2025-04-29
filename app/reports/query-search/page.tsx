"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Filter, Search, Sparkles } from "lucide-react"
import Link from "next/link"

export default function QuerySearchPage() {
  const [useAI, setUseAI] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYearGroups, setSelectedYearGroups] = useState<string[]>([])
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([])
  const [ageRange, setAgeRange] = useState({ min: "", max: "" })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isEAL, setIsEAL] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const yearGroups = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
    "Year 11",
    "Year 12",
    "Year 13",
  ]

  const ethnicities = [
    "White British",
    "White Irish",
    "White Other",
    "Black Caribbean",
    "Black African",
    "Black Other",
    "Asian Indian",
    "Asian Pakistani",
    "Asian Bangladeshi",
    "Asian Chinese",
    "Asian Other",
    "Mixed White/Black Caribbean",
    "Mixed White/Black African",
    "Mixed White/Asian",
    "Mixed Other",
    "Other Ethnic Group",
  ]

  const languages = [
    "Albanian",
    "Arabic",
    "Bengali",
    "Bulgarian",
    "Chinese (Cantonese)",
    "Chinese (Mandarin)",
    "Czech",
    "Dutch",
    "Farsi",
    "French",
    "German",
    "Greek",
    "Gujarati",
    "Hindi",
    "Hungarian",
    "Italian",
    "Japanese",
    "Korean",
    "Kurdish",
    "Lithuanian",
    "Nepali",
    "Pashto",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Slovak",
    "Somali",
    "Spanish",
    "Swahili",
    "Tamil",
    "Thai",
    "Turkish",
    "Urdu",
    "Vietnamese",
    "Welsh",
    "Yoruba",
  ]

  const incidentCategories = [
    "Bullying",
    "Physical Abuse",
    "Emotional Abuse",
    "Neglect",
    "Sexual Abuse",
    "Disclosure",
    "Self-Harm",
    "Attendance",
    "Mental Health",
    "Online Safety",
    "Peer-on-Peer",
    "Other",
  ]

  const toggleYearGroup = (yearGroup: string) => {
    if (selectedYearGroups.includes(yearGroup)) {
      setSelectedYearGroups(selectedYearGroups.filter((y) => y !== yearGroup))
    } else {
      setSelectedYearGroups([...selectedYearGroups, yearGroup])
    }
  }

  const toggleEthnicity = (ethnicity: string) => {
    if (selectedEthnicities.includes(ethnicity)) {
      setSelectedEthnicities(selectedEthnicities.filter((e) => e !== ethnicity))
    } else {
      setSelectedEthnicities([...selectedEthnicities, ethnicity])
    }
  }

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language))
    } else {
      setSelectedLanguages([...selectedLanguages, language])
    }
  }

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSearch = () => {
    // In a real app, this would perform the actual search
    setShowResults(true)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedYearGroups([])
    setSelectedEthnicities([])
    setAgeRange({ min: "", max: "" })
    setSelectedCategories([])
    setIsEAL(false)
    setSelectedLanguages([])
    setShowResults(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Query Search</h1>
            <p className="text-muted-foreground">Advanced search across student records and incidents</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Parameters</CardTitle>
                  <CardDescription>Define your search criteria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="search-query">Search Query</Label>
                    <Input
                      id="search-query"
                      placeholder="Enter keywords or phrases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
                    <Label htmlFor="use-ai" className="flex items-center gap-2">
                      Enhance query with AI
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </Label>
                  </div>

                  {useAI && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm">
                      <p>AI enhancement will:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Expand search terms with relevant synonyms</li>
                        <li>Include contextually related safeguarding concerns</li>
                        <li>Improve natural language understanding</li>
                      </ul>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Label>Year Groups</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {yearGroups.map((yearGroup) => (
                        <div key={yearGroup} className="flex items-center space-x-2">
                          <Checkbox
                            id={`year-${yearGroup}`}
                            checked={selectedYearGroups.includes(yearGroup)}
                            onCheckedChange={() => toggleYearGroup(yearGroup)}
                          />
                          <Label htmlFor={`year-${yearGroup}`} className="text-sm">
                            {yearGroup}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Age Range</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="w-20"
                        value={ageRange.min}
                        onChange={(e) => setAgeRange({ ...ageRange, min: e.target.value })}
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="w-20"
                        value={ageRange.max}
                        onChange={(e) => setAgeRange({ ...ageRange, max: e.target.value })}
                      />
                      <span>years</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Ethnicity</Label>
                    <div className="h-40 overflow-y-auto border rounded-md p-2">
                      {ethnicities.map((ethnicity) => (
                        <div key={ethnicity} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`ethnicity-${ethnicity}`}
                            checked={selectedEthnicities.includes(ethnicity)}
                            onCheckedChange={() => toggleEthnicity(ethnicity)}
                          />
                          <Label htmlFor={`ethnicity-${ethnicity}`} className="text-sm">
                            {ethnicity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="eal" checked={isEAL} onCheckedChange={() => setIsEAL(!isEAL)} />
                      <Label htmlFor="eal">English as an Additional Language (EAL)</Label>
                    </div>

                    {isEAL && (
                      <div className="space-y-2 pl-6">
                        <Label>Languages</Label>
                        <div className="h-40 overflow-y-auto border rounded-md p-2">
                          {languages.map((language) => (
                            <div key={language} className="flex items-center space-x-2 py-1">
                              <Checkbox
                                id={`language-${language}`}
                                checked={selectedLanguages.includes(language)}
                                onCheckedChange={() => toggleLanguage(language)}
                              />
                              <Label htmlFor={`language-${language}`} className="text-sm">
                                {language}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Incident Categories</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {incidentCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label htmlFor={`category-${category}`} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={handleSearch}>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    {showResults ? (
                      <div className="flex items-center gap-2">
                        <span>Found 24 results matching your criteria</span>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <Download className="mr-2 h-4 w-4" />
                          Export Results
                        </Button>
                      </div>
                    ) : (
                      "Use the search parameters to find matching records"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showResults ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            Query: {searchQuery}
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        )}
                        {selectedYearGroups.map((year) => (
                          <Badge key={year} variant="secondary" className="flex items-center gap-1">
                            {year}
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        ))}
                        {selectedEthnicities.map((ethnicity) => (
                          <Badge key={ethnicity} variant="secondary" className="flex items-center gap-1">
                            {ethnicity}
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        ))}
                        {ageRange.min && ageRange.max && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            Age: {ageRange.min}-{ageRange.max}
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        )}
                        {isEAL && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            EAL
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        )}
                        {selectedLanguages.map((language) => (
                          <Badge key={language} variant="secondary" className="flex items-center gap-1">
                            {language}
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        ))}
                        {selectedCategories.map((category) => (
                          <Badge key={category} variant="secondary" className="flex items-center gap-1">
                            {category}
                            <button className="ml-1 hover:text-primary">&times;</button>
                          </Badge>
                        ))}
                      </div>

                      <Tabs defaultValue="students">
                        <TabsList>
                          <TabsTrigger value="students">Students (15)</TabsTrigger>
                          <TabsTrigger value="incidents">Incidents (9)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="students" className="mt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Year Group</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Ethnicity</TableHead>
                                <TableHead>Safeguarding</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell className="font-medium">
                                    {
                                      [
                                        "Oliver Williams",
                                        "Sophia Jones",
                                        "Harry Williams",
                                        "Emily Davis",
                                        "Mohammed Ali",
                                      ][i]
                                    }
                                  </TableCell>
                                  <TableCell>{["Year 7", "Year 8", "Year 5", "Year 6", "Year 9"][i]}</TableCell>
                                  <TableCell>{[12, 13, 10, 11, 14][i]}</TableCell>
                                  <TableCell>
                                    {
                                      [
                                        "White British",
                                        "Bangladeshi",
                                        "White British",
                                        "Black African",
                                        "Asian Pakistani",
                                      ][i]
                                    }
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        [
                                          "bg-amber-100 text-amber-800",
                                          "bg-red-100 text-red-800",
                                          "bg-gray-100 text-gray-800",
                                          "bg-purple-100 text-purple-800",
                                          "bg-gray-100 text-gray-800",
                                        ][i]
                                      }
                                    >
                                      {["CIN", "CP", "None", "LAC", "None"][i]}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/students/student-${i + 1}`}>View</Link>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                        <TabsContent value="incidents" className="mt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    {["15 Mar 2024", "20 Mar 2024", "10 Mar 2024", "05 Mar 2024", "01 Mar 2024"][i]}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {
                                      [
                                        "Oliver Williams",
                                        "Sophia Jones",
                                        "Emily Davis",
                                        "Harry Williams",
                                        "Mohammed Ali",
                                      ][i]
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {["Bullying", "Disclosure", "Attendance", "Mental Health", "Online Safety"][i]}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        [
                                          "bg-amber-100 text-amber-800",
                                          "bg-red-100 text-red-800",
                                          "bg-green-100 text-green-800",
                                          "bg-amber-100 text-amber-800",
                                          "bg-blue-100 text-blue-800",
                                        ][i]
                                      }
                                    >
                                      {["in_progress", "escalated", "resolved", "in_progress", "reported"][i]}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/incidents/incident-${i + 1}`}>View</Link>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Filter className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No search performed yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Use the search parameters on the left to find students and incidents matching your criteria.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

