import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';

interface PricingProps {
  onBookingClick: (service?: string) => void;
}

const CATEGORIES = [
  {
    name: 'Bridal & Makeup',
    emoji: '👰',
    color: 'from-[#FFE8F0]/30 to-[#FFE8F0]/5',
    border: 'border-pink-200/60',
    services: [
      { name: 'Simple Bridal Makeup', duration: '120 min', price: '₹5,000', popular: true },
      { name: 'Professional Bridal Makeup', duration: '150 min', price: '₹7,000', popular: true },
      { name: 'Reception Makeup', duration: '120 min', price: '₹7,000' },
      { name: 'Engagement Makeup', duration: '90 min', price: '₹3,500' },
      { name: 'Baby Shower Makeup', duration: '75 min', price: '₹3,000' },
      { name: 'Party Makeup', duration: '60 min', price: '₹2,000' },
      { name: 'Sider Makeup', duration: '60 min', price: '₹1,500' },
    ],
  },
  {
    name: 'Hair',
    emoji: '💇',
    color: 'from-[#ADD8E6]/20 to-[#ADD8E6]/5',
    border: 'border-[#ADD8E6]/40',
    services: [
      { name: 'Hair Styling', duration: '45–90 min', price: '₹1,000 – ₹4,000', popular: true },
      { name: 'Hair Botox', duration: '90 min', price: '₹2,499' },
      { name: 'Keratin Hair Spa', duration: '60 min', price: '₹1,299' },
      { name: 'Hair Colour', duration: '90 min', price: '₹1,999' },
    ],
  },
  {
    name: 'Saree & Draping',
    emoji: '🥻',
    color: 'from-amber-100/20 to-amber-50/5',
    border: 'border-amber-200/40',
    services: [
      { name: 'Saree Draping', duration: '30 min', price: '₹1,000', popular: true },
    ],
  },
  {
    name: 'Skin & Facial',
    emoji: '✨',
    color: 'from-[#F4C2C2]/20 to-[#F4C2C2]/5',
    border: 'border-[#F4C2C2]/40',
    services: [
      { name: 'Korean Glass Skin Facial', duration: '60 min', price: '₹1,499', popular: true },
      { name: 'Gold Facial', duration: '60 min', price: '₹1,199' },
      { name: 'D-Tan Treatment', duration: '45 min', price: '₹599' },
      { name: 'Deep Facial Cleanup', duration: '45 min', price: '₹699' },
    ],
  },
  {
    name: 'Nails & Brows',
    emoji: '💅',
    color: 'from-purple-100/20 to-purple-50/5',
    border: 'border-purple-200/40',
    services: [
      { name: 'Nail Art & Extensions', duration: '60 min', price: '₹799', popular: true },
      { name: 'Nail Cut & Polish', duration: '20 min', price: '₹199' },
      { name: 'Brow Sculpting', duration: '30 min', price: '₹399' },
      { name: 'Eyebrow Threading', duration: '10 min', price: '₹50' },
    ],
  },
  {
    name: 'Waxing & Threading',
    emoji: '🌸',
    color: 'from-rose-100/20 to-rose-50/5',
    border: 'border-rose-200/40',
    services: [
      { name: 'Full Hand Waxing (Rica)', duration: '30 min', price: '₹399' },
      { name: 'Full Leg Waxing', duration: '45 min', price: '₹599' },
      { name: 'Upper Lip Threading', duration: '5 min', price: '₹30' },
      { name: 'Full Face Threading', duration: '20 min', price: '₹150' },
    ],
  },
  {
    name: 'Special Packages',
    emoji: '🎁',
    color: 'from-green-100/20 to-green-50/5',
    border: 'border-green-200/40',
    services: [
      { name: 'Essential Beauty Combo', duration: '90 min', price: '₹499', popular: true },
      { name: 'Mega Summer Combo', duration: '180 min', price: '₹1,999', popular: true },
      { name: 'Mehendi Application', duration: '90 min', price: '₹1,299' },
      { name: 'Relaxing Oil Massage', duration: '45 min', price: '₹699' },
    ],
  },
];

export default function Pricing({ onBookingClick }: PricingProps) {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">Transparent Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Services & Prices
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            No hidden charges. All prices are inclusive of products used. Home service available at a small travel surcharge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.08, duration: 0.5 }}
              className={`rounded-3xl border bg-gradient-to-b ${cat.color} ${cat.border} p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">{cat.emoji}</span>
                <h3 className="font-bold text-[#1a1a2e] text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {cat.name}
                </h3>
              </div>

              <div className="space-y-2">
                {cat.services.map((svc) => (
                  <div key={svc.name} className="py-2 border-b border-gray-100 last:border-0">
                    {/* Top row: name + popular badge */}
                    <div className="flex items-start gap-1.5 mb-1">
                      <p className="text-sm font-medium text-[#1a1a2e] flex-1 min-w-0 leading-snug">{svc.name}</p>
                      {svc.popular && (
                        <span className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#F4C2C2]/30 text-[10px] font-bold text-[#c47a7a] mt-0.5">
                          <Star size={8} fill="currentColor" /> Popular
                        </span>
                      )}
                    </div>
                    {/* Bottom row: duration + price + book */}
                    <div className="flex items-center justify-between gap-2">
                      {svc.duration ? (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {svc.duration}
                        </p>
                      ) : <span />}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-[#1a1a2e]">{svc.price}</span>
                        <button
                          onClick={() => onBookingClick(svc.name)}
                          className="px-2.5 py-1 rounded-lg bg-[#F4C2C2] text-[#1a1a2e] text-[11px] font-bold hover:bg-[#e8a8a8] transition-colors whitespace-nowrap"
                          style={{ minHeight: 'unset' }}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Home service note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-gray-500">
            🚗 <strong>Home Service</strong> available in Valasaravakkam & nearby areas — small travel surcharge applies.
          </p>
          <button
            onClick={() => onBookingClick()}
            className="mt-4 px-8 py-3 rounded-full bg-[#1a1a2e] text-white font-bold text-sm hover:bg-[#2d2d4e] transition-colors shadow-lg"
          >
            Book Any Service Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
