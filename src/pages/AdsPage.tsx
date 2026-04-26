import React from 'react';
import { motion } from 'motion/react';
import { Ad } from '../types';

export default function AdsPage({ ads, getIcon }: { ads: Ad[], getIcon: (name: string) => React.ReactNode }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
        <p>لا توجد إعلانات حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.map((ad, index) => (
        <motion.a
          key={ad.id}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="pro-card group flex flex-col items-center text-center p-8 border-white/5 hover:border-primary/50 transition-colors"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all">
            {getIcon(ad.icon)}
          </div>
          <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">{ad.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">{ad.description}</p>
          <div className="mt-auto inline-flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-black transition-colors">
            استكشف المزيد
          </div>
        </motion.a>
      ))}
    </div>
  );
}
