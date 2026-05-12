import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, Scale, Clock } from 'lucide-react';

const TermsPage = () => {
  const sections = [
    {
      title: "1. قبول الشروط",
      icon: <CheckCircle className="text-primary" size={24} />,
      content: "باستخدامك لموقع ZONEPUBG، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا لم تكن موافقاً، يرجى التوقف عن استخدام الموقع."
    },
    {
      title: "2. حقوق الملكية الفكرية",
      icon: <Scale className="text-primary" size={24} />,
      content: "العلامات التجارية والأسماء المتعلقة بـ PUBG Mobile هي ملك لشركة Tencent و Krafton. نحن منصة تعليمية وإخبارية مستقلة تقدم تحليلات وإعدادات لدعم مجتمع اللاعبين."
    },
    {
      title: "3. استخدام المحتوى",
      icon: <FileText className="text-primary" size={24} />,
      content: "يسمح باستخدام المعلومات المتاحة على الموقع للأغراض الشخصية فقط. يمنع نسخ أو إعادة نشر المحتوى لأغراض تجارية دون إذن كتابي مسبق."
    },
    {
      title: "4. السلوك العام",
      icon: <ShieldCheck className="text-primary" size={24} />,
      content: "نحن نشجع النقاش البناء والروح الرياضية. سيتم حظر أي مستخدم يقوم بنشر روابط خبيثة، أو استخدام لغة بذيئة، أو الترويج للغش في اللعبة."
    }
  ];

  return (
    <div className="space-y-12">
      <div className="pro-card p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Scale size={180} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Scale size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">شروط الاستخدام</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
            يرجى قراءة شروط الخدمة بعناية لضمان أفضل تجربة لك ولأعضاء مجتمع ZONEPUBG. نحن نسعى لتوفير بيئة آمنة واحترافية لجميع اللاعبين.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Clock size={14} />
            <span>آخر تحديث: 11 مايو 2026</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="pro-card p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
          >
            <div className="flex items-start gap-5">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                {section.icon}
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-white tracking-tight">{section.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pro-card p-10 bg-primary/5 border-primary/20 text-center space-y-6">
        <h2 className="text-2xl font-black">هل لديك استفسار؟</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          إذا كان لديك أي سؤال بخصوص شروط الاستخدام أو واجهت مشكلة تقنية، لا تتردد في التواصل معنا عبر بريد الدعم الفني.
        </p>
        <button className="px-8 py-3 bg-primary text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
          تواصل مع الدعم
        </button>
      </div>
    </div>
  );
};

const CheckCircle = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default TermsPage;
