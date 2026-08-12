/**
 * Utility untuk nomor WhatsApp Admin/CS
 * 
 * Priority:
 * 1. Sanity appSettings.adminPhone
 * 2. Environment variable NEXT_PUBLIC_WHATSAPP_ADMIN
 * 3. Hardcoded fallback
 */

// Default admin WhatsApp number
const DEFAULT_WHATSAPP_NUMBER = '6281328128315'

/**
 * Get WhatsApp admin number from environment or default
 * Use this for all WA links across the app
 */
export function getWhatsAppAdminNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_ADMIN || DEFAULT_WHATSAPP_NUMBER
}

/**
 * Build WhatsApp deep link URL
 * @param phone - Phone number (with country code, no +)
 * @param message - Optional pre-filled message
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${cleanPhone}${encodedMessage}`
}

/**
 * Get WhatsApp link for admin/CS
 * @param message - Optional pre-filled message
 */
export function getAdminWhatsAppLink(message?: string): string {
  return buildWhatsAppLink(getWhatsAppAdminNumber(), message)
}
