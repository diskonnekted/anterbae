const fs = require('fs');
let code = fs.readFileSync('i:/anterbae/src/app/page.tsx', 'utf8');

// Imports
code = code.replace(
  'import { Truck, Package, ShoppingBag, MapPin, Clock, Shield, Phone, Star, ChevronRight, Zap } from "lucide-react";',
  'import { Truck, Package, ShoppingBag, MapPin, Clock, Shield, Phone, Star, ChevronRight, Zap, Utensils, Check, MessageSquare, Bike, CheckCircle, Coins, Store, Megaphone, ArrowRight, Handshake, ShoppingCart } from "lucide-react";'
);

// Layanan Unggulan Icons
code = code.replace('<div className="text-5xl mb-4">🍔</div>', '<Utensils className="w-12 h-12 text-slate-800 mb-4" />');
code = code.replace('<div className="text-5xl mb-4">📦</div>', '<Package className="w-12 h-12 text-slate-800 mb-4" />');
code = code.replace('<div className="text-5xl mb-4">🛒</div>', '<ShoppingCart className="w-12 h-12 text-slate-800 mb-4" />');

// Lists checkmarks
code = code.replace(/<span className="text-green-500">✓<\/span>/g, '<Check className="w-4 h-4 text-green-500 inline-block" />');
code = code.replace(/<span className="text-green-400">✓<\/span>/g, '<Check className="w-4 h-4 text-green-400 inline-block" />');

// Star
code = code.replace('⭐ Terpopuler', '<Star className="w-3 h-3 inline-block -mt-0.5 mr-1" /> Terpopuler');

// Cara Pesan Icons
code = code.replace(/icon: '📱'/g, "icon: <MessageSquare className='w-8 h-8' />");
code = code.replace(/icon: '🛵'/g, "icon: <Bike className='w-8 h-8' />");
code = code.replace(/icon: '✅'/g, "icon: <CheckCircle className='w-8 h-8' />");

// Shopping bag
code = code.replace('<span className="text-2xl">🛍️</span>', '<ShoppingBag className="w-6 h-6 text-slate-400" />');

// Merchant
code = code.replace('🏪 Merchant Terdaftar', '<Store className="w-4 h-4 inline-block mr-1" /> Merchant Terdaftar');
code = code.replace('<div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>', '<div className="w-full h-full flex items-center justify-center text-slate-400"><Store className="w-6 h-6" /></div>');
code = code.replace('Lihat Semua →', 'Lihat Semua <ArrowRight className="w-4 h-4 inline-block ml-1" />');

// Keunggulan
code = code.replace(/icon: '⚡'/g, "icon: <Zap className='w-10 h-10' />");
code = code.replace(/icon: '🛡️'/g, "icon: <Shield className='w-10 h-10' />");
code = code.replace(/icon: '💰'/g, "icon: <Coins className='w-10 h-10' />");
code = code.replace(/icon: '📍'/g, "icon: <MapPin className='w-10 h-10' />");

// Kurir
code = code.replace('<div className="w-full h-full flex items-center justify-center text-lg">🛵</div>', '<div className="w-full h-full flex items-center justify-center text-slate-400"><Bike className="w-5 h-5" /></div>');
code = code.replace('<div className="text-6xl mb-6">🛵</div>', '<Bike className="w-16 h-16 text-slate-800 mx-auto md:mx-0 mb-6" />');

// Join as Courier CTA
code = code.replace('Daftar Jadi Kurir →', 'Daftar Jadi Kurir <ArrowRight className="w-5 h-5 inline-block ml-1" />');
code = code.replace(/icon: '💰'/g, "icon: <Coins className='w-6 h-6 text-yellow-400' />");
code = code.replace(/icon: '⏰'/g, "icon: <Clock className='w-6 h-6 text-blue-400' />");
code = code.replace(/icon: '🤝'/g, "icon: <Handshake className='w-6 h-6 text-green-400' />");

// Articles
code = code.replace('Info & Promo Terbaru 📢', 'Info & Promo Terbaru <Megaphone className="w-6 h-6 inline-block ml-2 text-slate-800" />');

fs.writeFileSync('i:/anterbae/src/app/page.tsx', code);
console.log('Replaced emojis successfully!');
