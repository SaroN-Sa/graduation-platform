"use client"

import { useEffect, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { supabase } from "@/lib/supabaseClient"

interface ImageType {
  id: string
  image_url: string
  caption?: string
}

interface Props {
  slug: string
}

export default function GallerySection({ slug }: Props) {

  const [images, setImages] = useState<ImageType[]>([])
  const [index, setIndex] = useState(-1)
  const [loading, setLoading] = useState(true)

  async function loadImages() {

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("graduate_slug", slug) // fetch only this graduate
      .eq("featured", true)      // optional: only featured
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Gallery error:", error.message)
      setLoading(false)
      return
    }

    setImages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (slug) {
      loadImages()
    }
  }, [slug])

  if (loading) {
    return (
      <section className="py-24 text-center text-gray-400">
        Loading gallery...
      </section>
    )
  }

  if (images.length === 0) {
    return (
      <section className="py-24 text-center text-gray-400">
        No gallery images yet 📸
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-[#1a1333] to-[#0b0f1a] py-24 px-6 text-white">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          📸 Gallery
        </h2>

        <p className="text-center text-gray-400 mt-2 mb-12">
          A collection of memorable moments from the journey.
        </p>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">

          {images.map((img, i) => (

            <div
              key={img.id}
              className="relative group cursor-pointer break-inside-avoid overflow-hidden rounded-xl border border-[#2a2f45]"
              onClick={() => setIndex(i)}
            >

              <img
                src={img.image_url}
                alt={img.caption || "Gallery image"}
                loading="lazy"
                className="w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition">
                  {img.caption}
                </div>
              )}

            </div>

          ))}

        </div>

      </div>

      {/* Fullscreen Viewer */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((img) => ({
          src: img.image_url,
          description: img.caption || ""
        }))}
      />

    </section>
  )
  }