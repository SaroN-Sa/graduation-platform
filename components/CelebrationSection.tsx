"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"

interface Props {
  name: string
}

export default function CelebrationSection({ name }: Props) {

  return (

    <section className="py-24 bg-gradient-to-b from-[#2a1c45] to-[#0f0b1f] text-white">

      <div className="max-w-4xl mx-auto text-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >

          <div className="flex justify-center mb-6">
            <Sparkles className="text-yellow-400 w-10 h-10" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Thank You for Celebrating with{" "}
            <span className="text-yellow-400">{name}</span>
          </h2>

          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Every wish, message, and moment shared here means a lot.
            This journey would not be possible without the love and support
            of friends, family, and mentors.
          </p>

          <div className="flex justify-center mt-8">
            <Heart className="text-red-400 w-8 h-8" />
          </div>

        </motion.div>

      </div>

    </section>

  )
}