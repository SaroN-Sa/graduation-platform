"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import ImageUploader from "./ImageUploader"
import ImageCard from "./ImageCard"

interface Props {
  slug: string
}

export default function GalleryManager({ slug }: Props) {

  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadImages() {

    setLoading(true)

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("graduate_slug", slug)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setImages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="mt-10">

      <h2 className="text-xl font-bold mb-6">
        Gallery Manager
      </h2>

      <ImageUploader slug={slug} onUploadComplete={loadImages} />

      {loading && (
        <p className="text-gray-400">Loading gallery...</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {images.map((img) => (
          <ImageCard
            key={img.id}
            image={img}
            refresh={loadImages}
          />
        ))}

      </div>

    </div>
  )
}