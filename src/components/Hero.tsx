import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[450px] flex items-center overflow-hidden rounded-b-3xl">
      <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" alt="PUBG Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#0f1014] via-[#0f1014]/90 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-end">
        <div className="max-w-xl text-right flex flex-col items-end gap-6">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
            كل ما يخص ببجي
            <br />
            <span className="text-yellow-500">في مكان واحد</span>
          </h1>
          <p className="text-lg text-gray-300 font-medium leading-relaxed max-w-md">
            أخبار ببجي، التحديثات، أكواد الحساسية، إعدادات اللاعبين، مقارنة الأسلحة، الفعاليات واللقطات في منصة واحدة.
          </p>
          <div className="flex gap-4 mt-2">
            <button className="flex items-center gap-2 px-6 py-3 font-bold text-gray-300 bg-[#1f2129] border border-gray-700/50 rounded-md hover:bg-gray-800 transition">
              أكواد الحساسية
            </button>
            <button className="flex items-center gap-2 px-6 py-3 font-bold text-black bg-yellow-500 rounded-md hover:bg-yellow-400 transition">
              <ChevronLeft size={20} />
              استعرض الأخبار
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

