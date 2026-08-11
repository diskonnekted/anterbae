import './globals.css'

export const metadata = {
  title: 'Anterbae - Kirim Apa Saja ke Mana Saja di Banjarnegara',
  description: 'Layanan kurir Anterbae: pesan antar makanan, antar paket, jastip belanja di seluruh Kabupaten Banjarnegara.',
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
