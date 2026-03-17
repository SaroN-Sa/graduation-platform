"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfileManager({ graduate }: any) {

  const [name, setName] = useState(graduate?.name ?? "")
  const [department, setDepartment] = useState(graduate?.department ?? "")
  const [bio, setBio] = useState(graduate?.bio ?? "")
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function updateProfile() {

    setLoading(true)
    setMessage(null)

    let imageUrl = graduate.profile_image

    /* Upload image if selected */
    if (file) {

      const filePath = `${graduate.slug}-${Date.now()}`

      const { error: uploadError } = await supabase.storage
        .from("graduates")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        setLoading(false)
        setMessage(uploadError.message)
        return
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/graduates/${filePath}`
    }

    /* Update database */
    const { error } = await supabase
      .from("graduates")
      .update({
        name,
        department,
        bio,
        profile_image: imageUrl
      })
      .eq("id", graduate.id)

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Profile updated successfully 🎉")
  }

  return (

    <div className="flex justify-center px-4">

      <div className="w-full max-w-2xl bg-[#1a1333] border border-[#2a2f45] rounded-2xl p-6 md:p-8 shadow-lg">

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Profile Settings
        </h2>

        {/* Name */}
        <div className="mb-4">

          <label className="text-sm text-gray-400 mb-1 block">
            Name
          </label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f0b1f] text-white border border-[#2a2f45] focus:outline-none focus:border-yellow-400"
          />

        </div>

        {/* Department */}
        <div className="mb-4">

          <label className="text-sm text-gray-400 mb-1 block">
            Department
          </label>

          <input
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f0b1f] text-white border border-[#2a2f45] focus:outline-none focus:border-yellow-400"
          />

        </div>

        {/* Bio */}
        <div className="mb-4">

          <label className="text-sm text-gray-400 mb-1 block">
            Bio
          </label>

          <textarea
            rows={4}
            value={bio ?? ""}
            onChange={(e)=>setBio(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f0b1f] text-white border border-[#2a2f45] focus:outline-none focus:border-yellow-400"
          />

        </div>

        {/* Profile Image */}
        <div className="mb-6">

          <label className="text-sm text-gray-400 mb-2 block">
            Profile Image
          </label>

          <input
            type="file"
            onChange={(e)=>setFile(e.target.files?.[0] || null)}
            className="
            block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-yellow-400 file:text-black
            hover:file:bg-yellow-300
            "
          />

        </div>

        {/* Preview */}
        {graduate?.profile_image && (

          <div className="mb-6 flex justify-center">

            <img
              src={graduate.profile_image}
              alt="profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border border-[#2a2f45]"
            />

          </div>

        )}

        {/* Notification */}
        {message && (

          <div className="mb-4 text-sm text-green-400 text-center">
            {message}
          </div>

        )}

        {/* Save Button */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className="
          w-full
          bg-yellow-400
          text-black
          py-3
          rounded-lg
          font-semibold
          hover:scale-[1.02]
          transition
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>

  )
}