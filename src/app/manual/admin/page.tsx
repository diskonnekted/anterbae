import Link from 'next/link'
import { ArrowLeft, UserCog, Settings, ShieldCheck, Database, LayoutDashboard } from 'lucide-react'

export const metadata = {
  title: 'Buku Panduan Admin | PAWON Pondokrejo'
}

export default function AdminManualPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/admin" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dasbor Admin
      </Link>

      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-800 text-white">
        <div className="mb-12 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 text-white rounded-3xl mb-6">
            <UserCog className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">Panduan Admin Kalurahan</h1>
          <p className="text-lg text-slate-400 font-medium">Buku saku pengoperasian sistem backend PAWON melalui Sanity Studio.</p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">1</span>
              Akses Sanity Studio
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-800/50 p-6 rounded-3xl flex items-start gap-4">
                <Database className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Mengelola Database Secara Visual</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">Seluruh data (Penjual, Kurir, Pesanan, Produk) tersimpan di <strong>Sanity Studio</strong>. Anda dapat mengaksesnya melalui tombol <em>"Buka Sanity Studio"</em> di dasbor Admin. Di sana, Anda akan melihat tampilan visual seperti Microsoft Excel yang jauh lebih canggih untuk mengedit dan menambah data secara manual.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">2</span>
              Verifikasi Pendaftaran Baru (Kurir & UMKM)
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-800/50 p-6 rounded-3xl flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Memeriksa Data Pendaftar</h4>
                  <p className="text-slate-400 leading-relaxed text-sm mb-3">Ketika ada warga yang mendaftar menjadi Kurir atau Penjual melalui formulir website, data mereka akan masuk ke Sanity Studio dalam keadaan <strong>Belum Diverifikasi</strong>.</p>
                  <p className="text-slate-400 leading-relaxed text-sm">Tugas Anda: Buka data tersebut di Sanity, cek kesesuaiannya, lalu geser tombol/centang <em>"Is Verified"</em> agar akun mereka aktif dan bisa digunakan untuk login. Jangan lupa klik tombol hijau <strong>Publish</strong> di Sanity!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">3</span>
              Manajemen Pesanan & Penugasan Kurir
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-800/50 p-6 rounded-3xl">
                <h4 className="font-bold text-white mb-2">Alur Memproses Orderan Masuk</h4>
                <p className="text-slate-400 leading-relaxed text-sm mb-4">Setiap ada pesanan baru dari pembeli, statusnya adalah <em>"Menunggu Konfirmasi Admin" (Pending)</em>. Berikut cara memprosesnya:</p>
                <ul className="list-decimal ml-5 text-sm text-slate-400 space-y-3">
                  <li>Buka dokumen pesanan tersebut di Sanity Studio.</li>
                  <li><strong>Jika Pesanan Jasa:</strong> Ubah status menjadi <em>"Diterima / Sanggup"</em> (bisa diserahkan pada penjual jasa yang bersangkutan). Tidak perlu kurir.</li>
                  <li><strong>Jika Pesanan Produk:</strong> Hubungi penjual untuk menyiapkan pesanan.</li>
                  <li>Pilih salah satu kurir dari kolom <em>"Kurir yang Bertugas" (Reference)</em>.</li>
                  <li>Ubah Status Pesanan menjadi <strong>"Order Diterima Kurir" (Accepted)</strong>.</li>
                  <li>Klik <strong>Publish</strong>. Kurir yang ditugaskan kini akan melihat tugas ini di HP mereka!</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">4</span>
              Pengaturan Teknis (Advanced)
            </h2>
            <div className="bg-green-900/30 p-6 rounded-3xl pl-11 ml-11 border border-green-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-green-500" />
                <h4 className="font-bold text-green-400">Peringatan Penting</h4>
              </div>
              <p className="text-green-100/70 leading-relaxed text-sm">
                Sanity Studio sangat kuat (<em>powerful</em>). Setiap perubahan pada dokumen bersifat final jika sudah menekan <strong>Publish</strong>. Berhati-hatilah saat menghapus (<em>Delete</em>) dokumen pesanan atau UMKM karena tidak dapat dikembalikan. Pastikan Anda hanya mengubah field yang diperlukan.
              </p>
            </div>
          </section>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-500">
            PAWON Admin Core System v1.0
          </p>
          <Link href="/admin" className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-colors shadow-lg active:scale-95 text-center w-full md:w-auto flex items-center justify-center gap-2">
            <LayoutDashboard className="w-5 h-5" /> Kembali ke Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
