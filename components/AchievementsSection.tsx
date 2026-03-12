export default function AchievementsSection() {

  return (
    <section className="bg-[#050a14] text-white py-24 px-6">

      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl text-yellow-400 font-bold text-center mb-10">
          📄 Achievements
        </h2>

        <div className="space-y-6">

          <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937]">
            <h3 className="font-semibold">
              B.Sc Computer Science & Engineering
            </h3>
            <p className="text-gray-400">
              Graduated with First Class Honours.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937]">
            <h3 className="font-semibold">
              Software Engineering Intern — Google
            </h3>
            <p className="text-gray-400">
              Improved system performance by 30%.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937]">
            <h3 className="font-semibold">
              Hackathon Winner
            </h3>
            <p className="text-gray-400">
              1st place at National AI Hackathon.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}