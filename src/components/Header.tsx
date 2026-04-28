import React from 'react';
import { Search, Moon, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold text-white uppercase tracking-tighter">PUBG <span className="text-yellow-500">ZONE</span></div>
        <nav className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="#" className="text-yellow-500">الرئيسية</a>
          <a href="#" className="hover:text-white">الأسلحة</a>
          <a href="#" className="hover:text-white">الحساسية</a>
          <a href="#" className="hover:text-white">التحديثات</a>
          <a href="#" className="hover:text-white">الأخبار</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Search className="text-gray-400 cursor-pointer" size={20} />
        <Moon className="text-gray-400 cursor-pointer" size={20} />
        <button className="px-4 py-2 text-sm font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
          تسجيل الدخول
        </button>
      </div>
    </header>
  );
}
