"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function PrivacyToggle() {
  const [isPrivate, setIsPrivate] = useState(false)

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate)
  }

  return (
    <>
      {isPrivate && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="text-center p-6 bg-background rounded-lg shadow-lg">
            <EyeOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Privacy Mode Active</h2>
            <p className="text-muted-foreground mb-4">Screen content is hidden for privacy</p>
            <Button onClick={togglePrivacy}>Show Screen</Button>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={togglePrivacy}
        className="relative"
        aria-label={isPrivate ? "Disable privacy mode" : "Enable privacy mode"}
      >
        {isPrivate ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </Button>
    </>
  )
}

