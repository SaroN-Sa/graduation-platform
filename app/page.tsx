"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function HomePage() {
  const [name, setName] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [notFound, setNotFound] = useState(false)

  const router = useRouter()

  // Search suggestions while typing
  useEffect(() => {
    async function fetchSuggestions() {
      if (!name) {
        setSuggestions([])
        return
      }

      const { data } = await supabase
        .from("graduates")
        .select("name, slug")
        .ilike("name", `${name}%`)
        .limit(5)

      setSuggestions(data || [])
    }

    fetchSuggestions()
  }, [name])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setNotFound(false)

    if (suggestions.length > 0) {
      router.push(`/graduate/${suggestions[0].slug}`)
      return
    }

    setNotFound(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // TAB autocomplete
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault()
      setName(suggestions[0].name)
    }

    // ENTER open first suggestion
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault()
      router.push(`/graduate/${suggestions[0].slug}`)
    }
  }

  function selectSuggestion(g: any) {
    router.push(`/graduate/${g.slug}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0b1f] via-[#1a1333] to-[#2a1c45] text-white px-4">

      <div className="text-center w-full max-w-md">

        <h1 className="text-4xl font-bold mb-6">
          🎓 Graduation Celebration
        </h1>

        <p className="text-gray-300 mb-8">
          Search for a graduate and celebrate their journey.
        </p>

        <form onSubmit={handleSearch} className="relative">

          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNotFound(false)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter graduate name..."
            className="px-4 py-3 rounded-lg bg-[#14102a] border border-[#2a2f45] text-white w-full"
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-[#14102a] border border-[#2a2f45] rounded-lg mt-2 z-40">

              {suggestions.map((g) => (
                <div
                  key={g.slug}
                  onClick={() => selectSuggestion(g)}
                  className="px-4 py-3 hover:bg-[#1c1638] cursor-pointer text-left"
                >
                  {g.name}
                </div>
              ))}

            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Search
          </button>

        </form>

        {/* Not found message */}
        {notFound && (
          <div className="mt-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            Graduate not found.
          </div>
        )}

      </div>

    </main>
  )
}
