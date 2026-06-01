import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE + TABLET (hidden on lg+)
          Image as true background, content overlaid
      ══════════════════════════════════════ */}
      <section
        id="home"
        className="lg:hidden relative w-full overflow-hidden"
        style={{ minHeight: '100svh', backgroundColor: '#000' }}
      >
        {/* Background image — absolute, zoomed out to show full portrait */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/bg image.png")',
            backgroundSize: '100% auto',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000',
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)' }}
        />

        {/* Content — overlaid, pulled up closer to image */}
        <div
          className="absolute left-0 right-0 z-10 flex flex-col items-center text-center px-4"
          style={{ top: '52%' }}
        >
          {/* Logo */}
          <img
            src="/logo wobg.png"
            alt="EMBOS Beauty Salon & Studio"
            className="mx-auto object-contain mb-2"
            style={{
              width: 'clamp(180px, 55vw, 220px)',
              mixBlendMode: 'screen',
            }}
          />

          <p className="text-[10px] tracking-[0.2em] text-[#F4C2C2]/90 uppercase font-medium mb-2">
            For Ladies &amp; Kids
          </p>

          <div className="w-14 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-3" />

          <p
            className="text-white/90 leading-relaxed font-light mb-5 px-2"
            style={{
              fontSize: 'clamp(13px, 3.5vw, 15px)',
              maxWidth: '300px',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
          </p>

          <div className="flex flex-col gap-3 w-full" style={{ maxWidth: '300px' }}>
            <a
              href="#services"
              className="w-full py-3 rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold text-sm text-center hover:bg-white transition-all duration-300 shadow-lg"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="w-full py-3 rounded-full bg-[#40BFFF] text-white font-semibold text-sm text-center hover:bg-[#1c9ff9] transition-all duration-300"
            >
              Book Appointment
            </a>
          </div>
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
            backgroundImage: 'url("/bg image.png")',
            backgroundSize: '75%',
            backgroundPosition: 'center 80px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
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
