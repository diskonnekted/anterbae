import { defineField, defineType } from 'sanity'

export const activityLogType = defineType({
  name: 'activityLog',
  title: 'Log Aktivitas',
  type: 'document',
  fields: [
    defineField({
      name: 'timestamp',
      title: 'Waktu',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Pesanan',
      type: 'reference',
      to: [{ type: 'order' }, { type: 'deliveryOrder' }],
    }),
    defineField({
      name: 'courier',
      title: 'Kurir',
      type: 'reference',
      to: [{ type: 'courier' }],
    }),
    defineField({
      name: 'merchant',
      title: 'Merchant',
      type: 'reference',
      to: [{ type: 'merchant' }],
    }),
    defineField({
      name: 'actor',
      title: 'Pelaku',
      type: 'string',
      options: {
        list: [
          { title: 'Sistem (Auto)', value: 'system' },
          { title: 'Administrator', value: 'admin' },
          { title: 'Pelanggan / Warga', value: 'customer' },
          { title: 'Mitra Kurir', value: 'courier' },
          { title: 'Mitra Merchant', value: 'merchant' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'action',
      title: 'Aktivitas',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Catatan Rincian',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      action: 'action',
      actor: 'actor',
      timestamp: 'timestamp',
    },
    prepare({ action, actor, timestamp }) {
      return {
        title: `${action || 'Aktivitas'} oleh ${actor || 'Aktor'}`,
        subtitle: timestamp ? new Date(timestamp).toLocaleString('id-ID') : '',
      }
    },
  },
})
