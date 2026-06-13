import { Truck, Package, ShoppingBag, MapPin, Clock, Shield, Phone } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Layanan Anterbae — Antar Makanan, Paket & Jastip Banjarnegara",
  description: "Layanan kurir Anterbae: pesan antar makanan, antar paket barang, dan jastip belanja di seluruh Kabupaten Banjarnegara.",
}

const services = [
  {
    id: "food",
    icon: "🍔",
    title: "Pesan Antar Makanan",
    description: "Lapar tapi males keluar? Pesan dari warung atau restoran favorit, kurir kami yang ambil dan antar!",
    features: [
      "Nasi, mie, bakso, soto, dll",
      "Minuman dan es teh",
      "Snack dan kue",
      "Antar selagi hangat",
    ],
    price: "Mulai Rp 5.000",
    time: "30-60 menit",
    color: "red",
  },
  {
    id: "parcel",
    icon: "📦",
    title: "Antar Paket & Barang",
    description: "Kirim apapun ke tujuan di dalam Kabupaten Banjarnegara. Cepat, aman, dan bisa COD.",
    features: [
      "Antar dalam kota Banjarnegara",
      "Antar antar-kecamatan",
      "Dokumen penting & surat",
      "Barang elektronik & fragile",
    ],
    price: "Mulai Rp 8.000",
    time: "1-3 jam",
    color: "blue",
  },
  {
    id: "jastip",
    icon: "🛒",
    title: "Jastip (Titip Beli)",
    description: "Titip beli ke pasar, minimarket, apotek, atau toko apapun. Kurir kami belanjakan dan antarkan!",
    features: [
      "Belanja ke Pasar Banjarnegara",
      "Minimarket (Alfamart, Indomaret)",
      "Apotek dan toko kesehatan",
      "Toko bangunan dan pertanian",
    ],
    price: "Mulai Rp 10.000 + harga barang",
    time: "1-2 jam",
    color: "green",
  },
]

export default function LayananPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          ⚡ Layanan Kami
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Semua <span className="text-red-600">Layanan Anterbae</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">
          Dari makanan panas hingga paket penting, kami siap mengantarkan ke mana pun di Kabupaten Banjarnegara.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {services.map((service) => (
          <div
            key={service.id}
            className={`rounded-[2.5rem] p-8 border-2 transition-all ${
              service.color === "red"
                ? "bg-white border-red-100 hover:border-red-300 hover:shadow-2xl hover:shadow-red-100"
                : service.color === "blue"
                ? "bg-slate-900 border-slate-800 text-white hover:shadow-2xl hover:shadow-slate-900/30"
                : "bg-white border-green-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-100"
            }`}
          >
            <div className="text-6xl mb-5">{service.icon}</div>
            <h2 className={`text-2xl font-black mb-3 ${service.color === "blue" ? "text-white" : "text-slate-900"}`}>
              {service.title}
            </h2>
            <p className={`font-medium leading-relaxed mb-6 ${service.color === "blue" ? "text-slate-400" : "text-slate-500"}`}>
              {service.description}
            </p>

            <ul className="space-y-2 mb-8">
              {service.features.map((feat) => (
                <li key={feat} className={`flex items-center gap-2 text-sm font-bold ${service.color === "blue" ? "text-slate-300" : "text-slate-700"}`}>
                  <span className="text-green-500">✓</span> {feat}
                </li>
              ))}
            </ul>

            <div className={`border-t ${service.color === "blue" ? "border-slate-700" : "border-slate-100"} pt-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-xs font-black uppercase tracking-wider mb-1 ${service.color === "blue" ? "text-slate-400" : "text-slate-400"}`}>Tarif</div>
                  <div className={`font-black text-lg ${service.color === "red" ? "text-red-600" : service.color === "green" ? "text-green-600" : "text-red-400"}`}>
                    {service.price}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-black uppercase tracking-wider mb-1 ${service.color === "blue" ? "text-slate-400" : "text-slate-400"}`}>Estimasi</div>
                  <div className={`font-black ${service.color === "blue" ? "text-white" : "text-slate-900"}`}>
                    {service.time}
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 font-black py-3 rounded-2xl transition-all active:scale-95 ${
                  service.color === "red"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : service.color === "blue"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <Phone className="w-4 h-4" />
                Pesan via WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 text-center">
        <div className="text-3xl mb-3">ℹ️</div>
        <h3 className="text-xl font-black text-amber-900 mb-2">Informasi Tarif</h3>
        <p className="text-amber-700 font-medium max-w-2xl mx-auto">
          Tarif dapat berbeda tergantung jarak, ukuran barang, dan area tujuan. Admin kami akan memberikan info harga pasti sebelum pesanan diproses. Tidak ada biaya tersembunyi!
        </p>
      </div>
    </div>
  )
}
