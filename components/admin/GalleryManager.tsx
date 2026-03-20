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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

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

  function next() {
    if (previewIndex === null) return
    setPreviewIndex((previewIndex + 1) % images.length)
  }

  function prev() {
    if (previewIndex === null) return
    setPreviewIndex((previewIndex - 1 + images.length) % images.length)
  }

  /* Keyboard navigation */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (previewIndex === null) return

      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "Escape") setPreviewIndex(null)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [previewIndex, images])

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

      {/* UPLOAD */}
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

      {/* EMPTY */}
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

      {/* GRID */}
      {!loading && images.length > 0 && (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {images.map((img, i) => (
            <ImageCard
              key={img.id}
              image={img}
              onPreview={() => setPreviewIndex(i)}
              refresh={loadImages}
            />
          ))}
        </div>
      )}

      {/* FULLSCREEN VIEWER */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">

          {/* CLOSE */}
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-xl bg-black/50 hover:bg-black/70 w-10 h-10 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>

          {/* COUNTER */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 text-sm text-gray-300">
            {previewIndex + 1} / {images.length}
          </div>

          {/* LEFT */}
          <button
            onClick={prev}
            className="absolute left-2 md:left-10 text-white text-3xl md:text-4xl bg-black/40 hover:bg-black/70 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition"
          >
            ‹
          </button>

          {/* IMAGE */}
          <div className="w-full h-full flex items-center justify-center px-6 md:px-16">
            <img
              src={images[previewIndex].image_url}
              className="max-h-[75vh] md:max-h-[80vh] lg:max-h-[82vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition duration-300"
            />
          </div>

          {/* RIGHT */}
          <button
            onClick={next}
            className="absolute right-2 md:right-10 text-white text-3xl md:text-4xl bg-black/40 hover:bg-black/70 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition"
          >
            ›
          </button>

        </div>
      )}

    </div>
  )
}