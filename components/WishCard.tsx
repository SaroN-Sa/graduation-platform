interface Props {
  wish: any
}

export default function WishCard({ wish }: Props) {

  const hasVideo = wish.video_url
  const hasImage = wish.photo_url

  return (
    <div className="bg-[#1a1333] rounded-xl border border-[#2a2f45] overflow-hidden">

      {/* MEDIA */}

      {hasVideo && (
        <video
          src={wish.video_url}
          controls
          className="w-full h-40 object-cover"
        />
      )}

      {!hasVideo && hasImage && (
        <img
          src={wish.photo_url}
          className="w-full h-40 object-cover"
        />
      )}

      {/* TEXT */}

      <div className="p-3">

        <p className="text-yellow-400 text-sm font-semibold">
          {wish.name}
        </p>

        {wish.message && (
          <p className="text-gray-300 text-xs mt-1 line-clamp-2">
            {wish.message}
          </p>
        )}

      </div>

    </div>
  )
}