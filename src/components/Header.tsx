import React from 'react';
import { Search, Moon, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
            <Shield className="text-yellow-500" size={20} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-[28px] flex items-center px-1.5 border-[2.5px] border-yellow-500 bg-yellow-500/10 text-yellow-500 text-[16px] font-[900] tracking-tighter rounded-sm">
                PUBG
              </div>
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-yellow-500"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-yellow-500"></div>
            </div>
            <span className="text-white text-[18px] font-[800] tracking-tight">ZONE</span>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="#" className="text-yellow-500">الرئيسية</a>
          <a href="#" className="hover:text-white transition-colors">الأسلحة</a>
          <a href="#" className="hover:text-white transition-colors">الحساسية</a>
          <a href="#" className="hover:text-white transition-colors">التحديثات</a>
          <a href="#" className="hover:text-white transition-colors">الأخبار</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-800/50 rounded-full px-3 py-1.5 border border-gray-700">
          <Search className="text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="بحث..." 
            className="bg-transparent border-none outline-none text-xs text-white px-2 w-32 focus:w-48 transition-all"
            dir="rtl"
          />
        </div>
        <Moon className="text-gray-400 cursor-pointer hover:text-white transition-colors" size={20} />
        <button className="px-5 py-2 text-sm font-bold text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 shadow-[0_4px_14px_rgba(234,179,8,0.3)] transition-all">
          تسجيل الدخول
        </button>
      </div>
    </header>
  );
}
