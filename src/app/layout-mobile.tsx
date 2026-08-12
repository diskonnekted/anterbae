import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Anterbae - Kirim Apa Saja ke Mana Saja di Banjarnegara',
  description: 'Layanan kurir Anterbae: pesan antar makanan, antar paket, jastip belanja di seluruh Kabupaten Banjarnegara.',
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect ke Sanity API hanya jika diperlukan */}
        <Script id="sanity-preconnect" strategy="afterInteractive">
          {`if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const link = document.createElement('link');
                  link.rel = 'preconnect';
                  link.href = 'https://mri94xpo.api.sanity.io';
                  document.head.appendChild(link);
                  observer.disconnect();
                }
              });
            });
            observer.observe(document.body);
          }`}
        </Script>
      </head>
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
