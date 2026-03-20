"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  Star,
  Trash2,
  Save,
  Pencil,
  Image as ImageIcon
} from "lucide-react"

interface Props {
  image: any
  onPreview: () => void
  refresh: () => void
}

export default function ImageCard({
  image,
  onPreview,
  refresh
}: Props) {

  const [caption, setCaption] = useState(image.caption || "")
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notification, setNotification] = useState("")
  const [featured, setFeatured] = useState(image.featured || false)

  function notify(msg: string) {
    setNotification(msg)
    setTimeout(() => setNotification(""), 2500)
  }

  async function updateCaption() {
    const { error } = await supabase
      .from("gallery_images")
      .update({ caption })
      .eq("id", image.id)

    if (error) return notify("Failed to update caption")
    notify("Caption updated")
    setEditing(false)
    refresh()
  }

  async function toggleFeatured() {
    const { error } = await supabase
      .from("gallery_images")
      .update({ featured: !featured })
      .eq("id", image.id)

    if (error) return notify("Failed to update")
    setFeatured(!featured)
    notify(!featured ? "Added to featured ⭐" : "Removed from featured")
    refresh()
  }

  async function deleteImage() {
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id)

    if (error) return notify("Delete failed")
    notify("Image deleted")
    setConfirmDelete(false)
    refresh()
  }

  return (
    <div className="bg-[#14102a] border border-[#2a2f45] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}
      <div
        onClick={onPreview}
        className="relative cursor-pointer group bg-black"
      >
        <img
          src={image.image_url}
          className="w-full h-48 md:h-52 object-contain mx-auto"
        />

        {/* Hover Preview */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            <ImageIcon size={16} />
            Preview
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">

        {/* Notification */}
        {notification && (
          <div className="text-xs text-green-400">
            {notification}
          </div>
        )}

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">
            Caption
          </p>

          {editing ? (
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 bg-[#0f0b1f] border border-[#2a2f45] text-white rounded-lg text-sm"
              placeholder="Write something..."
            />
          ) : (
            <div className="text-sm text-gray-200 min-h-[20px]">
              {caption || "No caption added"}
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="flex items-center justify-between pt-2">

          {/* Featured Star */}
          <button
            onClick={toggleFeatured}
            className={`transition ${
              featured
                ? "text-yellow-400"
                : "text-gray-500 hover:text-yellow-300"
            }`}
          >
            <Star
              size={18}
              fill={featured ? "currentColor" : "none"}
            />
          </button>

          {/* Edit / Save */}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Pencil size={18} />
            </button>
          ) : (
            <button
              onClick={updateCaption}
              className="text-green-400 hover:text-green-300"
            >
              <Save size={18} />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>

        </div>

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div className="flex justify-between items-center text-sm bg-[#0f0b1f] border border-[#2a2f45] rounded-lg p-2">
            <span className="text-gray-300">
              Delete this image?
            </span>

            <div className="flex gap-3">
              <button
                onClick={deleteImage}
                className="text-red-400"
              >
                Yes
              </button>

              <button
                onClick={() => setConfirmDelete(false)}
                className="text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}