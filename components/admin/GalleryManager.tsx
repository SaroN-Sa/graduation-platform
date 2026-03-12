"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  slug: string
}

export default function GalleryManager({ slug }: Props) {

  const [file, setFile] = useState<File | null>(null)

  async function uploadImage() {
    if (!file) return

    const filePath = `${slug}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("gallery-images")
      .upload(filePath, file)

    if (error) {
      alert("Upload failed")
      return
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery-images/${filePath}`

    await supabase.from("gallery").insert({
      graduate_slug: slug,
      image_url: imageUrl
    })

    alert("Image uploaded!")
  }

  return (
    <div className="bg-[#1a1333] p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Gallery Upload</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadImage}
        className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg"
      >
        Upload
      </button>
    </div>
  )
}