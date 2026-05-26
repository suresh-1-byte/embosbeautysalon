import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { supabase, type GoogleReview } from '../lib/supabase';

// Fallback placeholder reviews (always shown when DB has no entries)
const PLACEHOLDER_REVIEWS: GoogleReview[] = [
  { id: 'gr1', image_url: '/review1.png', reviewer_name: '', created_at: '' },
  { id: 'gr2', image_url: '/review2.png', reviewer_name: '', created_at: '' },
  { id: 'gr3', image_url: '/review3.png', reviewer_name: '', created_at: '' },
  { id: 'gr4', image_url: '/review4.png', reviewer_name: '', created_at: '' },
  { id: 'gr5', image_url: '/review5.png', reviewer_name: '', created_at: '' },
  { id: 'gr6', image_url: '/review6.png', reviewer_name: '', created_at: '' },
];

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>(PLACEHOLDER_REVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('google_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const dbReviews = data ?? [];
        if (dbReviews.length > 0) {
          // Merge: DB reviews first (newest on top), then placeholders not already in DB
          const dbUrls = new Set(dbReviews.map((r) => r.image_url));
          const uniquePlaceholders = PLACEHOLDER_REVIEWS.filter((p) => !dbUrls.has(p.image_url));
          setReviews([...dbReviews, ...uniquePlaceholders]);
        }
        // If DB empty, placeholders stay as initial state
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3 flex items-center justify-center gap-2">
            {/* Google G icon */}
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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#40BFFF]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#40BFFF]/30 transition-all"
              >
                <img
                  src={review.image_url}
                  alt={review.reviewer_name || 'Google review'}
                  className="w-full object-contain bg-gray-50 p-3"
                  style={{ maxHeight: '220px' }}
                />
                {review.reviewer_name && (
                  <div className="px-4 py-3 border-t border-gray-50">
                    <p className="text-sm font-semibold text-[#1a1a2e]">{review.reviewer_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Verified Google Review</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Link to Google */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://g.page/r/embosbeautysalon/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#40BFFF] text-[#40BFFF] font-semibold text-sm hover:bg-[#40BFFF]/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Leave a Google Review
          </a>
        </motion.div>
      </div>
    </section>
  );
}
