import type { StructureResolver } from 'sanity/structure'
import {
  BasketIcon,
  UserIcon,
  RocketIcon,
  DocumentIcon,
  CogIcon,
  InfoOutlineIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Anterbae — Admin Dashboard')
    .items([

      // ======= PESANAN MASUK =======
      S.listItem()
        .title('📦 Pesanan Masuk')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Filter Pesanan')
            .items([
              S.listItem()
                .title('Semua Pesanan')
                .child(S.documentTypeList('deliveryOrder').title('Semua Pesanan')),
              S.divider(),
              S.listItem()
                .title('⏳ Menunggu Konfirmasi')
                .child(
                  S.documentList()
                    .title('Perlu Konfirmasi')
                    .filter('_type == "deliveryOrder" && status == "pending"')
                ),
              S.listItem()
                .title('✅ Dikonfirmasi')
                .child(
                  S.documentList()
                    .title('Sudah Dikonfirmasi')
                    .filter('_type == "deliveryOrder" && status == "accepted"')
                ),
              S.listItem()
                .title('🛵 Dalam Pengiriman')
                .child(
                  S.documentList()
                    .title('Sedang Diantar')
                    .filter('_type == "deliveryOrder" && (status == "picking_up" || status == "picked_up" || status == "delivering")')
                ),
              S.listItem()
                .title('✔️ Selesai Hari Ini')
                .child(
                  S.documentList()
                    .title('Pesanan Selesai')
                    .filter('_type == "deliveryOrder" && status == "completed"')
                ),
              S.listItem()
                .title('⚠️ Bermasalah')
                .child(
                  S.documentList()
                    .title('Pesanan Bermasalah')
                    .filter('_type == "deliveryOrder" && (status == "problem" || status == "cancelled")')
                ),
              S.divider(),
              // By type
              S.listItem()
                .title('🍔 Pesan Antar Makanan')
                .child(
                  S.documentList()
                    .title('Pesan Antar Makanan')
                    .filter('_type == "deliveryOrder" && orderType == "food"')
                ),
              S.listItem()
                .title('📦 Antar Paket')
                .child(
                  S.documentList()
                    .title('Antar Paket')
                    .filter('_type == "deliveryOrder" && orderType == "parcel"')
                ),
              S.listItem()
                .title('🛒 Jastip')
                .child(
                  S.documentList()
                    .title('Jastip')
                    .filter('_type == "deliveryOrder" && orderType == "jastip"')
                ),
            ])
        ),

      S.divider(),

      // ======= MITRA KURIR =======
      S.listItem()
        .title('🛵 Mitra Kurir')
        .icon(RocketIcon)
        .child(
          S.list()
            .title('Manajemen Kurir')
            .items([
              S.listItem()
                .title('Semua Kurir')
                .child(S.documentTypeList('courier').title('Tim Kurir Anterbae')),
              S.divider(),
              S.listItem()
                .title('Kurir Aktif')
                .child(
                  S.documentList()
                    .title('Kurir Aktif')
                    .filter('_type == "courier" && status == "active"')
                ),
              S.listItem()
                .title('🆕 Pendaftaran Kurir Baru')
                .child(S.documentTypeList('courierApplication').title('Pendaftaran Masuk')),
              S.listItem()
                .title('Perlu Review')
                .child(
                  S.documentList()
                    .title('Menunggu Verifikasi')
                    .filter('_type == "courierApplication" && applicationStatus == "pending"')
                ),
            ])
        ),

      S.divider(),

      // ======= MERCHANT =======
      S.listItem()
        .title('🏪 Mitra Merchant')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Manajemen Merchant')
            .items([
              S.listItem()
                .title('Semua Merchant')
                .child(S.documentTypeList('merchant').title('Merchant Anterbae')),
              S.divider(),
              S.listItem()
                .title('🍔 Makanan & Minuman')
                .child(
                  S.documentList()
                    .title('F&B')
                    .filter('_type == "merchant" && category == "food"')
                ),
              S.listItem()
                .title('🛒 Grocery/Sembako')
                .child(
                  S.documentList()
                    .title('Grocery')
                    .filter('_type == "merchant" && category == "grocery"')
                ),
              S.listItem()
                .title('Perlu Verifikasi')
                .child(
                  S.documentList()
                    .title('Menunggu Verifikasi')
                    .filter('_type == "merchant" && isVerified == false')
                ),
              S.divider(),
              S.listItem()
                .title('📦 Semua Produk')
                .child(S.documentTypeList('product').title('Produk Merchant')),
              S.listItem()
                .title('🏷️ Kategori Produk')
                .child(S.documentTypeList('category').title('Kategori')),
            ])
        ),

      S.divider(),

      // ======= PELANGGAN =======
      S.listItem()
        .title('👤 Data Pelanggan')
        .icon(UserIcon)
        .child(S.documentTypeList('customer').title('Pelanggan Anterbae')),

      S.divider(),

      // ======= KONTEN =======
      S.listItem()
        .title('📢 Info & Promosi')
        .icon(InfoOutlineIcon)
        .child(S.documentTypeList('article').title('Info & Promosi')),

      S.listItem()
        .title('🖼️ Banner Promosi')
        .child(S.documentTypeList('banner').title('Banner')),

      S.divider(),

      // ======= SETTINGS =======
      S.listItem()
        .title('⚙️ Pengaturan Aplikasi')
        .icon(CogIcon)
        .child(S.documentTypeList('appSettings').title('Pengaturan')),
    ])
