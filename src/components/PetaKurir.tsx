'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon asset paths
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

type MapCourier = {
  _id: string
  name: string
  phone: string
  vehicleType: 'motor' | 'mobil'
  latitude?: number
  longitude?: number
  lastLocationUpdate?: string
}

export default function PetaKurir({ couriers }: { couriers: MapCourier[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  // Filter couriers that have valid coordinates
  const activeCouriers = couriers.filter(c => c.latitude && c.longitude)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map centering Banjarnegara Kota
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([-7.4, 109.58], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)
      mapInstanceRef.current = map
    }

    const map = mapInstanceRef.current

    // Sync courier markers
    activeCouriers.forEach((courier) => {
      const pos: [number, number] = [courier.latitude!, courier.longitude!]
      const timeStr = courier.lastLocationUpdate 
        ? new Date(courier.lastLocationUpdate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : '-'

      if (markersRef.current[courier._id]) {
        // Update position if marker exists
        markersRef.current[courier._id].setLatLng(pos)
      } else {
        // Create custom motorbike icon element
        const customIcon = L.divIcon({
          html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); text-align: center;">🛵</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: 'live-courier-icon'
        })

        const marker = L.marker(pos, { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
              <strong style="font-size: 14px;">🛵 ${courier.name}</strong><br/>
              <span style="color: #64748b;">Phone: ${courier.phone}</span><br/>
              <span style="color: #ef4444; font-weight: bold;">Update: ${timeStr} WIB</span>
            </div>
          `)

        markersRef.current[courier._id] = marker
      }
    })

    // Clean up markers for couriers who are no longer active/mapped
    Object.keys(markersRef.current).forEach((id) => {
      if (!activeCouriers.some(c => c._id === id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

  }, [activeCouriers])

  return (
    <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapRef} className="w-full h-full z-10" />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 z-20 text-[10px] font-black uppercase text-slate-700 tracking-wider shadow-sm">
        🟢 Live Map Kurir ({activeCouriers.length} Terdeteksi)
      </div>
    </div>
  )
}
