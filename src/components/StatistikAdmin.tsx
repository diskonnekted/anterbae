'use client'

import { useMemo, useState } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  Store,
  Users,
  Star,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Order = {
  _id: string
  orderNumber: string
  _createdAt: string
  customerName?: string
  restaurantName?: string
  totalAmount: number
  shippingFee: number
  status: string
  orderCategory?: string
  orderType?: string | null
  deliveryArea?: string
  courier?: { _id?: string; name: string; phone?: string } | null
}

type Merchant = {
  _id: string
  name: string
  area?: string
  category?: string
  isOpen?: boolean
  isVerified?: boolean
}

type Courier = {
  _id: string
  name: string
  isActive?: boolean
  status?: string
}

interface Props {
  orders: Order[]
  merchants: Merchant[]
  couriers: Courier[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRp(n: number) {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}jt`
  if (n >= 1_000) return `Rp${(n / 1_000).toFixed(0)}rb`
  return `Rp${n.toLocaleString('id-ID')}`
}

function formatRpFull(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Donut chart using SVG */
function DonutChart({
  segments,
  size = 140,
  thickness = 28,
}: {
  segments: { value: number; color: string; label: string }[]
  size?: number
  thickness?: number
}) {
  const total = segments.reduce((a, b) => a + b.value, 0)
  if (total === 0)
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xs font-bold text-slate-300">Belum ada data</span>
      </div>
    )

  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  let offset = 0
  const slices = segments.map((seg) => {
    const pct = seg.value / total
    const dash = pct * circumference
    const gap = circumference - dash
    const currentOffset = offset
    offset += dash
    return { ...seg, dash, gap, offset: currentOffset }
  })

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={thickness}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  )
}

/** Horizontal bar row */
function BarRow({
  label,
  value,
  max,
  color,
  suffix = '',
  sublabel,
}: {
  label: string
  value: number
  max: number
  color: string
  suffix?: string
  sublabel?: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline gap-2">
        <div className="flex items-baseline gap-1 min-w-0">
          <span className="text-xs font-bold text-slate-700 truncate">{label}</span>
          {sublabel && <span className="text-[10px] text-slate-400 flex-shrink-0">{sublabel}</span>}
        </div>
        <span className="text-xs font-black text-slate-900 tabular-nums flex-shrink-0">
          {suffix === 'Rp' ? formatRpFull(value) : `${value}${suffix}`}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%`, background: color }}
        />
      </div>
    </div>
  )
}

/** KPI Card */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  trend,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  const trendColor =
    trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-400' : 'text-slate-300'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + '18' }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-[11px] font-bold text-slate-400 mt-1">{sub}</p>}
      </div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  )
}

// ─── SVG Line Chart Component ───────────────────────────────────────────────

function InteractiveLineChart({ data }: { data: { label: string; count: number; completed: number; cancelled: number; revenue: number }[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  
  const width = 600
  const height = 260
  const paddingLeft = 40
  const paddingRight = 20
  const paddingTop = 30
  const paddingBottom = 40

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Get max values across all counts
  const maxVal = Math.max(...data.map(d => Math.max(d.count, d.completed, d.cancelled)), 5)
  const totalOrders = data.reduce((a, d) => a + d.count, 0)
  const totalCompleted = data.reduce((a, d) => a + d.completed, 0)
  const totalCancelled = data.reduce((a, d) => a + d.cancelled, 0)

  // Points coordinates mapping
  const getPoints = (key: 'count' | 'completed' | 'cancelled') => {
    return data.map((d, i) => {
      const x = paddingLeft + (i / Math.max(data.length - 1, 1)) * chartWidth
      const y = paddingTop + chartHeight - (d[key] / maxVal) * chartHeight
      return { x, y, val: d[key] }
    })
  }

  const pointsTotal = getPoints('count')
  const pointsSuccess = getPoints('completed')
  const pointsCancelled = getPoints('cancelled')

  // Helper to create smooth Bezier line path string
  const getPathD = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return ''
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
    
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const cp1x = p1.x + (p2.x - p1.x) * 0.35
      const cp1y = p1.y
      const cp2x = p2.x - (p2.x - p1.x) * 0.35
      const cp2y = p2.y
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
  }

  const pathTotal = getPathD(pointsTotal)
  const pathSuccess = getPathD(pointsSuccess)
  const pathCancelled = getPathD(pointsCancelled)

  // Area under Total Orders
  const areaTotal = pointsTotal.length > 0 
    ? `${pathTotal} L ${pointsTotal[pointsTotal.length - 1].x} ${paddingTop + chartHeight} L ${pointsTotal[0].x} ${paddingTop + chartHeight} Z` 
    : ''

  // Y-axis grid helper
  const yTicks = 4
  const yGridLines = Array.from({ length: yTicks + 1 }).map((_, i) => {
    const val = Math.round((i / yTicks) * maxVal)
    const y = paddingTop + chartHeight - (i / yTicks) * chartHeight
    return { val, y }
  })

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 space-y-5">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Grafik Tren Pemesanan & Keberhasilan
          </h3>
          <p className="text-[11px] text-slate-400 font-bold">
            Total: <span className="text-slate-700 font-black">{totalOrders} order</span> · Sukses: <span className="text-emerald-600 font-black">{totalCompleted}</span> · Batal: <span className="text-red-500 font-black">{totalCancelled}</span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-500">Total Order</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Sukses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-500">Batal</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-visible">
        {/* Floating Tooltip Dashboard */}
        {hoveredIdx !== null && (
          <div className="absolute top-0 right-0 md:right-4 bg-slate-950/95 backdrop-blur-sm text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800/80 flex flex-col gap-1.5 min-w-[160px] animate-fade-in z-20">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">{data[hoveredIdx].label}</p>
            <div className="space-y-1 mt-1 text-[11px]">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400 font-bold">🔵 Total Order:</span>
                <strong className="text-blue-400 tabular-nums">{data[hoveredIdx].count}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400 font-bold">🟢 Sukses:</span>
                <strong className="text-emerald-400 tabular-nums">{data[hoveredIdx].completed}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400 font-bold">🔴 Batal:</span>
                <strong className="text-red-400 tabular-nums">{data[hoveredIdx].cancelled}</strong>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-800 pt-1 mt-1.5">
                <span className="text-slate-400 font-bold">💸 Omset:</span>
                <strong className="text-yellow-400 tabular-nums">{formatRp(data[hoveredIdx].revenue)}</strong>
              </div>
            </div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            
            {/* Soft shadows for lines */}
            <filter id="shadow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.2" />
            </filter>
            <filter id="shadow-success" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10b981" floodOpacity="0.2" />
            </filter>
            <filter id="shadow-cancelled" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Grid lines */}
          {yGridLines.map((tick, i) => (
            <g key={i} className="opacity-45">
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray={i === 0 ? undefined : "4 4"}
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 3}
                textAnchor="end"
                className="text-[9px] font-black fill-slate-400"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* X axis labels */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / Math.max(data.length - 1, 1)) * chartWidth
            const skip = data.length > 10 ? i % Math.ceil(data.length / 8) !== 0 : false
            if (skip) return null
            return (
              <text
                key={i}
                x={x}
                y={height - paddingBottom + 16}
                textAnchor="middle"
                className="text-[9px] font-black fill-slate-400"
              >
                {d.label}
              </text>
            )
          })}

          {/* Vertical Cursor Tracking Line */}
          {hoveredIdx !== null && (
            <line
              x1={pointsTotal[hoveredIdx].x}
              y1={paddingTop}
              x2={pointsTotal[hoveredIdx].x}
              y2={paddingTop + chartHeight}
              stroke="#64748b"
              strokeWidth={1.2}
              strokeDasharray="4 4"
              className="opacity-40"
            />
          )}

          {/* Area Fill for Total */}
          {areaTotal && (
            <path d={areaTotal} fill="url(#area-gradient)" />
          )}

          {/* Line 1: Total Orders */}
          {pathTotal && (
            <path
              d={pathTotal}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow-blue)"
            />
          )}

          {/* Line 2: Successful Orders */}
          {pathSuccess && (
            <path
              d={pathSuccess}
              fill="none"
              stroke="#10b981"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow-success)"
            />
          )}

          {/* Line 3: Cancelled Orders */}
          {pathCancelled && (
            <path
              d={pathCancelled}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow-cancelled)"
            />
          )}

          {/* Dots on Hover/Normal */}
          {pointsTotal.map((p, i) => {
            const isHovered = hoveredIdx === i
            if (!isHovered) return null
            return (
              <g key={i} className="pointer-events-none">
                <circle cx={p.x} cy={p.y} r={5} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
                <circle cx={pointsSuccess[i].x} cy={pointsSuccess[i].y} r={5} fill="#10b981" stroke="#fff" strokeWidth={2} />
                <circle cx={pointsCancelled[i].x} cy={pointsCancelled[i].y} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2} />
              </g>
            )
          })}

          {/* Hover hotspots */}
          {pointsTotal.map((p, i) => (
            <rect
              key={`hotspot-${i}`}
              x={p.x - chartWidth / (2 * Math.max(data.length - 1, 1))}
              y={paddingTop}
              width={chartWidth / Math.max(data.length - 1, 1)}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StatistikAdmin({ orders, merchants, couriers }: Props) {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'all'>('all')

  // ── Filter by period ──
  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders
    const cutoff = new Date()
    if (period === 'today') cutoff.setHours(0, 0, 0, 0)
    if (period === '7d') cutoff.setDate(cutoff.getDate() - 7)
    if (period === '30d') cutoff.setDate(cutoff.getDate() - 30)
    return orders.filter((o) => new Date(o._createdAt) >= cutoff)
  }, [orders, period])

  // ── Prepare Time-series Line Chart Data ──
  const lineChartData = useMemo(() => {
    const now = new Date()
    let datesList: Date[] = []
    let isHourly = false

    if (period === 'today') {
      isHourly = true
      for (let i = 23; i >= 0; i--) {
        const d = new Date()
        d.setHours(now.getHours() - i, 0, 0, 0)
        datesList.push(d)
      }
    } else if (period === '7d') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        datesList.push(d)
      }
    } else if (period === '30d') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        datesList.push(d)
      }
    } else {
      for (let i = 14; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        datesList.push(d)
      }
    }

    const getFormatKey = (date: Date) => {
      if (isHourly) {
        return `${date.getHours().toString().padStart(2, '0')}:00`
      } else {
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      }
    }

    const dataMap: Record<string, { count: number; completed: number; cancelled: number; revenue: number }> = {}
    datesList.forEach((d) => {
      dataMap[getFormatKey(d)] = { count: 0, completed: 0, cancelled: 0, revenue: 0 }
    })

    filteredOrders.forEach((o) => {
      const oDate = new Date(o._createdAt)
      let key = ''
      if (isHourly) {
        const hour = oDate.getHours()
        key = `${hour.toString().padStart(2, '0')}:00`
      } else {
        key = oDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      }

      if (dataMap[key] !== undefined) {
        dataMap[key].count++
        if (o.status === 'completed') {
          dataMap[key].completed++
          dataMap[key].revenue += o.totalAmount || 0
        } else if (['cancelled', 'problem'].includes(o.status)) {
          dataMap[key].cancelled++
        }
      }
    })

    return Object.entries(dataMap).map(([label, val]) => {
      return {
        label,
        count: val.count,
        completed: val.completed,
        cancelled: val.cancelled,
        revenue: val.revenue
      }
    })
  }, [filteredOrders, period])

  // ── Core metrics ──
  const totalOrders = filteredOrders.length
  const completedOrders = filteredOrders.filter((o) => o.status === 'completed')
  const pendingOrders = filteredOrders.filter((o) => o.status === 'pending')
  const activeOrders = filteredOrders.filter((o) =>
    ['accepted', 'delivering', 'delivered'].includes(o.status)
  )
  const cancelledOrders = filteredOrders.filter((o) =>
    ['cancelled', 'problem'].includes(o.status)
  )

  const totalRevenue = completedOrders.reduce((a, o) => a + (o.totalAmount || 0), 0)
  const totalShipping = completedOrders.reduce((a, o) => a + (o.shippingFee || 0), 0)
  const avgOrderValue =
    completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0
  const completionRate =
    totalOrders > 0 ? Math.round((completedOrders.length / totalOrders) * 100) : 0

  // ── Top merchants by order count ──
  const merchantOrderCount: Record<string, number> = {}
  const merchantRevenue: Record<string, number> = {}
  filteredOrders.forEach((o) => {
    const name = o.restaurantName || 'Tidak diketahui'
    merchantOrderCount[name] = (merchantOrderCount[name] || 0) + 1
    if (o.status === 'completed') {
      merchantRevenue[name] = (merchantRevenue[name] || 0) + (o.totalAmount || 0)
    }
  })
  const topMerchantsByOrders = Object.entries(merchantOrderCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const maxMerchantOrders = topMerchantsByOrders[0]?.[1] || 1

  const topMerchantsByRevenue = Object.entries(merchantRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxMerchantRevenue = topMerchantsByRevenue[0]?.[1] || 1

  // ── Top couriers ──
  const courierOrderCount: Record<string, number> = {}
  filteredOrders.forEach((o) => {
    if (o.courier?.name) {
      courierOrderCount[o.courier.name] = (courierOrderCount[o.courier.name] || 0) + 1
    }
  })
  const topCouriers = Object.entries(courierOrderCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxCourierOrders = topCouriers[0]?.[1] || 1

  // ── Status donut ──
  const statusSegments = [
    { value: completedOrders.length, color: '#22c55e', label: 'Selesai' },
    { value: pendingOrders.length, color: '#eab308', label: 'Pending' },
    { value: activeOrders.length, color: '#3b82f6', label: 'Aktif' },
    { value: cancelledOrders.length, color: '#ef4444', label: 'Batal' },
  ]

  // ── Hourly activity ──
  const hourlyData = Array(24).fill(0)
  filteredOrders.forEach((o) => {
    const h = new Date(o._createdAt).getHours()
    hourlyData[h]++
  })
  const maxHourlyCount = Math.max(...hourlyData, 1)
  const peakHour = hourlyData.indexOf(Math.max(...hourlyData))
  const peakCount = Math.max(...hourlyData)

  // ── Day of week ──
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const dayData = Array(7).fill(0)
  filteredOrders.forEach((o) => {
    dayData[new Date(o._createdAt).getDay()]++
  })
  const maxDay = Math.max(...dayData, 1)

  // ── Merchant metadata ──
  const activeMerchants = merchants.filter((m) => m.isOpen)
  const verifiedMerchants = merchants.filter((m) => m.isVerified)
  const activeCouriers = couriers.filter((c) => c.isActive && c.status === 'active')

  // ── Category breakdown ──
  const categoryCount: Record<string, number> = {}
  merchants.forEach((m) => {
    const cat = m.category || 'Lainnya'
    categoryCount[cat] = (categoryCount[cat] || 0) + 1
  })
  const catColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
  const categorySegments = Object.entries(categoryCount).map(([label, value], i) => ({
    label,
    value,
    color: catColors[i % catColors.length],
  }))

  const periods: { key: typeof period; label: string }[] = [
    { key: 'today', label: 'Hari ini' },
    { key: '7d', label: '7 Hari' },
    { key: '30d', label: '30 Hari' },
    { key: 'all', label: 'Semua' },
  ]

  return (
    <div className="space-y-6 pb-4">

      {/* ── Header + Period filter ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Analitik & Statistik
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            Data real-time seluruh transaksi platform
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                period === p.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={ShoppingBag}
          label="Total Transaksi"
          value={totalOrders}
          sub={`${completedOrders.length} selesai`}
          color="#ef4444"
          trend="neutral"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Omset"
          value={formatRp(totalRevenue)}
          sub={`Avg ${formatRp(avgOrderValue)}/order`}
          color="#22c55e"
          trend="up"
        />
        <StatCard
          icon={CheckCircle}
          label="Tingkat Keberhasilan"
          value={`${completionRate}%`}
          sub={`${completedOrders.length} dari ${totalOrders} order`}
          color="#3b82f6"
          trend={completionRate >= 70 ? 'up' : completionRate >= 40 ? 'neutral' : 'down'}
        />
        <StatCard
          icon={Zap}
          label="Ongkir Terkumpul"
          value={formatRp(totalShipping)}
          sub={`Dari ${completedOrders.length} pengiriman`}
          color="#f97316"
          trend="neutral"
        />
      </div>

      {/* ── Line Chart ── */}
      <InteractiveLineChart data={lineChartData} />

      {/* ── Status Donut + Snapshot ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-red-600" />
            Komposisi Status Transaksi
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <DonutChart segments={statusSegments} size={144} thickness={30} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-black text-slate-900 leading-none">{totalOrders}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Order</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {statusSegments.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className="text-xs font-bold text-slate-600">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{s.value}</span>
                    <span className="text-[10px] font-bold text-slate-300 w-8 text-right">
                      {totalOrders > 0 ? `${Math.round((s.value / totalOrders) * 100)}%` : '0%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Snapshot Platform
          </h3>
          <div className="space-y-0">
            {[
              {
                icon: Store,
                label: 'Toko Terdaftar',
                main: merchants.length,
                badge: `${activeMerchants.length} buka`,
                badgeColor: 'bg-green-50 text-green-700',
              },
              {
                icon: Users,
                label: 'Kurir Terdaftar',
                main: couriers.length,
                badge: `${activeCouriers.length} aktif`,
                badgeColor: 'bg-blue-50 text-blue-700',
              },
              {
                icon: Clock,
                label: 'Antrian Pending',
                main: pendingOrders.length,
                badge: 'butuh aksi',
                badgeColor: pendingOrders.length > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-50 text-slate-400',
              },
              {
                icon: Truck,
                label: 'Sedang Diantar',
                main: activeOrders.length,
                badge: 'on delivery',
                badgeColor: 'bg-blue-50 text-blue-700',
              },
              {
                icon: Award,
                label: 'Toko Terverifikasi',
                main: verifiedMerchants.length,
                badge: `dari ${merchants.length}`,
                badgeColor: 'bg-emerald-50 text-emerald-700',
              },
            ].map((row, i, arr) => {
              const Icon = row.icon
              return (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{row.main}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${row.badgeColor}`}>
                      {row.badge}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Top Merchants by Order Count ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          Toko dengan Pesanan Terbanyak
        </h3>
        {topMerchantsByOrders.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold text-center py-6">Belum ada data pesanan.</p>
        ) : (
          <div className="space-y-4">
            {topMerchantsByOrders.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span
                  className={`text-xs font-black w-5 text-center flex-shrink-0 ${
                    i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-slate-300'
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <BarRow
                    label={name}
                    value={count}
                    max={maxMerchantOrders}
                    color={i === 0 ? '#eab308' : i === 1 ? '#94a3b8' : '#f97316'}
                    suffix=" order"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Revenue by Merchant + Top Couriers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Toko dengan Omset Tertinggi
          </h3>
          {topMerchantsByRevenue.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold text-center py-6">
              Belum ada transaksi selesai.
            </p>
          ) : (
            <div className="space-y-4">
              {topMerchantsByRevenue.map(([name, rev]) => (
                <BarRow
                  key={name}
                  label={name}
                  value={rev}
                  max={maxMerchantRevenue}
                  color="#22c55e"
                  suffix="Rp"
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            Kurir Paling Produktif
          </h3>
          {topCouriers.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold text-center py-6">
              Belum ada kurir yang bekerja.
            </p>
          ) : (
            <div className="space-y-4">
              {topCouriers.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                      i === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : i === 1
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-orange-50 text-orange-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <BarRow
                      label={name}
                      value={count}
                      max={maxCourierOrders}
                      color="#3b82f6"
                      suffix=" antar"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Activity per Hour ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-600" />
              Pola Aktivitas per Jam (24 Jam)
            </h3>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              {peakCount > 0
                ? `Jam tersibuk: ${peakHour.toString().padStart(2, '0')}:00 – ${(peakHour + 1)
                    .toString()
                    .padStart(2, '0')}:00 (${peakCount} order)`
                : 'Belum ada aktivitas dalam periode ini'}
            </p>
          </div>
          {peakCount > 0 && (
            <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-1 rounded-lg">
              Peak {peakHour.toString().padStart(2,'0')}:00
            </span>
          )}
        </div>

        {/* 24 bar chart */}
        <div className="flex items-end h-16 gap-px">
          {hourlyData.map((count, h) => {
            const pct = count / maxHourlyCount
            const isPeak = h === peakHour && peakCount > 0
            return (
              <div
                key={h}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                <div
                  className="w-full rounded-t transition-all duration-700"
                  style={{
                    height: `${Math.max(pct * 100, count > 0 ? 10 : 2)}%`,
                    background: isPeak ? '#ef4444' : count > 0 ? '#fca5a5' : '#f1f5f9',
                    minHeight: 2,
                  }}
                />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {h}:00 · {count}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2 px-0">
          <span className="text-[9px] font-bold text-slate-300">00:00</span>
          <span className="text-[9px] font-bold text-slate-300">06:00</span>
          <span className="text-[9px] font-bold text-slate-300">12:00</span>
          <span className="text-[9px] font-bold text-slate-300">18:00</span>
          <span className="text-[9px] font-bold text-slate-300">23:00</span>
        </div>
      </div>

      {/* ── Day of Week + Category Donut ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Distribusi per Hari dalam Seminggu
          </h3>
          <div className="flex items-end gap-2 h-24">
            {dayData.map((count, d) => {
              const pct = count / maxDay
              const isBusiest = count === Math.max(...dayData) && count > 0
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-black text-slate-400">{count > 0 ? count : ''}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: 64 }}>
                    <div
                      className="w-full rounded-lg transition-all duration-700"
                      style={{
                        height: `${Math.max(pct * 100, count > 0 ? 10 : 4)}%`,
                        background: isBusiest ? '#8b5cf6' : count > 0 ? '#c4b5fd' : '#f1f5f9',
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{dayNames[d]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-500" />
            Kategori Toko Mitra
          </h3>
          {categorySegments.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold text-center py-6">Belum ada data toko.</p>
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <DonutChart segments={categorySegments} size={120} thickness={24} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-lg font-black text-slate-900 leading-none">{merchants.length}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Toko</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {categorySegments.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: s.color }}
                      />
                      <span className="text-[11px] font-bold text-slate-600 truncate max-w-[100px]">
                        {s.label}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Financial Summary ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Ringkasan Nilai Keuangan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Omset (Selesai)',
              value: formatRpFull(totalRevenue),
              bg: 'bg-emerald-50',
              text: 'text-emerald-700',
            },
            {
              label: 'Total Ongkir Diterima',
              value: formatRpFull(totalShipping),
              bg: 'bg-orange-50',
              text: 'text-orange-700',
            },
            {
              label: 'Rata-rata Nilai Order',
              value: formatRpFull(avgOrderValue),
              bg: 'bg-blue-50',
              text: 'text-blue-700',
            },
            {
              label: 'Potensi (Pending+Aktif)',
              value: formatRpFull(
                [...pendingOrders, ...activeOrders].reduce((a, o) => a + (o.totalAmount || 0), 0)
              ),
              bg: 'bg-yellow-50',
              text: 'text-yellow-700',
            },
          ].map((card) => (
            <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
              <p className={`text-[11px] font-black ${card.text} mb-1.5`}>{card.label}</p>
              <p className="text-sm font-black text-slate-900 leading-tight">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
