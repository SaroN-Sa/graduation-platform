"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"
import WishCard from "./WishCard"

interface Wish {
  id: string
  name: string
  message: string
  photo_url?: string
  video_url?: string
}

interface Props {
  slug: string
}

export default function WishList({ slug }: Props) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [viewerOpen, setViewerOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  async function loadWishes() {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("graduate_slug", slug)
      .eq("featured", true)
      .order("created_at", { ascending: false })

    if (!error) {
      setWishes(data || [])
    }
  }

  useEffect(() => {
    loadWishes()
  }, [slug])

  // Scroll to selected wish
  useEffect(() => {
    if (viewerOpen && containerRef.current) {
      containerRef.current.scrollTo({
        top: startIndex * window.innerHeight,
        behavior: "instant"
      })
    }
  }, [viewerOpen, startIndex])

  if (wishes.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-10">
        No featured wishes yet ⭐
      </p>
    )
  }

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishes.map((wish, index) => (
          <div
            key={wish.id}
            onClick={() => {
              setStartIndex(index)
              setViewerOpen(true)
            }}
            className="cursor-pointer"
          >
            <WishCard wish={wish} />
          </div>
        ))}
      </div>

      {/* VIEWER */}
      {viewerOpen && (
        <div className="fixed inset-0 bg-black z-50">

          {/* CLOSE */}
          <button
            onClick={() => setViewerOpen(false)}
            className="fixed top-4 right-4 text-white text-2xl z-50"
          >
            ✕
          </button>

          {/* SCROLL */}
          <div
            ref={containerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
          >
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="h-screen snap-start flex items-center justify-center px-4"
              >
                <div className="w-full max-w-4xl">

                  {/* MEDIA */}
                  {wish.video_url ? (
                    <video
                      ref={(el) => {
                        if (!el) return

                        const observer = new IntersectionObserver(
                          ([entry]) => {
                            if (entry.isIntersecting) {
                              el.play().catch(() => {})
                            } else {
                              el.pause()
                            }
                          },
                          { threshold: 0.6 }
                        )

                        observer.observe(el)
                      }}
                      src={wish.video_url}
                      muted
                      playsInline
                      controls
                      className="w-full max-h-[70vh] object-contain rounded-xl"
                    />
                  ) : wish.photo_url ? (
                    <img
                      src={wish.photo_url}
                      className="w-full max-h-[70vh] object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full bg-[#0f0b1f] rounded-xl p-6 text-white text-center">
                      {wish.message}
                    </div>
                  )}

                  {/* TEXT */}
                  <div className="text-center text-white mt-6">
                    <p className="font-semibold text-lg">
                      {wish.name}
                    </p>

                    <p className="text-gray-300 mt-2">
                      {wish.message}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* HINT */}
          <div className="fixed bottom-6 w-full  text-center text-gray-400 text-xs">
            Swipe up / down
          </div>

        </div>
      )}
    </>
  )
}
