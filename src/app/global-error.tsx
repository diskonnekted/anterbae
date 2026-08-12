'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Anterbae Sedang Gangguan
          </h1>
          <p className="text-gray-500 mb-6">
            Maaf, terjadi kesalahan pada sistem kami. Tim kami sudah diberi notifikasi.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-transform"
            >
              Coba Lagi
            </button>
            <a
              href="https://wa.me/6281328128315"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-transform"
            >
              Hubungi Admin
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
