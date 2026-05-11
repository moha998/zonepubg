import React from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, Lock, Globe, Clock, CheckCircle2 } from 'lucide-react';

const PrivacyPage = () => {
  const policies = [
    {
      title: "1. البيانات التي نجمعها",
      icon: <Eye className="text-primary" size={24} />,
      content: "نقوم بجمع البيانات الأساسية فقط مثل البريد الإلكتروني وصورة الملف الشخصي عند تسجيل الدخول عبر Google. هذا يساعدنا على تخصيص تجربتك وحفظ إعدادات الحساسية الخاصة بك."
    },
    {
      title: "2. كيف نستخدم بياناتك",
      icon: <Globe className="text-primary" size={24} />,
      content: "نستخدم البيانات لإدارة حسابك، وتوثيق مشاركتك في السحوبات والفعاليات، وتحسين جودة التحليلات التي نقدمها للأجهزة المختلفة."
    },
    {
      title: "3. حماية البيانات",
      icon: <Lock className="text-primary" size={24} />,
      content: "نستخدم تقنيات Firestore Security Rules المتقدمة لضمان أن بياناتك الشخصية لا يمكن الوصول إليها إلا من قبلك ومن قبل فريق الإدارة المعتمد."
    },
    {
      title: "4. ملفات تعريف الارتباط",
      icon: <CheckCircle2 className="text-primary" size={24} />,
      content: "نستخدم ملفات تعريف الارتباط التقنية فقط لضمان بقاء جلسة تسجيل دخولك نشطة ولحفظ خيارات المظهر (ليلي/نهاري)."
    }
  ];

  return (
    <div className="space-y-12">
      <div className="pro-card p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield size={180} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">سياسة الخصوصية</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
            خصوصيتك هي أولويتنا القصوى في PUBG ZONE. نحن نلتزم بالشفافية الكاملة حول كيفية تعاملنا مع بياناتك وضمان أمانها بأحدث التقنيات.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Clock size={14} />
            <span>آخر تحديث: 11 مايو 2026</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="pro-card p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
          >
            <div className="flex items-start gap-5">
              <div className="mt-1 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                {policy.icon}
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-white tracking-tight">{policy.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{policy.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pro-card p-10 bg-indigo-500/5 border-indigo-500/20 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black">أمان بياناتك مضمون</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          نحن لا نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث. جميع العمليات تتم داخل بيئة Firebase الآمنة والمشفرة.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
