import Link from 'next/link'
import { ArrowLeft, Store, Upload, Smartphone, Power, LayoutDashboard } from 'lucide-react'

export const metadata = {
  title: 'Buku Panduan Penjual | PAWON Pondokrejo'
}

export default function SellerManualPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="mb-12 border-b border-slate-100 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Panduan Penjual UMKM & Jasa</h1>
          <p className="text-lg text-slate-500 font-medium">Langkah praktis mengelola warung digital Anda di Pasar Warga Pondokrejo (PAWON).</p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
              Akses Portal UMKM (Lapak)
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <Smartphone className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Masuk ke Dasbor</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">Masuk ke halaman <strong>Portal UMKM / Lapak</strong> lewat menu navigasi atau halaman depan. Gunakan Nomor WhatsApp yang didaftarkan ke Kalurahan beserta PIN Keamanan (default: 123456) untuk masuk ke warung digital Anda.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
              Mengatur Etalase Barang & Jasa
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <Upload className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Mengunggah Jualan Anda</h4>
                  <p className="text-slate-600 leading-relaxed text-sm mb-3">Jika Anda mendaftar sebagai <strong>Penjual Produk</strong>, dasbor Anda akan memiliki tab <em>Kelola Produk</em>. Jika Anda <strong>Penjual Jasa</strong>, akan berubah otomatis menjadi <em>Kelola Jasa</em>.</p>
                  <p className="text-slate-600 leading-relaxed text-sm">Klik tombol <strong>"Tambah Baru"</strong>, isi nama dagangan/jasa, harga, dan unggah foto terbaik langsung dari galeri HP Anda. Jangan lupa centang kotak <em>"Tampilkan di halaman depan"</em> agar dagangan Anda bisa dilihat warga!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
              Menerima Pesanan & Memproses
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl">
                <h4 className="font-bold text-slate-900 mb-2">Bagaimana saya tahu jika ada pesanan masuk?</h4>
                <p className="text-slate-600 leading-relaxed text-sm mb-3">Sistem kami tersambung dengan Admin Desa (Sanity Studio). Saat ini, jika ada pesanan masuk, <strong>Admin PAWON atau pembeli akan langsung menghubungi WhatsApp Anda</strong>.</p>
                <ul className="list-disc ml-5 text-sm text-slate-600 space-y-2">
                  <li><strong>Penjual Produk:</strong> Siapkan pesanan sayur/barang Anda dan bungkus dengan rapi. Kurir kalurahan akan datang mengambil paketan tersebut ke rumah/toko Anda dan memberikannya ke pembeli.</li>
                  <li><strong>Penjual Jasa:</strong> Cek chat pesanan dari pembeli di WA Anda, negosiasikan harganya, lalu konfirmasikan <em>"Kesanggupan"</em>. Setelah deal, datanglah ke rumah pembeli sesuai jadwal!</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
              Status Buka/Tutup Lapak Sementara
            </h2>
            <div className="bg-blue-50 p-6 rounded-3xl pl-11 ml-11 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Power className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-900">Sedang Libur atau Habis Stok?</h4>
              </div>
              <p className="text-blue-800 leading-relaxed text-sm">
                Buka tab <strong>Profil Toko</strong> di Portal Anda. Ada tombol saklar (toggle) <em>"Status Operasional"</em>. Matikan saklar tersebut jika Anda sedang libur, dan isikan "Pesan Penutupan" (Misal: <em>Sedang kondangan, buka besok pagi!</em>). Ini akan menghalangi pembeli agar tidak bisa check-out barang Anda selama Anda libur.
              </p>
            </div>
          </section>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-500">
            Perlu ganti data rekening atau identitas usaha? Hubungi Admin Kalurahan.
          </p>
          <Link href="/lapak" className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95 text-center w-full md:w-auto flex items-center justify-center gap-2">
            <LayoutDashboard className="w-5 h-5" /> Buka Portal Saya
          </Link>
        </div>
      </div>
    </div>
  )
}
