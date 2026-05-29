import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Full background: black & gold — full image visible, no crop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#000',
          backgroundImage: 'url("/bg image.png")',
          backgroundSize: '75%',
          backgroundPosition: 'center 80px',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Accent portrait, desktop only, bottom-right */}
      <div className="hidden md:block absolute bottom-16 right-10 z-10 w-36 h-48 lg:w-44 lg:h-60 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
        <img src="/kerala bridal.jpeg" alt="Kerala Bridal portrait" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>



      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] text-center px-5 sm:px-6 py-20 w-full max-w-full overflow-hidden">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-5 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/60 shadow-2xl mx-auto">
            <img src="/logo.jpeg" alt="EMBOS Logo" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[10px] sm:text-xs tracking-[0.35em] text-[#FFFDD0] uppercase mb-2 sm:mb-3 font-medium"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-2 sm:mb-3 leading-none"
          style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
        >
          EMBOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xs sm:text-base tracking-[0.25em] sm:tracking-[0.3em] text-[#40BFFF] uppercase font-semibold mb-1 sm:mb-2"
        >
          Beauty Salon + Studio
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="text-[10px] sm:text-sm tracking-[0.2em] text-[#F4C2C2]/80 uppercase font-medium mb-5 sm:mb-8"
        >
          For Ladies &amp; Kids
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-5 sm:mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="max-w-xs sm:max-w-xl text-white/90 text-sm sm:text-lg leading-relaxed font-light px-2"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-none justify-center"
        >
          <a
            href="#services"
            className="px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold tracking-wide hover:bg-white transition-all duration-300 shadow-lg text-sm text-center"
          >
            Explore Services
          </a>
          <a
            href="#contact"
            className="px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#40BFFF] text-white font-semibold tracking-wide hover:bg-[#1c9ff9] transition-all duration-300 text-sm text-center"
          >
            Book Appointment
          </a>
        </motion.div>

        {/* Split labels — desktop only */}
        <div className="hidden md:flex absolute bottom-12 left-0 right-0 justify-between px-16 pointer-events-none">
          <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-[#ADD8E6] uppercase font-medium">Korean Beauty</motion.p>
          <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-[#F4C2C2] uppercase font-medium">Bridal Studio</motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
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
