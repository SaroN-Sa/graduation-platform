"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import confetti from "canvas-confetti"
import { useEffect, useState } from "react"

interface JourneyItem {
  id: string
  stage: string
  school: string
  field?: string
  start_year?: number
  end_year?: number
}

interface Particle {
  left: number
  duration: number
  delay: number
}

export default function EducationTimeline({
  journey
}: {
  journey: JourneyItem[]
}) {

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5
  })

  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const p = Array.from({ length: 24 }).map(() => ({
      left: Math.random() * 100,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 3
    }))
    setParticles(p)
  }, [])

  useEffect(() => {
    if (inView && journey.length > 0) {
      const last = journey[journey.length - 1]

      if (last.stage.toLowerCase() === "university") {
        const duration = 2500
        const end = Date.now() + duration

        const frame = () => {
          confetti({
            particleCount: 6,
            spread: 360,
            startVelocity: 30,
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2
            }
          })
          if (Date.now() < end) requestAnimationFrame(frame)
        }

        frame()
      }
    }
  }, [inView, journey])

  return (

    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#0f0b1f] via-[#1a1333] to-[#2a1c45]">

      {/* particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-[2px] h-[2px] bg-yellow-400 rounded-full opacity-40"
            animate={{
              y: ["0%", "-120%"],
              x: ["0%", "20%", "-20%", "0%"]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay
            }}
            style={{
              left: `${p.left}%`,
              bottom: "-10px"
            }}
          />
        ))}
      </div>

      {/* title */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12 md:mb-20">
        🎓 Education Journey
      </h2>

      <div className="relative max-w-5xl mx-auto px-4">

        {/* timeline line */}
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="
            absolute
            left-4 md:left-1/2
            md:-translate-x-1/2
            w-[2px] md:w-[3px]
            bg-[#1f1a3a]
          "
        />

        {journey.map((item, index) => {

          const left = index % 2 === 0

          return (

            <div
              key={item.id}
              ref={index === journey.length - 1 ? ref : undefined}
              className={`
                mb-12 md:mb-16
                flex
                ${left ? "md:justify-start" : "md:justify-end"}
              `}
            >

              {/* node */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 mt-6">

                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(250,204,21,0.5)",
                      "0 0 12px rgba(250,204,21,0.8)",
                      "0 0 0px rgba(250,204,21,0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full"
                />

              </div>

              {/* card */}
              <motion.div
                initial={{ opacity: 0, x: left ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="
                  bg-[#1f1a3a]
                  border border-[#2e2557]
                  rounded-xl
                  p-4 md:p-6
                  w-full md:w-[44%]
                  ml-10 md:ml-0
                  shadow-lg
                  hover:scale-[1.02]
                  transition
                "
              >

                <h3 className="text-yellow-400 font-semibold text-base md:text-lg">
                  {item.stage}
                </h3>

                <p className="text-gray-200 mt-1 text-sm md:text-base">
                  {item.school}
                </p>

                {item.field && (
                  <p className="text-gray-400 text-xs md:text-sm">
                    {item.field}
                  </p>
                )}

                {(item.start_year || item.end_year) && (
                  <p className="text-gray-500 text-xs md:text-sm mt-2">
                    {item.start_year} - {item.end_year}
                  </p>
                )}

              </motion.div>

            </div>

          )
        })}

      </div>

    </section>
  )
}