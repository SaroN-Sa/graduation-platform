interface Props {
  name: string
}

export default function DashboardHeader({ name }: Props) {
  return (
    <div className="mb-10">

      <h1 className="text-4xl font-bold text-yellow-400">
        🎓 {name} Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Manage your graduation page content.
      </p>

    </div>
  )
}