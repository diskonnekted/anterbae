import Link from 'next/link'
import { ArrowLeft, Bike, CheckSquare, LogIn, Map, Package, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Buku Panduan Kurir | PAWON Pondokrejo'
}

export default function CourierManualPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="mb-12 border-b border-slate-100 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl mb-6">
            <Bike className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Panduan Kurir Desa</h1>
          <p className="text-lg text-slate-500 font-medium">Langkah-langkah menjalankan tugas pengantaran di Pasar Warga Pondokrejo (PAWON).</p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
              Akses Portal Tugas (Dasbor Kurir)
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <LogIn className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Masuk ke Dasbor</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">Buka halaman <strong>Kurir</strong>. Masukkan Nomor WhatsApp Anda yang sudah didaftarkan ke Kalurahan beserta PIN Keamanan (default: 123456). Di dasbor ini, semua tugas penjemputan dan pengantaran Anda akan muncul secara otomatis.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
              Alur Mengambil Barang dari Penjual
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <Package className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">A. Cek Tugas Baru</h4>
                  <p className="text-slate-600 leading-relaxed text-sm mb-3">Admin akan mengirimkan pesanan ke Anda (statusnya <em>"Order Diterima Kurir"</em>). Tugas Anda pertama adalah mengambil barang tersebut ke alamat <strong>UMKM / Penjual</strong> yang tertera.</p>
                  <h4 className="font-bold text-slate-900 mb-2">B. Tandai "Barang Sudah Diambil"</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">Ketika Anda sudah sampai di tempat penjual dan mengambil paketannya, pastikan Anda menekan tombol <strong>"Barang Diambil & Siap Antar"</strong> di aplikasi Anda. Status ini akan langsung mengubah notifikasi pembeli agar mereka tahu Anda sedang OTW ke rumah mereka.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
              Mengantar ke Rumah Pembeli (COD)
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <MapPin className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Pengantaran dan Pembayaran Tunai</h4>
                  <p className="text-slate-600 leading-relaxed text-sm mb-3">Lihat <strong>Alamat Pengiriman</strong> dan nomor WhatsApp pembeli di aplikasi. Antarkan barang dengan aman. Jika metode pembayarannya adalah COD, tagihkan nominal <strong>Total Pembayaran</strong> (termasuk ongkir) secara tunai kepada pembeli.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
              Menyelesaikan Tugas
            </h2>
            <div className="bg-orange-50 p-6 rounded-3xl pl-11 ml-11 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-orange-900">Ingatkan Pembeli!</h4>
              </div>
              <p className="text-orange-800 leading-relaxed text-sm">
                Setelah barang Anda serahkan dan uang Anda terima, <strong>ingatkan pembeli untuk menekan tombol "Konfirmasi Pesanan Diterima"</strong> di HP mereka agar sistem mencatat tugas Anda selesai 100%. Jangan lupa setorkan uang tunainya (pembagian hasil) ke Admin PAWON di Balai Kalurahan!
              </p>
            </div>
          </section>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-500">
            Terima kasih telah menjadi penggerak ekonomi Desa!
          </p>
          <Link href="/kurir" className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95 text-center w-full md:w-auto flex items-center justify-center gap-2">
            <Map className="w-5 h-5" /> Buka Dasbor Kurir
          </Link>
        </div>
      </div>
    </div>
  )
}
