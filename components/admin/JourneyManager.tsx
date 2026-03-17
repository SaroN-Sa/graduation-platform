"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  slug: string
}

const stages = [
  "Kindergarten",
  "Primary School",
  "Secondary School",
  "Preparatory",
  "University",
  "Masters",
  "PhD"
]

const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
)

export default function JourneyManager({ slug }: Props) {

  const [stage, setStage] = useState("")
  const [school, setSchool] = useState("")
  const [field, setField] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endYear, setEndYear] = useState("")

  const [journey, setJourney] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function notify(text: string) {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  async function loadJourney() {

    const { data } = await supabase
      .from("education_journey")
      .select("*")
      .eq("graduate_slug", slug)
      .order("position", { ascending: true })

    setJourney(data || [])
  }

  useEffect(() => {
    loadJourney()
  }, [slug])

  async function addJourney() {

    if (!stage || !school) {
      notify("Stage and school are required")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("education_journey")
      .insert({
        graduate_slug: slug,
        stage,
        school,
        field,
        start_year: startYear || null,
        end_year: endYear || null,
        position: journey.length + 1
      })

    setLoading(false)

    if (error) {
      notify("Failed to add stage")
      return
    }

    setStage("")
    setSchool("")
    setField("")
    setStartYear("")
    setEndYear("")

    notify("Stage added")
    loadJourney()
  }

  async function deleteJourney(id: string) {

    const { error } = await supabase
      .from("education_journey")
      .delete()
      .eq("id", id)

    if (error) {
      notify("Delete failed")
      return
    }

    notify("Stage deleted")
    setConfirmDelete(null)
    loadJourney()
  }

  return (

    <div className="max-w-3xl mx-auto px-4">

      <h2 className="text-xl font-bold text-white mb-6">
        🎓 Education Journey
      </h2>

      {/* Notification */}

      {message && (
        <div className="mb-4 text-sm text-green-400 text-center">
          {message}
        </div>
      )}

      {/* FORM */}

      <div className="bg-[#14102a] border border-[#2a2f45] p-5 md:p-6 rounded-xl mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Stage */}

          <select
            value={stage}
            onChange={(e)=>setStage(e.target.value)}
            className="p-2 bg-[#0f0b1f] text-white rounded"
          >
            <option value="">Select Stage</option>

            {stages.map((s)=>(
              <option key={s} value={s}>
                {s}
              </option>
            ))}

          </select>

          {/* School */}

          <input
            placeholder="School / University"
            value={school}
            onChange={(e)=>setSchool(e.target.value)}
            className="p-2 bg-[#0f0b1f] text-white rounded"
          />

          {/* Field */}

          <input
            placeholder="Field (optional)"
            value={field}
            onChange={(e)=>setField(e.target.value)}
            className="p-2 bg-[#0f0b1f] text-white rounded"
          />

          {/* Start Year */}

          <select
            value={startYear}
            onChange={(e)=>setStartYear(e.target.value)}
            className="p-2 bg-[#0f0b1f] text-white rounded"
          >

            <option value="">Start Year</option>

            {years.map((y)=>(
              <option key={y} value={y}>
                {y}
              </option>
            ))}

          </select>

          {/* End Year */}

          <select
            value={endYear}
            onChange={(e)=>setEndYear(e.target.value)}
            className="p-2 bg-[#0f0b1f] text-white rounded"
          >

            <option value="">End Year</option>

            {years.map((y)=>(
              <option key={y} value={y}>
                {y}
              </option>
            ))}

          </select>

        </div>

        <button
          onClick={addJourney}
          disabled={loading}
          className="mt-4 bg-orange-400 hover:bg-orange-500 text-black px-6 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Add Stage"}
        </button>

      </div>

      {/* LIST */}

      <div className="space-y-4">

        {journey.length === 0 && (
          <p className="text-gray-400">
            No stages added yet
          </p>
        )}

        {journey.map((item)=>(

          <div
            key={item.id}
            className="bg-[#14102a] border border-[#2a2f45] p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3"
          >

            <div>

              <p className="text-yellow-400 font-semibold">
                {item.stage}
              </p>

              <p className="text-white">
                {item.school}
              </p>

              {item.field && (
                <p className="text-gray-400 text-sm">
                  {item.field}
                </p>
              )}

              <p className="text-gray-500 text-sm">
                {item.start_year} - {item.end_year}
              </p>

            </div>

            {/* Delete Section */}

            {confirmDelete === item.id ? (

              <div className="flex gap-3 text-sm">

                <button
                  onClick={()=>deleteJourney(item.id)}
                  className="text-red-400"
                >
                  Yes Delete
                </button>

                <button
                  onClick={()=>setConfirmDelete(null)}
                  className="text-gray-400"
                >
                  Cancel
                </button>

              </div>

            ) : (

              <button
                onClick={()=>setConfirmDelete(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  )
}