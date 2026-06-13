import { sanityFetch } from "@/sanity/lib/live";
import { MERCHANT_BY_SLUG_QUERY, PRODUCTS_BY_MERCHANT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Info, ShoppingBag, Store } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MerchantPage({ params }: Props) {
  const { slug } = await params;
  
  const [
    { data: merchant },
    { data: products }
  ] = await Promise.all([
    sanityFetch({ query: MERCHANT_BY_SLUG_QUERY, params: { slug } }) as Promise<{ data: any }>,
    sanityFetch({ query: PRODUCTS_BY_MERCHANT_QUERY, params: { merchantId: '' } }) // We'll re-fetch with merchant._id below
  ]);

  if (!merchant) {
    notFound();
  }

  // Fetch actual products using merchant._id
  const { data: merchantProducts } = await sanityFetch({ 
    query: PRODUCTS_BY_MERCHANT_QUERY, 
    params: { merchantId: merchant._id } 
  }) as { data: any[] };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/mitra" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-red-600 transition-colors group">
        <div className="p-2 rounded-lg bg-white border border-slate-100 group-hover:border-red-100 group-hover:bg-red-50 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
        </div>
        Kembali ke Daftar Mitra
      </Link>

      {/* Header Store */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 mb-12 relative overflow-hidden">
        {/* Cover Background */}
        <div className="relative h-48 md:h-72 w-full bg-slate-100">
          {merchant.coverImage ? (
            <Image
              src={urlFor(merchant.coverImage).width(1200).height(600).url()}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-100" />
          )}
        </div>
        
        <div className="relative z-10 px-8 pb-8 md:px-12 md:pb-12 pt-0 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          {/* Logo overlapping banner */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white shadow-xl border-4 border-white flex-shrink-0 -mt-16 md:-mt-20">
            {merchant.logo ? (
              <Image
                src={urlFor(merchant.logo).width(300).height(300).url()}
                alt={merchant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-slate-100 to-slate-200">
                <Store className="w-12 h-12 text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex-grow pt-4 md:pt-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${merchant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {merchant.isOpen ? '● BUKA SEKARANG' : '● TUTUP'}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                {merchant.area}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              {merchant.name}
            </h1>
            <p className="text-slate-500 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {merchant.address}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={`https://wa.me/${merchant.phone || '6281234567890'}?text=Halo ${merchant.name}, saya ingin pesan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-black px-5 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95 text-sm"
              >
                <Phone className="w-4 h-4" /> Hubungi Merchant
              </a>
              {merchant.openHours && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                  <Info className="w-4 h-4" />
                  Jam Operasional: {merchant.openHours}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-red-600" />
          Katalog Produk
          <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {merchantProducts.length} item
          </span>
        </h2>

        {merchantProducts && merchantProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {merchantProducts.map((product) => {
              // Ensure merchant object is passed to ProductCard even if query doesn't expand it fully
              const p = { ...product, merchant: { name: merchant.name, isVerified: true } };
              return <ProductCard key={p._id} product={p} />;
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-400 font-bold text-xl mb-2">Belum ada produk</p>
            <p className="text-slate-400 text-sm">Merchant ini belum menambahkan produk ke dalam katalog.</p>
          </div>
        )}
      </div>
    </div>
  );
}
