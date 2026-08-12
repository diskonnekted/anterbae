import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const customerType = defineType({
  name: 'customer',
  title: 'Data Pelanggan',
  type: 'document',
  icon: UserIcon,
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
      title: 'Alamat Lengkap',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pin',
      title: 'PIN Login',
      type: 'string',
      initialValue: '123456',
      description: 'PIN default adalah 123456. Warga bisa mengubahnya sendiri.',
    }),
    defineField({
      name: 'isVerified',
      title: 'Sudah Diverifikasi Kalurahan?',
      type: 'boolean',
      initialValue: false,
      description: 'Centang jika pelanggan ini sudah terverifikasi.',
    }),
    defineField({
      name: 'successfulOrders',
      title: 'Total COD Berhasil',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'failedOrders',
      title: 'Total COD Gagal (Fiktif)',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'totalOrders',
      title: 'Total Semua Pesanan',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'buyerLevel',
      title: 'Level Pembeli',
      type: 'string',
      options: {
        list: [
          { title: '🥉 Pembeli Biasa (Level 1)', value: 'regular' },
          { title: '🥈 Pembeli Rutin VIP (Level 2)', value: 'vip' },
          { title: '🥇 Pembelian Setia VVIP (Level 3)', value: 'vvip' },
        ],
      },
      initialValue: 'regular',
      readOnly: true,
    }),
    defineField({
      name: 'buyerLevelBadge',
      title: 'Badge Level',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'levelUpDate',
      title: 'Tanggal Naik Level',
      type: 'datetime',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'totalSpent',
      title: 'Total Belanja Semua Waktu',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'phone',
      success: 'successfulOrders',
      failed: 'failedOrders',
      level: 'buyerLevel',
      total: 'totalOrders',
    },
    prepare({ title, subtitle, success, failed, level, total }) {
      const levelEmoji = level === 'vvip' ? '🥇' : level === 'vip' ? '🥈' : '🥉'
      return {
        title,
        subtitle: `${levelEmoji} ${level?.toUpperCase() || 'REGULAR'} | WA: ${subtitle} | ✅ ${success || 0} | 📦 ${total || 0}`,
      }
    },
  },
})
