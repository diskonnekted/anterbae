'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PetaMiniMerchantProps {
  latitude?: number
  longitude?: number
  merchantName?: string
  category?: string
  isOpen?: boolean
}

export default function PetaMiniMerchant({
  latitude,
  longitude,
  merchantName = 'Merchant',
  category,
  isOpen,
}: PetaMiniMerchantProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  const center = useMemo(() => {
    if (latitude != null && longitude != null) {
      return [latitude, longitude] as [number, number]
    }
    return [-7.3967, 109.6967] as [number, number]
  }, [latitude, longitude])

  const hasCoords = latitude != null && longitude != null

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
      .setView(center, hasCoords ? 15 : 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)

    if (hasCoords) {
      const color = category === 'food' ? '#dc2626' :
                    category === 'grocery' ? '#16a34a' :
                    category === 'health' ? '#2563eb' : '#7c3aef'

      const emoji = category === 'food' ? '🍔' :
                    category === 'grocery' ? '🛒' :
                    category === 'health' ? '💊' : '🏪'

      const markerHtml = `
        <div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: ${color}; border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        ">${emoji}</div>
      `

      L.marker(center, {
        icon: L.divIcon({ html: markerHtml, iconSize: [36, 36], iconAnchor: [18, 18], className: '' })
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:2px 4px">
            <strong style="font-size:13px">${merchantName}</strong><br/>
            <span style="font-size:11px; color:${isOpen ? '#16a34a' : '#dc2626'}; font-weight:bold">
              ${isOpen ? '● Buka' : '● Tutup'}
            </span>
          </div>
        `)
        .openPopup()
    }

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [center, merchantName, category, isOpen, hasCoords])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: '180px' }}>
      <div ref={mapRef} className="w-full h-full" />
      {!hasCoords && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-[999]">
          <span className="text-2xl mb-1">📍</span>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lokasi belum diatur</p>
          <p className="text-[9px] text-slate-300 mt-0.5">Edit profil di Sanity Studio</p>
        </div>
      )}
    </div>
  )
}
