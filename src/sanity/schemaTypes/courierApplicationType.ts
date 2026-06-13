import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

// Untuk pendaftaran mitra kurir baru
export const courierApplicationType = defineType({
  name: 'courierApplication',
  title: 'Pendaftaran Kurir',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Lengkap',
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
      name: 'address',
      title: 'Alamat Domisili',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'area',
      title: 'Area yang Diminati',
      type: 'string',
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
      },
    }),
    defineField({
      name: 'vehiclePlate',
      title: 'Nomor Plat',
      type: 'string',
    }),
    defineField({
      name: 'ktpNumber',
      title: 'Nomor KTP',
      type: 'string',
    }),
    defineField({
      name: 'motivation',
      title: 'Motivasi / Keterangan',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'applicationStatus',
      title: 'Status Pendaftaran',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Menunggu Review', value: 'pending' },
          { title: '✅ Diterima', value: 'approved' },
          { title: '❌ Ditolak', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Catatan Admin',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'applicationStatus',
    },
    prepare({ title, subtitle }) {
      const labels: Record<string, string> = {
        pending: '⏳ Menunggu',
        approved: '✅ Diterima',
        rejected: '❌ Ditolak',
      }
      return { title, subtitle: labels[subtitle] || subtitle }
    },
  },
})
