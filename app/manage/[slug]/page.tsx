import { supabase } from "@/lib/supabaseClient"
import DashboardHeader from "@/components/admin/DashboardHeader"
import ProfileManager from "@/components/admin/ProfileManager"
import GalleryManager from "@/components/admin/GalleryManager"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function ManagePage({ params, searchParams }: Props) {

  const { slug } = await params
  const { token } = await searchParams

  if (!token) {
    return <p className="text-center mt-20">Unauthorized</p>
  }

  const { data } = await supabase
    .from("graduates")
    .select("*")
    .eq("slug", slug)
    .eq("token", token)
    .single()

  if (!data) {
    return <p className="text-center mt-20">Unauthorized</p>
  }

  return (
    <div className="min-h-screen bg-[#0f0b1f] text-white p-10">

      <DashboardHeader name={data.name} />

      <div className="grid md:grid-cols-2 gap-8 mt-10">

        <ProfileManager graduate={data} />

        <GalleryManager slug={slug} />

      </div>

    </div>
  )
}