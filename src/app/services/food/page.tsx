'use client'

import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, Star, Clock, Search } from 'lucide-react'

const restaurants = [
  {
    id: 1,
    name: 'Warung Nasi Bu Sri',
    cuisine: 'Nasi, Mie, Bakso',
    rating: 4.8,
    distance: '0.5 km',
    eta: '20 menit',
    image: '🍛',
    priceRange: 'Rp 10.000 - 25.000',
  },
  {
    id: 2,
    name: 'Soto Pak Ahmad',
    cuisine: 'Soto, Ayam, Sayur',
    rating: 4.9,
    distance: '1.2 km',
    eta: '25 menit',
    image: '🍲',
    priceRange: 'Rp 12.000 - 30.000',
  },
  {
    id: 3,
    name: 'Warung Tegal Mbak Dwi',
    cuisine: 'Nasi Pecel, Gado-gado',
    rating: 4.7,
    distance: '0.8 km',
    eta: '20 menit',
    image: '🥗',
    priceRange: 'Rp 8.000 - 20.000',
  },
  {
    id: 4,
    name: 'Bakso Jantur Banjarnegara',
    cuisine: 'Bakso, Bakso Goreng',
    rating: 4.9,
    distance: '2.0 km',
    eta: '30 menit',
    image: '🍜',
    priceRange: 'Rp 15.000 - 35.000',
  },
  {
    id: 5,
    name: 'Restoran Padang Sederhana',
    cuisine: 'Nasi Padang, Rendang',
    rating: 4.6,
    distance: '1.5 km',
    eta: '30 menit',
    image: '🍛',
    priceRange: 'Rp 15.000 - 40.000',
  },
  {
    id: 6,
    name: 'Martabak Madu Banjarnegara',
    cuisine: 'Martabak Manis, Telor',
    rating: 4.8,
    distance: '0.3 km',
    eta: '25 menit',
    image: '🥞',
    priceRange: 'Rp 15.000 - 50.000',
  },
  {
    id: 7,
    name: 'Ayam Geprek Sambal Bawang',
    cuisine: 'Ayam Geprek, Nasi',
    rating: 4.7,
    distance: '0.7 km',
    eta: '20 menit',
    image: '🍗',
    priceRange: 'Rp 12.000 - 25.000',
  },
  {
    id: 8,
    name: 'Es Teh & Kue Mbak Yuni',
    cuisine: 'Es Teh, Kue, Snack',
    rating: 4.5,
    distance: '0.4 km',
    eta: '15 menit',
    image: '🧋',
    priceRange: 'Rp 5.000 - 15.000',
  },
]

export default function FoodPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/services" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-gray-900">Pesan Antar Makanan</h1>
            <p className="text-xs text-gray-400 font-medium">{restaurants.length} restoran tersedia</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari restoran atau makanan"
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
            />
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="px-4 py-4 space-y-3">
        {restaurants.map((rest) => (
          <a
            key={rest.id}
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all active:scale-[0.98]"
          >
            {/* Restaurant image area */}
            <div className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-6xl relative">
              {rest.image}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black text-gray-700">{rest.rating}</span>
              </div>
            </div>

            {/* Restaurant info */}
            <div className="p-4">
              <h3 className="font-black text-gray-900 text-base mb-1">{rest.name}</h3>
              <p className="text-xs text-gray-500 font-medium mb-3">{rest.cuisine}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {rest.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {rest.eta}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-600">{rest.priceRange}</span>
                <span className="flex items-center gap-1 text-xs font-black text-orange-600">
                  Pesan via WA
                  <Phone className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
