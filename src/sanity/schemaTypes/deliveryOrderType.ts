import { defineField, defineType } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export const deliveryOrderType = defineType({
  name: 'deliveryOrder',
  title: 'Pesanan Pengiriman',
  type: 'document',
  liveEdit: true,
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Nomor Order',
      type: 'string',
      readOnly: true,
    }),
    // === CUSTOMER INFO ===
    defineField({
      name: 'customerName',
      title: 'Nama Pemesan',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'WhatsApp Pemesan',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // === DELIVERY TYPE ===
    defineField({
      name: 'orderType',
      title: 'Jenis Pesanan',
      type: 'string',
      options: {
        list: [
          { title: '🍔 Pesan Antar Makanan/Minuman', value: 'food' },
          { title: '📦 Antar Paket / Barang', value: 'parcel' },
          { title: '🛒 Belanja Titip (Jastip)', value: 'jastip' },
        ],
        layout: 'radio',
      },
      initialValue: 'food',
    }),
    // === MERCHANT (for food orders) ===
    defineField({
      name: 'merchant',
      title: 'Merchant / Toko',
      type: 'reference',
      to: [{ type: 'merchant' }],
      hidden: ({ document }) => document?.orderType === 'parcel',
    }),
    defineField({
      name: 'merchantName',
      title: 'Nama Toko (jika tidak terdaftar)',
      type: 'string',
      description: 'Isi jika toko belum terdaftar di sistem.',
      hidden: ({ document }) => document?.orderType === 'parcel',
    }),
    // === ORDER ITEMS ===
    defineField({
      name: 'items',
      title: 'Detail Pesanan / Item',
      type: 'text',
      rows: 4,
      description: 'Tulis detail item yang dipesan atau paket yang dikirim.',
      validation: (rule) => rule.required(),
    }),
    // === ADDRESSES ===
    defineField({
      name: 'pickupAddress',
      title: 'Alamat Penjemputan / Pickup',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Alamat Pengiriman / Tujuan',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'deliveryArea',
      title: 'Kecamatan Tujuan',
      type: 'string',
      options: {
        list: [
          'Banjarnegara',
          'Purwonegoro',
          'Bawang',
          'Banjarmangu',
          'Mandiraja',
          'Purworejo Klampok',
          'Sigaluh',
          'Wanadadi',
          'Rakit',
          'Susukan',
          'Lainnya',
        ].map(v => ({ title: v, value: v.toLowerCase().replace(' ', '-') })),
      },
    }),
    defineField({
      name: 'customerNotes',
      title: 'Catatan dari Pemesan',
      type: 'text',
      rows: 2,
    }),
    // === PAYMENT ===
    defineField({
      name: 'totalAmount',
      title: 'Total Harga Barang (Rp)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'shippingFee',
      title: 'Ongkos Kirim (Rp)',
      type: 'number',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Metode Pembayaran',
      type: 'string',
      options: {
        list: [
          { title: 'Bayar di Tempat (COD)', value: 'cod' },
          { title: 'Transfer / QRIS', value: 'transfer' },
        ],
      },
      initialValue: 'cod',
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Status Pembayaran',
      type: 'string',
      options: {
        list: [
          { title: 'Belum Dibayar', value: 'unpaid' },
          { title: 'Sudah Dibayar', value: 'paid' },
        ],
      },
      initialValue: 'unpaid',
    }),
    // === STATUS & COURIER ===
    defineField({
      name: 'status',
      title: 'Status Pesanan',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Menunggu Konfirmasi', value: 'pending' },
          { title: '✅ Dikonfirmasi', value: 'accepted' },
          { title: '🛵 Kurir Berangkat Pickup', value: 'picking_up' },
          { title: '📦 Barang Dijemput', value: 'picked_up' },
          { title: '🚀 Dalam Pengiriman', value: 'delivering' },
          { title: '🏠 Telah Sampai', value: 'delivered' },
          { title: '✔️ Selesai', value: 'completed' },
          { title: '❌ Dibatalkan', value: 'cancelled' },
          { title: '⚠️ Ada Masalah', value: 'problem' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'courier',
      title: 'Kurir yang Bertugas',
      type: 'reference',
      to: [{ type: 'courier' }],
    }),
    defineField({
      name: 'courierNotes',
      title: 'Catatan untuk Kurir',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'estimatedTime',
      title: 'Estimasi Waktu Tiba',
      type: 'string',
      description: 'Misal: 30-45 menit',
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'customerName',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      const statusLabels: Record<string, string> = {
        pending: '⏳',
        accepted: '✅',
        picking_up: '🛵',
        picked_up: '📦',
        delivering: '🚀',
        delivered: '🏠',
        completed: '✔️',
        cancelled: '❌',
        problem: '⚠️',
      }
      return {
        title: `${statusLabels[status] || ''} ${title || 'Order Baru'}`,
        subtitle: subtitle,
      }
    },
  },
})
