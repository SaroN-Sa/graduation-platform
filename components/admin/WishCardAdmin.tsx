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

  async function toggleFeatured() {
    setLoading(true)

    const { error } = await supabase
      .from("wishes")
      .update({ featured: !wish.featured })
      .eq("id", wish.id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Failed to update featured status")
      return
    }

    onRefresh()
  }

  async function deleteWish() {
    const confirmDelete = confirm("Delete this wish?")
    if (!confirmDelete) return

    setLoading(true)

    const { error } = await supabase
      .from("wishes")
      .delete()
      .eq("id", wish.id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Failed to delete wish")
      return
    }

    onRefresh()
  }

  return (
    <div className="bg-[#0f0b1f] border border-[#2a2f45] rounded-xl p-4">

      {/* Media */}
      <div
        className="cursor-pointer mb-3"
        onClick={onOpen}
      >
        {wish.video_url ? (
          <video
            src={wish.video_url}
            className="rounded-lg w-full"
            controls
          />
        ) : wish.photo_url ? (
          <img
            src={wish.photo_url}
            className="rounded-lg w-full"
            alt={wish.name}
          />
        ) : null}
      </div>

      {/* Text */}
      <p className="font-semibold text-white">{wish.name}</p>
      <p className="text-sm text-gray-400">{wish.message}</p>

      {/* Buttons */}
      <div className="flex gap-4 mt-3">

        <button
          onClick={toggleFeatured}
          disabled={loading}
          className={`text-sm font-medium ${
            wish.featured
              ? "text-green-400"
              : "text-yellow-400"
          }`}
        >
          {wish.featured ? "⭐ Featured" : "☆ Feature"}
        </button>

        <button
          onClick={deleteWish}
          disabled={loading}
          className="text-red-400 text-sm font-medium"
        >
          🗑 Delete
        </button>

      </div>

    </div>
  )
}