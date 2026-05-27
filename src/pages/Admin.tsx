import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Eye, EyeOff, LogOut, Image, Tag,
  ToggleLeft, ToggleRight, Loader2, Users,
  CalendarCheck, CheckCircle, XCircle, Clock, Bell, Send,
  Sparkles, Gift, Star, Scissors, MessageSquare, ArrowLeft, Heart, ThumbsUp,
} from 'lucide-react';
import { supabase, type Offer, type GalleryImage, type Booking, type Review, type StickyNote, type GoogleReview } from '../lib/supabase';
import { sendPushToAll, showLocalNotification, sendBookingEmail, sendBulkOfferEmail, sendTelegramToAll } from '../lib/notifications';
import Toast, { useToast } from '../components/Toast';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

type Tab = 'bookings' | 'notifications' | 'offers' | 'gallery' | 'sticky_notes' | 'google_reviews' | 'customers' | 'reviews';
type AuthView = 'login' | 'forgot' | 'reset';

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Detect Supabase recovery redirect (#type=recovery in URL hash)
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setView('reset');
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── Sign in ──────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!email.trim() || !password.trim()) { setError('Please enter email and password'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), password,
    });
    setLoading(false);
    if (!err) { onLogin(); return; }
    // Fallback: env-based credentials
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL?.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem('embos_admin', '1');
      onLogin();
    } else {
      setError('Incorrect email or password');
    }
  };

  // ── Send password reset email ─────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!email.trim()) { setError('Please enter your email address'); return; }
    if (cooldown > 0) { setError(`Please wait ${cooldown}s before requesting again`); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/admin` }
    );
    setLoading(false);
    if (err) {
      if (err.message.toLowerCase().includes('rate') || err.message.toLowerCase().includes('too many')) {
        setError('Too many requests. Please wait 60 seconds before trying again.');
        setCooldown(60);
      } else {
        setError(err.message);
      }
    } else {
      setMessage(`✅ Reset link sent to ${email.trim().toLowerCase()}. Check your inbox and click the link.`);
      setCooldown(60);
    }
  };

  // ── Set new password (after clicking reset link) ──────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setMessage('✅ Password updated! Signing you in...');
      // Clear the hash so it doesn't re-trigger reset view on refresh
      window.history.replaceState(null, '', window.location.pathname);
      setTimeout(() => onLogin(), 1500);
    }
  };

  const viewTitles: Record<AuthView, string> = {
    login: 'Admin Portal',
    forgot: 'Reset Password',
    reset: 'Set New Password',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDD0]/60 via-white to-[#F4C2C2]/30 flex items-center justify-center px-4">
      <motion.div key={view} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-pink-100">

        {view !== 'login' && (
          <button onClick={() => { setView('login'); setError(''); setMessage(''); }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-5 transition-colors">
            <ArrowLeft size={13} /> Back to login
          </button>
        )}

        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F4C2C2] mx-auto mb-3 shadow-md">
            <img src="/logo.jpeg" alt="EMBOS" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {viewTitles[view]}
          </h1>
          <p className="text-gray-400 text-xs mt-1">EMBOS Beauty Salon & Studio</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <XCircle size={14} className="flex-shrink-0" /> {error}
            </motion.div>
          )}
          {message && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
              <CheckCircle size={14} className="flex-shrink-0" /> {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOGIN FORM ── */}
        {view === 'login' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@embos.in" autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ fontSize: '16px' }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2] pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ minHeight: 'unset' }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="button" onClick={() => { setView('forgot'); setError(''); setMessage(''); }}
                style={{ minHeight: 'unset' }}
                className="mt-1.5 text-xs text-[#40BFFF] hover:underline float-right">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed -mt-2 mb-2">
              Enter your admin email and we'll send a secure reset link to your inbox.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Admin Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="sureshkathirvel601@gmail.com" autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2]" />
            </div>
            <button type="submit" disabled={loading || cooldown > 0}
              className="w-full py-3 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Sending...</>
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Send Reset Link'}
            </button>
            {cooldown > 0 && !message && (
              <p className="text-xs text-center text-gray-400">
                Didn't receive it? Check your spam folder or wait {cooldown}s to resend.
              </p>
            )}
          </form>
        )}

        {/* ── SET NEW PASSWORD FORM ── */}
        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed -mt-2 mb-2">
              Choose a strong new password for your admin account.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">New Password</label>
              <div className="relative">
                <input type={showNewPw ? 'text' : 'password'} value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  style={{ fontSize: '16px' }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2] pr-11" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} style={{ minHeight: 'unset' }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <input type="password" value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Re-enter new password" autoComplete="new-password"
                style={{ fontSize: '16px' }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Update Password'}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('embos_admin') === '1');
  const [tab, setTab] = useState<Tab>('bookings');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [newOffer, setNewOffer] = useState({ title: '', description: '' });
  const { toasts, addToast, removeToast } = useToast();
  const [notifLoading, setNotifLoading] = useState(false);

  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushUrl, setPushUrl] = useState('/');
  const [pushSending, setPushSending] = useState(false);

  // Image upload state
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<{ file: File; preview: string; url: string; uploading: boolean }[]>([]);
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Bridal');
  const [pushImageUrl, setPushImageUrl] = useState('');
  const [pushImageUploading, setPushImageUploading] = useState(false);
  const [pushImagePreview, setPushImagePreview] = useState('');

  // Sticky notes upload state
  const [stickyCaption, setStickyCaption] = useState('');
  const [stickyUploading, setStickyUploading] = useState(false);
  const [stickyPreview, setStickyPreview] = useState('');
  const [stickyFile, setStickyFile] = useState<File | null>(null);

  // Google reviews upload state
  const [grName, setGrName] = useState('');
  const [grUploading, setGrUploading] = useState(false);
  const [grPreview, setGrPreview] = useState('');
  const [grFile, setGrFile] = useState<File | null>(null);

  // Upload a file to Supabase Storage and return its public URL
  const uploadImage = async (file: File, bucket: string): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) { addToast('info', 'Upload failed', error.message); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const QUICK_TEMPLATES = [
    { icon: Gift, label: 'New Offer', title: '🔥 Exclusive Offer — EMBOS Salon', body: 'Limited-time deal just for you! Book now and save big on your favourite services.', url: '/#offers' },
    { icon: Sparkles, label: 'Bridal Season', title: '👰 Bridal Season is Here!', body: 'Book your bridal package early and get a complimentary makeup trial. Limited slots!', url: '/bridal-studio' },
    { icon: Star, label: 'Korean Beauty', title: '✨ Korean Glass Skin Special', body: 'Try our trending Korean beauty treatments. Glow like never before — book today!', url: '/korean-beauty' },
    { icon: Scissors, label: 'Hair & Style', title: '💇 New Hair Styles Available', body: 'Fresh cuts, colours & styling now available. Check out our latest gallery looks!', url: '/#gallery' },
  ];

  // Also handle Supabase auth session on mount (for password reset redirect)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setAuthed(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (!authed) return; loadData(); }, [authed]);

  const loadData = async () => {
    setLoading(true);
    const [o, g, b, r, sn, gr] = await Promise.all([
      supabase.from('offers').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('sticky_notes').select('*').order('created_at', { ascending: false }),
      supabase.from('google_reviews').select('*').order('created_at', { ascending: false }),
    ]);
    setOffers(o.data ?? []);
    setGallery(g.data ?? []);
    setBookings(b.data ?? []);
    setReviews(r.data ?? []);
    setStickyNotes(sn.data ?? []);
    setGoogleReviews(gr.data ?? []);
    setLoading(false);
  };

  const logout = () => {
    supabase.auth.signOut();
    sessionStorage.removeItem('embos_admin');
    setAuthed(false);
  };

  // ── Offers CRUD ────────────────────────────────────────────────────────────
  const addOffer = async () => {
    if (!newOffer.title.trim()) return;
    const { data } = await supabase.from('offers').insert([{ ...newOffer, active: true }]).select().single();
    if (data) {
      setOffers([data, ...offers]);
      setNewOffer({ title: '', description: '' });
      addToast('success', 'Offer added', 'Sending notifications...');
      setNotifLoading(true);
      await Promise.all([
        sendPushToAll('🔥 New Offer Available', `${data.title} is now live. Check it out now!`, '/#offers'),
        sendTelegramToAll('🔥 New Offer Available', `${data.title} is now live. Check it out now!`, '/#offers'),
        showLocalNotification('🔥 New Offer Available', `${data.title} is now live. Check it out now!`),
      ]);
      setNotifLoading(false);
      addToast('info', 'Notifications sent', `Push + Telegram sent for "${data.title}"`);
    }
  };
  const toggleOffer = async (id: string, active: boolean) => {
    await supabase.from('offers').update({ active: !active }).eq('id', id);
    setOffers(offers.map((o) => (o.id === id ? { ...o, active: !active } : o)));
  };
  const deleteOffer = async (id: string) => {
    await supabase.from('offers').delete().eq('id', id);
    setOffers(offers.filter((o) => o.id !== id));
    addToast('success', 'Offer deleted');
  };

  // ── Gallery CRUD ───────────────────────────────────────────────────────────
  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Add all files to preview list immediately
    const newEntries = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: '',
      uploading: true,
    }));
    setGalleryPreviews((prev) => [...prev, ...newEntries]);

    // Upload each file in parallel
    const uploaded = await Promise.all(
      newEntries.map(async (entry) => {
        const url = await uploadImage(entry.file, 'gallery');
        return { ...entry, url: url ?? '', uploading: false };
      })
    );

    setGalleryPreviews((prev) =>
      prev.map((p) => {
        const match = uploaded.find((u) => u.preview === p.preview);
        return match ? { ...p, url: match.url, uploading: false } : p;
      })
    );
  };

  const removeGalleryPreview = (preview: string) => {
    setGalleryPreviews((prev) => prev.filter((p) => p.preview !== preview));
  };

  const addGalleryImages = async () => {
    const ready = galleryPreviews.filter((p) => p.url && !p.uploading);
    if (!ready.length) return;
    setGalleryUploading(true);
    const inserts = ready.map((p) => ({
      url: p.url,
      description: galleryDescription,
      category: galleryCategory,
    }));
    const { data } = await supabase.from('gallery_images').insert(inserts).select();
    setGalleryUploading(false);
    if (data) {
      setGallery((prev) => [...data, ...prev]);
      setGalleryPreviews([]);
      setGalleryDescription('');
      setGalleryCategory('Bridal');
      addToast('success', `${data.length} image${data.length > 1 ? 's' : ''} added to gallery`);
      await sendPushToAll('📸 New Gallery Update', `${data.length} new photo${data.length > 1 ? 's' : ''} added. Come see the latest looks!`, '/#gallery');
    }
  };

  const deleteGalleryImage = async (id: string) => {
    await supabase.from('gallery_images').delete().eq('id', id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
    addToast('success', 'Image deleted');
  };

  // ── Bookings ───────────────────────────────────────────────────────────────
  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
    if (status === 'confirmed') {
      const booking = bookings.find((b) => b.id === id);
      addToast('success', 'Booking confirmed', booking ? `${booking.name} — ${booking.service}` : '');
      if (booking) {
        await sendBookingEmail('booking_confirmed', {
          name: booking.name, phone: booking.phone, email: booking.email,
          service: booking.service, date: booking.date,
          time_slot: booking.time_slot, location: booking.location, notes: booking.notes,
        });
      }
    }
  };
  const deleteBooking = async (id: string) => {
    await supabase.from('bookings').delete().eq('id', id);
    setBookings(bookings.filter((b) => b.id !== id));
    addToast('success', 'Booking deleted');
  };

  // ── Reviews ────────────────────────────────────────────────────────────────
  const approveReview = async (id: string, approved: boolean) => {
    await supabase.from('reviews').update({ approved }).eq('id', id);
    setReviews(reviews.map((r) => (r.id === id ? { ...r, approved } : r)));
    addToast('success', approved ? 'Review approved' : 'Review hidden');
  };
  const deleteReview = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(reviews.filter((r) => r.id !== id));
    addToast('success', 'Review deleted');
  };

  // ── Sticky Notes CRUD ─────────────────────────────────────────────────────
  const addStickyNote = async () => {
    if (!stickyFile) return;
    setStickyUploading(true);
    const url = await uploadImage(stickyFile, 'sticky-notes');
    setStickyUploading(false);
    if (!url) return;
    const { data } = await supabase.from('sticky_notes').insert([{ image_url: url, caption: stickyCaption }]).select().single();
    if (data) {
      setStickyNotes([data, ...stickyNotes]);
      setStickyCaption(''); setStickyPreview(''); setStickyFile(null);
      addToast('success', 'Love note added');
    }
  };
  const deleteStickyNote = async (id: string) => {
    await supabase.from('sticky_notes').delete().eq('id', id);
    setStickyNotes(stickyNotes.filter(s => s.id !== id));
    addToast('success', 'Note deleted');
  };

  // ── Google Reviews CRUD ────────────────────────────────────────────────────
  const addGoogleReview = async () => {
    if (!grFile) return;
    setGrUploading(true);
    const url = await uploadImage(grFile, 'google-reviews');
    setGrUploading(false);
    if (!url) return;
    const { data } = await supabase.from('google_reviews').insert([{ image_url: url, reviewer_name: grName }]).select().single();
    if (data) {
      setGoogleReviews([data, ...googleReviews]);
      setGrName(''); setGrPreview(''); setGrFile(null);
      addToast('success', 'Google review added');
    }
  };
  const deleteGoogleReview = async (id: string) => {
    await supabase.from('google_reviews').delete().eq('id', id);
    setGoogleReviews(googleReviews.filter(g => g.id !== id));
    addToast('success', 'Review deleted');
  };

  // ── Custom push notification ───────────────────────────────────────────────
  const sendCustomPush = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) { addToast('info', 'Fill in title and message'); return; }
    setPushSending(true);
    const [pushResult, emailResult, telegramResult] = await Promise.all([
      sendPushToAll(pushTitle.trim(), pushBody.trim(), pushUrl || '/'),
      sendBulkOfferEmail(pushTitle.trim(), pushBody.trim(), pushUrl || '/', pushImageUrl || undefined),
      sendTelegramToAll(pushTitle.trim(), pushBody.trim(), pushUrl || '/'),
    ]);
    showLocalNotification(pushTitle.trim(), pushBody.trim()).catch(() => {});
    setPushSending(false);
    const parts = [];
    if (pushResult.success) parts.push('Push sent');
    if (telegramResult.success && (telegramResult.sent ?? 0) > 0) parts.push(`Telegram: ${telegramResult.sent}`);
    if (emailResult.success && (emailResult.sent ?? 0) > 0) parts.push(`Email: ${emailResult.sent}`);
    if (parts.length > 0) {
      addToast('success', 'Notifications sent!', parts.join(' · '));
      setPushTitle(''); setPushBody(''); setPushUrl('/');
      setPushImageUrl(''); setPushImagePreview('');
    } else {
      addToast('info', 'Sent', 'No active subscribers yet — share your bot link!');
      setPushTitle(''); setPushBody(''); setPushUrl('/');
      setPushImageUrl(''); setPushImagePreview('');
    }
  };

  const handlePushImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPushImagePreview(URL.createObjectURL(file));
    setPushImageUploading(true);
    const url = await uploadImage(file, 'offers');
    setPushImageUploading(false);
    if (url) setPushImageUrl(url);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string; icon: typeof Tag; count?: number }[] = [
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: bookings.filter(b => b.status === 'pending').length },
    { id: 'notifications', label: 'Push', icon: Bell },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'sticky_notes', label: 'Love Notes', icon: Heart },
    { id: 'google_reviews', label: 'Google Reviews', icon: ThumbsUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: reviews.filter(r => !r.approved).length },
  ];

  const statusColors: Record<Booking['status'], string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
  };
  const statusIcons: Record<Booking['status'], typeof Clock> = {
    pending: Clock, confirmed: CheckCircle, cancelled: XCircle,
  };

  const customers = Array.from(
    bookings.reduce((map, b) => {
      if (!map.has(b.phone)) map.set(b.phone, { name: b.name, phone: b.phone, email: b.email, bookingCount: 0, lastService: b.service, lastDate: b.date });
      const c = map.get(b.phone)!;
      c.bookingCount++;
      return map;
    }, new Map<string, { name: string; phone: string; email: string; bookingCount: number; lastService: string; lastDate: string }>())
    .values()
  );

  const SERVICE_PRICES: Record<string, number> = {
    'Simple Bridal Makeup': 5000,
    'Professional Bridal Makeup': 7000,
    'Reception Makeup': 7000,
    'Engagement Makeup': 3500,
    'Baby Shower Makeup': 3000,
    'Party Makeup': 2000,
    'Sider Makeup': 1500,
    'Hair Styling': 1000,
    'Saree Draping': 1000,
    'Korean Glass Skin Facial': 1499,
    'Gold Facial': 1199,
    'Hair Botox': 2499,
    'Keratin Hair Spa': 1299,
    'Nail Art & Extensions': 799,
    'Mehendi Application': 1299,
    'Brow Sculpting': 399,
    'D-Tan Treatment': 599,
  };
  const estimatedRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (SERVICE_PRICES[b.service] ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toasts={toasts} onRemove={removeToast} />

      {notifLoading && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a2e] text-white text-xs font-medium shadow-xl">
          <Bell size={13} className="animate-bounce" /> Sending push notification...
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#F4C2C2] flex-shrink-0">
            <img src="/logo.jpeg" alt="EMBOS" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-[#1a1a2e] text-sm">EMBOS Admin</p>
            <p className="text-xs text-gray-400 truncate max-w-[160px]">{ADMIN_EMAIL}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'text-[#1a1a2e]' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-600' },
            { label: 'Est. Revenue', value: `₹${estimatedRevenue.toLocaleString('en-IN')}`, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                tab === id ? 'bg-[#F4C2C2] text-[#1a1a2e] shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:border-[#F4C2C2]'
              }`}>
              <Icon size={15} />
              {label}
              {count !== undefined && count > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-400 text-white text-[10px] font-bold flex items-center justify-center">{count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-[#F4C2C2]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>

              {/* ── BOOKINGS TAB ── */}
              {tab === 'bookings' && (
                <div className="space-y-4">
                  {bookings.length === 0 && (
                    <div className="text-center py-16">
                      <CalendarCheck size={40} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No bookings yet</p>
                    </div>
                  )}
                  {bookings.map((b) => {
                    const StatusIcon = statusIcons[b.status];
                    return (
                      <motion.div key={b.id} layout className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-bold text-[#1a1a2e] text-sm">{b.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{b.service}</p>
                          </div>
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[b.status]}`}>
                            <StatusIcon size={11} /> {b.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                          <span>📞 {b.phone}</span>
                          <span>📅 {b.date} {b.time_slot && `@ ${b.time_slot}`}</span>
                          <span>✉️ {b.email}</span>
                          <span>📍 {b.location === 'home' ? 'Home Service' : 'Salon Visit'}</span>
                          {b.notes && <span className="col-span-2 text-gray-400 italic">"{b.notes}"</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {b.status !== 'confirmed' && (
                            <button onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors border border-green-200">
                              <CheckCircle size={12} /> Confirm
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors border border-red-200">
                              <XCircle size={12} /> Cancel
                            </button>
                          )}
                          {b.status !== 'pending' && (
                            <button onClick={() => updateBookingStatus(b.id, 'pending')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold hover:bg-yellow-100 transition-colors border border-yellow-200">
                              <Clock size={12} /> Pending
                            </button>
                          )}
                          <button onClick={() => deleteBooking(b.id)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors p-1.5">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* ── PUSH NOTIFICATIONS TAB ── */}
              {tab === 'notifications' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Templates</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {QUICK_TEMPLATES.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button key={t.label} onClick={() => { setPushTitle(t.title); setPushBody(t.body); setPushUrl(t.url); }}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-left hover:border-[#F4C2C2] hover:bg-[#F4C2C2]/5 transition-all text-sm">
                            <Icon size={16} className="text-[#F4C2C2] flex-shrink-0" />
                            <span className="font-medium text-[#1a1a2e]">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Send to All Subscribers</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                          placeholder="e.g. 🔥 New Offer Available" value={pushTitle} onChange={(e) => setPushTitle(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Message</label>
                        <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] resize-none"
                          placeholder="Your notification message..." rows={3} value={pushBody} onChange={(e) => setPushBody(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Click URL</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                          placeholder="/ or /#offers or /bridal-studio" value={pushUrl} onChange={(e) => setPushUrl(e.target.value)} />
                      </div>
                      {/* Offer image upload */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Offer Image (optional — shown in email)</label>
                        <label className={`relative flex items-center gap-3 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors ${pushImagePreview ? 'border-[#F4C2C2]' : 'border-gray-200 hover:border-[#F4C2C2]'}`}>
                          {pushImagePreview ? (
                            <>
                              <img src={pushImagePreview} alt="Offer" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                {pushImageUploading
                                  ? <p className="text-xs text-gray-400 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading...</p>
                                  : <p className="text-xs text-green-600 font-semibold">Image ready</p>
                                }
                                <p className="text-xs text-gray-400 mt-0.5">Click to change</p>
                              </div>
                              {!pushImageUploading && (
                                <button type="button" onClick={(e) => { e.preventDefault(); setPushImageUrl(''); setPushImagePreview(''); }}
                                  className="text-gray-300 hover:text-red-400 flex-shrink-0"><XCircle size={16} /></button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Image size={20} className="text-gray-300" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Upload from laptop or gallery</p>
                                <p className="text-xs text-gray-300">JPG, PNG, WEBP</p>
                              </div>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handlePushImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </label>
                      </div>
                      {(pushTitle || pushBody) && (
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Preview</p>
                          {pushImagePreview && !pushImageUploading && (
                            <img src={pushImagePreview} alt="Offer" className="w-full h-32 object-cover rounded-lg mb-3" />
                          )}
                          <div className="flex items-start gap-3">
                            <img src="/logo.jpeg" alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-[#1a1a2e]">{pushTitle || 'Notification Title'}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{pushBody || 'Notification message...'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <button onClick={sendCustomPush} disabled={pushSending || !pushTitle.trim() || !pushBody.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {pushSending ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send to All Subscribers</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── OFFERS TAB ── */}
              {tab === 'offers' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Add New Offer</h3>
                    <div className="space-y-3">
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="Offer title" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} />
                      <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] resize-none"
                        placeholder="Description" rows={3} value={newOffer.description} onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} />
                      <button onClick={addOffer} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] text-sm font-semibold hover:bg-[#e8a8a8] transition-colors">
                        <Plus size={16} /> Add Offer
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {offers.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No offers yet</p>}
                    {offers.map((offer) => (
                      <motion.div key={offer.id} layout className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1a1a2e] text-sm">{offer.title}</p>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{offer.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggleOffer(offer.id, offer.active)}>
                            {offer.active ? <ToggleRight size={22} className="text-green-400" /> : <ToggleLeft size={22} className="text-gray-300" />}
                          </button>
                          <button onClick={() => deleteOffer(offer.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── GALLERY TAB ── */}
              {tab === 'gallery' && (
                <div className="space-y-5">
                  {/* Upload card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Add Gallery Images</h3>
                    <p className="text-xs text-gray-400 mb-4">Select one or multiple images — they are added to the existing gallery without removing anything.</p>
                    <div className="space-y-3">
                      {/* Multi-file upload zone */}
                      <label className="block">
                        <span className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Upload Images (select multiple)</span>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${galleryPreviews.length > 0 ? 'border-[#ADD8E6]' : 'border-gray-200 hover:border-[#ADD8E6]'}`}>
                          <div className="py-3">
                            <Image size={28} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Click to choose images from laptop or gallery</p>
                            <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP — multiple files supported</p>
                          </div>
                          <input type="file" accept="image/*" multiple onChange={handleGalleryFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </label>

                      {/* Preview grid of selected files */}
                      {galleryPreviews.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{galleryPreviews.length} image{galleryPreviews.length > 1 ? 's' : ''} selected</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {galleryPreviews.map((p) => (
                              <div key={p.preview} className="relative rounded-lg overflow-hidden aspect-square bg-gray-50">
                                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                                {p.uploading && (
                                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                    <Loader2 size={16} className="animate-spin text-[#ADD8E6]" />
                                  </div>
                                )}
                                {!p.uploading && p.url && (
                                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                                    <CheckCircle size={10} className="text-white" />
                                  </div>
                                )}
                                {!p.uploading && !p.url && (
                                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                                    <XCircle size={10} className="text-white" />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeGalleryPreview(p.preview)}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                  style={{ minHeight: 'unset' }}
                                >
                                  <XCircle size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <input
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ADD8E6]"
                        placeholder="Description (applies to all selected images)"
                        value={galleryDescription}
                        onChange={(e) => setGalleryDescription(e.target.value)}
                      />
                      <select
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ADD8E6] bg-white"
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                      >
                        {['Bridal', 'Korean', 'Nails', 'Hair', 'Saree', 'Other'].map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <button
                        onClick={addGalleryImages}
                        disabled={galleryPreviews.length === 0 || galleryPreviews.some((p) => p.uploading) || galleryUploading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ADD8E6] text-[#1a1a2e] text-sm font-semibold hover:bg-[#8ec8d8] transition-colors disabled:opacity-50"
                      >
                        {galleryUploading
                          ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                          : galleryPreviews.some((p) => p.uploading)
                            ? <><Loader2 size={15} className="animate-spin" /> Uploading {galleryPreviews.filter((p) => p.uploading).length} file{galleryPreviews.filter((p) => p.uploading).length > 1 ? 's' : ''}...</>
                            : <><Plus size={16} /> Add {galleryPreviews.length > 0 ? `${galleryPreviews.length} ` : ''}Image{galleryPreviews.length !== 1 ? 's' : ''} to Gallery</>
                        }
                      </button>
                    </div>
                  </div>

                  {/* Existing gallery */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Gallery
                      </h3>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {gallery.length} image{gallery.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {gallery.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No gallery images yet — upload some above</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {gallery.map((img) => (
                          <motion.div key={img.id} layout className="relative rounded-xl overflow-hidden shadow-sm group">
                            <img src={img.url} alt={img.description} className="w-full h-36 object-cover" loading="lazy" />
                            {/* Overlay — always visible on mobile, hover on desktop */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-2.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                              <span className="text-[10px] font-semibold tracking-wide text-[#ADD8E6] uppercase">{img.category}</span>
                              <p className="text-white text-xs truncate leading-tight">{img.description}</p>
                            </div>
                            {/* Delete button — always visible */}
                            <button
                              onClick={() => deleteGalleryImage(img.id)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-red-300 hover:text-red-400 hover:bg-black/80 transition-colors shadow-sm"
                              style={{ minHeight: 'unset' }}
                              title="Delete image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STICKY LOVE NOTES TAB ── */}
              {tab === 'sticky_notes' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Add Love Note</h3>
                    <p className="text-xs text-gray-400 mb-4">Upload sticky note / handwritten message photos from happy clients. New uploads are added alongside existing ones.</p>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Upload Image</span>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${stickyPreview ? 'border-[#F4C2C2]' : 'border-gray-200 hover:border-[#F4C2C2]'}`}>
                          {stickyPreview ? (
                            <div className="relative">
                              <img src={stickyPreview} alt="Preview" className="w-full h-48 object-contain rounded-lg bg-amber-50" />
                              {stickyUploading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                                  <Loader2 size={20} className="animate-spin text-[#F4C2C2]" />
                                </div>
                              )}
                              {!stickyUploading && (
                                <button type="button" onClick={(e) => { e.preventDefault(); setStickyFile(null); setStickyPreview(''); }}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                  style={{ minHeight: 'unset' }}>
                                  <XCircle size={13} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="py-6">
                              <Heart size={28} className="text-pink-200 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">Click to upload sticky note photo</p>
                              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setStickyFile(f); setStickyPreview(URL.createObjectURL(f)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </label>
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="Caption (optional)" value={stickyCaption} onChange={(e) => setStickyCaption(e.target.value)} />
                      <button onClick={addStickyNote} disabled={!stickyFile || stickyUploading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] text-sm font-semibold hover:bg-[#e8a8a8] transition-colors disabled:opacity-50">
                        {stickyUploading ? <><Loader2 size={15} className="animate-spin" /> Uploading...</> : <><Plus size={16} /> Add Love Note</>}
                      </button>
                    </div>
                  </div>

                  {/* Existing sticky notes */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>Uploaded Love Notes</h3>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {stickyNotes.length} note{stickyNotes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {stickyNotes.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No love notes uploaded yet — add one above</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {stickyNotes.map((note) => (
                          <motion.div key={note.id} layout className="relative rounded-xl overflow-hidden shadow-sm bg-amber-50 border border-amber-100">
                            <img src={note.image_url} alt={note.caption} className="w-full h-40 object-contain p-2" loading="lazy" />
                            {note.caption && <p className="text-xs text-center text-amber-700 px-2 pb-2 font-medium">{note.caption}</p>}
                            {/* Delete — always visible */}
                            <button
                              onClick={() => deleteStickyNote(note.id)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-red-300 hover:text-white hover:bg-red-500 transition-colors shadow-sm"
                              style={{ minHeight: 'unset' }}
                              title="Delete love note"
                            >
                              <Trash2 size={13} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── GOOGLE REVIEWS TAB ── */}
              {tab === 'google_reviews' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Add Google Review Screenshot</h3>
                    <p className="text-xs text-gray-400 mb-4">Upload screenshots of Google reviews. New uploads are added alongside existing ones — nothing is deleted automatically.</p>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Upload Screenshot</span>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${grPreview ? 'border-[#40BFFF]' : 'border-gray-200 hover:border-[#40BFFF]'}`}>
                          {grPreview ? (
                            <div className="relative">
                              <img src={grPreview} alt="Preview" className="w-full h-48 object-contain rounded-lg bg-gray-50" />
                              {grUploading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                                  <Loader2 size={20} className="animate-spin text-[#40BFFF]" />
                                </div>
                              )}
                              {!grUploading && (
                                <button type="button" onClick={(e) => { e.preventDefault(); setGrFile(null); setGrPreview(''); }}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                  style={{ minHeight: 'unset' }}>
                                  <XCircle size={13} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="py-6">
                              <ThumbsUp size={28} className="text-blue-200 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">Click to upload Google review screenshot</p>
                              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setGrFile(f); setGrPreview(URL.createObjectURL(f)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </label>
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#40BFFF]"
                        placeholder="Reviewer name (optional)" value={grName} onChange={(e) => setGrName(e.target.value)} />
                      <button onClick={addGoogleReview} disabled={!grFile || grUploading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#40BFFF] text-white text-sm font-semibold hover:bg-[#1c9ff9] transition-colors disabled:opacity-50">
                        {grUploading ? <><Loader2 size={15} className="animate-spin" /> Uploading...</> : <><Plus size={16} /> Add Google Review</>}
                      </button>
                    </div>
                  </div>

                  {/* Existing google reviews */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>Uploaded Reviews</h3>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {googleReviews.length} review{googleReviews.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {googleReviews.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No Google reviews uploaded yet — add one above</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {googleReviews.map((gr) => (
                          <motion.div key={gr.id} layout className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100">
                            <img src={gr.image_url} alt={gr.reviewer_name} className="w-full object-contain max-h-64 p-2" loading="lazy" />
                            {gr.reviewer_name && <p className="text-xs text-center text-gray-500 px-3 pb-3 font-medium">{gr.reviewer_name}</p>}
                            {/* Delete — always visible */}
                            <button
                              onClick={() => deleteGoogleReview(gr.id)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-red-300 hover:text-white hover:bg-red-500 transition-colors shadow-sm"
                              style={{ minHeight: 'unset' }}
                              title="Delete review"
                            >
                              <Trash2 size={13} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── CUSTOMERS TAB ── */}
              {tab === 'customers' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#1a1a2e]">{customers.length} unique customers</p>
                    <p className="text-xs text-gray-400">{bookings.length} total bookings</p>
                  </div>
                  {customers.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No customers yet</p>}
                  {customers.map((c) => (
                    <div key={c.phone} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#1a1a2e] text-sm">{c.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#F4C2C2]/20 text-[#c47a7a] text-xs font-bold">
                          {c.bookingCount} booking{c.bookingCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mt-3">
                        <span>📞 {c.phone}</span>
                        <span>💅 {c.lastService}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── REVIEWS TAB ── */}
              {tab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No reviews yet</p>}
                  {reviews.map((r) => (
                    <motion.div key={r.id} layout className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-bold text-[#1a1a2e] text-sm">{r.name}</p>
                          <p className="text-xs text-[#F4C2C2]">{r.service}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} className={s <= r.rating ? 'text-amber-400' : 'text-gray-200'} fill={s <= r.rating ? '#fbbf24' : 'none'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">"{r.message}"</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => approveReview(r.id, !r.approved)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            r.approved ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}>
                          <CheckCircle size={12} /> {r.approved ? 'Approved' : 'Approve'}
                        </button>
                        <button onClick={() => deleteReview(r.id)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors p-1.5">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
