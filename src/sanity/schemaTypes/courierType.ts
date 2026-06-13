import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export const courierType = defineType({
  name: 'courier',
  title: 'Mitra Kurir Anterbae',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Kurir',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Nomor WhatsApp',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pin',
      title: 'PIN Akses Portal',
      type: 'string',
      description: 'PIN rahasia (4-6 digit) untuk login ke portal kurir.',
      validation: (rule) => rule.min(4).max(6),
    }),
    defineField({
      name: 'photo',
      title: 'Foto Kurir',
      type: 'image',
    }),
    defineField({
      name: 'vehicleType',
      title: 'Jenis Kendaraan',
      type: 'string',
      options: {
        list: [
          { title: 'Motor', value: 'motor' },
          { title: 'Mobil', value: 'mobil' },
        ],
        layout: 'radio',
      },
      initialValue: 'motor',
    }),
    defineField({
      name: 'vehiclePlate',
      title: 'Nomor Plat Kendaraan',
      type: 'string',
    }),
    defineField({
      name: 'area',
      title: 'Area Jangkauan',
      type: 'string',
      description: 'Misal: Banjarnegara Kota, Purwonegoro, Sigaluh, dll.',
    }),
    defineField({
      name: 'isActive',
      title: 'Kurir Aktif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'statusMessage',
      title: 'Pesan Status (jika tidak aktif)',
      type: 'string',
      hidden: ({ document }) => !!document?.isActive,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Aktif', value: 'active' },
          { title: 'Tidak Aktif', value: 'inactive' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'joinedAt',
      title: 'Tanggal Bergabung',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'area',
      media: 'photo',
    },
  },
})
