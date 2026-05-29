import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PillarServices() {
  return (
    <section id="services" className="py-24 px-4 bg-gradient-to-b from-pink-100/50 to-white/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Pinyon Script, cursive' }}
          >
            Signature Experience
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            A promise of radiance for your most beautiful beginning.
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#40BFFF] to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Bridal Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden group max-w-4xl mx-auto w-full"
          >
            {/* Responsive height: shorter on mobile, full on desktop */}
            <div className="relative h-56 sm:h-80 md:h-[28rem] overflow-hidden">
              <motion.img
                src="/bridal page background.png"
                alt="Bridal Studio"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFE8F0]/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/25" />

              {/* Gold filigree — desktop only */}
              <div className="absolute top-6 left-6 opacity-40 hidden sm:block">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="28" stroke="#FFFDD0" strokeWidth="0.8" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <line key={i} x1="30" y1="30"
                      x2={30 + 25 * Math.cos((deg * Math.PI) / 180)}
                      y2={30 + 25 * Math.sin((deg * Math.PI) / 180)}
                      stroke="#FFFDD0" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 flex flex-col items-start">
                <p className="text-[10px] sm:text-xs tracking-[0.3em] text-white/70 uppercase font-medium mb-1 sm:mb-2">Signature Service</p>
                <h3
                  className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
                >
                  Bridal Studio
                </h3>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-sm mb-3 hidden sm:block">
                  Traditional elegance with modern artistry for your special day.
                </p>
                <Link
                  to="/bridal-studio"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#40BFFF]/95 text-white text-xs font-semibold hover:bg-[#20A8F3] transition-colors group"
                >
                  Know More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
