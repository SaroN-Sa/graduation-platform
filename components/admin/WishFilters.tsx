interface Props {
  value: string
  onChange: (v: string) => void
}

export default function WishFilters({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 bg-[#0f0b1f] border border-[#2a2f45] rounded-lg text-white"
    >
      <option value="all">All</option>
      <option value="featured">Featured</option>
      <option value="video">Videos</option>
      <option value="photo">Photos</option>
      <option value="text">Text Only</option>
    </select>
  )
}
