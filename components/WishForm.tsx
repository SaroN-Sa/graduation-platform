"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  slug: string
}

export default function WishForm({ slug }: Props) {

  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    if (!name) {
      alert("Please enter your name")
      return
    }

    setLoading(true)

    let photo_url = null
    let video_url = null

    /* PHOTO UPLOAD */
    if (photo) {

      const path = `${slug}/${Date.now()}-${photo.name}`

      const { error } = await supabase.storage
        .from("wish-photos")
        .upload(path, photo)

      if (!error) {
        const { data } = supabase.storage
          .from("wish-photos")
          .getPublicUrl(path)

        photo_url = data.publicUrl
      }
    }

    /* VIDEO UPLOAD */
    if (video) {

      const path = `${slug}/${Date.now()}-${video.name}`

      const { error } = await supabase.storage
        .from("wish-videos")
        .upload(path, video)

      if (!error) {
        const { data } = supabase.storage
          .from("wish-videos")
          .getPublicUrl(path)

        video_url = data.publicUrl
      }
    }

    const { error } = await supabase
      .from("wishes")
      .insert({
        graduate_slug: slug,
        name,
        message,
        photo_url,
        video_url,
        featured: false
      })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    setName("")
    setMessage("")
    setPhoto(null)
    setVideo(null)

    alert("Wish sent 🎉")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1333] p-6 rounded-xl border border-[#2a2f45]"
    >

      {/* Name */}
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        className="w-full p-3 mb-4 bg-[#0f0b1f] rounded text-white"
      />

      {/* Message */}
      <textarea
        placeholder="Write your wish..."
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        className="w-full p-3 mb-6 bg-[#0f0b1f] rounded text-white"
      />

      {/* Upload Area */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        {/* PHOTO UPLOAD */}
        <label className="border border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition">

          <div className="text-3xl mb-2">📷</div>

          <p className="font-semibold">Upload Photo</p>
          <p className="text-sm text-gray-400">PNG, JPG</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setPhoto(e.target.files?.[0] || null)}
            className="hidden"
          />

          {photo && (
            <p className="text-xs mt-2 text-green-400">
              {photo.name}
            </p>
          )}

        </label>

        {/* VIDEO UPLOAD */}
        <label className="border border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition">

          <div className="text-3xl mb-2">🎥</div>

          <p className="font-semibold">Upload Video</p>
          <p className="text-sm text-gray-400">MP4, MOV</p>

          <input
            type="file"
            accept="video/*"
            onChange={(e)=>setVideo(e.target.files?.[0] || null)}
            className="hidden"
          />

          {video && (
            <p className="text-xs mt-2 text-green-400">
              {video.name}
            </p>
          )}

        </label>

      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 text-black px-6 py-3 rounded font-semibold hover:scale-105 transition"
      >
        {loading ? "Sending..." : "Send Wish"}
      </button>

    </form>
  )
}
