"use client"

import WishForm from "./WishForm"
import WishList from "./WishList"

interface Props {
  slug: string
}

export default function WishSection({ slug }: Props) {

  return (
    <section className="bg-[#0b0f1a] py-24 px-6 text-white">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          💬 Leave a Wish
        </h2>

        <p className="text-center text-gray-400 mt-2 mb-12">
          Send your congratulations and best wishes.
        </p>

        <WishForm slug={slug} />

        <div className="mt-16">
          <WishList slug={slug} />
        </div>

      </div>

    </section>
  )
}