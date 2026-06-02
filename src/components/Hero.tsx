import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE + TABLET (hidden on lg+)
          Same concept as desktop: bg image + floating owner card
      ══════════════════════════════════════ */}
      <section
        id="home"
        className="lg:hidden relative w-full overflow-hidden"
        style={{ minHeight: '100svh', backgroundColor: '#000' }}
      >
        {/* Black & gold background — same as desktop */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#000',
            backgroundImage: 'url("/hero bg.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 15%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/75" />
        </div>

        {/* Owner photo — small floating card, bottom-right */}
        <div
          className="absolute bottom-20 right-3 z-10 rounded-xl overflow-hidden shadow-2xl border border-white/20"
          style={{ width: '18vw', maxWidth: '72px', aspectRatio: '3/4', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
        >
          <img src="/kerala bridal.jpeg" alt="Bridal" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Center content — overlaid on image */}
        <div
          className="absolute left-0 right-0 z-10 flex flex-col items-center text-center px-5"
          style={{ bottom: '7%' }}
        >
          {/* Logo */}
          <img
            src="/logo wobg.png"
            alt="EMBOS Beauty Salon & Studio"
            className="mx-auto object-contain mb-1"
            style={{ width: 'clamp(160px, 50vw, 210px)', mixBlendMode: 'screen' }}
          />

          <p className="text-[9px] tracking-[0.2em] text-[#F4C2C2]/90 uppercase font-medium mb-2">
            For Ladies &amp; Kids
          </p>

          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-2" />

          <p
            className="text-white/85 leading-relaxed font-light mb-4 px-1"
            style={{ fontSize: '11px', maxWidth: '260px', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
          >
            Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
          </p>

          <div className="flex flex-row gap-2 justify-center w-full" style={{ maxWidth: '280px' }}>
            <a
              href="#services"
              className="flex-1 py-2.5 rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold text-xs text-center hover:bg-white transition-all duration-300 shadow-lg"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="flex-1 py-2.5 rounded-full bg-[#40BFFF] text-white font-semibold text-xs text-center hover:bg-[#1c9ff9] transition-all duration-300"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Bottom labels */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-between px-5 pointer-events-none z-10">
          <p className="text-[8px] tracking-[0.25em] text-[#ADD8E6]/70 uppercase font-medium">Korean Beauty</p>
          <p className="text-[8px] tracking-[0.25em] text-[#F4C2C2]/70 uppercase font-medium">Bridal Studio</p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESKTOP (lg+) — UNCHANGED
      ══════════════════════════════════════ */}
      <section
        id="home"
        className="relative w-full overflow-hidden hidden lg:block"
        style={{ minHeight: '100svh' }}
      >
        {/* Desktop background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#000',
            backgroundImage: 'url("/hero bg.jpeg")',
            backgroundSize: 'contain',
            backgroundPosition: 'center 70px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
        </div>

        {/* Accent portrait — bottom-right */}
        <div
          className="absolute bottom-16 right-10 z-10 w-36 h-48 xl:w-44 xl:h-60 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
        >
          <img src="/kerala bridal.jpeg" alt="Kerala Bridal portrait" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Desktop content at 68% from top */}
        <div
          className="absolute left-0 right-0 z-10 flex flex-col items-center text-center px-6"
          style={{ top: '68%', transform: 'translateY(-50%)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-1"
          >
            <img
              src="/logo wobg.png"
              alt="EMBOS Beauty Salon & Studio"
              className="w-72 lg:w-80 xl:w-96 mx-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xs lg:text-sm tracking-[0.2em] text-[#F4C2C2]/90 uppercase font-medium mb-2"
          >
            For Ladies &amp; Kids
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-3"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-lg text-sm lg:text-base leading-relaxed font-light px-2 mb-5 text-white/90"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
          >
            Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex flex-row gap-4 justify-center"
          >
            <a
              href="#services"
              className="px-8 py-3.5 rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold tracking-wide hover:bg-white transition-all duration-300 shadow-lg text-sm text-center"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full bg-[#40BFFF] text-white font-semibold tracking-wide hover:bg-[#1c9ff9] transition-all duration-300 text-sm text-center"
            >
              Book Appointment
            </a>
          </motion.div>
        </div>

        {/* Section height spacer */}
        <div className="invisible" style={{ minHeight: '100svh' }} />

        {/* Split labels */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-between px-16 pointer-events-none z-10">
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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
    </>
  );
}
