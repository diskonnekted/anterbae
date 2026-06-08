import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Truck, CheckCircle2, UserCheck, Briefcase } from 'lucide-react'

export const metadata = {
  title: 'Buku Panduan Pembeli | PAWON Pondokrejo'
}

export default function BuyerManualPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="mb-12 border-b border-slate-100 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-3xl mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Panduan Pembeli</h1>
          <p className="text-lg text-slate-500 font-medium">Langkah mudah berbelanja barang dan memesan jasa di Pasar Warga Pondokrejo (PAWON).</p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
              Belanja Produk (Sayur, Lauk, dll)
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl">
                <h4 className="font-bold text-slate-900 mb-2">A. Memilih Produk</h4>
                <p className="text-slate-600 leading-relaxed text-sm">Masuk ke menu Produk atau kategori yang Anda cari. Klik tombol <strong>"Tambah ke Keranjang"</strong> pada barang yang ingin Anda beli. Anda bisa mencampur barang dari beberapa toko yang berbeda sekaligus.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl">
                <h4 className="font-bold text-slate-900 mb-2">B. Checkout & Mengisi Alamat</h4>
                <p className="text-slate-600 leading-relaxed text-sm">Tekan ikon troli (keranjang belanja) di pojok kanan atas layar Anda, lalu klik <strong>Checkout</strong>. Isikan nama, nomor WhatsApp aktif, dan alamat lengkap rumah Anda agar kurir mudah menemukan lokasinya.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl">
                <h4 className="font-bold text-slate-900 mb-2">C. Tunggu Kurir Datang (COD)</h4>
                <p className="text-slate-600 leading-relaxed text-sm">Pilih pembayaran "Bayar di Tempat (COD)". Kurir desa akan mengambil barang dari para penjual dan mengantarkannya langsung ke depan pintu Anda. Anda bayar ketika barang tiba!</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
              Memesan Layanan Jasa (Servis, Instalasi)
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-purple-900">Pesanan Jasa Bersifat Langsung!</h4>
                </div>
                <p className="text-purple-800 leading-relaxed text-sm">Layanan jasa <strong>tidak masuk ke keranjang belanja</strong>. Saat Anda menemukan jasa yang cocok di halaman Layanan Jasa, klik detailnya, lalu isi <strong>Form Pemesanan Langsung</strong> (menentukan tanggal, jam, dan alamat). Penjual jasa akan segera menghubungi WhatsApp Anda untuk konfirmasi kesanggupan dan harga pastinya.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
              Melacak Pesanan & Riwayat Transaksi
            </h2>
            <div className="grid gap-4 pl-11">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <Truck className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Melacak Tanpa Login (Lacak Cepat)</h4>
                  <p className="text-slate-600 leading-relaxed text-sm mb-3">Saat Anda selesai memesan, catat <strong>ID Pesanan</strong> Anda (Contoh: ORD-123...). Masuk ke halaman <strong>Lacak Pesanan</strong> dan masukkan kode tersebut untuk melihat kurir Anda sudah sampai mana.</p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl flex items-start gap-4">
                <UserCheck className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Dasbor Riwayat Pembeli (Login)</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">Anda juga bisa <strong>Login ke Dasbor Pembeli</strong> menggunakan Nomor WhatsApp dan PIN keamanan Anda. Di sana, semua riwayat pesanan (barang & jasa) masa lalu dan saat ini akan tersimpan rapi.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
              Menyelesaikan Pesanan
            </h2>
            <div className="bg-green-50 p-6 rounded-3xl pl-11 ml-11 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-900">Tombol "Konfirmasi Selesai"</h4>
              </div>
              <p className="text-green-800 leading-relaxed text-sm">
                Jika barang sudah Anda terima dari kurir, atau jika penjual jasa sudah merampungkan pekerjaannya di rumah Anda, mohon bantuannya untuk menekan tombol <strong>"Konfirmasi Pesanan Diterima" / "Layanan Selesai"</strong> pada halaman rincian pelacakan pesanan Anda. Ini membantu sistem kalurahan mencatat bahwa transaksi telah tuntas!
              </p>
            </div>
          </section>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-500">
            Masih kebingungan? Hubungi Admin Kalurahan untuk bantuan.
          </p>
          <Link href="/track" className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95 text-center w-full md:w-auto">
            Mulai Lacak Pesanan
          </Link>
        </div>
      </div>
    </div>
  )
}
