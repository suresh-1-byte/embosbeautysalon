import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase, type Review } from '../lib/supabase';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', service: '', rating: 5, message: '' });

  const SERVICES = [
    'Korean Glass Skin Facial', 'Bridal Makeup', 'Hair Cut & Styling',
    'Nail Art', 'Mehendi', 'Gold Facial', 'Brow Sculpting', 'Hair Botox', 'Other',
  ];

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? []);
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
        <button key={s} type="button" onClick={() => onChange?.(s)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={18}
            className={s <= value ? 'text-amber-400' : 'text-gray-200'}
            fill={s <= value ? '#fbbf24' : 'none'} />
        </button>
      ))}
    </div>
  );

  return (
    <section id="reviews" className="py-20 px-4 bg-gradient-to-b from-[#FFF1F5] to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">What Clients Say</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e]"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Client Reviews
          </h2>
        </motion.div>

        {/* Reviews grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#F4C2C2]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {reviews.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow"
              >
                <StarRating value={r.rating} />
                <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-4">"{r.message}"</p>
                <div className="mt-4 pt-3 border-t border-gray-50">
                  <p className="font-semibold text-[#1a1a2e] text-sm">{r.name}</p>
                  <p className="text-xs text-[#F4C2C2] mt-0.5">{r.service}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leave a review CTA */}
        <div className="text-center">
          <button onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-full border-2 border-[#F4C2C2] text-[#1a1a2e] font-semibold text-sm hover:bg-[#F4C2C2]/10 transition-colors">
            {showForm ? 'Cancel' : '✍️ Leave a Review'}
          </button>
        </div>

        {/* Review form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-md border border-pink-100">
                {submitted ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <CheckCircle size={40} className="text-green-400 mb-3" />
                    <p className="font-bold text-[#1a1a2e]">Thank you for your review!</p>
                    <p className="text-sm text-gray-400 mt-1">It will appear after admin approval.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-[#1a1a2e] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Share Your Experience
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Your Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Priya S."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Service *</label>
                      <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] bg-white">
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
                        placeholder="Tell us about your experience..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] resize-none" />
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full py-3 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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
  );
}
