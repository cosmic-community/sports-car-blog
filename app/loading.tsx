export default function Loading() {
  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-carbon-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-racing-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-carbon-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}