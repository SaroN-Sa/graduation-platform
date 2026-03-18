import { supabase } from "@/lib/supabaseClient"
import HeroSection from "@/components/HeroSection"
import GallerySection from "@/components/GallerySection"
import WishSection from "@/components/WishSection"
import SiteFooter from "@/components/SiteFooter"
import CelebrationSection from "@/components/CelebrationSection"
import EducationTimeline from "@/components/EducationTimeline"

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

  const { data: journey } = await supabase
    .from("education_journey")
    .select("*")
    .eq("graduate_slug", slug)
    .order("position", { ascending: true })

  return (
    <main className="bg-[#0f0b1f] text-white">

      {/* HERO */}
      <HeroSection
        name={data.name}
        department={data.department}
        profileImage={data.profile_image}
      />

      {/* 📸 GALLERY */}
      <section id="gallery" className="scroll-mt-24">
        <GallerySection slug={slug} />
      </section>

      {/* 💬 WISHES */}
      <section id="wishes" className="scroll-mt-24">
        <WishSection slug={slug} />
      </section>

      
      {/* 🎓 EDUCATION */}
      <section id="education" className="scroll-mt-24">
        <EducationTimeline journey={journey || []} />
      </section>


      {/* 🎉 CELEBRATION */}
      <section id="celebration" className="scroll-mt-24">
        <CelebrationSection name={data.name} />
      </section>

      <SiteFooter />

    </main>
  )
}