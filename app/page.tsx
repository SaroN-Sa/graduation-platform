"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {

  const [name, setName] = useState("")
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    const slug = name.toLowerCase().replace(/\s+/g, "")

    router.push(`graduate/${slug}`)
  }

  return (

    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0b1f] via-[#1a1333] to-[#2a1c45] text-white">

      <div className="text-center px-6">

        <h1 className="text-4xl font-bold mb-6">
          🎓 Graduation Celebration
        </h1>

        <p className="text-gray-300 mb-10">
          Search for a graduate and celebrate their journey.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex gap-3 justify-center"
        >

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Enter graduate name..."
            className="px-4 py-3 rounded-lg bg-[#14102a] border border-[#2a2f45] text-white w-64"
          />

          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Search
          </button>

        </form>

      </div>

    </main>

  )
}