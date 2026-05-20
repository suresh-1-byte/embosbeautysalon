import { motion } from 'framer-motion';
import { Scissors, Sparkles, Hand, Home } from 'lucide-react';

const categories = [
  {
    icon: Scissors,
    title: 'Hair Care',
    color: '#40BFFF',
    bg: '#E0F7FF',
    services: [
      'Advanced Layer Cut',
      'U-Cut & V-Cut',
      'Keratin Treatment',
      'Hair Botox',
      'Smoothening',
      'Fashion Color',
      'Highlights & Balayage',
      'Hair Spa',
    ],
  },
  {
    icon: Sparkles,
    title: 'Skin & Facial',
    color: '#40BFFF',
    bg: '#FFE8F0',
    services: [
      'Korean Glass Skin',
      'Gold Facial',
      'D-Tan Treatment',
      'Brightening Facial',
      'Hydra Facial',
      'Anti-Aging Facial',
      'Meso Glow',
      'Clean-up & Bleach',
    ],
  },
  {
    icon: Hand,
    title: 'Hand & Foot Care',
    color: '#40BFFF',
    bg: '#FFD4E6',
    services: [
      'Nail Extensions',
      'Gel Nails',
      'Nail Art',
      'Spa Manicure',
      'Spa Pedicure',
      'Paraffin Treatment',
      'Nail Repair',
      'Foot Scrub',
    ],
  },
  {
    icon: Home,
    title: 'Home Services',
    color: '#40BFFF',
    bg: '#B3E9FF',
    services: [
      'Bridal Makeup at Home',
      'Party Makeup at Home',
      'Threading & Waxing',
      'Facial & Clean-up',
      'Hair Services at Home',
      'Pre-bridal Package',
      'Mehendi Application',
      'All Services Available',
    ],
    highlight: true,
  },
];

export default function ServiceGrid() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-pink-100 to-pink-150/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.35em] text-[#ADD8E6] uppercase font-semibold mb-3">What We Offer</p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            All Services
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            Every service available in-studio and at your doorstep.
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, catIdx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.12, duration: 0.6 }}
                whileHover={{ y: -8, boxShadow: `0 24px 60px ${cat.color}50` }}
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  cat.highlight
                    ? 'border-green-200 bg-[#f5fff7]'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: cat.color + '40' }}
                >
                  <Icon size={22} style={{ color: cat.color === '#FFFDD0' ? '#c9b800' : cat.color }} />
                </div>

                <h3
                  className="text-lg font-bold text-[#1a1a2e] mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {cat.title}
                </h3>

                {cat.highlight && (
                  <div className="mb-3 px-3 py-1.5 rounded-full bg-green-100 inline-block">
                    <p className="text-xs font-semibold text-green-600 tracking-wide">Available at Home</p>
                  </div>
                )}

                <ul className="space-y-2">
                  {cat.services.map((service, i) => (
                    <motion.li
                      key={service}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIdx * 0.08 + i * 0.04 }}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color === '#FFFDD0' ? '#c9b800' : cat.color }}
                      />
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Home service banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#F4C2C2]/20 via-[#FFFDD0]/40 to-[#ADD8E6]/20 border border-pink-100 text-center"
        >
          <Home size={28} className="mx-auto mb-3 text-[#F4C2C2]" />
          <h3
            className="text-2xl font-bold text-[#1a1a2e] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Home Services Available
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            All our premium salon services are available at your doorstep in Valasaravakkam, Chennai and surrounding areas.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-full bg-[#40BFFF] text-white font-semibold text-sm hover:bg-[#1c9ff9] hover:scale-105 transition-all duration-300 shadow-md"
          >
            Book Home Service
          </a>
        </motion.div>
      </div>
    </section>
  );
}
