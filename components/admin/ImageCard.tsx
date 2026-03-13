"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  image: any
  refresh: () => void
}

export default function ImageCard({ image, refresh }: Props) {

  const [caption,setCaption] = useState(image.caption || "")

  async function updateCaption(){

    const { error } = await supabase
      .from("gallery_images")
      .update({ caption })
      .eq("id", image.id)

    if(error){
      alert(error.message)
      return
    }

    refresh()
  }

  async function toggleFeatured(){

    await supabase
      .from("gallery_images")
      .update({ featured: !image.featured })
      .eq("id", image.id)

    refresh()
  }

  async function deleteImage(){

    if(!confirm("Delete image?")) return

    await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id)

    refresh()
  }

  return (
    <div className="bg-[#1a1333] p-3 rounded-lg">

      <img
        src={image.image_url}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <input
        value={caption}
        onChange={(e)=>setCaption(e.target.value)}
        className="w-full mb-2 p-2 bg-[#0f0b1f] text-white rounded"
        placeholder="Caption"
      />

      <button
        onClick={updateCaption}
        className="text-sm text-green-400 mb-3"
      >
        Save Caption
      </button>

      <div className="flex justify-between">

        <button
          onClick={toggleFeatured}
          className="text-yellow-400 text-sm"
        >
          {image.featured ? "⭐ Featured" : "☆ Feature"}
        </button>

        <button
          onClick={deleteImage}
          className="text-red-400 text-sm"
        >
          Delete
        </button>

      </div>

    </div>
  )
}