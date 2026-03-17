"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import WishCardAdmin from "./WishCardAdmin"
import WishSearch from "./WishSearch"
import WishFilters from "./WishFilters"
import WishViewer from "./WishViewer"

interface Wish {
  id: string
  name: string
  message: string
  photo_url?: string
  video_url?: string
  featured: boolean
}

interface Props {
  slug: string
}

export default function WishDashboard({ slug }: Props) {

  const [wishes, setWishes] = useState<Wish[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const [message, setMessage] = useState<string | null>(null)

  function notify(text: string) {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  async function loadWishes() {

    let query = supabase
      .from("wishes")
      .select("*")
      .eq("graduate_slug", slug)
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (filter === "featured") {
      query = query.eq("featured", true)
    }

    if (filter === "video") {
      query = query.not("video_url", "is", null)
    }

    if (filter === "photo") {
      query = query.not("photo_url", "is", null)
    }

    const { data, error } = await query

    if (error) {
      notify("Failed to load wishes")
      return
    }

    setWishes(data || [])
  }

  useEffect(() => {
    loadWishes()
  }, [search, filter, slug])

  return (

    <div className="px-4">

      {/* Notification */}
      {message && (
        <div className="mb-4 text-sm text-green-400 text-center">
          {message}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <WishSearch
          value={search}
          onChange={setSearch}
        />

        <WishFilters
          value={filter}
          onChange={setFilter}
        />

      </div>

      {/* Empty State */}
      {wishes.length === 0 && (
        <p className="text-gray-400">
          No wishes found
        </p>
      )}

      {/* Grid */}
      {wishes.length > 0 && (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {wishes.map((wish, i) => (

            <WishCardAdmin
              key={wish.id}
              wish={wish}
              onOpen={() => setViewerIndex(i)}
              onRefresh={loadWishes}
            />

          ))}

        </div>

      )}

      {/* Viewer */}
      {viewerIndex !== null && (

        <WishViewer
          wishes={wishes}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />

      )}

    </div>
  )
}