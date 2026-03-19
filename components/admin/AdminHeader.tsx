"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import {
  User,
  Star,
  Image,
  MessageCircle,
  Video,
  LogOut
} from "lucide-react"

export default function AdminHeader() {

  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [graduate, setGraduate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState(false)
  const [notification, setNotification] = useState<any>(null)

  const [stats, setStats] = useState({
    images: 0,
    wishes: 0,
    videos: 0,
    featured: 0
  })

  function notify(text: string) {
    setNotification(text)
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {

    async function loadData() {

      if (!slug) return

      setLoading(true)

      /* GRADUATE */
      const { data } = await supabase
        .from("graduates")
        .select("*")
        .eq("slug", slug)
        .single()

      if (data) setGraduate(data)

      /* IMAGES */
      const { count: images } = await supabase
        .from("gallery_images")
        .select("*", { count: "exact", head: true })
        .eq("graduate_slug", slug)

      /* FEATURED */
      const { count: featured } = await supabase
        .from("gallery_images")
        .select("*", { count: "exact", head: true })
        .eq("graduate_slug", slug)
        .eq("featured", true)

      /* WISHES */
      const { count: wishes } = await supabase
        .from("wishes")
        .select("*", { count: "exact", head: true })
        .eq("graduate_slug", slug)

      /* VIDEOS (FROM WISHES TABLE) */
      const { count: videos } = await supabase
        .from("wishes")
        .select("*", { count: "exact", head: true })
        .eq("graduate_slug", slug)
        .not("video_url", "is", null)

      setStats({
        images: images || 0,
        featured: featured || 0,
        wishes: wishes || 0,
        videos: videos || 0
      })

      setLoading(false)
    }

    loadData()

  }, [slug])

  function logout() {

    localStorage.removeItem("grad_session")

    notify("Logged out successfully")

    setTimeout(() => {
      router.push("/admin")
    }, 1000)
  }

  return (
    <div className="w-full mb-12 relative">

      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 bg-red-500 px-4 py-2 rounded-lg text-white shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 mb-6">

        {/* NAME */}
        <h1 className="text-sm md:text-2xl font-bold text-white flex items-center gap-2 truncate">
          🎓 {loading ? "Loading..." : graduate?.name}
        </h1>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">

          <Link
            href={`/graduate/${slug}`}
            className="
            px-3 md:px-4 py-1.5 md:py-2
            border border-orange-400
            text-orange-400
            rounded-lg
            hover:bg-orange-400 hover:text-black
            transition
            text-xs md:text-base
            whitespace-nowrap
            "
          >
            View Page
          </Link>

          {/* PROFILE MENU */}
          <div className="relative">

            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center cursor-pointer"
            >
              {graduate?.profile_image ? (
                <img
                  src={graduate.profile_image}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover hover:ring-2 hover:ring-orange-400 transition"
                />
              ) : (
                <User size={20} className="text-gray-400" />
              )}
            </div>

            {/* DROPDOWN */}
            {openMenu && (
              <div className="
                absolute right-0 mt-3
                bg-[#14102a]
                border border-[#2a2f45]
                rounded-lg
                shadow-xl
                w-40
                overflow-hidden
              ">

                <button
                  onClick={logout}
                  className="
                  flex items-center gap-2
                  w-full px-4 py-3
                  text-left
                  text-red-400
                  hover:bg-[#1d1836]
                  transition
                  "
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* DASHBOARD STATS */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">

        <Stat icon={Image} value={stats.images} label="Images" loading={loading} />
        <Stat icon={Star} value={stats.featured} label="Featured" loading={loading} />
        <Stat icon={MessageCircle} value={stats.wishes} label="Wishes" loading={loading} />
        <Stat icon={Video} value={stats.videos} label="Videos" loading={loading} />

      </div>

    </div>
  )
}

/* STAT COMPONENT */

function Stat({ icon: Icon, value, label, loading }: any) {

  return (
    <div
      className="
      flex items-center gap-2
      bg-[#14102a]
      border border-[#2a2f45]
      px-4 py-2
      rounded-lg
      hover:border-orange-400
      transition
      "
    >

      <Icon size={18} className="text-orange-400" />

      <span className="text-white font-semibold">
        {loading ? "..." : value}
      </span>

      <span className="text-gray-400 text-sm">
        {label}
      </span>

    </div>
  )
}