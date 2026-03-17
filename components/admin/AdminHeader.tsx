"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import {
  User,
  Star,
  Image,
  MessageCircle,
  Video
} from "lucide-react"

export default function AdminHeader() {

  const params = useParams()
  const slug = params.slug as string

  const [graduate, setGraduate] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    images: 0,
    wishes: 0,
    videos: 0,
    featured: 0
  })

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

      /* VIDEOS */
      const { count: videos } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("graduate_slug", slug)

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

  return (
    <div className="w-full mb-12">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
          🎓 {loading ? "Loading..." : graduate?.name}
        </h1>

        <div className="flex items-center gap-4">

          <Link
            href={`/graduate/${slug}`}
            className="
            px-4 py-2
            border border-orange-400
            text-orange-400
            rounded-lg
            hover:bg-orange-400 hover:text-black
            transition
            text-sm md:text-base
            "
          >
            View Page
          </Link>

          {/* ACCOUNT */}

          <div className="relative group">

            <div className="flex items-center gap-2 cursor-pointer">

              {graduate?.profile_image ? (
                <img
                  src={graduate.profile_image}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-gray-400" />
              )}

            </div>

            <div
              className="
              absolute right-0 mt-2
              w-40
              bg-[#14102a]
              border border-[#2a2f45]
              rounded-lg
              shadow-lg
              opacity-0
              group-hover:opacity-100
              transition
              "
            >
            </div>

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

/* SMALL STAT COMPONENT */

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