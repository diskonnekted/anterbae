'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface PetaInteraktifProps {
  width?: string
  height?: string
  onClick?: (kecamatan?: string, desa?: string) => void
}

export default function PetaInteraktif({
  width = '100%',
  height = '180px',
  onClick,
}: PetaInteraktifProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  const center = useMemo(() => [-7.4, 109.58] as [number, number], [])
  
  const kecamatanInfo = useMemo(() => ({
    'Banjarmangu': { center: [-7.4400, 109.5100] as [number, number], color: '#9333ea' },
    'Banjarnegara': { center: [-7.4097, 109.5250] as [number, number], color: '#dc2626' },
    'Bawang': { center: [-7.4200, 109.5600] as [number, number], color: '#16a34a' },
    'Madukara': { center: [-7.3800, 109.6100] as [number, number], color: '#ea580c' },
    'Purwanegara': { center: [-7.3950, 109.5400] as [number, number], color: '#2563eb' },
    'Sigaluh': { center: [-7.4600, 109.5500] as [number, number], color: '#be185d' },
    'Wanadadi': { center: [-7.3850, 109.6500] as [number, number], color: '#65a30d' },
    'Rakit': { center: [-7.4500, 109.6200] as [number, number], color: '#ca8a04' },
    'Susukan': { center: [-7.3600, 109.5300] as [number, number], color: '#7c3aef' },
    'Punggelan': { center: [-7.3500, 109.5700] as [number, number], color: '#0891b2' },
    'Batur': { center: [-7.4300, 109.4900] as [number, number], color: '#e11d48' },
    'Pagentan': { center: [-7.3700, 109.5000] as [number, number], color: '#7c3aef' },
    'Karangkobar': { center: [-7.4800, 109.5700] as [number, number], color: '#0d9488' },
    'Pandanarum': { center: [-7.3400, 109.5600] as [number, number], color: '#d97706' },
    'Pejawaran': { center: [-7.5000, 109.5800] as [number, number], color: '#4f46e5' },
    'Purwarejaklampok': { center: [-7.3600, 109.5500] as [number, number], color: '#059669' },
    'Kalibening': { center: [-7.4100, 109.5800] as [number, number], color: '#c026d3' },
    'Wanayasa': { center: [-7.3300, 109.5100] as [number, number], color: '#0d9488' },
  }), [])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView(center, 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM',
      maxZoom: 18,
    }).addTo(map)

    // Add simple colored circles for kecamatan
    Object.entries(kecamatanInfo).forEach(([name, data]) => {
      L.circleMarker(data.center, {
        radius: 6,
        color: data.color,
        fillColor: data.color,
        fillOpacity: 0.6,
        weight: 2,
      }).addTo(map).bindPopup(`<strong style="font-size:12px">${name}</strong>`)
    })

    mapInstanceRef.current = map

    // Click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      let nearestKec = ''
      let minDist = Infinity
      Object.entries(kecamatanInfo).forEach(([name, data]) => {
        const dist = Math.sqrt(Math.pow(lat - data.center[0], 2) + Math.pow(lng - data.center[1], 2))
        if (dist < minDist) {
          minDist = dist
          nearestKec = name
        }
      })
      onClick?.(nearestKec || undefined, undefined)
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [center, onClick, kecamatanInfo])

  return (
    <div
      ref={mapRef}
      style={{ width, height, borderRadius: '0.75rem', overflow: 'hidden' }}
      className="border border-slate-200"
    />
  )
}
