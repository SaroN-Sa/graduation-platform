"use client"

import { GraduationCap, Sparkles } from "lucide-react"

interface Graduate {
  name: string
  slug: string
  department: string
  bio: string
  profile_image: string
  featured?: boolean
}

interface Props {
  graduate: Graduate
}

export default function GraduateSpotlight({ graduate }: Props) {

  // if graduate is not featured don't show spotlight
  if (!graduate.featured) return null

  return (
    <section className="relative py-28 px-6 bg-[#0b0f1a] text-white overflow-hidden">

      {/* glow background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center relative z-10">

        {/* image */}
        <div className="flex justify-center">

          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-300 blur-xl opacity-60"></div>

            <div className="relative w-72 h-72 rounded-full p-[4px] bg-gradient-to-br from-yellow-400 to-yellow-200 transition hover:scale-105">

              <img
                src={graduate.profile_image}
                alt={graduate.name}
                className="w-full h-full rounded-full object-cover"
              />

            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#1a1333] border border-[#2e2557] text-sm flex items-center gap-2">

              <GraduationCap className="w-4 h-4 text-yellow-400" />

              Featured Graduate

            </div>

          </div>

        </div>

        {/* content */}
        <div className="text-center md:text-left">

          <h2 className="text-yellow-400 text-sm tracking-widest uppercase mb-2">
            Graduate Spotlight
          </h2>

          <h3 className="text-4xl md:text-5xl font-bold">
            {graduate.name}
          </h3>

          <p className="text-gray-400 mt-2 text-lg">
            {graduate.department}
          </p>

          <p className="mt-6 text-gray-300 max-w-lg">
            {graduate.bio}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <a
              href={`/graduate/${graduate.slug}`}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:scale-105 transition shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              View Profile
            </a>

            <a
              href={`/graduate/${graduate.slug}`}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-[#2e2557] hover:bg-[#1a1333] transition"
            >
              Leave a Wish
            </a>

          </div>

        </div>

      </div>

    </section>
  )
}