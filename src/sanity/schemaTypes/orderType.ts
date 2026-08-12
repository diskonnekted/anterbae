import { defineField, defineType } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export const orderType = defineType({
  name: 'order',
  title: 'Pesanan',
  type: 'document',
  liveEdit: true,
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerName',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'deliveryAddress',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Profil Warga (Pembeli)',
      type: 'reference',
      to: [{ type: 'customer' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orderCategory',
      title: 'Kategori Pesanan',
      type: 'string',
      options: {
        list: [
          { title: 'Produk Barang', value: 'product' },
          { title: 'Pemesanan Jasa', value: 'service' },
          { title: 'Makanan (Food Order)', value: 'food' },
        ],
      },
      initialValue: 'product',
    }),
    // ===== FIELDS KHUSUS FOOD ORDER =====
    defineField({
      name: 'restaurant',
      title: 'Restoran / Warung',
      type: 'reference',
      to: [{ type: 'merchant' }],
      hidden: ({ document }) => document?.orderCategory !== 'food',
    }),
    defineField({
      name: 'foodItems',
      title: 'Menu Makanan',
      type: 'array',
      hidden: ({ document }) => document?.orderCategory !== 'food',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'productId', type: 'reference', to: [{ type: 'product' }] }),
            defineField({ name: 'name', type: 'string', title: 'Nama Menu' }),
            defineField({ name: 'price', type: 'number', title: 'Harga' }),
            defineField({ name: 'quantity', type: 'number', title: 'Jumlah' }),
            defineField({ name: 'notes', type: 'string', title: 'Catatan (misal: tidak pedas)' }),
          ],
          preview: {
            select: { name: 'name', quantity: 'quantity', price: 'price' },
            prepare({ name, quantity, price }) {
              return {
                title: `${name} x${quantity}`,
                subtitle: `Rp ${price?.toLocaleString('id-ID')}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'paymentFlow',
      title: 'Alur Pembayaran',
      type: 'object',
      fields: [
        defineField({
          name: 'accountNumber',
          title: 'Nomor Rekening Admin',
          type: 'string',
          description: 'Rekening untuk pembayaran',
        }),
        defineField({
          name: 'accountName',
          title: 'Nama Pemilik Rekening',
          type: 'string',
        }),
        defineField({
          name: 'paymentStatus',
          title: 'Status Pembayaran',
          type: 'string',
          options: {
            list: [
              { title: 'Menunggu Pembayaran', value: 'waiting_payment' },
              { title: 'Sudah Bayar (Menunggu Konfirmasi)', value: 'paid_pending_confirm' },
              { title: 'Sudah Dikonfirmasi Admin', value: 'confirmed' },
            ],
          },
          initialValue: 'waiting_payment',
        }),
        defineField({
          name: 'proofImage',
          title: 'Bukti Transfer',
          type: 'image',
          hidden: true,
        }),
        defineField({
          name: 'confirmedAt',
          title: 'Waktu Konfirmasi',
          type: 'datetime',
          hidden: true,
        }),
      ],
      hidden: ({ document }) => document?.orderCategory !== 'food',
    }),
    defineField({
      name: 'foodOrderStatus',
      title: 'Status Food Order',
      type: 'string',
      options: {
        list: [
          { title: 'Menunggu Pembayaran', value: 'waiting_payment' },
          { title: 'Menunggu Konfirmasi Admin', value: 'waiting_admin_confirm' },
          { title: 'Dikonfirmasi - Menunggu Resto', value: 'confirmed_resto_prep' },
          { title: 'Resto Siap - Menunggu Kurir', value: 'resto_ready_waiting_courier' },
          { title: 'Kurir Mengambil', value: 'courier_picking' },
          { title: 'Dalam Pengiriman', value: 'delivering' },
          { title: 'Selesai', value: 'completed' },
          { title: 'Dibatalkan', value: 'cancelled' },
        ],
      },
      initialValue: 'waiting_payment',
      hidden: ({ document }) => document?.orderCategory !== 'food',
    }),
    defineField({
      name: 'serviceItem',
      title: 'Layanan Jasa yang Dipesan',
      type: 'reference',
      to: [{ type: 'service' }],
      hidden: ({ document }) => document?.orderCategory !== 'service',
    }),
    defineField({
      name: 'serviceDate',
      title: 'Jadwal Pelaksanaan Jasa',
      type: 'datetime',
      hidden: ({ document }) => document?.orderCategory !== 'service',
    }),
    defineField({
      name: 'items',
      type: 'array',
      hidden: ({ document }) => document?.orderCategory === 'service',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }] }),
            defineField({ name: 'quantity', type: 'number' }),
            defineField({ name: 'price', type: 'number', title: 'Harga saat dibeli' }),
          ],
          preview: {
            select: {
              productName: 'product.name',
              quantity: 'quantity',
              media: 'product.image',
            },
            prepare({ productName, quantity, media }) {
              return {
                title: `${productName || 'Produk Tidak Terdaftar'}`,
                subtitle: `Jumlah: ${quantity || 0}`,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Pembayaran',
      type: 'number',
    }),
    defineField({
      name: 'shippingFee',
      title: 'Ongkos Kirim',
      type: 'number',
      hidden: ({ document }) => document?.orderCategory === 'service',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Metode Pembayaran',
      type: 'string',
      options: {
        list: [
          { title: 'Bayar di Tempat (COD)', value: 'cod' },
          { title: 'QRIS', value: 'qris' },
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
      hidden: ({ document }) => document?.paymentMethod === 'cod',
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status Pesanan',
      options: {
        list: [
          { title: 'Menunggu Konfirmasi', value: 'pending' },
          { title: 'Sedang Diproses / Disanggupi', value: 'accepted' },
          { title: 'Diproses Penjual (Barang)', value: 'processing' },
          { title: 'Diserahkan ke Kurir (Barang)', value: 'shipped' },
          { title: 'Dalam Perjalanan / Proses Jasa', value: 'delivering' },
          { title: 'Telah Sampai (Menunggu Konfirmasi Pembeli)', value: 'delivered' },
          { title: 'Selesai', value: 'completed' },
          { title: 'Dibatalkan', value: 'cancelled' },
          { title: 'Ada Masalah', value: 'problem' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'courier',
      title: 'Kurir yang Bertugas',
      type: 'reference',
      to: [{ type: 'courier' }],
      hidden: ({ document }) => document?.orderCategory === 'service',
    }),
    defineField({
      name: 'courierNotes',
      title: 'Catatan Khusus untuk Kurir',
      type: 'text',
      rows: 3,
      description: 'Instruksi tambahan dari Admin (misal: Barang pecah belah, titipkan ke tetangga jika tidak ada orang, dll).',
      hidden: ({ document }) => document?.orderCategory === 'service',
    }),
    defineField({
      name: 'vendorId_for_query_only',
      title: 'Vendor ID (Query Purpose)',
      type: 'string',
      hidden: true,
    }),
  ],
})

