import { motion } from 'framer-motion';

const OFFERS = [
  {
    title: 'Essential Beauty Combo',
    description: 'A quick refreshment for your skin and basic grooming needs.',
    features: [
      'D-Tan Treatment',
      'Deep Facial Cleanup',
      'Relaxing Oil Massage',
      'Eyebrows Threading',
      'Upper Lip Threading',
    ],
    price: '₹499/-',
  },
  {
    title: 'Hot Summer Cool Offer (Mega Summer Combo)',
    description: 'Our premium all-in-one transformation package featuring our signature Korean treatments.',
    features: [
      'Korean Glass Skin Facial (New)',
      'Korean D-Tan',
      'Keratin Hair Spa',
      'Full Hand Waxing (Rica Wax)',
      'Any Hair Cut of your choice',
      'Threading (Eyebrows)',
      'Upper Lip Threading',
      'Nail Cut and Polish',
    ],
    price: '₹1999/-',
  },
];

export default function Offers() {
  return (
    <section id="offers" className="py-24 px-4 bg-gradient-to-b from-pink-150/30 to-pink-100/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.35em] text-[#FFE8F0] uppercase font-semibold mb-3">Special Offers</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Exclusive Home Page Offers
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mt-4 text-sm leading-relaxed">
            Discover curated packages designed to make your wedding journey effortless and beautiful.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {OFFERS.map((offer) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-[#40BFFF]/30 bg-white/50 p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">{offer.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{offer.description}</p>
              <ul className="mb-4 list-disc list-inside text-sm text-gray-600 space-y-2">
                {offer.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="text-sm font-semibold text-[#1a1a2e]">Price: {offer.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
