"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import WishCard from "./WishCard"

interface Props {
  slug: string
}

export default function WishList({ slug }: Props) {

  const [wishes, setWishes] = useState<any[]>([])

  async function loadWishes() {

    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("graduate_slug", slug)
      .eq("featured", true) // fetch only featured wishes
      .order("created_at", { ascending: false })

    if (!error) {
      setWishes(data || [])
    }
  }

  useEffect(() => {
    loadWishes()
  }, [slug])

  if (wishes.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-10">
        No featured wishes yet ⭐
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {wishes.map((wish) => (
        <WishCard key={wish.id} wish={wish} />
      ))}

    </div>
  )
}