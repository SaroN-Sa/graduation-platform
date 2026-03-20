"use client"

import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  image: any
  images?: any[]
  index?: number
  refresh: () => void
}

export default function ImageCard({ image, images = [], index = 0, refresh }: Props) {

  const [caption, setCaption] = useState(image.caption || "")
  const [notification, setNotification] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(-1)

  function notify(text: string) {
    setNotification(text)
    setTimeout(() => setNotification(""), 3000)
  }

  async function updateCaption() {
    const { error } = await supabase
      .from("gallery_images")
      .update({ caption })
      .eq("id", image.id)

    if (error) return notify("Failed")
    notify("Saved")
    refresh()
  }

  async function toggleFeatured() {
    const { error } = await supabase
      .from("gallery_images")
      .update({ featured: !image.featured })
      .eq("id", image.id)

    if (error) return notify("Error")
    notify("Updated")
    refresh()
  }

  async function deleteImage() {
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id)

    if (error) return notify("Failed")
    notify("Deleted")
    setConfirmDelete(false)
    refresh()
  }

  return (
    <>
      {/* CARD */}
      <div className="bg-[#14102a] border border-[#2a2f45] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

        {/* IMAGE */}
        <div
          onClick={() => setPreviewIndex(index)}
          className="relative cursor-pointer group"
        >
          <img
            src={image.image_url}
            className="w-full aspect-[4/3] object-cover"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-sm">
            View
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-3">

          {notification && (
            <div className="text-xs text-green-400">
              {notification}
            </div>
          )}

          <input
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
            className="w-full p-2 bg-[#0f0b1f] text-white rounded text-sm"
          />

          <button
            onClick={updateCaption}
            className="text-xs text-green-400"
          >
            Save
          </button>

          <div className="flex justify-between text-sm pt-1">

            <button
              onClick={toggleFeatured}
              className="text-yellow-400"
            >
              {image.featured ? "⭐" : "☆"}
            </button>

            <button
              onClick={()=>setConfirmDelete(true)}
              className="text-red-400"
            >
              Delete
            </button>

          </div>

          {confirmDelete && (
            <div className="text-xs flex justify-between mt-2">
              <span>Delete?</span>
              <div className="flex gap-3">
                <button onClick={deleteImage} className="text-red-400">Yes</button>
                <button onClick={()=>setConfirmDelete(false)}>No</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* LIGHTBOX PREVIEW (same as gallery) */}
      <Lightbox
        open={previewIndex >= 0}
        index={previewIndex}
        close={() => setPreviewIndex(-1)}
        slides={images.map((img) => ({
          src: img.image_url,
          description: img.caption || ""
        }))}
      />
    </>
  )
}