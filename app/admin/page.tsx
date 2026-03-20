"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AdminAccessPage() {

  const router = useRouter()

  const [slug, setSlug] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAccess() {

    if (!slug || !token) {
      setError("Please enter slug and token")
      return
    }

    setLoading(true)
    setError("")

    const { data } = await supabase
      .from("graduates")
      .select("slug")
      .eq("slug", slug)
      .eq("token", token)
      .maybeSingle()

    if (!data) {
      setError("Invalid slug or token")
      setLoading(false)
      return
    }

    router.push(`/manage/${slug}?token=${token}`)
  }

  return (
    <div className="min-h-screen bg-[#0f0b1f] flex items-center justify-center text-white px-6 relative">

      {/* HOME BUTTON */}
      <button
        onClick={() => router.push("/")}
        className="
        absolute
        top-6
        left-6
        bg-[#14102a]
        border border-[#2a2f45]
        px-4 py-2
        rounded-lg
        hover:border-orange-400
        transition
        text-sm
        "
      >
        ← Home
      </button>

      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          🎓 Access Your Dashboard
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Enter your slug and access token
        </p>

        {/* SLUG */}
        <input
          type="text"
          placeholder="Enter your slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="
          w-full
          mb-4
          bg-[#14102a]
          border border-[#2a2f45]
          rounded-lg
          px-4 py-3
          outline-none
          focus:border-orange-400
          "
        />

        {/* TOKEN */}
        <input
          type="text"
          placeholder="Enter your token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="
          w-full
          bg-[#14102a]
          border border-[#2a2f45]
          rounded-lg
          px-4 py-3
          outline-none
          focus:border-orange-400
          "
        />

        {error && (
          <p className="text-red-400 mt-3 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleAccess}
          disabled={loading}
          className="
          w-full
          mt-6
          bg-orange-500
          hover:bg-orange-600
          transition
          rounded-lg
          py-3
          font-semibold
          "
        >
          {loading ? "Checking..." : "Access Dashboard"}
        </button>

      </div>

    </div>
  )
}