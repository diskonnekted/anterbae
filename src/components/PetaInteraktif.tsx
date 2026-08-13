'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons - use direct URLs for Turbopack
const markerIconUrl = 'node_modules/leaflet/dist/images/marker-icon.png'
const markerIcon2xUrl = 'node_modules/leaflet/dist/images/marker-icon-2x.png'
const markerShadowUrl = 'node_modules/leaflet/dist/images/marker-shadow.png'

interface PetaInteraktifProps {
  width?: string
  height?: string
  onClick?: (kecamatan?: string, desa?: string) => void
  merchants?: Array<{
    _id: string
    name: string
    slug: string
    category: string
    area?: string
    latitude?: number
    longitude?: number
    isOpen: boolean
  }>
}

export default function PetaInteraktif({
  width = '100%',
  height = '180px',
  onClick,
  merchants = [],
}: PetaInteraktifProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const merchantMarkersRef = useRef<L.LayerGroup | null>(null)

  const [selectedArea, setSelectedArea] = useState<string>('all')

  useEffect(() => {
    import('leaflet').then(() => {
      setSelectedArea('all')
    })
  }, [merchants])

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

    // Fix Leaflet default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2xUrl,
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    })

    // Load Kecamatan Boundaries (GeoJSON)
    fetch('/peta_kecamatan.geojson')
      .then(res => res.json())
      .then(geoJsonData => {
        L.geoJSON(geoJsonData, {
          style: {
            color: '#ef4444',
            weight: 1.5,
            opacity: 0.5,
            fillColor: '#f87171',
            fillOpacity: 0.02
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              const name = feature.properties.Kecamatan || feature.properties.KECAMATAN || feature.properties.Name || feature.properties.NAME || 'N/A'
              const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
              layer.bindPopup(`<span style="font-size: 11px; font-weight: bold; text-transform: uppercase; font-family: sans-serif;">Kec. ${capitalizedName}</span>`)
            }
          }
        }).addTo(map)
      })
      .catch(err => console.error('Failed to load kecamatan boundaries:', err))

    // Create layer group for merchant markers
    const merchantLayer = L.layerGroup().addTo(map)
    merchantMarkersRef.current = merchantLayer

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

    // Add merchant markers
    const updateMerchantMarkers = () => {
      merchantLayer.clearLayers()

      const filteredMerchants = selectedArea === 'all' 
        ? merchants 
        : merchants.filter(m => m.area === selectedArea)

      filteredMerchants.forEach(merchant => {
        if (merchant.latitude != null && merchant.longitude != null) {
          const color = merchant.category === 'food' ? '#dc2626' : 
                       merchant.category === 'grocery' ? '#16a34a' :
                       merchant.category === 'health' ? '#2563eb' : '#7c3aef'
          
          const circleMarker = L.circleMarker(
            [merchant.latitude, merchant.longitude],
            {
              radius: 8,
              color: color,
              fillColor: color,
              fillOpacity: 0.7,
              weight: 2,
            }
          )

          const popupContent = `
            <div style="min-width: 200px">
              <strong style="font-size:14px">${merchant.name}</strong><br/>
              <span style="font-size:12px; color: #64748b">${merchant.area}</span><br/>
              <span style="font-size:12px; color: ${color}; font-weight: bold">${merchant.category}</span><br/>
              <span style="font-size:12px">${merchant.isOpen ? '✅ Buka' : '❌ Tutup'}</span><br/>
              <a href="/mitra/${merchant.slug}" style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">Lihat Detail</a>
            </div>
          `

          circleMarker.bindPopup(popupContent)
          circleMarker.addTo(merchantLayer)
        }
      })
    }

    updateMerchantMarkers()

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
  }, [center, onClick, kecamatanInfo, merchants, selectedArea])

  // Get unique areas from merchants
  const areas = useMemo(() => {
    const uniqueAreas = new Set(merchants.map(m => m.area).filter(Boolean))
    return Array.from(uniqueAreas).sort()
  }, [merchants])

  return (
    <div>
      {/* Area Filter */}
      {areas.length > 0 && (
        <div className="mb-3">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Semua Kecamatan</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      )}

      <div
        ref={mapRef}
        style={{ width, height, borderRadius: '0.75rem', overflow: 'hidden' }}
        className="border border-slate-200"
      />
    </div>
  )
}
