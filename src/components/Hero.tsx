import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE + TABLET (hidden on lg+)
      ══════════════════════════════════════ */}
      <section
        id="home"
        className="lg:hidden relative w-full"
        style={{ height: '100vh', minHeight: '100vh', backgroundColor: '#000', overflow: 'hidden' }}
      >
        {/* z-index 0 — Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: 'url("/hero bg.jpeg")',
            backgroundSize: '110%',
            backgroundPosition: 'center 5%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* z-index 1 — Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.80) 75%, rgba(0,0,0,0.92) 100%)',
          }}
        />

        {/* z-index 10 — All content overlaid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: '5vh',
            paddingLeft: '20px',
            paddingRight: '20px',
            textAlign: 'center',
          }}
        >
          {/* Logo + small profile side by side */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <img
              src="/logo wobg.png"
              alt="EMBOS"
              style={{ width: 'clamp(140px, 42vw, 190px)', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
            {/* Small profile image */}
            <div style={{ width: '48px', height: '60px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.25)', flexShrink: 0 }}>
              <img src="/kerala bridal.jpeg" alt="Bridal" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          </div>

          {/* For Ladies & Kids */}
          <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(244,194,194,0.9)', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
            For Ladies &amp; Kids
          </p>

          {/* Divider */}
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #F4C2C2, transparent)', marginBottom: '8px' }} />

          {/* Description */}
          <p style={{
            fontSize: 'clamp(10px, 2.8vw, 13px)',
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.6,
            fontWeight: 300,
            maxWidth: '260px',
            marginBottom: '16px',
            textShadow: '0 2px 8px rgba(0,0,0,0.95)',
          }}>
            Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', width: '100%', maxWidth: '280px', justifyContent: 'center' }}>
            <a
              href="#services"
              style={{
                flex: 1, padding: '10px 0', borderRadius: '999px',
                background: '#F4C2C2', color: '#1a1a2e',
                fontWeight: 600, fontSize: '12px', textAlign: 'center',
                textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              Explore
            </a>
            <a
              href="#contact"
              style={{
                flex: 1, padding: '10px 0', borderRadius: '999px',
                background: '#40BFFF', color: '#fff',
                fontWeight: 600, fontSize: '12px', textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Book Now
            </a>
          </div>

          {/* Bottom labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '12px' }}>
            <p style={{ fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(173,216,230,0.6)', textTransform: 'uppercase' }}>Korean Beauty</p>
            <p style={{ fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(244,194,194,0.6)', textTransform: 'uppercase' }}>Bridal Studio</p>
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
            backgroundImage: 'url("/hero bg.jpeg")',
            backgroundSize: 'contain',
            backgroundPosition: 'center 60px',
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
