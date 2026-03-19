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

  /* GET GRADUATE */
  const { data } = await supabase
    .from("graduates")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0b1f] text-white">
        <p className="text-lg">Graduate not found</p>
      </div>
    )
  }

  /* EDUCATION JOURNEY */
  const { data: journey } = await supabase
    .from("education_journey")
    .select("*")
    .eq("graduate_slug", slug)
    .order("position", { ascending: true })

  return (
    <main className="bg-[#0f0b1f] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0f0b1f]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Brand */}
          <h1 className="text-lg font-bold text-orange-400">
            Gradify 🎓
          </h1>

          {/* Manage Page Button */}
          <a
            href="/admin"
            className="
            bg-orange-500
            hover:bg-orange-600
            text-black
            px-4 py-2
            rounded-lg
            text-sm
            font-semibold
            shadow-lg
            transition
            "
          >
            Manage Page
          </a>

        </div>
      </header>

      {/* HERO */}
      <HeroSection
        name={data.name}
        department={data.department}
        profileImage={data.profile_image}
        bio={data.bio}
        university={data.university}
        year={data.graduation_year}
      />

      {/* GALLERY */}
      <section id="gallery" className="scroll-mt-24">
        <GallerySection slug={slug} />
      </section>

      {/* WISHES */}
      <section id="wishes" className="scroll-mt-24">
        <WishSection slug={slug} />
      </section>

      {/* EDUCATION JOURNEY */}
      <section id="education" className="scroll-mt-24">
        <EducationTimeline journey={journey || []} />
      </section>

      {/* CELEBRATION */}
      <section id="celebration" className="scroll-mt-24">
        <CelebrationSection name={data.name} />
      </section>

      <SiteFooter />

    </main>
  )
}