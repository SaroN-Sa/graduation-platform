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

    if (!slug) return

    setLoading(true)

    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("graduate_slug", slug)
      .order("created_at", { ascending: false })

    setImages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadImages()
  }, [slug])

  return (

    <div className="w-full max-w-7xl mx-auto mt-10 px-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">

        <h2 className="text-xl md:text-2xl font-bold text-white">
          Gallery Manager
        </h2>

        <p className="text-sm text-gray-400">
          {images.length} image{images.length !== 1 && "s"}
        </p>

      </div>

      {/* UPLOAD SECTION */}
      <div className="bg-[#14102a] border border-[#2a2f45] rounded-2xl p-5 md:p-6 mb-12 shadow-lg">

        <h3 className="text-lg font-semibold text-white mb-4">
          Add New Image
        </h3>

        <ImageUploader
          slug={slug}
          onUploadComplete={loadImages}
        />

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          Loading gallery...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && images.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            No images uploaded yet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Start by uploading your first memory 📸
          </p>
        </div>
      )}

      {/* IMAGE GRID */}
      {!loading && images.length > 0 && (

        <div
          className="
            grid
            gap-8
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
          "
        >

          {images.map((img, i) => (

            <div
              key={img.id}
              className="transition duration-300 hover:scale-[1.02]"
            >

              <ImageCard
                image={img}
                images={images}   // 🔥 IMPORTANT (enables gallery mode)
                index={i}         // 🔥 IMPORTANT (for swipe navigation)
                refresh={loadImages}
              />

            </div>

          ))}

        </div>

      )}

    </div>
  )
}