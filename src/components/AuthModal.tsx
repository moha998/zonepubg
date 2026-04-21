import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Zap,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Send,
} from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } from '../firebase';
import { translateFirebaseError } from '../lib/errorTranslations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  showNotification: (msg: string, type: 'success' | 'error' | 'info') => void;
  onLoginSuccess: (user: { name: string; email?: string }) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

type TabType = 'login' | 'register' | 'forgot-password';

const STORAGE_KEY = 'pubg_pro_auth_data';

const AuthModal = React.memo(({
  isOpen,
  onClose,
  showNotification,
  onLoginSuccess,
  activeTab,
  setActiveTab,
}: AuthModalProps) => {

  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [rememberRegister, setRememberRegister] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed?.name) {
          setLoginName(parsed.name);
          setRegisterName(parsed.name);
        }

        if (parsed?.email) {
          setRegisterEmail(parsed.email);
        }

        if (parsed?.password) {
          setLoginPassword(parsed.password);
          setRegisterPassword(parsed.password);
        }

        setRememberLogin(true);
        setRememberRegister(true);
      }
    } catch (error) {
      console.error('Failed to load saved auth data:', error);
    }
  }, [isOpen]);

  const resetFields = () => {
    setLoginName('');
    setLoginPassword('');
    setRememberLogin(false);
    setShowLoginPassword(false);

    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRememberRegister(false);
    setShowRegisterPassword(false);
    setForgotEmail('');
  };

  const handleClose = () => {
    onClose();
  };

  const saveRememberedData = (data: {
    name: string;
    email?: string;
    password: string;
  }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearRememberedData = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      showNotification('تم تسجيل الدخول بنجاح عبر Google', 'success');
      onClose();
    } catch (error: any) {
      console.error('Google Login Error:', error);
      const errorCode = error.code;
      
      if (errorCode === 'auth/popup-blocked') {
        showNotification('تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة للموقع وحاول مجدداً.', 'error');
      } else if (errorCode === 'auth/popup-closed-by-user') {
        showNotification('تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.', 'info');
      } else if (errorCode === 'auth/unauthorized-domain') {
        showNotification('هذا النطاق غير مصرح به لتسجيل الدخول عبر Google. يرجى التواصل مع الإدارة.', 'error');
      } else if (errorCode === 'auth/operation-not-allowed') {
        showNotification('تسجيل الدخول عبر Google غير مفعل في إعدادات Firebase. يرجى تفعيله من لوحة التحكم.', 'error');
      } else if (errorCode === 'auth/cancelled-popup-request') {
        // Ignore this one as it usually means another popup was opened
      } else {
        showNotification(translateFirebaseError(error), 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginName.trim() || !loginPassword.trim()) {
      showNotification('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
      return;
    }

    const email = loginName.trim().includes('@') 
      ? loginName.trim().toLowerCase() 
      : `${loginName.trim().toLowerCase()}@pubgcom.local`;

    setIsLoading(true);
    try {
      await loginWithEmail(email, loginPassword);
      
      if (rememberLogin) {
        saveRememberedData({
          name: loginName.trim(),
          password: loginPassword,
        });
      } else {
        clearRememberedData();
      }

      showNotification(`مرحباً، تم تسجيل الدخول بنجاح`, 'success');
      onClose();
    } catch (error: any) {
      console.error('Login Error:', error);
      const errorCode = error.code;
      
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        showNotification('البريد الإلكتروني أو كلمة المرور غير صحيحة. تأكد من البيانات وحاول مجدداً.', 'error');
      } else if (errorCode === 'auth/too-many-requests') {
        showNotification('تم حظر المحاولات مؤقتاً بسبب كثرة الأخطاء. حاول لاحقاً.', 'error');
      } else if (errorCode === 'auth/invalid-email') {
        showNotification('صيغة البريد الإلكتروني غير صحيحة.', 'error');
      } else {
        showNotification('فشل تسجيل الدخول. يرجى التأكد من اتصالك بالإنترنت.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim()
    ) {
      showNotification('يرجى تعبئة جميع الحقول', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail.trim())) {
      showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
      return;
    }

    if (registerPassword.length < 6) {
      showNotification('كلمة المرور يجب أن تكون 6 أحرف أو أكثر', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await registerWithEmail(registerEmail.trim().toLowerCase(), registerPassword);
      
      if (rememberRegister) {
        saveRememberedData({
          name: registerName.trim(),
          email: registerEmail.trim().toLowerCase(),
          password: registerPassword,
        });
      } else {
        clearRememberedData();
      }

      showNotification(`تم إنشاء الحساب باسم ${registerName} بنجاح`, 'success');
      onClose();
    } catch (error: any) {
      console.error('Register Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        showNotification('البريد الإلكتروني مستخدم بالفعل', 'error');
      } else {
        showNotification('فشل إنشاء الحساب. يرجى المحاولة لاحقاً', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      showNotification('يرجى إدخال البريد الإلكتروني', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(forgotEmail.trim().toLowerCase());
      showNotification('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تفقد البريد الوارد والرسائل غير المرغوب فيها (Spam).', 'success');
      setActiveTab('login');
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      if (error.code === 'auth/user-not-found') {
        showNotification('البريد الإلكتروني غير مسجل لدينا', 'error');
      } else {
        showNotification('فشل إرسال الرابط. يرجى المحاولة لاحقاً', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        resetFields();
      }}
    >
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-lg bg-bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      الحساب
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      تسجيل دخول أو إنشاء حساب جديد
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-all"
                  aria-label="إغلاق"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4 shadow-lg shadow-primary/5">
                  <Zap size={38} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  مرحباً بك في ببجي برو
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  يمكنك تسجيل الدخول أو إنشاء حساب من خلال النموذج التالي.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-2xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'login' || activeTab === 'forgot-password'
                      ? 'bg-primary text-black'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <LogIn size={18} />
                  تسجيل دخول
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'register'
                      ? 'bg-primary text-black'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <UserPlus size={18} />
                  إنشاء حساب
                </button>
              </div>

              {activeTab === 'login' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="الاسم أو البريد الإلكتروني"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pr-12 pl-12 text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      aria-label="إظهار أو إخفاء كلمة المرور"
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberLogin}
                        onChange={(e) => setRememberLogin(e.target.checked)}
                        className="accent-yellow-500 w-4 h-4"
                      />
                      <span className="flex items-center gap-2">
                        <Save size={16} />
                        حفظ المعلومات
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        if (loginName.includes('@')) {
                          setForgotEmail(loginName);
                        }
                        setActiveTab('forgot-password');
                      }}
                      className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      <Mail size={14} />
                      نسيت كلمة المرور؟
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full btn-gold py-3.5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                    <span className="font-bold">دخول</span>
                  </button>
                </div>
              ) : activeTab === 'register' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="الاسم"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="البريد الإلكتروني"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pr-12 pl-12 text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      aria-label="إظهار أو إخفاء كلمة المرور"
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberRegister}
                      onChange={(e) => setRememberRegister(e.target.checked)}
                      className="accent-yellow-500 w-4 h-4"
                    />
                    <span className="flex items-center gap-2">
                      <Save size={16} />
                      حفظ المعلومات
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full btn-gold py-3.5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                    <span className="font-bold">إنشاء الحساب</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-white font-bold mb-1">استعادة كلمة المرور</h4>
                    <p className="text-xs text-slate-400">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور</p>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors z-10"
                      title="إرسال رابط استعادة كلمة المرور"
                    >
                      <Mail size={18} />
                    </button>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
                      placeholder="البريد الإلكتروني"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="w-full btn-gold py-3.5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                    )}
                    <span className="font-bold">إرسال الرابط</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-full text-sm text-slate-400 hover:text-white transition-colors py-2"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </div>
              )}

              <div className="relative my-6">
                <div className="border-t border-white/10" />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-bg-card px-3 text-xs text-slate-500">
                  أو
                </span>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                <span className="font-bold">الدخول بواسطة Google</span>
              </button>

              <p className="text-[10px] text-slate-500 mt-6 text-center uppercase tracking-widest">
                UI Login + Google Firebase Access
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default AuthModal;
