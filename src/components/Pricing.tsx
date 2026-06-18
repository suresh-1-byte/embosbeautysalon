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
    name: 'Threading',
    emoji: '🧵',
    color: 'from-rose-100/20 to-rose-50/5',
    border: 'border-rose-200/40',
    services: [
      { name: 'Eyebrow Threading', duration: '10 min', price: '₹50' },
      { name: 'Upper Lip Threading', duration: '5 min', price: '₹20' },
      { name: 'Chin Threading', duration: '5 min', price: '₹20' },
      { name: 'Forehead Threading', duration: '5 min', price: '₹20' },
      { name: 'Full Face Threading', duration: '20 min', price: '₹150' },
      { name: 'Side Threading', duration: '10 min', price: '₹40' },
    ],
  },
  {
    name: 'Face Waxing (Peel Off)',
    emoji: '✨',
    color: 'from-yellow-100/20 to-yellow-50/5',
    border: 'border-yellow-200/40',
    services: [
      { name: 'Full Face Wax', duration: '20 min', price: '₹200' },
      { name: 'Upper Lip Wax', duration: '5 min', price: '₹50' },
      { name: 'Chin Wax', duration: '5 min', price: '₹50' },
    ],
  },
  {
    name: 'D-Tan',
    emoji: '🌞',
    color: 'from-orange-100/20 to-orange-50/5',
    border: 'border-orange-200/40',
    services: [
      { name: 'D-Tan Mask (Face & Neck)', duration: '30 min', price: '₹800' },
      { name: 'Full Arms D-Tan', duration: '30 min', price: '₹500' },
      { name: 'Half Back D-Tan', duration: '30 min', price: '₹300' },
      { name: 'Full Back D-Tan', duration: '45 min', price: '₹500' },
      { name: 'Full Body D-Tan', duration: '90 min', price: '₹1,800' },
    ],
  },
  {
    name: 'Bleach',
    emoji: '💫',
    color: 'from-sky-100/20 to-sky-50/5',
    border: 'border-sky-200/40',
    services: [
      { name: 'Full Hand Bleach', duration: '30 min', price: '₹600' },
      { name: 'Half Leg Bleach', duration: '30 min', price: '₹700' },
      { name: 'Ankles Length Bleach', duration: '20 min', price: '₹300' },
    ],
  },
  {
    name: 'Waxing',
    emoji: '🌸',
    color: 'from-rose-100/20 to-rose-50/5',
    border: 'border-rose-200/40',
    services: [
      { name: 'Full Hand Wax (Rica)', duration: '30 min', price: '₹500', popular: true },
      { name: 'Full Hand Wax (Korean)', duration: '30 min', price: '₹600' },
      { name: 'Half Hand Wax (Rica)', duration: '20 min', price: '₹300' },
      { name: 'Half Hand Wax (Korean)', duration: '20 min', price: '₹400' },
      { name: 'Underarm Wax (Peel Off)', duration: '10 min', price: '₹200' },
      { name: 'Half Leg Wax (Rica)', duration: '30 min', price: '₹500' },
      { name: 'Half Leg Wax (Korean)', duration: '30 min', price: '₹600' },
      { name: 'Full Leg Wax (Rica)', duration: '45 min', price: '₹800' },
      { name: 'Full Leg Wax (Korean)', duration: '45 min', price: '₹1,000' },
      { name: 'Intimate Korean Wax (Peel Off)', duration: '30 min', price: '₹2,000' },
      { name: 'Full Body Wax (Rica)', duration: '90 min', price: '₹1,800' },
      { name: 'Full Body Wax (Korean)', duration: '90 min', price: '₹2,000' },
      { name: 'Blouse Line Wax (Rica)', duration: '15 min', price: '₹300' },
      { name: 'Blouse Line Wax (Korean)', duration: '15 min', price: '₹500' },
    ],
  },
  {
    name: 'Facial',
    emoji: '🧖',
    color: 'from-[#F4C2C2]/20 to-[#F4C2C2]/5',
    border: 'border-[#F4C2C2]/40',
    services: [
      { name: 'Glow Facial', duration: '60 min', price: '₹1,000', popular: true },
      { name: 'Shine & Glow Facial', duration: '60 min', price: '₹1,800' },
      { name: 'Vitamin C Brightening Facial', duration: '60 min', price: '₹1,600' },
      { name: 'Youthful Facial', duration: '60 min', price: '₹1,800' },
      { name: 'Stay Young Facial', duration: '75 min', price: '₹2,000' },
      { name: 'Organic Oil Facial', duration: '60 min', price: '₹1,300' },
      { name: 'D-Tan Off Facial (Glow Up)', duration: '60 min', price: '₹1,500' },
      { name: 'Ayurvedic Facial', duration: '75 min', price: '₹2,500' },
      { name: 'O3 Bridal Facial', duration: '75 min', price: '₹3,000' },
      { name: 'Premium Bridal Gold Facial', duration: '90 min', price: '₹3,800' },
    ],
  },
  {
    name: 'Cleanup',
    emoji: '💆',
    color: 'from-green-100/20 to-green-50/5',
    border: 'border-green-200/40',
    services: [
      { name: 'Vit-C Brightening Cleanup', duration: '30 min', price: '₹599' },
      { name: 'Classic Cleanup', duration: '30 min', price: '₹499' },
      { name: 'Skin Tightening Cleanup', duration: '30 min', price: '₹699' },
      { name: 'D-Tan Cleanup', duration: '30 min', price: '₹700' },
    ],
  },
  {
    name: 'LED Mask Therapy (Add-on)',
    emoji: '💡',
    color: 'from-violet-100/20 to-violet-50/5',
    border: 'border-violet-200/40',
    services: [
      { name: '3-in-1 LED Light Therapy Face Mask', duration: '10 min', price: '₹299' },
      { name: 'Peel Off Mask', duration: '10 min', price: '₹199' },
      { name: 'V4 Lifting (Gua-sha Massage)', duration: '10 min', price: '₹199' },
      { name: 'Eye Massage', duration: '10 min', price: '₹299' },
      { name: 'Neck & Shoulder Relaxation Massage', duration: '30 min', price: '₹499' },
      { name: 'Back Relaxation Massage', duration: '30 min', price: '₹799' },
      { name: 'Foot Reflexology Massage', duration: '30 min', price: '₹599' },
      { name: 'Hand Reflexology Massage', duration: '30 min', price: '₹499' },
    ],
  },
  {
    name: 'Mani - Pedicure',
    emoji: '💅',
    color: 'from-purple-100/20 to-purple-50/5',
    border: 'border-purple-200/40',
    services: [
      { name: 'Classic Pedicure', duration: '45 min', price: '₹550', popular: true },
      { name: 'Classic Manicure', duration: '30 min', price: '₹350' },
      { name: 'O3 Pedicure', duration: '60 min', price: '₹749' },
      { name: 'O3 Manicure', duration: '45 min', price: '₹450' },
      { name: 'Ice Cream Pedicure', duration: '60 min', price: '₹849' },
      { name: 'Ice Cream Manicure', duration: '45 min', price: '₹550' },
      { name: 'Korean Luxe Pedicure', duration: '75 min', price: '₹1,199' },
      { name: 'Korean Luxe Manicure', duration: '60 min', price: '₹750' },
      { name: 'Add-on: Foot Soak + Bubble', duration: '', price: 'Add-on' },
    ],
  },
  {
    name: 'Hair Spa',
    emoji: '🧴',
    color: 'from-[#ADD8E6]/20 to-[#ADD8E6]/5',
    border: 'border-[#ADD8E6]/40',
    services: [
      { name: 'Nourishing Hair Spa', duration: '45 min', price: '₹800' },
      { name: 'Keratin Boost Hair Spa', duration: '60 min', price: '₹1,000', popular: true },
      { name: 'Deep Cure Hair Spa', duration: '60 min', price: '₹1,500' },
      { name: 'Healthy Root Hair Spa', duration: '60 min', price: '₹1,200' },
      { name: 'Anti Hairfall Spa', duration: '60 min', price: '₹1,400' },
      { name: 'Dandruff Treatment', duration: '60 min', price: '₹2,000' },
      { name: 'Lice Treatment', duration: '60 min', price: '₹3,000' },
    ],
  },
  {
    name: 'Hair Treatments',
    emoji: '💇',
    color: 'from-teal-100/20 to-teal-50/5',
    border: 'border-teal-200/40',
    services: [
      { name: 'Smoothing (Short Hair)', duration: '120 min', price: '₹3,000', popular: true },
      { name: 'Keratin (Short Hair)', duration: '120 min', price: '₹4,000 (20ml)' },
      { name: 'Botox (Short Hair)', duration: '120 min', price: '₹5,000 (20ml)' },
      { name: '7x Pro Korean Treatments (Short Hair)', duration: '120 min', price: '₹6,000 (30ml)' },
    ],
  },
  {
    name: 'Body Massage',
    emoji: '🛁',
    color: 'from-amber-100/20 to-amber-50/5',
    border: 'border-amber-200/40',
    services: [
      { name: 'Full Body Massage (Organic Oil)', duration: '60 min', price: '₹1,500' },
      { name: 'Full Body Massage (Cream)', duration: '60 min', price: '₹2,000' },
      { name: 'Back Massage Full (Oil)', duration: '30 min', price: '₹500' },
      { name: 'Back Massage Full (Cream)', duration: '30 min', price: '₹600' },
      { name: 'Shoulder & Neck Massage (Oil)', duration: '20 min', price: '₹300' },
      { name: 'Shoulder & Neck Massage (Cream)', duration: '20 min', price: '₹400' },
      { name: 'Half Leg Massage (Oil)', duration: '20 min', price: '₹500' },
      { name: 'Half Leg Massage (Cream)', duration: '20 min', price: '₹600' },
      { name: 'Foot Reflexology (Oil)', duration: '30 min', price: '₹500' },
      { name: 'Foot Reflexology (Cream)', duration: '30 min', price: '₹600' },
      { name: 'Head Oil Massage', duration: '20 min', price: '₹300' },
      { name: 'Hair Wash & Deep Conditioning', duration: '30 min', price: '₹500' },
      { name: 'Blow Set', duration: '20 min', price: '₹300' },
      { name: 'Deep Blowdry', duration: '30 min', price: '₹1,000' },
      { name: 'Deep Ironing with Setting', duration: '30 min', price: '₹1,000' },
      { name: 'Steaming with Setting', duration: '30 min', price: '₹1,000' },
      { name: 'Curling', duration: '30 min', price: '₹1,500' },
    ],
  },
  {
    name: 'Aesthetic Services',
    emoji: '⭐',
    color: 'from-pink-100/20 to-pink-50/5',
    border: 'border-pink-200/40',
    services: [
      { name: 'Micro Blading Eyebrow (Shading)', duration: '2 sittings', price: '₹6,000', popular: true },
      { name: 'Korean Pigmentation Removal', duration: '3 sittings', price: '₹15,000' },
      { name: 'Hair Extension (12 inch+)', duration: '', price: 'From ₹12,000' },
      { name: 'Nano Ring Extension', duration: '', price: 'From ₹12,000' },
      { name: 'Keratin Glue Extension', duration: '', price: 'From ₹12,000' },
      { name: 'Mini Micro Ring Extension', duration: '', price: 'From ₹12,000' },
      { name: 'Invisible Extension', duration: '', price: 'From ₹12,000' },
    ],
  },
  {
    name: 'Saree & Special',
    emoji: '🥻',
    color: 'from-amber-100/20 to-amber-50/5',
    border: 'border-amber-200/40',
    services: [
      { name: 'Saree Draping', duration: '30 min', price: '₹1,000', popular: true },
      { name: 'Mehendi Application', duration: '90 min', price: '₹1,299' },
      { name: 'Nail Art & Extensions', duration: '60 min', price: '₹799' },
      { name: 'Brow Sculpting', duration: '30 min', price: '₹399' },
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
