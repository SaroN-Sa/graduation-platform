import GraduateManager from "@/components/admin/GraduateManager"

export default function SuperAdminPage() {

  return (

    <div className="min-h-screen bg-[#0f0b1f] text-white p-10">

      <h1 className="text-3xl font-bold mb-10">
        🎓 Super Admin Dashboard
      </h1>

      <GraduateManager />

    </div>

  )
}