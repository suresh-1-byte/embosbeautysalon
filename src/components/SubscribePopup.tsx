import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Bell, BellRing, Mail, ArrowRight, Loader2, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Step = 'push' | 'email' | 'done';

export default function SubscribePopup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<Step>('push');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pushLoading, setPushLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [pushDone, setPushDone] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Show only once per session — respect localStorage dismissal
    const dismissed = localStorage.getItem('embos_popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePushAllow = async () => {
    setPushLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPushDone(true);
      if (perm === 'granted') {
        try {
          const { initializeApp, getApps } = await import('firebase/app');
          const { getMessaging, getToken } = await import('firebase/messaging');

          const app = getApps().length === 0
            ? initializeApp({
                apiKey:            import.meta.env.VITE_FCM_API_KEY,
                projectId:         import.meta.env.VITE_FCM_PROJECT_ID,
                messagingSenderId: import.meta.env.VITE_FCM_MESSAGING_SENDER_ID,
                appId:             import.meta.env.VITE_FCM_APP_ID,
              })
            : getApps()[0];

          const messaging = getMessaging(app);
          const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
          await navigator.serviceWorker.ready;

          const fcmToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FCM_VAPID_KEY,
            serviceWorkerRegistration: swReg,
          });

          if (fcmToken) {
            const { supabase } = await import('../lib/supabase');
            await supabase.from('push_subscriptions').upsert(
              { endpoint: fcmToken, p256dh: 'fcm-v1', auth: 'fcm-v1' },
              { onConflict: 'endpoint' }
            );
            console.log('FCM token saved ✅');
          } else {
            console.warn('No FCM token received');
          }
        } catch (e) {
          console.error('FCM subscribe error:', e);
        }
        setTimeout(() => setStep('email'), 1200);
      } else {
        setTimeout(() => setStep('email'), 800);
      }
    } catch {
      setPushDone(true);
      setTimeout(() => setStep('email'), 800);
    } finally {
      setPushLoading(false);
    }
  };

  const handleSkipPush = () => {
    setStep('email');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return; }

    setEmailLoading(true);
    const { error: err } = await supabase
      .from('email_subscribers')
      .insert({ name: name.trim(), email: email.trim().toLowerCase() });
    setEmailLoading(false);

    // Ignore duplicate email error (code 23505 = unique violation)
    if (err && err.code !== '23505') {
      console.error('Email subscribe error:', err);
      setError('Something went wrong. Please try again.');
      return;
    }

    setEmailDone(true);
    localStorage.setItem('embos_popup_dismissed', '1');
    setTimeout(() => setShow(false), 2500);
  };

  const handleSkipEmail = () => {
    localStorage.setItem('embos_popup_dismissed', '1');
    setStep('done');
    setTimeout(() => setShow(false), 300);
  };

  const handleDismiss = () => {
    localStorage.setItem('embos_popup_dismissed', '1');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={handleDismiss}
          />

          {/* Centering wrapper — flex is the most reliable cross-device centering */}
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden"
              style={{ maxHeight: '88dvh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center pt-4">
              <div className={`w-6 h-1 rounded-full transition-colors ${step === 'push' ? 'bg-[#F4C2C2]' : 'bg-[#F4C2C2]'}`} />
              <div className={`w-6 h-1 rounded-full transition-colors ${step === 'email' || step === 'done' ? 'bg-[#F4C2C2]' : 'bg-gray-200'}`} />
            </div>

            <button onClick={handleDismiss} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 p-1">
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Push Notifications ── */}
              {step === 'push' && (
                <motion.div
                  key="push"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 pt-4 pb-6"
                >
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#F4C2C2]/20 flex items-center justify-center mb-3">
                      {pushDone
                        ? <BellRing size={28} className="text-[#F4C2C2]" />
                        : <Bell size={28} className="text-[#F4C2C2]" />
                      }
                    </div>
                    <h2 className="text-xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Get Notified Instantly
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Allow browser notifications to get instant alerts for new offers, packages & updates from EMBOS — even when the site is closed.
                    </p>
                  </div>

                  {pushDone ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold text-sm">
                      <CheckCircle size={18} /> Notifications enabled!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handlePushAllow}
                        disabled={pushLoading}
                        className="w-full py-3 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {pushLoading
                          ? <><Loader2 size={15} className="animate-spin" /> Requesting...</>
                          : <><Bell size={15} /> Allow Notifications</>
                        }
                      </button>
                      <button
                        onClick={handleSkipPush}
                        className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Skip for now →
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── STEP 2: Email Subscription ── */}
              {step === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 pt-4 pb-6"
                >
                  {emailDone ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-6 text-center"
                    >
                      <CheckCircle size={48} className="text-green-400 mb-3" />
                      <p className="font-bold text-[#1a1a2e] text-lg">You're all set!</p>
                      <p className="text-xs text-gray-400 mt-1">We'll send you exclusive offers by email.</p>
                      <a
                        href="https://t.me/Embosbeautysalon_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#40BFFF]/10 text-[#40BFFF] text-sm font-semibold hover:bg-[#40BFFF]/20 transition-colors"
                      >
                        <Send size={14} /> Also get Telegram notifications
                      </a>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#ADD8E6]/20 flex items-center justify-center mb-2">
                          <Mail size={22} className="text-[#ADD8E6]" />
                        </div>
                        <h2 className="text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Get Offers by Email
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Enter your email to receive exclusive offers & beauty tips.
                        </p>
                      </div>

                      <form onSubmit={handleEmailSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Your Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="e.g. Priya"
                            style={{ fontSize: '16px' }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ADD8E6] focus:ring-1 focus:ring-[#ADD8E6]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            placeholder="your@email.com"
                            style={{ fontSize: '16px' }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ADD8E6] focus:ring-1 focus:ring-[#ADD8E6]"
                          />
                        </div>
                        {error && <p className="text-red-400 text-xs">{error}</p>}
                        <button
                          type="submit"
                          disabled={emailLoading}
                          className="w-full py-3 rounded-xl bg-[#ADD8E6] text-[#1a1a2e] font-bold text-sm hover:bg-[#8ec8d8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {emailLoading
                            ? <><Loader2 size={15} className="animate-spin" /> Subscribing...</>
                            : <><Mail size={15} /> Subscribe to Offers <ArrowRight size={14} /></>
                          }
                        </button>
                        <button
                          type="button"
                          onClick={handleSkipEmail}
                          className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          No thanks
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
