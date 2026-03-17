"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { uploadVideoToCloudinary } from "@/lib/cloudinary"

interface Props {
  slug: string
}

export default function WishForm({ slug }: Props) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const MAX_VIDEO_SIZE = 300 * 1024 * 1024 // 300MB
  const MIN_DURATION = 5 // seconds
  const MAX_DURATION = 120 // 2 minutes

  // Function to get video duration
  const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const videoEl = document.createElement("video")
      videoEl.preload = "metadata"
      videoEl.src = url
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        resolve(videoEl.duration) // duration in seconds
      }
      videoEl.onerror = () => reject("Cannot read video duration")
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNotification(null)

    if (!name) {
      setNotification({ message: "Please enter your name", type: "error" })
      return
    }

    setLoading(true)

    let photo_url: string | null = null
    let video_url: string | null = null

    try {
      /* PHOTO UPLOAD → SUPABASE */
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

      /* VIDEO UPLOAD → CLOUDINARY ONLY */
      if (video) {
        // Check size
        if (video.size > MAX_VIDEO_SIZE) {
          setNotification({ message: "Video is too large. Max 300MB.", type: "error" })
          setLoading(false)
          return
        }

        // Check duration
        const duration = await checkVideoDuration(video)
        if (duration < MIN_DURATION || duration > MAX_DURATION) {
          setNotification({ message: `Video must be between ${MIN_DURATION}s and ${MAX_DURATION}s.`, type: "error" })
          setLoading(false)
          return
        }

        // Upload to Cloudinary
        video_url = await uploadVideoToCloudinary(video)
      }

      /* SAVE WISH DATA IN SUPABASE */
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

      if (error) {
        setNotification({ message: error.message, type: "error" })
        return
      }

      // Reset form
      setName("")
      setMessage("")
      setPhoto(null)
      setVideo(null)
      setNotification({ message: "Wish sent 🎉", type: "success" })

    } catch (err: any) {
      setNotification({ message: "Upload failed: " + err, type: "error" })
    } finally {
      setLoading(false)
    }
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
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mb-4 bg-[#0f0b1f] rounded text-white"
      />

      {/* Message */}
      <textarea
        placeholder="Write your wish..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 mb-6 bg-[#0f0b1f] rounded text-white"
      />

      {/* Upload Area */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* PHOTO */}
        <label className="border border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition">
          <div className="text-3xl mb-2">📷</div>
          <p className="font-semibold">Upload Photo</p>
          <p className="text-sm text-gray-400">PNG, JPG</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="hidden"
          />
          {photo && <p className="text-xs mt-2 text-green-400">{photo.name}</p>}
        </label>

        {/* VIDEO */}
        <label className="border border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition">
          <div className="text-3xl mb-2">🎥</div>
          <p className="font-semibold">Upload Video</p>
          <p className="text-sm text-gray-400">MP4, MOV</p>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="hidden"
          />
          {video && <p className="text-xs mt-2 text-green-400">{video.name}</p>}
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

      {/* Inline notification */}
      {notification && (
        <p
          className={`mt-2 text-center font-semibold ${
            notification.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {notification.message}
        </p>
      )}
    </form>
  )
}