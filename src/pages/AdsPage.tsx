import React from 'react';
import { motion } from 'motion/react';
import { Ad } from '../types';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface AdsPageProps {
  ads: Ad[];
  getIcon: (name: string) => React.ReactNode;
  isAdmin: boolean;
  onToggleVisibility: (collectionName: string, id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdsPage({ ads, getIcon, isAdmin, onToggleVisibility, onDelete }: AdsPageProps) {
  const [isAdModalOpen, setIsAdModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">المجتمع والإعلانات</h2>
        {isAdmin && (
          <button 
             onClick={() => {
               window.location.href = "/#manage-ads";
             }}
             className="px-4 py-2 bg-primary text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
          >
             إضافة إعلان جديد
          </button>
        )}
      </div>
      
      {(!ads || ads.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <p>لا توجد إعلانات حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad, index) => (
            <div key={ad.id} className="relative group">
              <motion.a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`pro-card flex flex-col items-center text-center p-8 border-white/5 hover:border-primary/50 transition-colors h-full ${ad.isHidden ? 'opacity-60 bg-red-500/5' : ''}`}
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
              {isAdmin && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleVisibility("ads", ad.id, ad.isHidden || false);
                    }}
                    className={`p-2 rounded-lg transition-all border ${ad.isHidden ? 'bg-red-500 text-white border-red-500' : 'bg-black/40 text-primary border-primary/20 hover:border-primary hover:bg-primary hover:text-black'}`}
                    title={ad.isHidden ? "إظهار" : "إخفاء"}
                  >
                    {ad.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(ad.id);
                    }}
                    className="p-2 rounded-lg bg-black/40 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
