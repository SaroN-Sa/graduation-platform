export default function GallerySection() {

  const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg",
  ]

  return (
    <section className="bg-gradient-to-b from-[#1a1333] to-[#0b0f1a] py-24 px-6 text-white">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          📸 Gallery
        </h2>

        <p className="text-center text-gray-400 mt-2 mb-12">
          A collection of memorable moments from the journey.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          {images.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[#2a2f45]"
            >
              <img
                src={img}
                className="w-full h-64 object-cover hover:scale-110 transition"
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  )
}