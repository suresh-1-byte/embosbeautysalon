import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Eye, EyeOff, LogOut, Image, Zap, Tag,
  ToggleLeft, ToggleRight, Loader2, Users,
  CalendarCheck, CheckCircle, XCircle, Clock, Bell, Send,
  Sparkles, Gift, Star, Scissors, MessageSquare,
} from 'lucide-react';
import { supabase, type Offer, type GalleryImage, type Transformation, type Booking, type Review } from '../lib/supabase';
import { sendPushToAll, showLocalNotification, sendBookingEmail, sendBulkOfferEmail, sendTelegramToAll } from '../lib/notifications';
import Toast, { useToast } from '../components/Toast';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

type Tab = 'offers' | 'gallery' | 'transformations' | 'bookings' | 'notifications' | 'customers' | 'reviews';

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please enter email and password'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('embos_admin', '1');
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDD0]/60 via-white to-[#F4C2C2]/30 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-pink-100">
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F4C2C2] mx-auto mb-3 shadow-md">
            <img src="/logo.jpeg" alt="EMBOS" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Portal</h1>
          <p className="text-gray-400 text-xs mt-1">EMBOS Beauty Salon & Studio</p>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <XCircle size={14} className="flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2] pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('embos_admin') === '1');
  const [tab, setTab] = useState<Tab>('bookings');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [transforms, setTransforms] = useState<Transformation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [newOffer, setNewOffer] = useState({ title: '', description: '' });
  const [newGallery, setNewGallery] = useState({ url: '', description: '', category: 'Bridal' });
  const [newTransform, setNewTransform] = useState({ before_url: '', after_url: '', description: '' });
  const { toasts, addToast, removeToast } = useToast();
  const [notifLoading, setNotifLoading] = useState(false);

  // Push notification state
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushUrl, setPushUrl] = useState('/');
  const [pushSending, setPushSending] = useState(false);

  const QUICK_TEMPLATES = [
    { icon: Gift, label: 'New Offer', title: '🔥 Exclusive Offer — EMBOS Salon', body: 'Limited-time deal just for you! Book now and save big on your favourite services.', url: '/#offers' },
    { icon: Sparkles, label: 'Bridal Season', title: '👰 Bridal Season is Here!', body: 'Book your bridal package early and get a complimentary makeup trial. Limited slots!', url: '/bridal-studio' },
    { icon: Star, label: 'Korean Beauty', title: '✨ Korean Glass Skin Special', body: 'Try our trending Korean beauty treatments. Glow like never before — book today!', url: '/korean-beauty' },
    { icon: Scissors, label: 'Hair & Style', title: '💇 New Hair Styles Available', body: 'Fresh cuts, colours & styling now available. Check out our latest gallery looks!', url: '/#gallery' },
  ];

  useEffect(() => { if (!authed) return; loadData(); }, [authed]);

  const loadData = async () => {
    setLoading(true);
    const [o, g, t, b, r] = await Promise.all([
      supabase.from('offers').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
      supabase.from('transformations').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    ]);
    setOffers(o.data ?? []);
    setGallery(g.data ?? []);
    setTransforms(t.data ?? []);
    setBookings(b.data ?? []);
    setReviews(r.data ?? []);
    setLoading(false);
  };

  const logout = () => { sessionStorage.removeItem('embos_admin'); setAuthed(false); };

  // ── Offers CRUD ──────────────────────────────────────────────────────────────
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

  // ── Gallery CRUD ─────────────────────────────────────────────────────────────
  const addGalleryImage = async () => {
    if (!newGallery.url.trim()) return;
    const { data } = await supabase.from('gallery_images').insert([newGallery]).select().single();
    if (data) {
      setGallery([data, ...gallery]);
      setNewGallery({ url: '', description: '', category: 'Bridal' });
      addToast('success', 'Image added');
      setNotifLoading(true);
      await sendPushToAll('📸 New Gallery Update', `New ${data.category} photo added. Come see the latest looks!`, '/#gallery');
      setNotifLoading(false);
    }
  };
  const deleteGalleryImage = async (id: string) => {
    await supabase.from('gallery_images').delete().eq('id', id);
    setGallery(gallery.filter((g) => g.id !== id));
    addToast('success', 'Image deleted');
  };

  // ── Transformations CRUD ─────────────────────────────────────────────────────
  const addTransform = async () => {
    if (!newTransform.before_url.trim() || !newTransform.after_url.trim()) return;
    const { data } = await supabase.from('transformations').insert([newTransform]).select().single();
    if (data) {
      setTransforms([data, ...transforms]);
      setNewTransform({ before_url: '', after_url: '', description: '' });
      addToast('success', 'Transformation added');
      setNotifLoading(true);
      await sendPushToAll('✨ New Transformation', `${data.description || 'Amazing before & after'} — see the results!`, '/#gallery');
      setNotifLoading(false);
    }
  };
  const deleteTransform = async (id: string) => {
    await supabase.from('transformations').delete().eq('id', id);
    setTransforms(transforms.filter((t) => t.id !== id));
    addToast('success', 'Transformation deleted');
  };

  // ── Bookings ─────────────────────────────────────────────────────────────────
  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
    if (status === 'confirmed') {
      const booking = bookings.find((b) => b.id === id);
      addToast('success', 'Booking confirmed', booking ? `${booking.name} — ${booking.service}` : '');
      // Send confirmation email to customer
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

  // ── Reviews ──────────────────────────────────────────────────────────────────
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

  // ── Custom push notification ─────────────────────────────────────────────────
  const sendCustomPush = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) { addToast('info', 'Fill in title and message'); return; }
    setPushSending(true);

    // Run push + email + Telegram in parallel
    const [pushResult, emailResult, telegramResult] = await Promise.all([
      sendPushToAll(pushTitle.trim(), pushBody.trim(), pushUrl || '/'),
      sendBulkOfferEmail(pushTitle.trim(), pushBody.trim(), pushUrl || '/'),
      sendTelegramToAll(pushTitle.trim(), pushBody.trim(), pushUrl || '/'),
    ]);

    // Local notification for current browser (non-blocking)
    showLocalNotification(pushTitle.trim(), pushBody.trim()).catch(() => {});

    setPushSending(false);

    const parts = [];
    if (pushResult.success) parts.push('Push sent');
    if (telegramResult.success && (telegramResult.sent ?? 0) > 0) parts.push(`Telegram: ${telegramResult.sent}`);
    if (emailResult.success && (emailResult.sent ?? 0) > 0) parts.push(`Email: ${emailResult.sent}`);

    if (parts.length > 0) {
      addToast('success', 'Notifications sent!', parts.join(' · '));
      setPushTitle(''); setPushBody(''); setPushUrl('/');
    } else {
      addToast('info', 'Sent', 'No active subscribers yet — share your bot link!');
      setPushTitle(''); setPushBody(''); setPushUrl('/');
    }
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string; icon: typeof Tag; count?: number }[] = [
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: bookings.filter(b => b.status === 'pending').length },
    { id: 'notifications', label: 'Push', icon: Bell },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'transformations', label: 'Transforms', icon: Zap },
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

  // Unique customers derived from bookings
  const customers = Array.from(
    bookings.reduce((map, b) => {
      if (!map.has(b.phone)) map.set(b.phone, { name: b.name, phone: b.phone, email: b.email, bookingCount: 0, lastService: b.service, lastDate: b.date });
      const c = map.get(b.phone)!;
      c.bookingCount++;
      return map;
    }, new Map<string, { name: string; phone: string; email: string; bookingCount: number; lastService: string; lastDate: string }>())
    .values()
  );

  // Revenue estimate (confirmed bookings only, rough pricing)
  const SERVICE_PRICES: Record<string, number> = {
    'Korean Glass Skin Facial': 1499, 'Bridal Makeup': 5999, 'Hair Cut & Styling': 499,
    'Nail Art & Extensions': 799, 'Mehendi Application': 1299, 'Gold Facial': 1199,
    'Brow Sculpting': 399, 'Hair Botox': 2499, 'D-Tan Treatment': 599,
    'Keratin Hair Spa': 1299, 'Essential Beauty Combo': 499, 'Mega Summer Combo': 1999,
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
                  {/* Quick templates */}
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

                  {/* Custom notification composer */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Send to All Subscribers</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                          placeholder="e.g. 🔥 New Offer Available" value={pushTitle}
                          onChange={(e) => setPushTitle(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Message</label>
                        <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] resize-none"
                          placeholder="Your notification message..." rows={3} value={pushBody}
                          onChange={(e) => setPushBody(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Click URL</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                          placeholder="/ or /#offers or /bridal-studio" value={pushUrl}
                          onChange={(e) => setPushUrl(e.target.value)} />
                      </div>

                      {/* Preview */}
                      {(pushTitle || pushBody) && (
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Preview</p>
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

                  {/* OneSignal setup status */}
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-sm text-amber-800">
                    <p className="font-semibold mb-1">⚙️ OneSignal Setup Required</p>
                    <p className="text-xs leading-relaxed">
                      To send background push to ALL users (even when site is closed), add your OneSignal REST API key to Supabase Edge Function secrets:<br />
                      <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[11px] mt-1 inline-block">
                        npx supabase secrets set ONESIGNAL_REST_API_KEY=your_key ONESIGNAL_APP_ID=fe0dc2a4-2aac-441a-a0f6-dada64111bba --project-ref hlvisrpopicrnhdgnhpr
                      </code>
                    </p>
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
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Add Gallery Image</h3>
                    <div className="space-y-3">
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="Image URL" value={newGallery.url} onChange={(e) => setNewGallery({ ...newGallery, url: e.target.value })} />
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="Description" value={newGallery.description} onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })} />
                      <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] bg-white"
                        value={newGallery.category} onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}>
                        {['Bridal', 'Korean', 'Nails', 'Hair', 'Saree', 'Other'].map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <button onClick={addGalleryImage} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ADD8E6] text-[#1a1a2e] text-sm font-semibold hover:bg-[#8ec8d8] transition-colors">
                        <Plus size={16} /> Add Image
                      </button>
                    </div>
                  </div>
                  {gallery.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No gallery images yet</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((img) => (
                      <motion.div key={img.id} layout className="relative rounded-xl overflow-hidden group shadow-sm">
                        <img src={img.url} alt={img.description} className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-[#F4C2C2] font-semibold">{img.category}</span>
                            <p className="text-white text-xs truncate">{img.description}</p>
                          </div>
                          <button onClick={() => deleteGalleryImage(img.id)} className="text-red-300 hover:text-red-400 ml-2 flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TRANSFORMATIONS TAB ── */}
              {tab === 'transformations' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Add Transformation</h3>
                    <div className="space-y-3">
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="Before image URL" value={newTransform.before_url} onChange={(e) => setNewTransform({ ...newTransform, before_url: e.target.value })} />
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="After image URL" value={newTransform.after_url} onChange={(e) => setNewTransform({ ...newTransform, after_url: e.target.value })} />
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                        placeholder="Description" value={newTransform.description} onChange={(e) => setNewTransform({ ...newTransform, description: e.target.value })} />
                      <button onClick={addTransform} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] text-sm font-semibold hover:bg-[#e8a8a8] transition-colors">
                        <Plus size={16} /> Add Transformation
                      </button>
                    </div>
                  </div>
                  {transforms.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No transformations yet</p>}
                  <div className="space-y-4">
                    {transforms.map((t) => (
                      <motion.div key={t.id} layout className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <div><p className="text-xs text-gray-400 mb-1">Before</p><img src={t.before_url} alt="Before" className="w-full h-20 object-cover rounded-lg" /></div>
                            <div><p className="text-xs text-gray-400 mb-1">After</p><img src={t.after_url} alt="After" className="w-full h-20 object-cover rounded-lg" /></div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="text-sm text-gray-500 text-right max-w-[100px] truncate">{t.description}</p>
                            <button onClick={() => deleteTransform(t.id)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
