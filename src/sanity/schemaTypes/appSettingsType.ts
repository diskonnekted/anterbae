import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const appSettingsType = defineType({
  name: 'appSettings',
  title: 'Pengaturan Aplikasi',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nama Aplikasi',
      type: 'string',
      initialValue: 'Anterbae',
    }),
    defineField({
      name: 'adminPhone',
      title: 'WhatsApp Admin/CS',
      type: 'string',
      description: 'Nomor WA untuk menerima notifikasi dan CS pelanggan.',
    }),
    defineField({
      name: 'baseDeliveryFee',
      title: 'Ongkos Kirim Dasar (Rp)',
      type: 'number',
      initialValue: 5000,
    }),
    defineField({
      name: 'feePerKm',
      title: 'Tarif per KM (Rp)',
      type: 'number',
      initialValue: 2000,
    }),
    defineField({
      name: 'operationalHours',
      title: 'Jam Operasional',
      type: 'string',
      initialValue: '07.00 - 22.00 WIB',
    }),
    defineField({
      name: 'serviceArea',
      title: 'Area Layanan',
      type: 'string',
      initialValue: 'Kabupaten Banjarnegara',
    }),
    defineField({
      name: 'isMaintenance',
      title: 'Mode Maintenance',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'maintenanceMessage',
      title: 'Pesan Maintenance',
      type: 'text',
      hidden: ({ document }) => !document?.isMaintenance,
    }),
    defineField({
      name: 'qrisImage',
      title: 'Foto QRIS Pembayaran',
      type: 'image',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram (@username)',
      type: 'string',
    }),
    defineField({
      name: 'waGroupLink',
      title: 'Link Grup WhatsApp',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
    },
  },
})
