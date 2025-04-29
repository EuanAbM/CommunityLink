"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, X } from "lucide-react"

type StudentFilterProps = {
  onFilter: (filters: any) => void
}

export function StudentFilter({ onFilter }: StudentFilterProps) {
  const [yearGroup, setYearGroup] = React.useState<string>("")
  const [safeguardingStatus, setSafeguardingStatus] = React.useState<string[]>([])
  const [searchTerm, setSearchTerm] = React.useState<string>("")
  const [activeFilters, setActiveFilters] = React.useState<string[]>([])
  const [sen, setSen] = React.useState<boolean>(false)
  const [fsm, setFsm] = React.useState<boolean>(false)
  const [pp, setPp] = React.useState<boolean>(false)

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

  const safeguardingStatuses = ["CP", "CIN", "LAC", "None"]

  const handleStatusToggle = (status: string) => {
    if (safeguardingStatus.includes(status)) {
      setSafeguardingStatus(safeguardingStatus.filter((s) => s !== status))
    } else {
      setSafeguardingStatus([...safeguardingStatus, status])
    }
  }

  const applyFilters = () => {
    const newActiveFilters = []

    if (yearGroup) {
      newActiveFilters.push(yearGroup)
    }

    if (safeguardingStatus.length > 0) {
      newActiveFilters.push(...safeguardingStatus)
    }

    if (searchTerm) {
      newActiveFilters.push(`Search: ${searchTerm}`)
    }

    if (sen) {
      newActiveFilters.push("SEN")
    }

    if (fsm) {
      newActiveFilters.push("FSM")
    }

    if (pp) {
      newActiveFilters.push("PP")
    }

    setActiveFilters(newActiveFilters)

    onFilter({
      yearGroup,
      safeguardingStatus,
      searchTerm,
      sen,
      fsm,
      pp,
    })
  }

  const clearFilters = () => {
    setYearGroup("")
    setSafeguardingStatus([])
    setSearchTerm("")
    setSen(false)
    setFsm(false)
    setPp(false)
    setActiveFilters([])

    onFilter({
      yearGroup: "",
      safeguardingStatus: [],
      searchTerm: "",
      sen: false,
      fsm: false,
      pp: false,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:w-[300px]"
        />

        <Select value={yearGroup} onValueChange={setYearGroup}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Year Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Year Groups</SelectItem>
            {yearGroups.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Safeguarding Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {safeguardingStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={safeguardingStatus.includes(status)}
                onCheckedChange={() => handleStatusToggle(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-4 sm:w-auto sm:ml-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="sen" checked={sen} onCheckedChange={(checked) => setSen(checked as boolean)} />
            <label htmlFor="sen" className="text-sm font-medium leading-none cursor-pointer">
              SEN
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="fsm" checked={fsm} onCheckedChange={(checked) => setFsm(checked as boolean)} />
            <label htmlFor="fsm" className="text-sm font-medium leading-none cursor-pointer">
              FSM
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pp" checked={pp} onCheckedChange={(checked) => setPp(checked as boolean)} />
            <label htmlFor="pp" className="text-sm font-medium leading-none cursor-pointer">
              PP
            </label>
          </div>
        </div>

        <Button onClick={applyFilters} className="sm:ml-auto">
          Apply Filters
        </Button>
        {activeFilters.length > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary">
              {filter}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

