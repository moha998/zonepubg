
/**
 * يترجم رسائل خطأ Firebase إلى اللغة العربية
 */
export function translateFirebaseError(error: any): string {
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';

  // أخطاء تسجيل الدخول والتوثيق
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة. تأكد من البيانات وحاول مجدداً.';
    case 'auth/too-many-requests':
      return 'تم حظر المحاولات مؤقتاً بسبب كثرة الأخطاء. حاول لاحقاً.';
    case 'auth/invalid-email':
      return 'صيغة البريد الإلكتروني غير صحيحة.';
    case 'auth/email-already-in-use':
      return 'البريد الإلكتروني مستخدم بالفعل بحساب آخر.';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة جداً. يرجى اختيار كلمة مرور أقوى.';
    case 'auth/popup-blocked':
      return 'تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة للموقع وحاول مجدداً.';
    case 'auth/popup-closed-by-user':
      return 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.';
    case 'auth/unauthorized-domain':
      return 'هذا النطاق غير مصرح به لتسجيل الدخول. يرجى التواصل مع الإدارة.';
    case 'auth/operation-not-allowed':
      return 'هذه العملية غير مفعلة حالياً. يرجى التواصل مع الإدارة.';
    case 'auth/network-request-failed':
      return 'فشل الاتصال بالشبكة. يرجى التأكد من اتصالك بالإنترنت.';
    case 'auth/requires-recent-login':
      return 'هذه العملية حساسة وتتطلب تسجيل الدخول مرة أخرى.';
    case 'auth/user-disabled':
      return 'تم إيقاف هذا الحساب من قبل الإدارة.';
  }

  // أخطاء Firestore
  if (errorMessage.includes('Missing or insufficient permissions')) {
    return 'عذراً، ليس لديك الصلاحيات الكافية للقيام بهذه العملية.';
  }
  
  if (errorMessage.includes('quota exceeded')) {
    return 'عذراً، تم تجاوز حصة الاستخدام اليومية. يرجى المحاولة غداً.';
  }

  if (errorMessage.includes('offline')) {
    return 'أنت غير متصل بالإنترنت حالياً. يرجى التحقق من اتصالك.';
  }

  // رسالة افتراضية
  return `حدث خطأ غير متوقع: ${errorCode || 'خطأ غير معروف'}`;
}
