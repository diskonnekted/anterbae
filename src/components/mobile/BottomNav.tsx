'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, MapPin, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on studio and kurir portal (they have their own UI)
  if (pathname.startsWith('/studio') || pathname.startsWith('/kurir')) return null;

  const { totalItems } = useCart();

  const navItems = [
    { name: 'Beranda', icon: Home, href: '/' },
    { name: 'Pesan', icon: Truck, href: '/pesan' },
    { name: 'Lacak', icon: MapPin, href: '/track' },
    { name: 'Mitra', icon: Package, href: '/mitra' },
    { name: 'Cart', icon: ShoppingCart, href: '/cart' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-2 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]" aria-label="Navigasi utama">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name === 'Cart' ? `Keranjang belanja (${totalItems} item)` : item.name}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name === 'Cart' && totalItems > 0 && (
                <span className="absolute top-0 right-1 bg-orange-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm" aria-hidden="true">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="font-black uppercase tracking-widest text-[9px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
