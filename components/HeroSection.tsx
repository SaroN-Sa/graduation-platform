"use client"

import Image from "next/image"
import { GraduationCap, Sparkles, Image as ImageIcon } from "lucide-react"

interface Props {
  name: string
  department?: string
  profileImage?: string
  bio?: string
  university?: string
  year?: string
}

export default function HeroSection({
  name,
  department,
  profileImage,
  bio,
  university,
  year
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
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0b1f] via-[#1a1333] to-[#2a1c45] text-white overflow-hidden">

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-12 md:py-16 max-w-3xl mx-auto">

        {/* icon */}
        <div className="mb-5 md:mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1f1a3a]">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
          </div>
        </div>

        {/* title */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
          Congratulations,{" "}
          <span className="text-yellow-400 break-words">{name}</span>!
        </h1>

        {/* university + year */}
        {(university || year) && (
          <p className="text-gray-400 text-sm sm:text-base mb-3">
            {university}
            {year && <span className="block sm:inline"> • Class of {year}</span>}
          </p>
        )}

        {/* subtitle */}
        <p className="text-gray-300 text-sm sm:text-lg md:text-xl max-w-xl leading-relaxed mb-6">
          Celebrate the achievements of our amazing graduate. Leave your wishes
          and share in this special moment.
        </p>

        {/* bio with visible lines */}
        {bio && (
          <div className="flex items-center w-full max-w-xl mb-8 md:mb-10 gap-3">

            {/* left line */}
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />

            {/* bio text */}
            <p className="text-yellow-400 text-xs sm:text-sm md:text-base text-center px-2 break-words">
              ✨ {bio} ✨
            </p>

            {/* right line */}
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />

          </div>
        )}

        {/* profile image */}
        {profileImage && (
          <div className="mb-6 md:mb-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-yellow-300">
              <Image
                src={profileImage}
                alt={name}
                width={200}
                height={200}
                priority
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        )}

        {/* department */}
        {department && (
          <div className="mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#1f1a3a] text-gray-200 text-xs sm:text-sm border border-[#2e2557]">
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              {department}
            </span>
          </div>
        )}

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">

          <button
            onClick={() => scrollTo("wishes")}
            className="w-full sm:w-auto rounded-full bg-yellow-400 text-black px-6 sm:px-8 py-3 font-semibold flex items-center justify-center hover:scale-105 active:scale-95 transition"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Leave a Wish
          </button>

          <button
            onClick={() => scrollTo("gallery")}
            className="w-full sm:w-auto rounded-full border border-[#2e2557] px-6 sm:px-8 py-3 font-semibold flex items-center justify-center hover:bg-[#1a1333] active:scale-95 transition"
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            View Gallery
          </button>

        </div>

      </div>
    </section>
  )
}