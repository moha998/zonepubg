import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, Upload, Crosshair, Settings2, Users, Trophy } from 'lucide-react';
import { Weapon, Attachment, Character, Device } from '../types';

interface ContentEditorModalProps {
  isOpen: boolean;
  type: 'weapon' | 'attachment' | 'character' | 'player' | null;
  data: any;
  setData: (data: any) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  isOpen,
  type,
  data,
  setData,
  onSave,
  onClose,
  isSaving
}) => {
  if (!isOpen || !type) return null;

  const renderFields = () => {
    switch (type) {
      case 'weapon':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">اسم السلاح (عربي)</label>
                <input
                  type="text"
                  value={data.nameAr || ''}
                  onChange={(e) => setData({ ...data, nameAr: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  placeholder="مثال: M416"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">اسم السلاح (انجليزي)</label>
                <input
                  type="text"
                  value={data.nameEn || ''}
                  onChange={(e) => setData({ ...data, nameEn: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  placeholder="M416"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">نوع السلاح</label>
              <select
                value={data.type || 'AR'}
                onChange={(e) => setData({ ...data, type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary appearance-none"
              >
                <option value="AR">Assault Rifle (AR)</option>
                <option value="Sniper">Sniper Rifle</option>
                <option value="DMR">DMR</option>
                <option value="SMG">SMG</option>
                <option value="LMG">LMG</option>
                <option value="Shotgun">Shotgun</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الضرر</label>
                <input
                  type="number"
                  value={data.damage || 0}
                  onChange={(e) => setData({ ...data, damage: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الارتداد</label>
                <input
                  type="number"
                  value={data.recoil || 0}
                  onChange={(e) => setData({ ...data, recoil: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
            </div>
          </>
        );
      case 'attachment':
        return (
           <>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">اسم المرفق</label>
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">النوع</label>
              <select
                value={data.type || 'muzzle'}
                onChange={(e) => setData({ ...data, type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary appearance-none"
              >
                <option value="muzzle">Muzzle</option>
                <option value="grip">Grip</option>
                <option value="magazine">Magazine</option>
                <option value="stock">Stock</option>
                <option value="scope">Scope</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">التأثير</label>
              <input
                type="text"
                value={data.effect || ''}
                onChange={(e) => setData({ ...data, effect: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="مثال: يقلل الارتداد الأفقي"
              />
            </div>
           </>
        );
      case 'character':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الاسم العربي</label>
                <input
                  type="text"
                  value={data.arabicName || ''}
                  onChange={(e) => setData({ ...data, arabicName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الاسم الانجليزي</label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الميزة الأساسية</label>
              <input
                type="text"
                value={data.ability || ''}
                onChange={(e) => setData({ ...data, ability: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الوصف</label>
              <textarea
                value={data.description || ''}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none h-24"
              />
            </div>
          </>
        );
      case 'player':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">اسم اللاعب</label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الدولة</label>
                <input
                  type="text"
                  value={data.country || ''}
                  onChange={(e) => setData({ ...data, country: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">كود الحساسية</label>
              <input
                type="text"
                value={data.code || ''}
                onChange={(e) => setData({ ...data, code: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الجهاز</label>
              <input
                type="text"
                value={data.brand || ''}
                onChange={(e) => setData({ ...data, brand: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="مثال: iPhone 15 Pro Max"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'weapon': return 'إضافة/تعديل سلاح';
      case 'attachment': return 'إضافة/تعديل مرفق';
      case 'character': return 'إضافة/تعديل شخصية';
      case 'player': return 'إضافة/تعديل لاعب محترف';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white">{getTitle()}</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="group relative">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">رابط الصورة (او وصف للذكاء الاصطناعي)</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={data.image || ''}
                    onChange={(e) => setData({ ...data, image: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-xs"
                    placeholder="رابط الصورة او pollinations prompt"
                  />
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {data.image ? (
                      <img src={data.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Upload size={18} className="text-slate-600" />
                    )}
                  </div>
                </div>
              </div>

              {renderFields()}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  حفظ البيانات
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContentEditorModal;
