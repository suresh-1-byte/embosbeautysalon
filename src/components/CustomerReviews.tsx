import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2, Heart } from 'lucide-react';
import { supabase, type Review, type GoogleReview, type StickyNote } from '../lib/supabase';

const PLACEHOLDER_GOOGLE: GoogleReview[] = [
  { id: 'gr1', image_url: '/review1.png', reviewer_name: '', created_at: '' },
  { id: 'gr2', image_url: '/review2.png', reviewer_name: '', created_at: '' },
  { id: 'gr3', image_url: '/review3.png', reviewer_name: '', created_at: '' },
  { id: 'gr4', image_url: '/review4.png', reviewer_name: '', created_at: '' },
  { id: 'gr5', image_url: '/review5.png', reviewer_name: '', created_at: '' },
  { id: 'gr6', image_url: '/review6.png', reviewer_name: '', created_at: '' },
];

const PLACEHOLDER_STICKY: StickyNote[] = [
  { id: 'sn1', image_url: '/sticky1.png', caption: '', created_at: '' },
  { id: 'sn2', image_url: '/sticky2.png', caption: '', created_at: '' },
  { id: 'sn3', image_url: '/sticky3.png', caption: '', created_at: '' },
  { id: 'sn4', image_url: '/sticky4.png', caption: '', created_at: '' },
  { id: 'sn5', image_url: '/sticky5.png', caption: '', created_at: '' },
  { id: 'sn6', image_url: '/sticky6.png', caption: '', created_at: '' },
];

const ROTATIONS = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];

const SERVICES = [
  'Simple Bridal Makeup', 'Professional Bridal Makeup', 'Reception Makeup',
  'Engagement Makeup', 'Baby Shower Makeup', 'Party Makeup', 'Sider Makeup',
  'Hair Styling', 'Saree Draping', 'Korean Glass Skin Facial', 'Gold Facial',
  'Hair Botox', 'Keratin Hair Spa', 'Nail Art & Extensions',
  'Mehendi Application', 'Brow Sculpting', 'D-Tan Treatment', 'Other',
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>(PLACEHOLDER_GOOGLE);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(PLACEHOLDER_STICKY);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', service: '', rating: 5, message: '' });

  useEffect(() => {
    Promise.all([
      supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }),
      supabase.from('google_reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('sticky_notes').select('*').order('created_at', { ascending: false }),
    ]).then(([{ data: rData }, { data: grData }, { data: snData }]) => {
      setReviews(rData ?? []);
      if ((grData ?? []).length > 0) setGoogleReviews(grData!);
      if ((snData ?? []).length > 0) setStickyNotes(snData!);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || !form.service) return;
    setSubmitting(true);
    await supabase.from('reviews').insert([{ ...form, approved: false }]);
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: '', service: '', rating: 5, message: '' });
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
  };

  const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange?.(s)} style={{ minHeight: 'unset' }}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={20} className={s <= value ? 'text-amber-400' : 'text-gray-200'} fill={s <= value ? '#fbbf24' : 'none'} />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* ══ 1. CLIENT REVIEWS ══════════════════════════════════════════════ */}
      <section id="reviews" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#FFF1F5] to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12">
            <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">What Clients Say</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Client Reviews
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-[#F4C2C2]" /></div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
              {reviews.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
                  <StarRating value={r.rating} />
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-4">"{r.message}"</p>
                  <div className="mt-4 pt-3 border-t border-gray-50">
                    <p className="font-semibold text-[#1a1a2e] text-sm">{r.name}</p>
                    <p className="text-xs text-[#F4C2C2] mt-0.5">{r.service}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : null}

          <div className="text-center mb-6">
            <button onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 rounded-full border-2 border-[#F4C2C2] text-[#1a1a2e] font-semibold text-sm hover:bg-[#F4C2C2]/10 transition-colors">
              {showForm ? 'Cancel' : '✍️ Leave a Review'}
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-pink-100">
                  {submitted ? (
                    <div className="flex flex-col items-center py-6 text-center">
                      <CheckCircle size={40} className="text-green-400 mb-3" />
                      <p className="font-bold text-[#1a1a2e]">Thank you for your review!</p>
                      <p className="text-sm text-gray-400 mt-1">It will appear after admin approval.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="font-bold text-[#1a1a2e] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Share Your Experience</h3>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Your Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Priya S." style={{ fontSize: '16px' }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Service *</label>
                        <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                          style={{ fontSize: '16px' }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] bg-white">
                          <option value="">Select service</option>
                          {SERVICES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Rating *</label>
                        <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Your Review *</label>
                        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                          placeholder="Tell us about your experience..." rows={3} style={{ fontSize: '16px' }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] resize-none" />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="w-full py-3.5 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Review</>}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══ 2. GOOGLE REVIEWS ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12">
            <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3 flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
              What Google Says
            </h2>
            <p className="text-gray-400 text-sm mt-3">Real reviews from our verified Google customers</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {googleReviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#40BFFF]/30 transition-all">
                <img src={review.image_url} alt={review.reviewer_name || 'Google review'}
                  className="w-full object-contain bg-gray-50 p-3" style={{ maxHeight: '220px' }} loading="lazy" />
                {review.reviewer_name && (
                  <div className="px-4 py-3 border-t border-gray-50">
                    <p className="text-sm font-semibold text-[#1a1a2e]">{review.reviewer_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Verified Google Review</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a href="https://g.page/r/embosbeautysalon/review" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#40BFFF] text-[#40BFFF] font-semibold text-sm hover:bg-[#40BFFF]/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Leave a Google Review
            </a>
          </div>
        </div>
      </section>

      {/* ══ 3. STICKY LOVE NOTES ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#FFFDD0]/40 to-[#FFF1F5]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12">
            <p className="text-xs tracking-[0.35em] text-[#F4C2C2] uppercase font-semibold mb-3 flex items-center justify-center gap-2">
              <Heart size={12} fill="#F4C2C2" /> Love from Our Clients <Heart size={12} fill="#F4C2C2" />
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sticky Love Notes
            </h2>
            <p className="text-gray-400 text-sm mt-3">Handwritten messages from our happy clients</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {stickyNotes.map((note, i) => (
              <motion.div key={note.id}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: ROTATIONS[i % ROTATIONS.length] }}
                whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative bg-[#FFFDE7] rounded-sm shadow-md border border-yellow-200 p-3 cursor-pointer"
                style={{ boxShadow: '3px 3px 10px rgba(0,0,0,0.12), inset 0 -2px 4px rgba(0,0,0,0.04)' }}>
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F4C2C2] border-2 border-white shadow-sm z-10" />
                <img src={note.image_url} alt={note.caption || 'Love note'}
                  className="w-full object-contain rounded-sm" style={{ maxHeight: '180px' }} loading="lazy" />
                {note.caption && (
                  <p className="text-xs text-amber-800 mt-2 text-center font-medium leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                    {note.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
