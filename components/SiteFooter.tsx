export default function SiteFooter() {

  return (

    <footer className="bg-[#0f0b1f] border-t border-[#2e2557] text-gray-400 py-8">

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

        <p>
          © {new Date().getFullYear()} Graduation Celebration
        </p>

        <p>
          Developed by{" "}
          <span className="text-yellow-400 font-semibold">
            Saron Samuel
          </span>
        </p>

      </div>

    </footer>

  )
}