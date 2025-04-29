"use client"

interface BodyMapMarkerProps {
  marker: {
    id: string
    x: number
    y: number
    note: string
    view?: string // Make view optional since we're not using tabs anymore
  }
  index: number
  onClick: () => void
}

export function BodyMapMarker({ marker, index, onClick }: BodyMapMarkerProps) {
  return (
    <div
      className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white -translate-x-3 -translate-y-3 cursor-pointer hover:bg-red-600 transition-colors"
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={marker.note || `Marker ${index}`}
    >
      <span className="text-xs">{index}</span>
    </div>
  )
}

