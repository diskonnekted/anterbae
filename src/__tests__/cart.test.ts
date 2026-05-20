import { describe, it, expect, beforeEach } from 'vitest'

// Mock storage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Shopping Cart Logic', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should calculate total correctly with shipping fee', () => {
    const items = [
      { id: '1', price: 10000, quantity: 2 },
      { id: '2', price: 20000, quantity: 1 }
    ]
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingFee = 5000
    const grandTotal = subtotal + shippingFee

    expect(subtotal).toBe(40000)
    expect(grandTotal).toBe(45000)
  })

  it('should format currency correctly for IDR', () => {
    const price = 1500000
    const formatted = price.toLocaleString('id-ID')
    expect(formatted).toContain('1.500.000')
  })
})
