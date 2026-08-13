import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const merchantType = defineType({
  name: 'merchant',
  title: 'Mitra Merchant',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Toko/Warung',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'merchantCode',
      title: 'Kode Merchant',
      type: 'string',
      description: 'Kode unik untuk login dashboard (misal: BEE01, CON01). Hanya 4-6 karakter.',
      validation: (rule) => rule.required().min(4).max(6),
    }),
    defineField({
      name: 'ownerName',
      title: 'Nama Pemilik Toko',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Makanan & Minuman', value: 'food' },
          { title: 'Groceries / Sembako', value: 'grocery' },
          { title: 'Apotek / Kesehatan', value: 'health' },
          { title: 'Lainnya', value: 'other' },
        ],
      },
      initialValue: 'food',
    }),
    defineField({
      name: 'logo',
      title: 'Logo Toko',
      type: 'image',
    }),
    defineField({
      name: 'coverImage',
      title: 'Foto Toko',
      type: 'image',
    }),
    defineField({
      name: 'phone',
      title: 'Nomor WhatsApp Toko',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Alamat Toko',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'area',
      title: 'Kecamatan',
      type: 'string',
      description: 'Misal: Banjarnegara, Purwonegoro, Banjarmangu, dll.',
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isOpen',
      title: 'Sedang Buka?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'closingMessage',
      title: 'Pesan Tutup',
      type: 'string',
      hidden: ({ document }) => !!document?.isOpen,
    }),
    defineField({
      name: 'openHours',
      title: 'Jam Operasional',
      type: 'string',
      description: 'Misal: 08.00 - 21.00 WIB',
    }),
    defineField({
      name: 'isVerified',
      title: 'Terverifikasi',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'minOrder',
      title: 'Minimum Pesanan (Rp)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
    }),
    defineField({
      name: 'dashboardPin',
      title: 'PIN Dashboard',
      type: 'string',
      description: 'PIN 4 digit untuk akses dashboard merchant. Kosongkan jika tidak pakai PIN.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'area',
      media: 'logo',
    },
  },
})
