import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { motion } from 'motion/react';

export function SensitivityCard({
  title,
  icon,
  data,
  fullWidth = false,
  isAdmin = false,
  onUpdate,
}: {
  title: string;
  icon: React.ReactNode;
  data: any;
  fullWidth?: boolean;
  isAdmin?: boolean;
  onUpdate?: (field: string, val: number) => void;
}) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const items = [
    { key: "noScope", label: "بدون منظار", value: data.noScope },
    { key: "redDot", label: "نقطة الاستهداف", value: data.redDot },
    { key: "scope2x", label: "منظار 2x", value: data.scope2x },
    { key: "scope3x", label: "منظار 3x", value: data.scope3x },
    { key: "scope4x", label: "منظار 4x", value: data.scope4x },
    { key: "scope6x", label: "منظار 6x", value: data.scope6x },
    { key: "scope8x", label: "منظار 8x", value: data.scope8x },
  ];

  const handleSave = (key: string, val: number | string) => {
    let parsedVal = typeof val === 'string' ? parseInt(val) : val;
    if (isNaN(parsedVal)) parsedVal = 0;
    if (parsedVal > 400) parsedVal = 400;
    if (parsedVal < 1) parsedVal = 1;
    
    if (onUpdate) {
      onUpdate(key, parsedVal);
    }
  };

  return (
    <div className="p-6 pro-card group">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      <div
        className={`grid ${
          fullWidth
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            : "grid-cols-1 md:grid-cols-2 gap-6"
        }`}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-xl group/item"
          >
            <div className="flex justify-between items-center px-1">
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {item.label}
              </span>
              
              {editingField === item.key ? (
                 <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                     handleSave(item.key, editValue);
                     setEditingField(null);
                  }}
                  className="w-16 bg-black/40 border border-primary/30 rounded px-1 text-center text-primary font-bold outline-none text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSave(item.key, editValue);
                        setEditingField(null);
                    }
                    if (e.key === "Escape") setEditingField(null);
                  }}
                />
              ) : (
                <div 
                   className={`flex items-center gap-1 ${isAdmin ? 'cursor-pointer hover:bg-white/5 rounded px-2' : ''}`}
                   onClick={() => {
                      if (isAdmin) {
                          setEditValue(item.value.toString());
                          setEditingField(item.key);
                      }
                   }}
                >
                  <span className="text-sm font-bold text-primary">
                    {item.value}%
                  </span>
                  {isAdmin && (
                    <Pencil size={10} className="text-slate-500 opacity-0 group-hover/item:opacity-100 transition-all" />
                  )}
                </div>
              )}
            </div>

            <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 group-hover/item:border-white/10 transition-colors">
               <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Math.min(item.value, 400) / 400) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute top-0 bottom-0 left-0 ${isAdmin ? 'bg-gradient-to-r from-primary/80 to-primary' : 'bg-primary/50'} shadow-[0_0_10px_rgba(255,184,0,0.2)]`}
              />
              {isAdmin && (
                <input
                  type="range"
                  min="1"
                  max="400"
                  value={item.value}
                  onChange={(e) => handleSave(item.key, parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
