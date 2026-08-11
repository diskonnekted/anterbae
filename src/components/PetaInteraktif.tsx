'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PetaInteraktifProps {
  width?: string
  height?: string
  showKecamatan?: boolean
  showDesa?: boolean
  onClick?: (kecamatan?: string, desa?: string) => void
}

export default function PetaInteraktif({
  width = '100%',
  height = '400px',
  showKecamatan = true,
  showDesa = false,
  onClick,
}: PetaInteraktifProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  // Banjarnegara center coordinates
  const center = useMemo(() => [-7.4, 109.58] as [number, number], [])
  const kecamatanBoundaries = useMemo(() => ({
    'Banjarnegara': { center: [-7.4097, 109.5250] as [number, number], color: '#dc2626' },
    'Purwonegoro': { center: [-7.3950, 109.5400] as [number, number], color: '#2563eb' },
    'Bawang': { center: [-7.4200, 109.5600] as [number, number], color: '#16a34a' },
    'Banjarmangu': { center: [-7.4400, 109.5100] as [number, number], color: '#9333ea' },
    'Mandiraja': { center: [-7.3800, 109.6100] as [number, number], color: '#ea580c' },
    'Purworejo Klampok': { center: [-7.3700, 109.5800] as [number, number], color: '#0891b2' },
    'Sigaluh': { center: [-7.4600, 109.5500] as [number, number], color: '#be185d' },
    'Wanadadi': { center: [-7.3850, 109.6500] as [number, number], color: '#65a30d' },
    'Rakit': { center: [-7.4500, 109.6200] as [number, number], color: '#ca8a04' },
    'Susukan': { center: [-7.3600, 109.5300] as [number, number], color: '#7c3aef' },
  }), [])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Suppress Leaflet marker icon warnings
    delete (L.Icon.Default.prototype as any)._getIconUrl

    const map = L.map(mapRef.current).setView(center, 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    // Add kecamatan markers
    Object.entries(kecamatanBoundaries).forEach(([name, data]) => {
      L.marker(data.center)
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:150px">
            <strong style="font-size:14px">${name}</strong><br/>
            <span style="color:#64748b;font-size:12px">Kecamatan</span>
          </div>
        `)
    })

    // Add boundary circles for visual effect
    Object.entries(kecamatanBoundaries).forEach(([name, data]) => {
      L.circle(data.center, {
        radius: 2000,
        color: data.color,
        fillColor: data.color,
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map).bindPopup(`<strong>${name}</strong>`)
    })

    mapInstanceRef.current = map

    // Click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      // Find nearest kecamatan
      let nearestKec = ''
      let minDist = Infinity
      Object.entries(kecamatanBoundaries).forEach(([name, data]) => {
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
  }, [center, onClick, kecamatanBoundaries, showKecamatan, showDesa])

  return (
    <div
      ref={mapRef}
      style={{ width, height, borderRadius: '1rem', overflow: 'hidden' }}
      className="border border-slate-200"
    />
  )
}
