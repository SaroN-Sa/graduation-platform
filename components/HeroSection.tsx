"use client"

import Image from "next/image"
import { GraduationCap, Sparkles, Image as ImageIcon } from "lucide-react"

interface Props {
  name: string
  department: string
  profileImage: string
}

export default function HeroSection({
  name,
  department,
  profileImage,
}: Props) {

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0b1f] via-[#1a1333] to-[#2a1c45] text-white overflow-hidden">

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-3xl mx-auto">

        {/* icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1f1a3a]">
            <GraduationCap className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
          Congratulations,{" "}
          <span className="text-yellow-400">{name}</span>!
        </h1>

        {/* subtitle */}
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mb-10">
          Celebrate the achievements of our amazing graduate. Leave your wishes
          and share in this special moment.
        </p>

        {/* image */}
        {profileImage && (
          <div className="mb-6">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-yellow-300">
              <Image
                src={profileImage}
                alt={name}
                width={200}
                height={200}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        )}

        {/* department */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1f1a3a] text-gray-200 text-sm border border-[#2e2557]">
            <GraduationCap className="w-4 h-4 text-yellow-400" />
            {department}
          </span>
        </div>

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          <button
            onClick={() => scrollTo("wishes")}
            className="w-full sm:w-auto rounded-full bg-yellow-400 text-black px-8 py-3 font-semibold flex items-center justify-center hover:scale-105 transition"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Leave a Wish
          </button>

          <button
            onClick={() => scrollTo("gallery")}
            className="w-full sm:w-auto rounded-full border border-[#2e2557] px-8 py-3 font-semibold flex items-center justify-center hover:bg-[#1a1333] transition"
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            View Gallery
          </button>

        </div>

      </div>
    </section>
  )
}