import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── DESKTOP background (md+): contain, centered, 80px from top ── */}
      <div
        className="hidden md:block absolute inset-0"
        style={{
          backgroundColor: '#000',
          backgroundImage: 'url("/bg image.png")',
          backgroundSize: '75%',
          backgroundPosition: 'center 80px',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>

      {/* ── MOBILE background: contain, top-center, full subject visible ── */}
      <div
        className="md:hidden absolute inset-0"
        style={{
          backgroundColor: '#000',
          backgroundImage: 'url("/bg image.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
      </div>

      {/* ── Accent portrait — desktop only, bottom-right ── */}
      <div
        className="hidden md:block absolute bottom-16 right-10 z-10 w-36 h-48 lg:w-44 lg:h-60 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
      >
        <img src="/kerala bridal.jpeg" alt="Kerala Bridal portrait" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* ── DESKTOP content: absolute, positioned at 68% from top ── */}
      <div
        className="hidden md:flex absolute left-0 right-0 z-10 flex-col items-center text-center px-6"
        style={{ top: '68%', transform: 'translateY(-50%)' }}
      >
        <ContentBlock />
      </div>

      {/* ── MOBILE content: absolute, positioned at 68% from top ── */}
      <div
        className="md:hidden absolute left-0 right-0 z-10 flex flex-col items-center text-center px-5"
        style={{ top: '68%', transform: 'translateY(-50%)' }}
      >
        <ContentBlock mobile />
      </div>

      {/* ── Section height spacer so page flow works ── */}
      <div className="invisible" style={{ minHeight: '100svh' }} />

      {/* ── Split labels — desktop only ── */}
      <div className="hidden md:flex absolute bottom-12 left-0 right-0 justify-between px-16 pointer-events-none z-10">
        <motion.p
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="text-xs tracking-[0.3em] text-[#ADD8E6] uppercase font-medium"
        >Korean Beauty</motion.p>
        <motion.p
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="text-xs tracking-[0.3em] text-[#F4C2C2] uppercase font-medium"
        >Bridal Studio</motion.p>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

function ContentBlock({ mobile }: { mobile?: boolean }) {
  return (
    <>
      {/* Logo — blend mode removes black bg */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-1"
      >
        <img
          src="/logo wobg.png"
          alt="EMBOS Beauty Salon & Studio"
          className={`mx-auto object-contain ${mobile ? 'w-48' : 'w-64 sm:w-72 md:w-80 lg:w-96'}`}
          style={{ mixBlendMode: 'screen' }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className={`tracking-[0.2em] text-[#F4C2C2]/90 uppercase font-medium mb-2 ${mobile ? 'text-[9px]' : 'text-[10px] sm:text-sm'}`}
      >
        For Ladies &amp; Kids
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        className="w-16 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-2 sm:mb-3"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className={`max-w-xs leading-relaxed font-light px-2 mb-4 sm:mb-5 text-white/90 ${mobile ? 'text-[10px]' : 'text-xs sm:text-sm md:text-base'}`}
        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
      >
        Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className={`flex gap-3 justify-center ${mobile ? 'flex-col w-full max-w-[220px]' : 'flex-col sm:flex-row'}`}
      >
        <a
          href="#services"
          className={`rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold tracking-wide hover:bg-white transition-all duration-300 shadow-lg text-center ${mobile ? 'px-5 py-2 text-xs' : 'px-7 py-3 sm:px-8 sm:py-3.5 text-sm'}`}
        >
          Explore Services
        </a>
        <a
          href="#contact"
          className={`rounded-full bg-[#40BFFF] text-white font-semibold tracking-wide hover:bg-[#1c9ff9] transition-all duration-300 text-center ${mobile ? 'px-5 py-2 text-xs' : 'px-7 py-3 sm:px-8 sm:py-3.5 text-sm'}`}
        >
          Book Appointment
        </a>
      </motion.div>
    </>
  );
}
