'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { sendCourierMessageViaFonnte, toggleCourierStatus } from '@/app/actions/admin'
import { Send, X, Loader2 } from 'lucide-react'

const markerIconUrl = 'node_modules/leaflet/dist/images/marker-icon.png'
const markerIcon2xUrl = 'node_modules/leaflet/dist/images/marker-icon-2x.png'
const markerShadowUrl = 'node_modules/leaflet/dist/images/marker-shadow.png'

type MapCourier = {
  _id: string
  name: string
  phone: string
  vehicleType: 'motor' | 'mobil'
  latitude?: number
  longitude?: number
  lastLocationUpdate?: string
  isActive?: boolean
  status?: string
}

type MapMerchant = {
  _id: string
  name: string
  category: string
  isOpen: boolean
  latitude?: number
  longitude?: number
}

type MapLocation = {
  _id: string
  name: string
  address: string
  type: string
  lat: number
  lng: number
}

type MapPoint = {
  _id: string
  name: string
  address: string
  category: string // food, grocery, health, other, pasar, keamanan, etc
  subcategory: string // resto, cafe, barbershop, layanan_publik, etc
  lat: number
  lng: number
  isOpen?: boolean
  phone?: string
  isCourier?: boolean
  isOnline?: boolean
}

const getCourierProfilePic = (name: string): string => {
  const normalized = name.toLowerCase()
  if (normalized.includes('dummy 1') || normalized === 'adi') return '/kurir/adi.JPG'
  if (normalized.includes('dummy 2') || normalized.includes('budiarto') || normalized === 'budi') return '/kurir/budi.JPG'
  if (normalized.includes('dummy 3') || normalized === 'candra') return '/kurir/candra.JPG'
  if (normalized.includes('dummy 4') || normalized === 'deni') return '/kurir/deni.JPG'
  if (normalized.includes('dummy 5') || normalized === 'edi') return '/kurir/edi.JPG'
  if (normalized.includes('dummy 6') || normalized === 'farid') return '/kurir/farid.JPG'
  if (normalized.includes('dummy 7') || normalized === 'gozi') return '/kurir/gozi.JPG'
  if (normalized.includes('dummy 8') || normalized === 'heri') return '/kurir/heri.JPG'
  if (normalized.includes('dummy 9') || normalized === 'imam') return '/kurir/imam.JPG'
  if (normalized.includes('dummy 10') || normalized === 'joni') return '/kurir/joni.JPG'
  if (normalized.includes('kardi')) return '/kurir/kardi.JPG'
  const names = ['adi', 'budi', 'candra', 'deni', 'edi', 'farid', 'gozi', 'heri', 'imam', 'joni', 'kardi']
  for (const n of names) {
    if (normalized.includes(n)) return `/kurir/${n}.JPG`
  }
  return '/kurir/adi.JPG'
}

// Unified SVG marker generator
const createMarkerSvg = (type: string, sub: string, isOpen?: boolean, isCourier?: boolean, isOnline?: boolean): string => {
  // Courier profile marker
  if (isCourier) {
    const border = isOnline ? '#10b981' : '#94a3b8'
    const bg = isOnline ? '#ecfdf5' : '#f1f5f9'
    const dot = isOnline ? '#10b981' : '#94a3b8'
    return `
      <div style="position:relative; width:38px; height:38px; border-radius:50%; border:3px solid ${border}; background-color:${bg}; box-shadow:0 4px 6px rgba(0,0,0,0.1); overflow:hidden;">
        <div style="width:100%; height:100%; background:#94a3b8; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:bold; text-transform:uppercase;">${type.charAt(0)}</div>
        <div style="position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; border:2px solid white; background-color:${dot};"></div>
      </div>
    `
  }

  // Category colors
  const colors: Record<string, { bg: string; fg: string }> = {
    'resto': { bg: '#dc2626', fg: '#fff' },
    'cafe': { bg: '#92400e', fg: '#fff' },
    'barbershop': { bg: '#4f46e5', fg: '#fff' },
    'layanan_publik': { bg: '#ca8a04', fg: '#fff' },
    'pasar': { bg: '#ea580c', fg: '#fff' },
    'keamanan': { bg: '#4f46e5', fg: '#fff' },
    'rumah_sakit': { bg: '#dc2626', fg: '#fff' },
    'transportasi': { bg: '#7c3aed', fg: '#fff' },
    'pemerintahan': { bg: '#ca8a04', fg: '#fff' },
    'rekreasi': { bg: '#0891b2', fg: '#fff' },
    'ibadah': { bg: '#059669', fg: '#fff' },
    'kampus': { bg: '#2563eb', fg: '#fff' },
    'perbankan': { bg: '#0d9488', fg: '#fff' },
    'grocery': { bg: '#16a34a', fg: '#fff' },
    'health': { bg: '#2563eb', fg: '#fff' },
    'other': { bg: '#7c3aef', fg: '#fff' },
  }
  const c = colors[sub] || colors['other']
  const statusDot = isOpen ? '#10b981' : '#ef4444'
  const statusBg = isOpen ? '#10b981' : '#94a3b8'

  // Emoji icons per subcategory
  const emojiIcons: Record<string, string> = {
    'resto': '🍽️',
    'cafe': '☕',
    'barbershop': '💈',
    'pasar': '🏪',
    'keamanan': '🛡️',
    'rumah_sakit': '🏥',
    'transportasi': '🚂',
    'pemerintahan': '🏛️',
    'rekreasi': '🎢',
    'ibadah': '🕌',
    'kampus': '🎓',
    'perbankan': '🏦',
    'grocery': '🛒',
    'health': '💊',
    'other': '📍',
  }

  const icon = emojiIcons[sub] || emojiIcons['other']

  return `
    <div style="
      position: relative;
      width: 36px;
      height: 36px;
    ">
      <div style="
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${c.bg};
        border: 3px solid ${c.fg};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        line-height: 1;
      ">
        ${icon}
      </div>
      <div style="
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${statusBg};
        border: 2px solid white;
      "></div>
    </div>
  `
}

export default function PetaKurir({ couriers, merchants = [], locations = [], onRefresh }: { couriers: MapCourier[]; merchants?: MapMerchant[]; locations?: MapLocation[]; onRefresh?: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const allPointsLayerRef = useRef<L.LayerGroup | null>(null)
  const [showAllPoints, setShowAllPoints] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['resto', 'cafe', 'layanan_publik']))
  const mapReadyRef = useRef(false)

  const [msgCourier, setMsgCourier] = useState<{ name: string; phone: string } | null>(null)
  const [messageText, setMessageText] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [msgResult, setMsgResult] = useState<{ success: boolean; text: string } | null>(null)

  const handleSendMessage = async () => {
    if (!msgCourier) return
    setSendingMsg(true)
    setMsgResult(null)
    try {
      const res = await sendCourierMessageViaFonnte(msgCourier.phone, messageText)
      if (res.success) {
        setMsgResult({ success: true, text: 'Pesan berhasil dikirim via Fonnte!' })
        setTimeout(() => {
          setMsgCourier(null)
          setMessageText('')
          setMsgResult(null)
        }, 1500)
      } else {
        setMsgResult({ success: false, text: res.error || 'Gagal mengirim pesan.' })
      }
    } catch (err: any) {
      setMsgResult({ success: false, text: err.message || 'Terjadi kesalahan sistem.' })
    } finally {
      setSendingMsg(false)
    }
  }

  // Filter couriers with valid coordinates
  const activeCouriers = couriers.filter(c => c.latitude && c.longitude)

  // Build unified points list from merchants + locations, deduplicated
  const buildPoints = (): MapPoint[] => {
    const seen = new Set<string>()
    const points: MapPoint[] = []



    // Add merchants
    merchants.forEach((m) => {
      if (!m.latitude || !m.longitude) return
      const key = `merchant-${m._id}`
      if (!seen.has(key)) {
        seen.add(key)
        // Map merchant category to subcategory
        const sub = m.category === 'food' ? 'resto' :
                    m.category === 'grocery' ? 'grocery' :
                    m.category === 'health' ? 'health' : 'other'
        points.push({
          _id: `merchant-${m._id}`,
          name: m.name,
          address: '',
          category: 'merchant',
          subcategory: sub,
          lat: m.latitude,
          lng: m.longitude,
          isOpen: m.isOpen,
        })
      }
    })

    // Add locations
    locations.forEach((l) => {
      if (!l.lat || !l.lng) return
      const key = `location-${l.lat}-${l.lng}`
      if (!seen.has(key)) {
        seen.add(key)
        // Map location type to subcategory
        const type = l.type.toLowerCase()
        const sub = type.includes('pasar') ? 'pasar' :
                    type.includes('keamanan') ? 'keamanan' :
                    type.includes('rumah') || type.includes('klinik') || type.includes('apotek') || type.includes('puskesmas') ? 'rumah_sakit' :
                    type.includes('transport') ? 'transportasi' :
                    type.includes('pemerintah') || type.includes('kantor') || type.includes('alun') || type.includes('mpps') ? 'pemerintahan' :
                    type.includes('rekreas') || type.includes('taman') || type.includes('waterpark') || type.includes('zoo') ? 'rekreasi' :
                    type.includes('ibadah') || type.includes('masjid') || type.includes('church') || type.includes('gereja') ? 'ibadah' :
                    type.includes('kampus') || type.includes('sekolah') || type.includes('sma') || type.includes('smk') || type.includes('smp') || type.includes('sd') || type.includes('ump') || type.includes('universitas') ? 'kampus' :
                    type.includes('bank') || type.includes('perbankan') ? 'perbankan' :
                    type.includes('cafe') || type.includes('coffee') ? 'cafe' :
                    type.includes('resto') || type.includes('warung') || type.includes('makanan') ? 'resto' :
                    type.includes('barber') || type.includes('salon') || type.includes('cukur') ? 'barbershop' :
                    type.includes('minimarket') || type.includes('alfamart') || type.includes('indomaret') ? 'grocery' :
                    'other'

        points.push({
          _id: `location-${l.lat}-${l.lng}`,
          name: l.name,
          address: l.address.replace(/\u{000f}/gu, '').trim(),
          category: 'location',
          subcategory: sub,
          lat: l.lat,
          lng: l.lng,
          isOpen: true,
        })
      }
    })

    return points
  }

  const allPoints = buildPoints()

  // Toggle category
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  // All available categories
  const allCategories = [...new Set(allPoints.map(p => p.subcategory))].sort()

  useEffect(() => {
    if (!mapRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([-7.3967, 109.6967], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2xUrl,
        iconUrl: markerIconUrl,
        shadowUrl: markerShadowUrl,
      })

      mapInstanceRef.current = map
      mapReadyRef.current = true

      // Load boundaries
      fetch('/peta_kecamatan.geojson')
        .then(res => res.json())
        .then(geoJsonData => {
          L.geoJSON(geoJsonData, {
            style: { color: '#ef4444', weight: 1.8, opacity: 0.6, fillColor: '#f87171', fillOpacity: 0.03 },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                const name = feature.properties.Kecamatan || feature.properties.KECAMATAN || 'N/A'
                layer.bindPopup(`<span style="font-size:11px;font-weight:bold;text-transform:uppercase;">Kec. ${name}</span>`)
              }
            }
          }).addTo(map)
        }).catch(() => {})

      fetch('/peta_desa.geojson')
        .then(res => res.json())
        .then(geoJsonData => {
          L.geoJSON(geoJsonData, {
            style: { color: '#3b82f6', weight: 0.8, opacity: 0.4, fillColor: '#93c5fd', fillOpacity: 0.01 },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                const name = feature.properties.Nama_Desa_ || 'N/A'
                const kec = feature.properties.Kecamatan || ''
                layer.bindPopup(`<div style="font-size:10px;font-family:sans-serif;">Desa: <strong>${name}</strong><br/><span style="color:#64748b;">${kec}</span></div>`)
              }
            }
          }).addTo(map)
        }).catch(() => {})
    }

    const map = mapInstanceRef.current

    // Sync courier markers
    activeCouriers.forEach((courier) => {
      const pos: [number, number] = [courier.latitude!, courier.longitude!]
      const isOnline = courier.status === 'active' && courier.isActive
      const timeStr = courier.lastLocationUpdate
        ? new Date(courier.lastLocationUpdate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : '-'

      const profilePic = getCourierProfilePic(courier.name)
      const waPhone = courier.phone.replace(/\D/g, '').replace(/^0/, '62')
      const waText = encodeURIComponent(`Halo ${courier.name}, saya Admin Anterbae.`)
      const waLink = `https://wa.me/${waPhone}?text=${waText}`

      const customIcon = L.divIcon({
        html: `
          <div style="position:relative; width:42px; height:50px; display:flex; flex-direction:column; align-items:center;">
            <div style="width:38px; height:38px; border-radius:50%; border:3px solid ${isOnline ? '#10b981' : '#94a3b8'}; background-color:${isOnline ? '#ecfdf5' : '#f1f5f9'}; box-shadow:0 4px 6px rgba(0,0,0,0.15); overflow:hidden; z-index:2;">
              <img src="${profilePic}" style="width:100%; height:100%; object-fit:cover;" />
            </div>
            <!-- Pointer Pin Tail -->
            <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:10px solid ${isOnline ? '#10b981' : '#94a3b8'}; margin-top:-2px; z-index:1; filter:drop-shadow(0 2px 2px rgba(0,0,0,0.2));"></div>
            <!-- Bike Mini Badge -->
            <div style="position:absolute; bottom:14px; right:0px; width:16px; height:16px; border-radius:50%; background:#2563eb; border:1.5px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.2); z-index:3;">
              <span style="font-size:8px; line-height:1;">🏍️</span>
            </div>
            <!-- Status dot -->
            <div style="position:absolute; top:0; right:0; width:10px; height:10px; border-radius:50%; border:1.5px solid white; background-color:${isOnline ? '#10b981' : '#94a3b8'}; z-index:3;"></div>
          </div>
        `,
        iconSize: [42, 50],
        iconAnchor: [21, 50],
        className: 'custom-courier-marker'
      })

      const popupHtml = `
        <div style="font-family:sans-serif;font-size:12px;padding:4px;min-width:140px;">
          <strong style="font-size:13px">${courier.name}</strong><br/>
          <div style="margin: 4px 0;">
            <span style="font-size:10px;font-weight:bold;padding:2px 6px;border-radius:4px;background-color:${isOnline ? '#d1fae5' : '#f1f5f9'};color:${isOnline ? '#065f46' : '#475569'}">
              ${isOnline ? 'Aktif / Online' : 'Libur / Offline'}
            </span>
          </div>
          <span style="color:#64748b;font-size:10px;">WA: ${courier.phone}</span><br/>
          <span style="color:#94a3b8;font-size:10px;">Update: ${timeStr} WIB</span>
          <br/>
          <button id="send-btn-${courier._id}" style="display:inline-block;margin-top:6px;width:100%;padding:6px 12px;background:#25d366;color:white;border-radius:6px;font-size:11px;font-weight:bold;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;box-shadow:0 2px 4px rgba(0,0,0,0.15);">
            💬 Kirim Pesan
          </button>
          ${!isOnline ? `
            <button id="activate-btn-${courier._id}" style="display:inline-block;margin-top:6px;width:100%;padding:6px 12px;background:#3b82f6;color:white;border-radius:6px;font-size:11px;font-weight:bold;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;box-shadow:0 2px 4px rgba(0,0,0,0.15);">
              ⚡ Aktifkan Kurir
            </button>
          ` : ''}
        </div>
      `

      const setupPopupEvents = (m: L.Marker) => {
        m.off('popupopen')
        m.on('popupopen', () => {
          const btn = document.getElementById(`send-btn-${courier._id}`)
          if (btn) {
            btn.onclick = (e) => {
              e.preventDefault()
              setMsgCourier({ name: courier.name, phone: courier.phone })
              setMessageText(`Halo ${courier.name}, `)
              setMsgResult(null)
              m.closePopup()
            }
          }

          const actBtn = document.getElementById(`activate-btn-${courier._id}`)
          if (actBtn) {
            actBtn.onclick = async (e) => {
              e.preventDefault()
              actBtn.innerText = 'Memproses...'
              actBtn.setAttribute('disabled', 'true')
              try {
                const res = await toggleCourierStatus(courier._id, true)
                if (res.success) {
                  alert(`Kurir ${courier.name} berhasil diaktifkan!`)
                  if (onRefresh) onRefresh()
                } else {
                  alert(res.error || 'Gagal mengaktifkan kurir.')
                }
              } catch (err: any) {
                alert(err.message || 'Gagal menghubungi server.')
              } finally {
                m.closePopup()
              }
            }
          }
        })
      }

      if (markersRef.current[`courier-${courier._id}`]) {
        markersRef.current[`courier-${courier._id}`].setLatLng(pos)
        markersRef.current[`courier-${courier._id}`].setIcon(customIcon)
        markersRef.current[`courier-${courier._id}`].setPopupContent(popupHtml)
        setupPopupEvents(markersRef.current[`courier-${courier._id}`])

        if (!map.hasLayer(markersRef.current[`courier-${courier._id}`])) {
          markersRef.current[`courier-${courier._id}`].addTo(map)
        }
      } else {
        const marker = L.marker(pos, { icon: customIcon })
          .bindPopup(popupHtml)
          .addTo(map)
        
        setupPopupEvents(marker)
        markersRef.current[`courier-${courier._id}`] = marker
      }
    })

    Object.keys(markersRef.current).forEach((id) => {
      if (!activeCouriers.some(c => c._id === id.replace('courier-', ''))) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

  }, [activeCouriers])

  // Unified points layer
  useEffect(() => {
    if (!mapReadyRef.current) return
    const map = mapInstanceRef.current
    if (!map) return

    if (!allPointsLayerRef.current) {
      allPointsLayerRef.current = L.layerGroup()
    }
    const layer = allPointsLayerRef.current
    layer.clearLayers()

    if (showAllPoints) {
      layer.addTo(map)
      const filteredPoints = allPoints.filter(p => selectedCategories.has(p.subcategory))

      filteredPoints.forEach(point => {
        const svgHtml = createMarkerSvg(point.category, point.subcategory, point.isOpen, point.isCourier, point.isOnline)

        const marker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            html: svgHtml,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            className: ''
          }),
          zIndexOffset: 500
        })
          .bindPopup(`
            <div style="font-family:sans-serif;font-size:12px;padding:4px;line-height:1.4">
              <strong style="font-size:13px">${point.name}</strong><br/>
              ${point.address ? `<span style="font-size:10px;color:#64748b">${point.address}</span><br/>` : ''}
              <span style="font-size:10px;font-weight:bold;text-transform:uppercase">${point.subcategory}</span>
              ${point.isOpen !== undefined ? `<br/><span style="font-size:10px;color:${point.isOpen ? '#065f46' : '#475569'}">${point.isOpen ? 'Buka' : 'Tutup'}</span>` : ''}
              ${point.isCourier ? `<br/><span style="font-size:10px;color:#64748b">${point.isOnline ? 'Online' : 'Offline'}</span>` : ''}
              <br/><a href="https://www.google.com/maps?q=${point.lat},${point.lng}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:6px;padding:4px 10px;background:#4285f4;color:white;border-radius:6px;font-size:11px;font-weight:bold;text-decoration:none;">
                📍 Buka di Google Maps
              </a>
            </div>
          `, { autoPan: true })

        marker.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e)
          marker.openPopup()
        })

        marker.addTo(layer)
      })
    } else {
      layer.remove()
    }
  }, [showAllPoints, selectedCategories, allPoints])

  const visiblePointsCount = showAllPoints ? allPoints.filter(p => selectedCategories.has(p.subcategory)).length : 0
  const totalCouriers = activeCouriers.length

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Controls bar */}
      <div className="flex items-start justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-wider">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Live Kurir ({totalCouriers} Terdeteksi)
        </div>
        <div className="flex items-start gap-2 flex-wrap">
          {/* Show Points Toggle */}
          <button
            onClick={() => setShowAllPoints(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider shadow-sm transition-all whitespace-nowrap ${
              showAllPoints
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
              showAllPoints ? 'bg-white border-white' : 'border-slate-300'
            }`}>
              {showAllPoints && (
                <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5L4 7.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            Tampilkan Marker
            {showAllPoints && (
              <span className="bg-white/30 text-white rounded-md px-1">{visiblePointsCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Category filters */}
      {showAllPoints && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {allCategories.map(cat => {
            const count = allPoints.filter(p => p.subcategory === cat).length
            const isSelected = selectedCategories.has(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Map container */}
      <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Fonnte WhatsApp Message Form Modal */}
      {msgCourier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  💬 Kirim Pesan WA
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Tujuan: {msgCourier.name} ({msgCourier.phone})</p>
              </div>
              <button 
                onClick={() => setMsgCourier(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={sendingMsg}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Isi Pesan WhatsApp</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ketik pesan yang ingin dikirim..."
                rows={4}
                disabled={sendingMsg}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all resize-none"
              />
            </div>

            {msgResult && (
              <div className={`p-3 rounded-2xl text-[11px] font-bold ${
                msgResult.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {msgResult.text}
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMsgCourier(null)}
                disabled={sendingMsg}
                className="flex-1 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 font-black text-xs uppercase tracking-wider text-slate-500 transition-all active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={sendingMsg || !messageText.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
              >
                {sendingMsg ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
