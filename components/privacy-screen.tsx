"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrivacyScreen() {
  const [isPrivate, setIsPrivate] = useState(false);

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
  };

  // Add keyboard shortcut (Alt+P) to toggle privacy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "p") {
        togglePrivacy();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPrivate]);

  if (!isPrivate) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePrivacy}
        className="h-8 w-8"
        title="Enable privacy screen (Alt+P)"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Enable privacy screen</span>
      </Button>
    );
  }

  // Render the overlay using a React Portal
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePrivacy}
        className="h-8 w-8 relative z-50"
        title="Disable privacy screen (Alt+P)"
      >
        <EyeOff className="h-4 w-4" />
        <span className="sr-only">Disable privacy screen</span>
      </Button>
      {createPortal(
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <EyeOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Privacy Screen Enabled</h2>
            <p className="text-muted-foreground mb-4">
              The screen content is hidden for privacy. Click the eye icon or press Alt+P to show content.
            </p>
          </div>
        </div>,
        document.body // Render the overlay at the root level of the DOM
      )}
    </>
  );
}