import { sanityFetch } from "@/sanity/lib/live";
import { ACTIVE_COURIERS_QUERY, FOOD_MERCHANTS_QUERY, LATEST_ARTICLES_QUERY, APP_SETTINGS_QUERY, CATEGORIES_QUERY, PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Truck, Package, ShoppingBag, MapPin, Clock, Shield, Phone, Star, ChevronRight, Zap, Utensils, Check, MessageSquare, Bike, CheckCircle, Coins, Store, Megaphone, ArrowRight, Handshake, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export default async function Home() {
  const [
    { data: couriers },
    { data: merchants },
    { data: articles },
    { data: settings },
    { data: categories },
    { data: products },
  ] = await Promise.all([
    sanityFetch({ query: ACTIVE_COURIERS_QUERY }) as Promise<{ data: any[] }>,
    sanityFetch({ query: FOOD_MERCHANTS_QUERY }) as Promise<{ data: any[] }>,
    sanityFetch({ query: LATEST_ARTICLES_QUERY }) as Promise<{ data: any[] }>,
    sanityFetch({ query: APP_SETTINGS_QUERY }) as Promise<{ data: any }>,
    sanityFetch({ query: CATEGORIES_QUERY }) as Promise<{ data: any[] }>,
    sanityFetch({ query: PRODUCTS_QUERY }) as Promise<{ data: any[] }>,
  ]);

  const adminPhone = settings?.adminPhone || '6281234567890';
  const waLink = `https://wa.me/${adminPhone.replace(/\D/g, '')}`;

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-slate-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Hero Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-600/15 blur-[120px] rounded-full -ml-48 -mt-48 z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full -mr-32 -mb-32 z-0"></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-green-600/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Kurir Aktif Se-Banjarnegara
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
              Kirim Apa Saja,<br />
              <span className="text-green-500">Ke Mana Saja</span><br />
              <span className="text-slate-300 text-4xl md:text-5xl">di Banjarnegara</span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl font-medium">
              Anterbae hadir untuk memudahkan pengiriman makanan, paket, dan belanja titip di seluruh wilayah Kabupaten Banjarnegara. Cepat, aman, dan terjangkau.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-green-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-green-600/30"
              >
                <Truck className="w-5 h-5" />
                Pesan via WhatsApp
              </a>
              <Link
                href="/track"
                className="flex items-center gap-3 bg-white/10 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
              >
                <MapPin className="w-5 h-5" />
                Lacak Pesanan
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div>
                <div className="text-3xl font-black text-white">{couriers?.length || '10'}+</div>
                <div className="text-slate-400 text-sm font-bold">Mitra Kurir Aktif</div>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div>
                <div className="text-3xl font-black text-white">{merchants?.length || '50'}+</div>
                <div className="text-slate-400 text-sm font-bold">Merchant Terdaftar</div>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div>
                <div className="text-3xl font-black text-white">16+</div>
                <div className="text-slate-400 text-sm font-bold">Kecamatan Terlayani</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-500 text-xs font-bold animate-bounce">
          <div className="w-px h-8 bg-slate-600"></div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* ===== LAYANAN SECTION ===== */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3" />
            Layanan Unggulan
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Semua Kebutuhan Antar,<br />
            <span className="text-red-600">Kami Siap Melayani</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Dari makanan panas hingga paket penting — kurir Anterbae siap mengantarkan ke tujuan Anda di seluruh Kabupaten Banjarnegara.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Food Delivery */}
          <div className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-red-200 hover:shadow-2xl hover:shadow-red-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:bg-red-100 transition-colors"></div>
            <div className="relative">
              <Utensils className="w-12 h-12 text-slate-800 mb-4" />
              <h3 className="text-2xl font-black text-slate-900 mb-3">Pesan Antar Makanan</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                Pesan dari warung dan restoran favorit Anda. Kurir kami ambil dan antar langsung ke depan pintu.
              </p>
              <ul className="space-y-2 mb-8">
                {['Nasi, Mie, Bakso & lebih', 'Minuman & Es Teh', 'Snack & Kue', 'Antar panas-panas'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Check className="w-4 h-4 text-green-500 inline-block" /> {item}
                  </li>
                ))}
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 font-black text-sm group-hover:gap-3 transition-all"
              >
                Pesan Sekarang <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Parcel Delivery */}
          <div className="group relative bg-slate-900 text-white rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <Package className="w-12 h-12 text-slate-800 mb-4" />
              <div className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3 border border-red-600/30">
                <Star className="w-3 h-3 inline-block -mt-0.5 mr-1" /> Terpopuler
              </div>
              <h3 className="text-2xl font-black mb-3">Antar Paket & Barang</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-6">
                Kirim dokumen penting, barang belanja, atau apapun ke seluruh kecamatan di Banjarnegara.
              </p>
              <ul className="space-y-2 mb-8">
                {['Antar dalam kota', 'Antar antar-kecamatan', 'Dokumen penting', 'Barang elektronik'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Check className="w-4 h-4 text-green-400 inline-block" /> {item}
                  </li>
                ))}
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-400 font-black text-sm hover:gap-3 transition-all"
              >
                Pesan Sekarang <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Jastip */}
          <div className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-green-200 hover:shadow-2xl hover:shadow-green-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:bg-green-100 transition-colors"></div>
            <div className="relative">
              <ShoppingCart className="w-12 h-12 text-slate-800 mb-4" />
              <h3 className="text-2xl font-black text-slate-900 mb-3">Jastip (Titip Beli)</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                Titip beli ke pasar, minimarket, atau toko apapun. Kurir kami yang belanjakan dan antarkan.
              </p>
              <ul className="space-y-2 mb-8">
                {['Belanja ke pasar', 'Minimarket & apotek', 'Toko bangunan', 'Sembako & sayuran'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Check className="w-4 h-4 text-green-500 inline-block" /> {item}
                  </li>
                ))}
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-600 font-black text-sm group-hover:gap-3 transition-all"
              >
                Pesan Sekarang <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARA PESAN SECTION ===== */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Cara Pesan <span className="text-red-600">Mudah & Cepat</span>
            </h2>
            <p className="text-slate-500 font-medium">Hanya 3 langkah, kurir langsung berangkat!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: <MessageSquare className='w-8 h-8' />,
                title: 'Chat via WhatsApp',
                desc: 'Hubungi admin Anterbae via WhatsApp. Ceritakan apa yang ingin Anda kirim atau pesan.',
                color: 'red',
              },
              {
                step: '02',
                icon: <Bike className='w-8 h-8' />,
                title: 'Kurir Kami Berangkat',
                desc: 'Admin akan assign kurir terdekat. Kurir langsung pickup dan antar ke tujuan Anda.',
                color: 'green',
              },
              {
                step: '03',
                icon: <CheckCircle className='w-8 h-8' />,
                title: 'Terima & Bayar',
                desc: 'Terima pesanan Anda. Bayar COD atau transfer sesuai kesepakatan. Mudah!',
                color: 'blue',
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div key={step} className="relative text-center">
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-slate-200 -z-10"></div>

                <div className={`inline-flex w-20 h-20 rounded-3xl items-center justify-center text-3xl mb-6 shadow-lg ${
                  color === 'red' ? 'bg-red-600 shadow-red-200' :
                  color === 'green' ? 'bg-green-600 shadow-green-200' :
                  'bg-blue-600 shadow-blue-200'
                }`}>
                  {icon}
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Langkah {step}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/25 text-lg"
            >
              <Phone className="w-5 h-5" />
              Mulai Pesan Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* ===== KATEGORI & PRODUK (MARKETPLACE) ===== */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <ShoppingBag className="w-3 h-3" />
            Marketplace Lokal
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Jelajahi Produk Pilihan<br />
            <span className="text-green-600">Terbaik di Banjarnegara</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Pilih produk yang Anda inginkan, masukkan ke keranjang, dan pesan via WhatsApp. Kurir kami akan segera menjemput & mengantarnya.
          </p>
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 mb-12 hide-scrollbar">
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/categories`}
                className="flex flex-col items-center gap-3 min-w-[100px] group"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-transparent group-hover:border-green-500 transition-all group-hover:shadow-lg overflow-hidden relative">
                  {cat.image ? (
                    <Image src={urlFor(cat.image).width(80).height(80).url()} alt={cat.name} fill className="object-cover" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-green-600 text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
            <Link
              href="/products"
              className="flex flex-col items-center gap-3 min-w-[100px] group"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border-2 border-transparent group-hover:border-green-500 transition-all group-hover:shadow-lg">
                <ChevronRight className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-xs font-bold text-green-700 group-hover:text-green-800 text-center">
                Lihat Semua
              </span>
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.slice(0, 10).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-3xl">
            Belum ada produk yang ditambahkan.
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 font-bold px-8 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            Jelajahi Semua Produk <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== MERCHANT SECTION ===== */}
      {merchants && merchants.length > 0 && (
        <section className="py-24 container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-3">
                <Store className="w-4 h-4 inline-block mr-1" /> Merchant Terdaftar
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mitra Restoran & Warung</h2>
              <p className="text-slate-500 font-medium mt-1">Pesan dari merchant favorit Anda</p>
            </div>
            <Link href="/mitra" className="text-red-600 font-bold hover:underline underline-offset-8 decoration-2">
              Lihat Semua <ArrowRight className="w-4 h-4 inline-block ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {merchants.slice(0, 10).map((merchant: any) => (
              <div
                key={merchant._id}
                className="group bg-white rounded-2xl p-4 border border-slate-100 hover:border-red-200 hover:shadow-xl transition-all text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden bg-slate-100">
                  {merchant.logo ? (
                    <Image
                      src={urlFor(merchant.logo).width(80).height(80).url()}
                      alt={merchant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><Store className="w-6 h-6" /></div>
                  )}
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1 truncate">{merchant.name}</h3>
                <p className="text-xs text-slate-400 font-bold">{merchant.area}</p>
                <div className={`mt-2 inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${
                  merchant.isOpen
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {merchant.isOpen ? '● Buka' : '● Tutup'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== KEUNGGULAN ===== */}
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              Kenapa Pilih <span className="text-red-500">Anterbae</span>?
            </h2>
            <p className="text-slate-400 font-medium">Kami berkomitmen memberikan pelayanan terbaik</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className='w-10 h-10' />, title: 'Super Cepat', desc: 'Estimasi 30-60 menit untuk pengiriman dalam kota Banjarnegara', color: 'red' },
              { icon: <Shield className='w-10 h-10' />, title: 'Aman & Terpercaya', desc: 'Semua kurir telah terverifikasi identitas dan reputasinya', color: 'green' },
              { icon: <Coins className='w-10 h-10' />, title: 'Tarif Terjangkau', desc: 'Mulai Rp 5.000 untuk pengiriman dalam kota. Transparan, no hidden fee', color: 'yellow' },
              { icon: <MapPin className='w-10 h-10' />, title: 'Jangkauan Luas', desc: 'Melayani 16+ kecamatan di seluruh Kabupaten Banjarnegara', color: 'blue' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="bg-slate-800 rounded-3xl p-6 hover:bg-slate-700 transition-colors">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-black mb-2">{title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AREA LAYANAN ===== */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  <MapPin className="w-3 h-3" /> Area Jangkauan
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Melayani Seluruh<br />Kab. Banjarnegara
                </h2>
                <p className="text-red-100 font-medium leading-relaxed mb-8">
                  Dari Banjarnegara kota hingga kecamatan-kecamatan terpencil. Kurir kami siap menjangkau Anda di mana pun dalam Kabupaten Banjarnegara.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-red-600 font-black px-8 py-4 rounded-2xl hover:bg-red-50 transition-all shadow-xl active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  Cek Area Saya
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  'Banjarnegara', 'Purwonegoro', 'Bawang', 'Banjarmangu',
                  'Mandiraja', 'Purworejo Klampok', 'Sigaluh', 'Wanadadi',
                  'Rakit', 'Susukan', 'Punggelan', 'Wanayasa',
                  'Pagentan', 'Karangkobar', 'Pejawaran', 'Batur',
                ].map((area) => (
                  <div key={area} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 text-sm font-bold border border-white/20">
                    <span className="text-green-300">●</span> {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KURIR AKTIF SECTION ===== */}
      {couriers && couriers.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Tim Kurir <span className="text-red-600">Anterbae</span>
              </h2>
              <p className="text-slate-500 font-medium">Kurir terverifikasi, siap melayani Anda</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {couriers.slice(0, 8).map((courier: any) => (
                <div key={courier._id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {courier.photo ? (
                      <Image src={urlFor(courier.photo).width(40).height(40).url()} alt={courier.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><Bike className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900">{courier.name}</p>
                    <p className="text-xs text-slate-400 font-bold">{courier.area || 'Banjarnegara'}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== JOIN AS COURIER CTA ===== */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-red-900/50"></div>
          <div className="relative z-10 text-center md:text-left flex-grow">
            <Bike className="w-16 h-16 text-slate-800 mx-auto md:mx-0 mb-6" />
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-red-600/30">
              Bergabung Bersama Kami
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Jadi Mitra Kurir<br /><span className="text-red-500">Anterbae</span> Sekarang
            </h2>
            <p className="text-slate-400 text-lg mb-10 font-medium max-w-lg">
              Punya motor dan waktu luang? Bergabung sebagai kurir Anterbae. Penghasilan tambahan, kerja fleksibel, dan jadi bagian dari komunitas kurir Banjarnegara!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register-courier"
                className="inline-flex items-center gap-3 bg-red-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-red-700 transition-all shadow-xl active:scale-95"
              >
                Daftar Jadi Kurir <ArrowRight className="w-5 h-5 inline-block ml-1" />
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Phone className="w-4 h-4" /> Tanya via WA
              </a>
            </div>
          </div>
          <div className="relative z-10 hidden lg:flex flex-col gap-4 w-80">
            {[
              { icon: <Coins className='w-10 h-10' />, title: 'Penghasilan Menarik', desc: 'Komisi per pengiriman yang kompetitif' },
              { icon: <Clock className='w-6 h-6 text-blue-400' />, title: 'Jam Kerja Fleksibel', desc: 'Atur sendiri jadwal aktif Anda' },
              { icon: <Handshake className='w-6 h-6 text-green-400' />, title: 'Komunitas Solid', desc: 'Bergabung dengan tim kurir Anterbae' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{icon}</div>
                  <div>
                    <p className="font-black text-sm">{title}</p>
                    <p className="text-slate-400 text-xs font-medium">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ARTICLES/PROMO ===== */}
      {articles && articles.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Info & Promo Terbaru <Megaphone className="w-6 h-6 inline-block ml-2 text-slate-800" /></h2>
                <p className="text-slate-500 font-medium text-sm">Update layanan dan penawaran menarik</p>
              </div>
              <Link href="/info" className="text-red-600 font-bold hover:underline text-sm">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article._id} href={`/info/${article.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-red-200 hover:shadow-xl transition-all">
                  <div className="relative h-48 bg-slate-100">
                    {article.image && (
                      <Image
                        src={urlFor(article.image).width(400).height(250).url()}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">
                      {article.category}
                    </div>
                    <h3 className="font-black text-slate-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
