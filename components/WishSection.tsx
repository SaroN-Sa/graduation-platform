"use client"

import { useState } from "react"

export default function WishSection() {

  const [name,setName] = useState("")
  const [message,setMessage] = useState("")

  return (
    <section className="bg-[#050a14] text-white py-24 px-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl text-yellow-400 font-bold text-center">
          💌 Leave a Wish
        </h2>

        <p className="text-center text-gray-400 mt-2 mb-10">
          Share your warm wishes and congratulations!
        </p>

        <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937]">

          <input
            placeholder="Your name"
            className="w-full mb-4 p-3 rounded-lg bg-[#1f2937]"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <textarea
            placeholder="Write your congratulatory message..."
            className="w-full p-3 rounded-lg bg-[#1f2937]"
            rows={4}
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />

          <button className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold">
            ✈ Send Wish
          </button>

        </div>

      </div>
    </section>
  )
}