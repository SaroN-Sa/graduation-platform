export const dynamic = "force-dynamic"

import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import AdminHeader from "@/components/admin/AdminHeader"
import ProfileManager from "@/components/admin/ProfileManager"
import GalleryManager from "@/components/admin/GalleryManager"
import WishDashboard from "@/components/admin/WishDashboard"
import JourneyManager from "@/components/admin/JourneyManager"
import AutoRefresh from "@/components/AutoRefresh"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function ManagePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { token } = await searchParams

  /* UNAUTHORIZED PAGE */
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0f0b1f] flex items-center justify-center text-white px-4">
        <div className="text-center w-full max-w-md">

          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            🔒 Unauthorized Access
          </h1>

          <p className="text-gray-400 mb-8 text-sm sm:text-base">
            This management link is invalid or expired.
          </p>

          <Link
            href="/"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
          >
            Go Home
          </Link>

        </div>
      </div>
    )
  }

  /* DATABASE CHECK */
  const { data } = await supabase
    .from("graduates")
    .select("*")
    .eq("slug", slug)
    .eq("token", token)
    .maybeSingle()

  /* GRADUATE NOT FOUND */
  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f0b1f] flex items-center justify-center text-white px-4">
        <div className="text-center w-full max-w-md">

          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            🎓 Graduate Not Found
          </h1>

          <p className="text-gray-400 mb-8 text-sm sm:text-base">
            The graduate page you're trying to manage does not exist
            or the access link is incorrect.
          </p>

          <Link
            href="/admin"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
          >
            Go Home
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0b1f] text-white px-4 sm:px-6 md:px-10 py-6">

      {/* AUTO REFRESH */}
      <AutoRefresh />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <AdminHeader />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto">

        {/* PROFILE + GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-10">
          <ProfileManager graduate={data} />
          <GalleryManager slug={slug} />
        </div>

        {/* EDUCATION JOURNEY */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 md:mb-6">
            🎓 Manage Education Journey
          </h2>

          <div className="bg-[#15112a] rounded-xl p-4 sm:p-6">
            <JourneyManager slug={slug} />
          </div>
        </div>

        {/* WISHES */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 md:mb-6">
            💌 Manage Wishes
          </h2>

          <div className="bg-[#15112a] rounded-xl p-4 sm:p-6">
            <WishDashboard slug={slug} />
          </div>
        </div>

      </div>
    </div>
  )
}