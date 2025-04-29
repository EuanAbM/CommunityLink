"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define incident category types with colors and descriptions
export type IncidentCategory = {
  id: string
  color: string
  name: string
}

export const incidentCategories: IncidentCategory[] = [
  { id: "black", color: "bg-black", name: "Sexual Behavior" },
  { id: "red", color: "bg-red-500", name: "Violence" },
  { id: "amber", color: "bg-amber-500", name: "Bullying" },
  { id: "blue", color: "bg-blue-500", name: "Emotional" },
  { id: "green", color: "bg-green-500", name: "Self-Harm" },
  { id: "purple", color: "bg-purple-500", name: "Mental Health" },
  { id: "indigo", color: "bg-indigo-500", name: "Substance Misuse" },
  { id: "pink", color: "bg-pink-500", name: "Online Safety" },
  { id: "teal", color: "bg-teal-500", name: "Medical" },
  { id: "gray", color: "bg-gray-500", name: "Attendance" },
]

type IncidentCategoryDotsProps = {
  categories: string[]
}

export function IncidentCategoryDots({ categories }: IncidentCategoryDotsProps) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      <TooltipProvider>
        {categories.map((categoryId) => {
          const category = incidentCategories.find((c) => c.id === categoryId)
          if (!category) return null

          return (
            <Tooltip key={categoryId}>
              <TooltipTrigger asChild>
                <div
                  className={`w-3 h-3 rounded-full ${category.color} cursor-help transition-transform hover:scale-125`}
                  aria-label={category.name}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="px-3 py-1.5">
                <p>{category.name}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}

