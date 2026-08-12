'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Oops! Ada Masalah
        </h1>
        <p className="text-gray-500 mb-6">
          Halaman ini tidak bisa dimuat. Coba muat ulang atau hubungi admin jika masalah berlanjut.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-transform"
          >
            Muat Ulang
          </button>
          <a
            href="https://wa.me/6281328128315"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-transform"
          >
            Chat Admin
          </a>
        </div>
      </div>
    </div>
  )
}
