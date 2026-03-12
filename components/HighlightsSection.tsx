export default function HighlightsSection() {

  return (
    <section className="bg-gradient-to-b from-[#0b0f1a] to-[#1a1333] py-24 text-white">

      <div className="max-w-5xl mx-auto text-center px-6">

        <h2 className="text-3xl text-yellow-400 font-bold mb-2">
          🎬 Highlights
        </h2>

        <p className="text-gray-400 mb-10">
          Relive the ceremony and special moments.
        </p>

        <div className="rounded-xl overflow-hidden shadow-xl border border-[#2a2f45]">

          <iframe
            width="100%"
            height="450"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            allowFullScreen
          />

        </div>

      </div>
    </section>
  )
}