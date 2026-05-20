import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Desktop: Diagonal Split */}
      <div className="hidden md:block absolute inset-0">
        {/* Korean side - left */}
        <div
          className="absolute inset-0"
          style={{ clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0 100%)' }}
        >
          <img
            src="/KOREAN_GIRL.png"
            alt="Korean beauty makeup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#40BFFF]/50 via-white/10 to-transparent" />
        </div>

        {/* Bridal side - right */}
        <div
          className="absolute inset-0"
          style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)' }}
        >
          <img
            src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg"
            alt="Indian bridal wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-[#FFE8F0]/50 via-pink-100/10 to-transparent" />
        </div>

        {/* Diagonal center overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(64,191,255,0.15) 0%, rgba(255,232,240,0.6) 45%, rgba(255,200,230,0.15) 100%)',
          }}
        />
      </div>

      {/* Mobile: Stacked */}
      <div className="md:hidden absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-1/2">
          <img
            src="/KOREAN_GIRL.png"
            alt="Korean beauty makeup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#40BFFF]/40" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <img
            src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg"
            alt="Indian bridal wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#FFE8F0]/40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/30" />
      </div>

      {/* Dark overlay on desktop for text readability */}
      <div className="hidden md:block absolute inset-0 bg-black/30" />

      {/* Decorative floral elements */}
      <div className="absolute top-24 right-8 w-32 h-32 opacity-20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="#FFE8F0" strokeWidth="1" />
          <circle cx="60" cy="60" r="35" stroke="#FFE8F0" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <ellipse
              key={i}
              cx={60 + 42 * Math.cos((deg * Math.PI) / 180)}
              cy={60 + 42 * Math.sin((deg * Math.PI) / 180)}
              rx="8"
              ry="14"
              transform={`rotate(${deg} ${60 + 42 * Math.cos((deg * Math.PI) / 180)} ${60 + 42 * Math.sin((deg * Math.PI) / 180)})`}
              fill="#FFE8F0"
            />
          ))}
        </svg>
      </div>

      <div className="absolute bottom-24 left-8 w-24 h-24 opacity-20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <ellipse
              key={i}
              cx={40 + 28 * Math.cos((deg * Math.PI) / 180)}
              cy={40 + 28 * Math.sin((deg * Math.PI) / 180)}
              rx="5"
              ry="10"
              transform={`rotate(${deg} ${40 + 28 * Math.cos((deg * Math.PI) / 180)} ${40 + 28 * Math.sin((deg * Math.PI) / 180)})`}
              fill="#40BFFF"
            />
          ))}
        </svg>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-24">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/60 shadow-2xl mx-auto">
            <img
              src="/logo.jpeg"
              alt="EMBOS Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs tracking-[0.4em] text-[#FFFDD0] uppercase mb-3 font-medium"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 leading-none"
          style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
        >
          EMBOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-sm sm:text-base tracking-[0.3em] text-[#40BFFF] uppercase font-semibold mb-2"
        >
          Beauty Salon + Studio
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="text-xs sm:text-sm tracking-[0.25em] text-[#F4C2C2]/80 uppercase font-medium mb-8"
        >
          For Ladies & Kids
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="max-w-xl text-white/90 text-base sm:text-lg leading-relaxed font-light"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair — curating your most radiant self.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#services"
            className="px-8 py-3.5 rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold tracking-wide hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg text-sm"
          >
            Explore Services
          </a>
          <button
            onClick={() => (window as any).openBookingModal?.()}
            className="px-8 py-3.5 rounded-full bg-[#40BFFF] text-white font-semibold tracking-wide hover:bg-[#1c9ff9] hover:scale-105 transition-all duration-300 text-sm backdrop-blur-sm"
          >
            Book Appointment
          </button>
        </motion.div>

        {/* Split labels */}
        <div className="hidden md:flex absolute bottom-12 left-0 right-0 justify-between px-16 pointer-events-none">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-[#ADD8E6] uppercase font-medium"
          >
            Korean Beauty
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-[#F4C2C2] uppercase font-medium"
          >
            Bridal Studio
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
