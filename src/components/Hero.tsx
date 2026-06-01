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



      {/* Center Content — pushed to bottom so it sits below the neck */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-[100dvh] text-center px-5 sm:px-6 pb-8 sm:pb-12 w-full max-w-full overflow-hidden">

        {/* EMBOS Logo — black bg removed via mix-blend-mode */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-0 sm:mb-1"
        >
          <img
            src="/logo wobg.png"
            alt="EMBOS Beauty Salon & Studio"
            className="w-56 sm:w-72 md:w-80 lg:w-96 mx-auto object-contain"
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.3))' }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-[10px] sm:text-sm tracking-[0.2em] text-[#F4C2C2]/90 uppercase font-medium mb-3 sm:mb-4 mt-2"
        >
          For Ladies &amp; Kids
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-4 sm:mb-5"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="max-w-xs sm:max-w-lg text-white/90 text-xs sm:text-base leading-relaxed font-light px-2 mb-6 sm:mb-8"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
        >
          Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-none justify-center"
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
