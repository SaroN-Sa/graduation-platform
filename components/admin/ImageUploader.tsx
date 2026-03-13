"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { UploadCloud, Loader2 } from "lucide-react"

interface Props {
  slug: string
  onUploadComplete: () => void
}

export default function ImageUploader({ slug, onUploadComplete }: Props) {

  const [caption, setCaption] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    setFiles(Array.from(e.target.files))
  }

  async function handleUpload() {

    if (files.length === 0) return

    setUploading(true)

    try {

      for (const file of files) {

        const filePath = `${slug}/${Date.now()}-${file.name}`

        const { error } = await supabase.storage
          .from("gallery")
          .upload(filePath, file)

        if (error) {
          console.error(error)
          continue
        }

        const { data } = supabase.storage
          .from("gallery")
          .getPublicUrl(filePath)

        await supabase.from("gallery_images").insert({
          graduate_slug: slug,
          image_url: data.publicUrl,
          caption
        })

      }

      setFiles([])
      setCaption("")
      onUploadComplete()

    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-8 p-6 bg-[#1a1333] rounded-2xl border border-[#2a2f45]">

      <h3 className="text-lg font-semibold mb-4 text-yellow-400">
        Upload Gallery Images
      </h3>

      {/* Caption */}
      <input
        type="text"
        placeholder="Image caption (optional)"
        value={caption}
        onChange={(e)=>setCaption(e.target.value)}
        className="w-full mb-4 p-3 rounded-lg bg-[#0f0b1f] border border-[#2a2f45] text-white outline-none focus:border-yellow-400"
      />

      {/* Upload Area */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#2a2f45] rounded-xl p-10 cursor-pointer hover:border-yellow-400 transition">

        <UploadCloud className="w-10 h-10 text-yellow-400 mb-2" />

        <span className="text-gray-300 text-sm">
          Click or drag images here
        </span>

        <span className="text-xs text-gray-500 mt-1">
          JPG, PNG • Multiple images supported
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

      </label>

      {/* Preview */}
      {files.length > 0 && (

        <div className="mt-6">

          <p className="text-sm text-gray-400 mb-3">
            Selected Images ({files.length})
          </p>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">

            {files.map((file, i) => (

              <img
                key={i}
                src={URL.createObjectURL(file)}
                className="w-full h-24 object-cover rounded-lg"
              />

            ))}

          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
          >

            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}

            {uploading ? "Uploading..." : "Upload Images"}

          </button>

        </div>

      )}

    </div>
  )
}