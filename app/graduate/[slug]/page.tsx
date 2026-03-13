import { supabase } from "@/lib/supabaseClient"
import HeroSection from "@/components/HeroSection"
import GallerySection from "@/components/GallerySection"
import WishSection from "@/components/WishSection"
import HighlightsSection from "@/components/HighlightsSection"
import AchievementsSection from "@/components/AchievementsSection"
import GraduateSpotlight from "@/components/GraduateSpotlight"

interface GraduatePageProps {
  params: Promise<{ slug: string }>
}

export default async function GraduatePage({ params }: GraduatePageProps) {

  const { slug } = await params

  const { data } = await supabase
    .from("graduates")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!data) return <p>Graduate not found</p>

  return (
    <main>

      <HeroSection
        name={data.name}
        department={data.department}
        profileImage={data.profile_image}
      />
       
       <GraduateSpotlight graduate={data} />

     <GallerySection slug={slug} />

      <WishSection />

      <HighlightsSection />

      <AchievementsSection />

    </main>
  )
}