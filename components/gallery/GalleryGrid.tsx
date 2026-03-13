"use client"

import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface ImageType {
  id: string
  image_url: string
  caption?: string
}

interface Props {
  images: ImageType[]
}

export default function GalleryGrid({ images }: Props) {

  const [index, setIndex] = useState(-1)

  const slides = images.map((img) => ({
    src: img.image_url,
    description: img.caption
  }))

  return (
    <div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">

        {images.map((img, i) => (

          <div
            key={img.id}
            className="relative group cursor-pointer break-inside-avoid"
            onClick={() => setIndex(i)}
          >

            <img
              src={img.image_url}
              className="w-full rounded-lg"
            />

            {/* Hover Caption */}
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0
              bg-black/60 text-white text-sm p-2
              opacity-0 group-hover:opacity-100
              transition rounded-b-lg">

                {img.caption}

              </div>
            )}

          </div>

        ))}

      </div>

      {/* Fullscreen Viewer */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />

    </div>
  )
}