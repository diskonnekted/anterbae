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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-2 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isMain = item.name === 'Pesan';
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all relative ${
                isMain
                  ? 'bg-red-600 text-white -mt-4 px-5 py-3 shadow-xl shadow-red-300'
                  : isActive
                  ? 'text-red-600'
                  : 'text-slate-400'
              }`}
            >
              <item.icon className={`${isMain ? 'w-6 h-6' : 'w-5 h-5'}`} />
              {item.name === 'Cart' && totalItems > 0 && (
                <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className={`font-black uppercase tracking-widest ${isMain ? 'text-[9px]' : 'text-[9px]'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
