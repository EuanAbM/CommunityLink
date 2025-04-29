"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Marker {
  id: string
  x: number
  y: number
  note: string
}

export function BodyMap() {
  const [markers, setMarkers] = useState<Marker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [note, setNote] = useState("")

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newMarker: Marker = {
      id: `marker-${Date.now()}`,
      x,
      y,
      note: "",
    }

    setMarkers([...markers, newMarker])
    setSelectedMarker(newMarker.id)
    setNote("")
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value)
  }

  const saveNote = () => {
    if (selectedMarker && note.trim()) {
      setMarkers(markers.map((marker) => (marker.id === selectedMarker ? { ...marker, note } : marker)))
      setSelectedMarker(null)
      setNote("")
    }
  }

  const removeMarker = (id: string) => {
    setMarkers(markers.filter((marker) => marker.id !== id))
    if (selectedMarker === id) {
      setSelectedMarker(null)
      setNote("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div
            className="relative border rounded-md overflow-hidden cursor-crosshair bg-gray-50 dark:bg-gray-800"
            style={{ width: "300px", height: "400px" }}
            onClick={handleImageClick}
          >
            {/* Simplified body outline */}
            <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-gray-400"></div>
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 w-1 h-24 bg-gray-400"></div>
            <div className="absolute left-[calc(50%-40px)] top-[45%] w-1 h-20 bg-gray-400 rotate-45"></div>
            <div className="absolute left-[calc(50%+40px)] top-[45%] w-1 h-20 bg-gray-400 -rotate-45"></div>
            <div className="absolute left-[calc(50%-10px)] top-[70%] w-1 h-20 bg-gray-400 rotate-12"></div>
            <div className="absolute left-[calc(50%+10px)] top-[70%] w-1 h-20 bg-gray-400 -rotate-12"></div>

            {/* Place markers */}
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white -translate-x-3 -translate-y-3 cursor-pointer"
                style={{ left: marker.x, top: marker.y }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedMarker(marker.id)
                  setNote(marker.note)
                }}
              >
                <span className="text-xs">{markers.indexOf(marker) + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 space-y-4">
            {selectedMarker ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note">
                    Add note for marker {markers.findIndex((m) => m.id === selectedMarker) + 1}
                  </Label>
                  <Input
                    id="note"
                    placeholder="Describe the mark or injury..."
                    value={note}
                    onChange={handleNoteChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveNote}>Save Note</Button>
                  <Button variant="outline" onClick={() => removeMarker(selectedMarker)}>
                    Remove Marker
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                <p>Click on the body map to add a marker for injuries or concerns.</p>
                {markers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Markers:</h4>
                    <ul className="space-y-1">
                      {markers.map((marker, index) => (
                        <li key={marker.id} className="flex items-start gap-2">
                          <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{marker.note || "No note added"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

