import './globals.css'
import Script from 'next/script'
import PwaRegister from '@/components/PwaRegister'
import PwaInstallButton from '@/components/PwaInstallButton'

export const metadata = {
  title: 'Anterbae - Kirim Apa Saja ke Mana Saja di Banjarnegara',
  description: 'Layanan kurir Anterbae: pesan antar makanan, antar paket, jastip belanja di seluruh Kabupaten Banjarnegara.',
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Anterbae" />
        <link rel="apple-touch-icon" href="/anterbae.png" />
        
        {/* iOS Splash Screen */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
          href="/anterbae.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
          href="/anterbae.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
          href="/anterbae.png"
        />
        
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
        <PwaRegister />
        <PwaInstallButton />
        {children}
      </body>
    </html>
  )
}
