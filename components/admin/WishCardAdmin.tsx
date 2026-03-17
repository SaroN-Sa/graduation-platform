"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Wish {
  id: string
  name: string
  message: string
  photo_url?: string
  video_url?: string
  featured: boolean
}

interface Props {
  wish: Wish
  onOpen: () => void
  onRefresh: () => void
}

export default function WishCardAdmin({ wish, onOpen, onRefresh }: Props) {

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function notify(text: string) {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  async function toggleFeatured() {
    setLoading(true)

    const { error } = await supabase
      .from("wishes")
      .update({ featured: !wish.featured })
      .eq("id", wish.id)

    setLoading(false)

    if (error) {
      notify("Failed to update")
      return
    }

    notify("Updated")
    onRefresh()
  }

  async function deleteWish() {
    setLoading(true)

    const { error } = await supabase
      .from("wishes")
      .delete()
      .eq("id", wish.id)

    setLoading(false)

    if (error) {
      notify("Delete failed")
      return
    }

    notify("Deleted")
    setConfirmDelete(false)
    onRefresh()
  }

  return (

    <div className="bg-[#0f0b1f] border border-[#2a2f45] rounded-xl overflow-hidden shadow hover:shadow-lg transition relative">

      {/* Notification */}
      {message && (
        <div className="absolute top-2 left-2 right-2 bg-green-500 text-black text-xs px-2 py-1 rounded text-center z-10">
          {message}
        </div>
      )}

      {/* MEDIA */}
      <div
        onClick={onOpen}
        className="cursor-pointer relative group"
      >

        {wish.video_url ? (
          <>
            <video
              src={wish.video_url}
              muted
              className="w-full h-44 sm:h-48 md:h-52 object-cover pointer-events-none"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-2xl opacity-80 group-hover:opacity-100 transition">
              ▶
            </div>
          </>
        ) : wish.photo_url ? (
          <>
            <img
              src={wish.photo_url}
              className="w-full h-44 sm:h-48 md:h-52 object-cover"
              alt={wish.name}
            />

            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition">
              View
            </div>
          </>
        ) : (
          <div className="w-full h-44 flex items-center justify-center bg-[#14102a] text-gray-400 text-sm">
            No Media
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-4">

        <p className="font-semibold text-white truncate">
          {wish.name}
        </p>

        <p className="text-sm text-gray-400 mt-1 line-clamp-3">
          {wish.message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-between items-center mt-4 text-sm">

          <button
            onClick={toggleFeatured}
            disabled={loading}
            className={`font-medium ${
              wish.featured ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {wish.featured ? "⭐ Featured" : "☆ Feature"}
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
            className="text-red-400 font-medium"
          >
            🗑 Delete
          </button>

        </div>

        {/* DELETE CONFIRM */}
        {confirmDelete && (
          <div className="mt-3 bg-black/40 p-2 rounded text-xs flex justify-between items-center">

            <span className="text-gray-300">
              Delete this wish?
            </span>

            <div className="flex gap-3">

              <button
                onClick={deleteWish}
                className="text-red-400"
              >
                Yes
              </button>

              <button
                onClick={() => setConfirmDelete(false)}
                className="text-gray-400"
              >
                No
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  )
}