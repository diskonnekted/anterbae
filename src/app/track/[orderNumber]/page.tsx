import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { MapPin, Phone, User, Clock, PackageCheck, Briefcase } from "lucide-react";
import Link from "next/link";
import CompleteOrderButton from "@/components/CompleteOrderButton";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

const productStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: "Menunggu Konfirmasi Admin", color: "text-yellow-700", bg: "bg-yellow-50", icon: "🕒" },
  accepted: { label: "Order Diterima Kurir", color: "text-blue-700", bg: "bg-blue-50", icon: "👍" },
  processing: { label: "Sedang Disiapkan Penjual", color: "text-orange-700", bg: "bg-orange-50", icon: "🍳" },
  shipped: { label: "Barang Diambil Kurir", color: "text-indigo-700", bg: "bg-indigo-50", icon: "📦" },
  delivering: { label: "Kurir Menuju Alamat Anda", color: "text-purple-700", bg: "bg-purple-50", icon: "🚚" },
  completed: { label: "Pesanan Selesai", color: "text-green-700", bg: "bg-green-50", icon: "✅" },
  cancelled: { label: "Pesanan Dibatalkan", color: "text-red-700", bg: "bg-red-50", icon: "❌" },
  problem: { label: "Ada Kendala", color: "text-rose-700", bg: "bg-rose-50", icon: "⚠️" },
};

const serviceStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: "Menunggu Penjual", color: "text-yellow-700", bg: "bg-yellow-50", icon: "🕒" },
  accepted: { label: "Penjual Sanggup", color: "text-blue-700", bg: "bg-blue-50", icon: "👍" },
  delivering: { label: "Penjual Menuju Lokasi / Bekerja", color: "text-purple-700", bg: "bg-purple-50", icon: "🏃" },
  completed: { label: "Layanan Selesai", color: "text-green-700", bg: "bg-green-50", icon: "✅" },
  cancelled: { label: "Pesanan Dibatalkan", color: "text-red-700", bg: "bg-red-50", icon: "❌" },
  problem: { label: "Ada Kendala", color: "text-rose-700", bg: "bg-rose-50", icon: "⚠️" },
};

// Custom query because we need serviceItem
const ORDER_BY_NUMBER_WITH_SERVICE = `*[_type == "order" && orderNumber == $orderNumber][0]{
  ...,
  "items": items[]{
    quantity,
    price,
    "product": product->{name, "image": image.asset->url}
  },
  "serviceItem": serviceItem->{
    name,
    price,
    priceType
  },
  "courier": courier->{name, phone}
}`

export default async function OrderResultPage({ params }: Props) {
  const { orderNumber } = await params;
  const { data: order } = await sanityFetch({
    query: ORDER_BY_NUMBER_WITH_SERVICE,
    params: { orderNumber },
  }) as { data: any };

  if (!order) {
    notFound();
  }

  const isService = order.orderCategory === 'service'
  const config = isService ? serviceStatusConfig : productStatusConfig
  const currentStatus = config[order.status] || { label: order.status, color: "text-gray-700", bg: "bg-gray-50", icon: "•" }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/track" className="text-green-700 font-bold mb-6 inline-block hover:underline">
          &larr; Kembali ke Pelacakan
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Status Banner */}
          <div className={`p-10 ${currentStatus.bg} border-b text-center`}>
            <div className="text-5xl mb-4">{currentStatus.icon}</div>
            <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Status {isService ? 'Layanan' : 'Pesanan'} {order.orderNumber}</p>
            <h1 className={`text-3xl font-black ${currentStatus.color}`}>{currentStatus.label}</h1>
          </div>

          <div className="p-8">
            {/* Real-time Timeline (Simple) */}
            <div className="mb-12">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Riwayat {isService ? 'Layanan' : 'Perjalanan'}</h3>
              <div className="space-y-8">
                {Object.keys(config).filter(k => {
                  const orderStatuses = isService 
                    ? ['pending', 'accepted', 'delivering', 'completed']
                    : ['pending', 'accepted', 'processing', 'shipped', 'delivering', 'completed'];
                  const currentIndex = orderStatuses.indexOf(order.status);
                  const statusIndex = orderStatuses.indexOf(k);
                  return statusIndex !== -1 && statusIndex <= currentIndex;
                }).reverse().map((statusKey, idx) => (
                  <div key={statusKey} className="flex gap-4 items-start relative">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm flex-shrink-0 z-10 ${idx === 0 ? 'bg-green-600 shadow-green-200' : 'bg-slate-100'}`}>
                      {idx === 0 ? '✨' : config[statusKey].icon}
                    </div>
                    {idx < (isService ? 1 : 2) && <div className="absolute left-5 top-10 bottom-[-2rem] w-0.5 bg-slate-100"></div>}
                    <div>
                      <p className={`font-black ${idx === 0 ? 'text-slate-900 text-lg' : 'text-slate-400'}`}>
                        {config[statusKey].label}
                      </p>
                      {idx === 0 && <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Update Terbaru</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-slate-50 p-6 rounded-[2.5rem]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Informasi Pelanggan
                  </h3>
                  <p className="font-bold text-lg">{order.customerName}</p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4" /> {order.customerPhone}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Alamat {isService ? 'Layanan' : 'Pengiriman'}
                  </h3>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Waktu Pesanan
                  </h3>
                  <p className="text-gray-600">
                    {new Date(order._createdAt).toLocaleString('id-ID', {
                      dateStyle: 'long',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>

                {isService && order.serviceDate && (
                   <div>
                   <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <Clock className="w-4 h-4" /> Jadwal Kedatangan
                   </h3>
                   <p className="font-black text-slate-800 text-lg">
                     {new Date(order.serviceDate).toLocaleString('id-ID', {
                       dateStyle: 'full',
                       timeStyle: 'short'
                     })}
                   </p>
                 </div>
                )}

                {!isService && order.courier && (
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <PackageCheck className="w-4 h-4" /> Kurir yang Bertugas
                    </h3>
                    <p className="font-bold text-green-900">{order.courier.name}</p>
                    <a 
                      href={`https://wa.me/${order.courier.phone}`}
                      className="text-green-600 text-sm font-bold hover:underline block mt-1"
                    >
                      Hubungi Kurir (WA)
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Item Table */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Rincian {isService ? 'Layanan' : 'Barang'}</h3>
              
              {isService && order.serviceItem ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-4 last:border-0">
                    <div className="flex gap-4 items-center">
                      <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-purple-600">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{order.serviceItem.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{order.serviceItem.priceType === 'fixed' ? 'Harga Pas' : order.serviceItem.priceType === 'hourly' ? 'Per Jam' : 'Mulai Dari'}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div className="flex gap-4 items-center">
                        <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-gray-400">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">@ Rp {item.price?.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-8 border-t space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                  <span>Subtotal {isService ? 'Jasa' : 'Barang'}</span>
                  <span>Rp {(order.totalAmount - (order.shippingFee || 0)).toLocaleString('id-ID')}</span>
                </div>
                {!isService && order.shippingFee && (
                  <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                    <span>Ongkos Kirim</span>
                    <span>Rp {order.shippingFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xl font-bold text-gray-500">Total Tagihan (Estimasi)</span>
                <span className="text-3xl font-black text-green-700">
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              {isService && (
                <p className="text-xs text-slate-400 font-bold mt-2 text-right">
                  *Total tagihan sebenarnya dapat berubah sesuai kesepakatan akhir dengan penjual jasa.
                </p>
              )}

              {['accepted', 'processing', 'shipped', 'delivering'].includes(order.status) && (
                <CompleteOrderButton orderId={order._id} isService={isService} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
