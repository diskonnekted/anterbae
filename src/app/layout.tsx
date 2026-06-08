import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SanityLive } from "@/sanity/lib/live";
import { CartProvider } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pasar Pondokrejo - Marketplace Desa",
  description: "Marketplace lokal untuk warga Kalurahan Pondokrejo",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PasarRejo",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const isMobile = headerList.get("x-is-mobile") === "true";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <CartProvider>
          {!isMobile && <Navbar />}
          <main className="flex-grow">
            {children}
          </main>
          {!isMobile && (
            <footer className="border-t bg-white pt-16 pb-8 print:hidden">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="relative w-10 h-10">
                        <Image
                          src="/logo.webp"
                          alt="Logo PAWON"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-2xl font-black tracking-tighter text-slate-900">
                        PA<span className="text-green-600">WON</span>
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Pasar Warga Pondokrejo (PAWON) adalah inisiatif marketplace digital resmi milik Kalurahan Pondokrejo untuk menghubungkan produk dan jasa warga langsung ke tangan pembeli.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Tentang Kami</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      PAWON hadir untuk memperkuat ekonomi lokal dengan semangat gotong-royong. Semua transaksi di sini membantu pertumbuhan UMKM dan kemandirian ekonomi kalurahan kita.
                    </p>
                    <div className="flex gap-4">
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Real UMKM</div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Verified</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Layanan Kalurahan</h4>
                    <ul className="space-y-4 text-sm font-bold">
                      <li>
                        <Link href="/register-vendor" className="text-slate-500 hover:text-green-600 transition-colors">Daftar Jadi Penjual</Link>
                      </li>
                      <li>
                        <Link href="/register-courier" className="text-slate-500 hover:text-green-600 transition-colors">Daftar Jadi Kurir</Link>
                      </li>
                      <li>
                        <Link href="/track" className="text-slate-500 hover:text-green-600 transition-colors">Lacak Pesanan Kurir</Link>
                      </li>
                      <li>
                        <Link href="/services" className="text-slate-500 hover:text-green-600 transition-colors">Cari Tenaga Ahli</Link>
                      </li>
                      <li>
                        <Link href="/info" className="text-slate-500 hover:text-green-600 transition-colors">Info & Pengumuman</Link>
                      </li>
                      <li>
                        <Link href="/studio" className="text-slate-500 hover:text-green-600 transition-colors font-bold text-slate-800">Portal Admin Desa</Link>
                      </li>
                      <li className="pt-4">
                        <Link 
                          href="/inkubator" 
                          className="inline-block bg-slate-900 text-white font-black px-6 py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg active:scale-95 text-xs"
                        >
                          Program Inkubator UMKM &rarr;
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Pusat Bantuan</h4>
                    <ul className="space-y-4 text-sm font-bold">
                      <li>
                        <Link href="/manual/pembeli" className="text-slate-500 hover:text-green-600 transition-colors">📖 Panduan Pembeli</Link>
                      </li>
                      <li>
                        <Link href="/manual/penjual" className="text-slate-500 hover:text-green-600 transition-colors">📖 Panduan Penjual</Link>
                      </li>
                      <li>
                        <Link href="/manual/kurir" className="text-slate-500 hover:text-green-600 transition-colors">📖 Panduan Kurir</Link>
                      </li>
                      <li className="pt-6">
                        <a 
                          href="/pawon.apk" 
                          download
                          className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95 group"
                        >
                          <svg className="w-5 h-5 fill-current text-green-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.518 15.3414 17.5129 15.3414 17.5079 15.3414C16.8929 15.3414 16.3934 14.8418 16.3934 14.2268C16.3934 13.6118 16.8929 13.1123 17.5079 13.1123C18.1228 13.1123 18.6224 13.6118 18.6224 14.2268C18.6224 14.8418 18.1228 15.3414 17.523 15.3414ZM6.47644 15.3414C5.86146 15.3414 5.36195 14.8418 5.36195 14.2268C5.36195 13.6118 5.86146 13.1123 6.47644 13.1123C7.09142 13.1123 7.59092 13.6118 7.59092 14.2268C7.59092 14.8418 7.09142 15.3414 6.47644 15.3414ZM17.701 10.3705L19.6454 7.00293C19.7423 6.83547 19.6845 6.62194 19.5171 6.52504C19.3496 6.42813 19.1361 6.4859 19.0392 6.65337L17.0628 10.0766C15.5412 9.38202 13.8213 8.97198 12.0003 8.97198C10.1794 8.97198 8.45942 9.38202 6.93783 10.0766L4.96144 6.65337C4.86453 6.4859 4.65101 6.42813 4.48354 6.52504C4.31607 6.62194 4.2583 6.83547 4.3552 7.00293L6.29962 10.3705C2.71616 12.3392 0.285885 16.0371 0 20.3546H24C23.7141 16.0371 21.2845 12.3392 17.701 10.3705Z" />
                          </svg>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-green-100 font-bold">Download App</span>
                            <span className="text-sm font-black tracking-tight">Android APK</span>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-gray-400 text-xs font-medium">
                    &copy; 2026 Kalurahan Pondokrejo. PAWON: Pasar Warga Pondokrejo.
                  </div>
                  <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Membangun Kalurahan dari Tetangga</span>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </CartProvider>
        <SanityLive />
      </body>
    </html>
  );
}
