import { sendWhatsAppNotification } from '@/sanity/lib/whatsapp'

export async function sendOrderReceived(phone: string, orderNumber: string) {
  const message = `Halo ${orderNumber}!

Pesanan Antar Jemput Anda sudah diterima.
Sedang mencari driver terdekat...

Terima kasih! 🙏`

  return sendWhatsAppNotification(phone, message)
}

export async function sendDriverAssigned(phone: string, orderNumber: string, driverName: string, driverPhone: string) {
  const message = `Hai! Driver untuk pesanan ${orderNumber} sudah ditemukan.

👤 Driver: ${driverName}
📞 Telepon: ${driverPhone}
🚗 Status: Sedang menjemput

Silakan tunggu di lokasi jemput. Terima kasih!`

  return sendWhatsAppNotification(phone, message)
}

export async function sendDriverPickingUp(phone: string, orderNumber: string) {
  const message = `Pesanan ${orderNumber}

Driver sedang dalam perjalanan ke lokasi jemput Anda.
Estimasi tiba: 5-10 menit lagi.

Terima kasih! 🚗`

  return sendWhatsAppNotification(phone, message)
}

export async function sendDeliveryComplete(phone: string, orderNumber: string) {
  const message = `Pesanan ${orderNumber}

Pengantaran sudah selesai!
Semoga layanan kami memuaskan.

Klik link berikut untuk konfirmasi:
anterbae.vercel.app/c/${orderNumber}

Terima kasih telah menggunakan Anterbae! 🙏`

  return sendWhatsAppNotification(phone, message)
}
