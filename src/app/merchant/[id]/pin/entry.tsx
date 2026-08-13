'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'

interface PinEntryProps {
  merchantId: string
  hasPin: boolean
}

export default function PinEntry({ merchantId, hasPin }: PinEntryProps) {
  const router = useRouter()
  const [pin, setPin] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPin, setShowPin] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter' && pin.every(d => d !== '')) {
      handleVerify()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const newPin = [...pin]
    for (let i = 0; i < 4; i++) {
      newPin[i] = pasted[i] || ''
    }
    setPin(newPin)
    const focusIndex = Math.min(pasted.length, 3)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async () => {
    const pinValue = pin.join('')
    if (pinValue.length !== 4) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/merchant-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, pin: pinValue }),
      })
      const data = await res.json()

      if (data.success) {
        router.push(`/merchant/${merchantId}`)
        router.refresh()
      } else {
        setError(data.error || 'PIN salah')
        setPin(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-600 mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">
          {hasPin ? 'Masukkan PIN' : 'Masuk ke Dashboard'}
        </h2>
        <p className="text-sm text-slate-400 font-medium mt-1">
          {hasPin ? 'PIN 4 digit yang diberikan admin' : 'Akses langsung tanpa PIN'}
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el }}
            type={showPin ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-2xl font-black border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all bg-slate-50 text-slate-900"
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Show/hide PIN toggle */}
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
      )}

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={pin.some(d => d === '') || loading}
        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-black py-3.5 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-red-600/25"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Memeriksa...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Masuk
          </>
        )}
      </button>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => {
              const firstEmpty = pin.findIndex(d => d === '')
              if (firstEmpty !== -1) {
                const newPin = [...pin]
                newPin[firstEmpty] = num.toString()
                setPin(newPin)
                if (firstEmpty < 3) {
                  setTimeout(() => inputRefs.current[firstEmpty + 1]?.focus(), 10)
                }
              }
            }}
            className="h-12 rounded-xl text-lg font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => {
            const lastFilled = pin.findLastIndex(d => d !== '')
            if (lastFilled !== -1) {
              const newPin = [...pin]
              newPin[lastFilled] = ''
              setPin(newPin)
              setTimeout(() => inputRefs.current[lastFilled]?.focus(), 10)
            }
          }}
          className="h-12 rounded-xl text-lg font-black text-slate-400 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
        >
          ⌫
        </button>
        <button
          onClick={() => {
            const newPin = [...pin]
            const firstEmpty = newPin.findIndex(d => d === '')
            if (firstEmpty !== -1) {
              newPin[firstEmpty] = '0'
              setPin(newPin)
              if (firstEmpty < 3) {
                setTimeout(() => inputRefs.current[firstEmpty + 1]?.focus(), 10)
              }
            }
          }}
          className="h-12 rounded-xl text-lg font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleVerify}
          disabled={pin.some(d => d === '') || loading}
          className="h-12 rounded-xl bg-red-600 text-white font-black hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          ✓
        </button>
      </div>
    </div>
  )
}
