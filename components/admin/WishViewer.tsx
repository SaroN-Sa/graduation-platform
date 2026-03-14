"use client"

import { useEffect, useRef, useState } from "react"

interface Wish {
  id: string
  name: string
  message: string
  photo_url?: string
  video_url?: string
}

interface Props {
  wishes: Wish[]
  startIndex: number
  onClose: () => void
}

export default function WishViewer({ wishes, startIndex, onClose }: Props) {

  const [index, setIndex] = useState(startIndex)
  const touchStart = useRef<number | null>(null)

  const wish = wishes[index]

  function next() {
    if (index < wishes.length - 1) {
      setIndex(index + 1)
    }
  }

  function prev() {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  // Mouse wheel scroll
  function handleWheel(e: WheelEvent) {
    if (e.deltaY > 0) next()
    else prev()
  }

  // Keyboard navigation
  function handleKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") next()
    if (e.key === "ArrowUp") prev()
    if (e.key === "Escape") onClose()
  }

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {

    if (touchStart.current === null) return

    const diff = touchStart.current - e.changedTouches[0].clientY

    if (diff > 50) next()
    if (diff < -50) prev()

    touchStart.current = null
  }

  useEffect(() => {

    window.addEventListener("wheel", handleWheel)
    window.addEventListener("keydown", handleKey)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKey)
    }

  })

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl z-50"
      >
        ✕
      </button>

      {/* Slide container */}
      <div className="relative w-full max-w-md h-[85vh] flex items-center justify-center">

        <div className="transition-all duration-500 w-full">

          {wish.video_url ? (

            <video
              src={wish.video_url}
              autoPlay
              controls
              className="w-full h-[65vh] object-contain rounded-xl"
            />

          ) : wish.photo_url ? (

            <img
              src={wish.photo_url}
              className="w-full h-[65vh] object-contain rounded-xl"
            />

          ) : (

            <div className="w-full h-[65vh] flex items-center justify-center bg-[#0f0b1f] rounded-xl text-white text-lg p-10 text-center">
              {wish.message}
            </div>

          )}

          {/* Caption */}
          <div className="text-white mt-6 text-center px-4">

            <p className="font-semibold text-lg">
              {wish.name}
            </p>

            <p className="text-gray-300 mt-2">
              {wish.message}
            </p>

          </div>

        </div>

      </div>

      {/* navigation hint */}
      <div className="absolute bottom-6 text-gray-400 text-sm">
        Swipe ↑ ↓ or Scroll
      </div>

    </div>
  )
}
