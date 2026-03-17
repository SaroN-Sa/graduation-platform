"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function GraduateManager() {

  const [graduates, setGraduates] = useState<any[]>([])
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)

  const [links, setLinks] = useState<any>(null)

  const [notification, setNotification] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  function notify(type: string, text: string) {
    setNotification({ type, text })

    setTimeout(() => {
      setNotification(null)
    }, 3500)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  function generateToken() {
    return Math.random().toString(36).substring(2, 12)
  }

  async function loadGraduates() {

    const { data, error } = await supabase
      .from("graduates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      notify("error", "Failed to load graduates")
      return
    }

    setGraduates(data || [])
  }

  useEffect(() => {
    loadGraduates()
  }, [])

  async function createGraduate() {

    if (!name || !department) {
      notify("warning", "Name and department are required")
      return
    }

    setLoading(true)

    let slug = generateSlug(name)

    const { data: existing } = await supabase
      .from("graduates")
      .select("slug")
      .ilike("slug", `${slug}%`)

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`
    }

    const token = generateToken()

    const { error } = await supabase
      .from("graduates")
      .insert({
        name,
        department,
        bio,
        slug,
        token
      })

    setLoading(false)

    if (error) {
      notify("error", "Failed to create graduate")
      return
    }

    const publicLink = `http://localhost:3000/graduate/${slug}`
    const adminLink = `http://localhost:3000/manage/${slug}?token=${token}`

    setLinks({ publicLink, adminLink })

    notify("success", "Graduate created successfully")

    setName("")
    setDepartment("")
    setBio("")

    loadGraduates()
  }

  async function confirmDelete() {

    if (!deleteTarget) return

    const { error } = await supabase
      .from("graduates")
      .delete()
      .eq("id", deleteTarget.id)

    if (error) {
      notify("error", "Delete failed")
      return
    }

    notify("success", "Graduate deleted")

    setGraduates(prev =>
      prev.filter(g => g.id !== deleteTarget.id)
    )

    setDeleteTarget(null)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    notify("success", "Link copied")
  }

  return (

    <div className="max-w-5xl mx-auto px-4 py-10 text-white">

      {/* Notification */}

      {notification && (

        <div className={`
          fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50
          ${notification.type === "success" && "bg-green-500"}
          ${notification.type === "error" && "bg-red-500"}
          ${notification.type === "warning" && "bg-yellow-500 text-black"}
        `}>
          {notification.text}
        </div>

      )}

      {/* DELETE CONFIRM MODAL */}

      {deleteTarget && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#14102a] border border-[#2a2f45] p-6 rounded-xl w-[90%] max-w-md">

            <h3 className="text-lg font-bold mb-4">
              Delete Graduate
            </h3>

            <p className="text-gray-400 mb-6">
              Are you sure you want to delete {deleteTarget.name}?
            </p>

            <div className="flex gap-3">

              <button
                onClick={confirmDelete}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Delete
              </button>

              <button
                onClick={()=>setDeleteTarget(null)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {/* CREATE GRADUATE */}

      <div className="bg-[#14102a] border border-[#2a2f45] p-6 rounded-xl mb-10">

        <h2 className="text-xl font-bold mb-6">
          Create Graduate
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Graduate Name"
            className="p-3 bg-[#0f0b1f] border border-[#2a2f45] rounded"
          />

          <input
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
            placeholder="Department"
            className="p-3 bg-[#0f0b1f] border border-[#2a2f45] rounded"
          />

          <textarea
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
            placeholder="Short Bio"
            rows={4}
            className="p-3 bg-[#0f0b1f] border border-[#2a2f45] rounded md:col-span-2"
          />

        </div>

        <button
          onClick={createGraduate}
          disabled={loading}
          className="mt-4 bg-yellow-400 text-black px-6 py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Graduate"}
        </button>

      </div>

      {/* GENERATED LINKS */}

      {links && (

        <div className="bg-[#14102a] border border-[#2a2f45] p-6 rounded-xl mb-10">

          <h3 className="text-yellow-400 font-semibold mb-6">
            Graduate Created
          </h3>

          <div className="mb-6">

            <p className="text-gray-400 mb-2">
              Public Page
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                readOnly
                value={links.publicLink}
                className="flex-1 p-2 bg-black rounded"
              />

              <button
                onClick={()=>copy(links.publicLink)}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Copy
              </button>

            </div>

          </div>

          <div>

            <p className="text-gray-400 mb-2">
              Graduate Admin Link
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                readOnly
                value={links.adminLink}
                className="flex-1 p-2 bg-black rounded"
              />

              <button
                onClick={()=>copy(links.adminLink)}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Copy
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ALL GRADUATES */}

      <h2 className="text-xl font-bold mb-6">
        All Graduates
      </h2>

      <div className="space-y-4">

        {graduates.map((g)=> (

          <div
            key={g.id}
            className="bg-[#14102a] border border-[#2a2f45] p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >

            <div>

              <p className="text-yellow-400 font-semibold">
                {g.name}
              </p>

              <p className="text-gray-400 text-sm">
                {g.department}
              </p>

              {g.bio && (
                <p className="text-gray-500 text-xs mt-1">
                  {g.bio}
                </p>
              )}

              <p className="text-gray-500 text-xs mt-1">
                /graduates/{g.slug}
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <a
                href={`/graduate/${g.slug}`}
                target="_blank"
                className="bg-blue-500 px-3 py-1 rounded text-sm"
              >
                View
              </a>

              <a
                href={`/manage/${g.slug}?token=${g.token}`}
                target="_blank"
                className="bg-green-500 px-3 py-1 rounded text-sm"
              >
                Manage
              </a>

              <button
                onClick={()=>setDeleteTarget(g)}
                className="bg-red-500 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}