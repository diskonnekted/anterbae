import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SanityLive } from "@/sanity/lib/live";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import BottomNav from "@/components/mobile/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anterbae Delivery Service — Kurir Banjarnegara",
  description: "Jasa kurir terpercaya di Kabupaten Banjarnegara. Antar makanan, paket, dan jastip cepat ke seluruh kecamatan. Pesan sekarang!",
  manifest: "/manifest.json",
  icons: {
    icon: "/anterbae.png",
    apple: "/anterbae.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Anterbae",
  },
  openGraph: {
    title: "Anterbae Delivery Service",
    description: "Kurir cepat se-Kabupaten Banjarnegara",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
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
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <CartProvider>
          {!isMobile && <Navbar />}
          <main className="flex-grow">
            {children}
          </main>
          {isMobile && <BottomNav />}
        {!isMobile && (
          <footer className="bg-slate-900 text-white pt-16 pb-8 print:hidden">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-3 mb-5">
                    <Image
                      src="/anterbae.png"
                      alt="Logo Anterbae"
                      width={180}
                      height={85}
                      className="w-[140px] h-auto md:w-[200px] object-contain"
                    />
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm font-medium">
                    Jasa kurir terpercaya untuk seluruh wilayah Kabupaten Banjarnegara. Antar makanan, paket & jastip — cepat, aman, dan terjangkau.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    <div className="bg-red-600/20 text-red-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-red-600/30">⚡ Cepat</div>
                    <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-green-600/30">🛡️ Aman</div>
                    <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-blue-600/30">📍 Lokal</div>
                  </div>
                </div>

                {/* Layanan */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Layanan Kami</h4>
                  <ul className="space-y-3 text-sm font-bold">
                    <li>
                      <Link href="/pesan" className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2">
                        🍔 Pesan Antar Makanan
                      </Link>
                    </li>
                    <li>
                      <Link href="/pesan?type=parcel" className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2">
                        📦 Antar Paket & Barang
                      </Link>
                    </li>
                    <li>
                      <Link href="/pesan?type=jastip" className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2">
                        🛒 Jastip (Titip Beli)
                      </Link>
                    </li>
                    <li>
                      <Link href="/mitra" className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2">
                        🏪 Daftar Mitra Merchant
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Bergabung */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Bergabung</h4>
                  <ul className="space-y-3 text-sm font-bold">
                    <li>
                      <Link href="/register-courier" className="text-slate-400 hover:text-red-400 transition-colors">
                        🛵 Daftar Jadi Kurir
                      </Link>
                    </li>
                    <li>
                      <Link href="/register-merchant" className="text-slate-400 hover:text-red-400 transition-colors">
                        🏪 Daftar Jadi Merchant
                      </Link>
                    </li>
                    <li>
                      <Link href="/track" className="text-slate-400 hover:text-red-400 transition-colors">
                        📍 Lacak Pesanan
                      </Link>
                    </li>
                    <li>
                      <Link href="/kurir" className="text-slate-400 hover:text-red-400 transition-colors">
                        🔐 Portal Mitra Kurir
                      </Link>
                    </li>
                    <li className="pt-2">
                      <Link
                        href="/studio"
                        className="text-slate-500 hover:text-slate-300 transition-colors text-xs font-bold"
                      >
                        ⚙️ Admin Studio
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Kontak */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Hubungi Kami</h4>
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-2xl hover:bg-green-700 transition-all shadow-lg active:scale-95 group"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase tracking-widest text-green-100 font-bold">WhatsApp CS</span>
                        <span className="text-sm font-black">Chat Sekarang</span>
                      </div>
                    </a>
                    <div className="text-slate-500 text-sm space-y-2">
                      <p className="flex items-center gap-2 font-medium">
                        🕐 07.00 – 22.00 WIB
                      </p>
                      <p className="flex items-center gap-2 font-medium">
                        📍 Pusat: Banjarnegara Kota
                      </p>
                      <p className="flex items-center gap-2 font-medium">
                        🗺️ Seluruh Kab. Banjarnegara
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-slate-500 text-xs font-medium">
                  © 2026 Anterbae Delivery Service. All rights reserved.
                </div>
                <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-500">
                  <span>🛵 Kirim Apa Saja, Ke Mana Saja</span>
                </div>
              </div>
            </div>
          </footer>
        )}
        <SanityLive />
        </CartProvider>
      </body>
    </html>
  );
}
