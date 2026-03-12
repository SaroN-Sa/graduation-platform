"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfileManager({ graduate }: any) {

  const [name, setName] = useState(graduate.name)
  const [department, setDepartment] = useState(graduate.department)
  const [bio, setBio] = useState(graduate.bio)
  const [file, setFile] = useState<File | null>(null)

  async function updateProfile() {

    let imageUrl = graduate.profile_image

    // upload image if selected
    if (file) {

      const filePath = `${graduate.slug}-${Date.now()}`

      const { error: uploadError } = await supabase.storage
        .from("graduates")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        alert(uploadError.message)
        return
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/graduates/${filePath}`
    }

    const { error } = await supabase
      .from("graduates")
      .update({
        name,
        department,
        bio,
        profile_image: imageUrl
      })
      .eq("id", graduate.id)

    if (error) {
      alert(error.message)
      return
    }

    alert("Profile updated!")
  }

  return (
    <div className="bg-[#1a1333] p-6 rounded-xl">

      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      {/* name */}
      <input
        className="w-full p-2 mb-3 bg-[#0f0b1f] text-white"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Name"
      />

      {/* department */}
      <input
        className="w-full p-2 mb-3 bg-[#0f0b1f] text-white"
        value={department}
        onChange={(e)=>setDepartment(e.target.value)}
        placeholder="Department"
      />

      {/* bio */}
      <textarea
        className="w-full p-2 mb-3 bg-[#0f0b1f] text-white"
        value={bio}
        onChange={(e)=>setBio(e.target.value)}
        placeholder="Bio"
      />

      {/* profile image */}
      <input
        type="file"
        className="mb-4"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
      />

      {/* preview */}
      {graduate.profile_image && (
        <img
          src={graduate.profile_image}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}

      <button
        onClick={updateProfile}
        className="bg-yellow-400 text-black px-6 py-2 rounded"
      >
        Save Changes
      </button>

    </div>
  )
}