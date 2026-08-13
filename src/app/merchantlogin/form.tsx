'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Shield, Search } from 'lucide-react'

export default function MerchantLoginForm() {
  const router = useRouter()
  const [merchantCode, setMerchantCode] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [merchantName, setMerchantName] = useState('')

  const pinValue = pin.join('')

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      const inputs = document.querySelectorAll('#pin-input')
      ;(inputs[index + 1] as HTMLInputElement)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const inputs = document.querySelectorAll('#pin-input')
      ;(inputs[index - 1] as HTMLInputElement)?.focus()
    }
    if (e.key === 'Enter' && pinValue.length === 4 && merchantCode.trim()) {
      handleLogin()
    }
  }

  const handleVerifyCode = async () => {
    if (!merchantCode.trim()) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/merchant-auth-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantCode: merchantCode.trim().toUpperCase() }),
      })
      const data = await res.json()

      if (data.merchant) {
        setMerchantName(data.merchant.name)
      } else {
        setMerchantName('')
        setError(data.error || 'Kode merchant tidak ditemukan')
      }
    } catch {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!merchantCode.trim() || pinValue.length !== 4) {
      setError('Lengkapi kode merchant dan PIN')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/merchant-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantCode: merchantCode.trim().toUpperCase(), pin: pinValue }),
      })
      const data = await res.json()

      if (data.success) {
        router.push(`/merchant/${data.merchant._id}`)
        router.refresh()
      } else {
        setError(data.error || 'PIN salah')
        setPin(['', '', '', ''])
        const inputs = document.querySelectorAll('#pin-input')
        ;(inputs[0] as HTMLInputElement)?.focus()
      }
    } catch {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
      {/* Merchant Code Input */}
      <div className="mb-6">
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
          Kode Merchant
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={merchantCode}
            onChange={e => {
              setMerchantCode(e.target.value.toUpperCase())
              setMerchantName('')
              setError('')
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleVerifyCode()
            }}
            placeholder="Masukkan kode merchant (4-6 karakter)"
            maxLength={6}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase tracking-widest"
          />
          <button
            onClick={handleVerifyCode}
            disabled={loading || merchantCode.length < 4}
            className="px-4 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 text-sm"
            title="Cek kode"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        {merchantName && (
          <p className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            Ditemukan: {merchantName}
          </p>
        )}
      </div>

      {/* PIN Input */}
      <div className="mb-6">
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          PIN (4 digit)
        </label>
        <div className="flex justify-center gap-3" id="pin-container">
          {pin.map((digit, index) => (
            <input
              key={index}
              id="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-black border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all bg-slate-50 text-slate-900"
              autoFocus={index === 0 && !merchantName}
            />
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
      )}

      {/* Login button */}
      <button
        onClick={handleLogin}
        disabled={(pinValue.length !== 4 || merchantCode.length < 4) || loading}
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
            Masuk ke Dashboard
          </>
        )}
      </button>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => {
              const inputs = document.querySelectorAll('#pin-input')
              const firstEmpty = pin.findIndex(d => d === '')
              if (firstEmpty !== -1) {
                const newPin = [...pin]
                newPin[firstEmpty] = num.toString()
                setPin(newPin)
                if (firstEmpty < 3) {
                  setTimeout(() => {
                    const nextInputs = document.querySelectorAll('#pin-input')
                    ;(nextInputs[firstEmpty + 1] as HTMLInputElement)?.focus()
                  }, 10)
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
            const inputs = document.querySelectorAll('#pin-input')
            const lastFilled = pin.findLastIndex(d => d !== '')
            if (lastFilled !== -1) {
              const newPin = [...pin]
              newPin[lastFilled] = ''
              setPin(newPin)
              setTimeout(() => {
                const prevInputs = document.querySelectorAll('#pin-input')
                ;(prevInputs[lastFilled] as HTMLInputElement)?.focus()
              }, 10)
            }
          }}
          className="h-12 rounded-xl text-lg font-black text-slate-400 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
        >
          ⌫
        </button>
        <button
          onClick={() => {
            const inputs = document.querySelectorAll('#pin-input')
            const firstEmpty = pin.findIndex(d => d === '')
            if (firstEmpty !== -1) {
              const newPin = [...pin]
              newPin[firstEmpty] = '0'
              setPin(newPin)
              if (firstEmpty < 3) {
                setTimeout(() => {
                  const nextInputs = document.querySelectorAll('#pin-input')
                  ;(nextInputs[firstEmpty + 1] as HTMLInputElement)?.focus()
                }, 10)
              }
            }
          }}
          className="h-12 rounded-xl text-lg font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleLogin}
          disabled={pinValue.length !== 4 || merchantCode.length < 4 || loading}
          className="h-12 rounded-xl bg-red-600 text-white font-black hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          ✓
        </button>
      </div>
    </div>
  )
}
