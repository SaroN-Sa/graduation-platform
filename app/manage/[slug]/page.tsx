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
      <div className="min-h-screen bg-[#0f0b1f] flex items-center justify-center text-white px-6">
        <div className="text-center max-w-md">

          <h1 className="text-3xl font-bold mb-4">
            🔒 Unauthorized Access
          </h1>

          <p className="text-gray-400 mb-8">
            This management link is invalid or expired.
          </p>

          <Link
            href="/"
            className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
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
      <div className="min-h-screen bg-[#0f0b1f] flex items-center justify-center text-white px-6">
        <div className="text-center max-w-md">

          <h1 className="text-3xl font-bold mb-4">
            🎓 Graduate Not Found
          </h1>

          <p className="text-gray-400 mb-8">
            The graduate page you're trying to manage does not exist
            or the access link is incorrect.
          </p>

          <Link
            href="/admin"
            className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
          >
            Go Home
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0b1f] text-white p-4 md:p-10">

      {/* AUTO REFRESH */}
      <AutoRefresh />

      <AdminHeader />

      {/* PROFILE + GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <ProfileManager graduate={data} />
        <GalleryManager slug={slug} />
      </div>

      {/* EDUCATION JOURNEY */}
      <div className="mt-16">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          🎓 Manage Education Journey
        </h2>
        <JourneyManager slug={slug} />
      </div>

      {/* WISHES */}
      <div className="mt-16">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          💌 Manage Wishes
        </h2>
        <WishDashboard slug={slug} />
      </div>

    </div>
  )
}