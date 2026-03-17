import { supabase } from "@/lib/supabaseClient"
import AdminHeader from "@/components/admin/AdminHeader"
import ProfileManager from "@/components/admin/ProfileManager"
import GalleryManager from "@/components/admin/GalleryManager"
import WishDashboard from "@/components/admin/WishDashboard"
import JourneyManager from "@/components/admin/JourneyManager"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function ManagePage({ params, searchParams }: Props) {

  const { slug } = await params
  const { token } = await searchParams

  // 🔒 Security check
  if (!token) {
    return (
      <p className="text-center mt-20 text-white">
        Unauthorized
      </p>
    )
  }

  const { data, error } = await supabase
    .from("graduates")
    .select("*")
    .eq("slug", slug)
    .eq("token", token)
    .single()

  if (!data || error) {
    return (
      <p className="text-center mt-20 text-white">
        Unauthorized
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0b1f] text-white p-4 md:p-10">

      {/* ✅ FIXED: removed name prop */}
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
