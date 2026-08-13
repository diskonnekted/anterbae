'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons - use direct URLs for Turbopack
const markerIconUrl = 'node_modules/leaflet/dist/images/marker-icon.png'
const markerIcon2xUrl = 'node_modules/leaflet/dist/images/marker-icon-2x.png'
const markerShadowUrl = 'node_modules/leaflet/dist/images/marker-shadow.png'

interface Merchant {
  _id: string
  name: string
  slug: string
  category: 'food' | 'grocery' | 'health' | 'other'
  area: string
  isOpen: boolean
  latitude?: number
  longitude?: number
}

interface PetaMerchantProps {
  merchants: Merchant[]
}

export default function PetaMerchant({ merchants }: PetaMerchantProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterArea, setFilterArea] = useState<string>('all')

  // Get unique areas from merchants
  const areas = useMemo(() => {
    const uniqueAreas = new Set(merchants.map(m => m.area).filter(Boolean))
    return Array.from(uniqueAreas).sort()
  }, [merchants])

  // Get unique categories from merchants
  const categories = useMemo(() => {
    const uniqueCategories = new Set(merchants.map(m => m.category).filter(Boolean))
    return Array.from(uniqueCategories)
  }, [merchants])

  // Filter merchants based on selected filters
  const filteredMerchants = useMemo(() => {
    return merchants.filter(m => {
      if (filterCategory !== 'all' && m.category !== filterCategory) return false
      if (filterArea !== 'all' && m.area !== filterArea) return false
      return true
    })
  }, [merchants, filterCategory, filterArea])

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return '#dc2626' // red
      case 'grocery': return '#16a34a' // green
      case 'health': return '#2563eb' // blue
      default: return '#7c3aef' // purple
    }
  }

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'food': return 'Makanan'
      case 'grocery': return 'Grocery'
      case 'health': return 'Kesehatan'
      default: return 'Lainnya'
    }
  }

  // Initialize map and markers
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView([-7.4097, 109.5250], 13)

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

    // Create layer group for markers
    const layerGroup = L.layerGroup().addTo(map)
    markersRef.current = layerGroup
    mapInstanceRef.current = map

    // Load Kecamatan Boundaries
    fetch('/peta_kecamatan.geojson')
      .then(res => res.json())
      .then(geoJsonData => {
        if (!mapInstanceRef.current) return
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
        }).addTo(mapInstanceRef.current)
      })
      .catch(err => console.error('Failed to load kecamatan boundaries:', err))

    // Update markers based on filters
    const updateMarkers = () => {
      layerGroup.clearLayers()

      filteredMerchants.forEach(merchant => {
        if (merchant.latitude != null && merchant.longitude != null) {
          const color = getCategoryColor(merchant.category)
          
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
              <span style="font-size:12px; color: ${color}; font-weight: bold">${getCategoryLabel(merchant.category)}</span><br/>
              <span style="font-size:12px">${merchant.isOpen ? '✅ Buka' : '❌ Tutup'}</span><br/>
              <a href="/mitra/${merchant.slug}" style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">Lihat Detail</a>
            </div>
          `

          circleMarker.bindPopup(popupContent)
          circleMarker.addTo(layerGroup)
        }
      })
    }

    updateMarkers()

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [filteredMerchants])

  // Update markers when filters change
  useEffect(() => {
    if (markersRef.current) {
      markersRef.current.clearLayers()

      filteredMerchants.forEach(merchant => {
        if (merchant.latitude != null && merchant.longitude != null) {
          const color = getCategoryColor(merchant.category)
          
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
              <span style="font-size:12px; color: ${color}; font-weight: bold">${getCategoryLabel(merchant.category)}</span><br/>
              <span style="font-size:12px">${merchant.isOpen ? '✅ Buka' : '❌ Tutup'}</span><br/>
              <a href="/mitra/${merchant.slug}" style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">Lihat Detail</a>
            </div>
          `

          circleMarker.bindPopup(popupContent)
          circleMarker.addTo(markersRef.current!)
        }
      })
    }
  }, [filterCategory, filterArea, filteredMerchants])

  return (
    <div className="mb-12">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Lokasi Merchant
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kecamatan</label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Kecamatan</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters info */}
        {(filterCategory !== 'all' || filterArea !== 'all') && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600 font-medium">
              Menampilkan <span className="font-black text-red-600">{filteredMerchants.length}</span> dari <span className="font-black text-slate-900">{merchants.length}</span> merchant
            </p>
            <button
              onClick={() => { setFilterCategory('all'); setFilterArea('all'); }}
              className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              Hapus Filter
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-200">
          <div ref={mapRef} className="h-full w-full" />
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span> Makanan
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600"></span> Grocery
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span> Kesehatan
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600"></span> Lainnya
          </span>
        </div>
      </div>
    </div>
  )
}
