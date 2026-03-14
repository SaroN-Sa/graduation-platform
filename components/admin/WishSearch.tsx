interface Props {
  value: string
  onChange: (v: string) => void
}

export default function WishSearch({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 bg-[#0f0b1f] border border-[#2a2f45] rounded-lg text-white w-full"
    />
  )
}
