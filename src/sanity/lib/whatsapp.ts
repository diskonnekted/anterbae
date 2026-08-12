import fs from 'fs'
import path from 'path'

export function formatOrderMessage(
  orderNumber: string,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: { name: string; quantity: number; price: number }[],
  totalPrice: number,
  shippingFee: number,
  grandTotal: number
): string {
  const itemLines = items
    .map((item, index) => `${index + 1}. *${item.name}*\n   Jumlah: ${item.quantity}\n   Harga: Rp${(item.price * item.quantity).toLocaleString('id-ID')}`)
    .join('\n\n')

  return `📦 *PESANAN BARU MASUK* 📦
----------------------------------
🆔 *No. Pesanan:* ${orderNumber}
👤 *Pemesan:* ${customerName}
📞 *No. WhatsApp:* ${customerPhone}
📍 *Alamat Kirim:* ${customerAddress}
----------------------------------

🛍️ *DAFTAR BELANJA:*
${itemLines}

----------------------------------
💰 *RINGKASAN PEMBAYARAN:*
Subtotal: Rp${totalPrice.toLocaleString('id-ID')}
Ongkir: Rp${shippingFee.toLocaleString('id-ID')}
*TOTAL BAYAR: Rp${grandTotal.toLocaleString('id-ID')}*

----------------------------------
📝 *Catatan:* Pembayaran dilakukan secara *COD (Bayar di Tempat)* saat barang diantar oleh kurir.

_Mohon segera diproses dan hubungi pemesan jika diperlukan. Terima kasih!_`
}

export function formatServiceOrderMessage(
  orderNumber: string,
  customerName: string,
  customerPhone: string,
  serviceAddress: string,
  serviceName: string,
  serviceDate: string,
  price: number
): string {
  const dateStr = new Date(serviceDate).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
  return `🛠️ *PEMESANAN JASA BARU* 🛠️
----------------------------------
🆔 *No. Pesanan:* ${orderNumber}
👤 *Pemesan:* ${customerName}
📞 *No. WhatsApp:* ${customerPhone}
📍 *Alamat Pelaksanaan:* ${serviceAddress}
🗓️ *Jadwal:* ${dateStr}
----------------------------------

💼 *JASA YANG DIPESAN:*
*${serviceName}*
Estimasi Harga: Rp${price.toLocaleString('id-ID')}

_Mohon segera konfirmasi kesanggupan dan hubungi pemesan!_`
}

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }
  if (cleaned.startsWith('620')) {
    cleaned = '62' + cleaned.slice(3)
  }
  return cleaned
}

function getLocalEnvToken(): string | null {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.match(/^FONNTE_API_TOKEN\s*=\s*(.*)$/m)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
  } catch (e) {
    console.error('Failed to read .env.local manually:', e)
  }
  return null
}

export async function sendWhatsAppNotification(target: string, message: string) {
  const localToken = getLocalEnvToken()
  const rawToken = localToken || process.env.FONNTE_API_TOKEN || 'bxWCvLcukyYH4ky6eDur'
  const token = rawToken.trim()

  console.log(`[Fonnte Debug] Token Length: ${token.length}, Starts with: ${token.substring(0, 5)}, Char codes: ${Array.from(token).map(c => c.charCodeAt(0)).join(',')}`)

  if (!token) {
    console.warn('FONNTE_API_TOKEN tidak ditemukan di environment variables.')
    return { success: false, error: 'API Token tidak dikonfigurasi.' }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const formattedTarget = formatPhone(target)
    console.log(`[Fonnte] Sending to ${target} -> ${formattedTarget}`)

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        target: formattedTarget,
        message: message,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const data = await response.json().catch(() => ({ status: response.ok }))
    console.log(`[Fonnte] Response (${target}):`, JSON.stringify(data))

    const success = data.status === 200 || data.status === true || response.ok
    return { success, data }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.error(`[Fonnte] Error (${target}):`, error)
    if (error.name === 'AbortError') {
      return { success: false, error: 'Request timeout saat menghubungi server Fonnte.' }
    }
    return { success: false, error: 'Gagal menghubungi server Fonnte.' }
  }
}
