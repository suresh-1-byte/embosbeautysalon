import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE + TABLET (hidden on lg+)
          Image on top, content below in normal flow
      ══════════════════════════════════════ */}
      <section
        id="home"
        className="lg:hidden w-full"
        style={{ backgroundColor: '#000', margin: 0, padding: 0 }}
      >
        {/* Hero image — full width, natural height, no crop */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '64px' }}>
          <img
            src="/hero bg.jpeg"
            alt="EMBOS Beauty"
            fetchpriority="high"
            decoding="async"
            style={{ width: '100%', display: 'block' }}
          />
          {/* Gradient fade at bottom into content */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '25%',
            background: 'linear-gradient(to bottom, transparent, #000)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Content below image — tight, no gap */}
        <div style={{
          backgroundColor: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          padding: '0px 24px 60px',
          marginTop: '-2px',
        }}>
          {/* Logo only */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <img
              src="/logo wobg.png"
              alt="EMBOS Beauty Salon & Studio"
              style={{ width: 'clamp(150px, 46vw, 200px)', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
          </div>

          <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(244,194,194,0.9)', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
            For Ladies &amp; Kids
          </p>

          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #F4C2C2, transparent)', marginBottom: '10px' }} />

          <p style={{
            fontSize: 'clamp(12px, 3.5vw, 15px)', color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.7, fontWeight: 300, maxWidth: '300px', marginBottom: '20px',
          }}>
            Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
            <a href="#services" style={{
              width: '100%', padding: '14px 0', borderRadius: '999px',
              background: '#F4C2C2', color: '#1a1a2e', fontWeight: 600,
              fontSize: '14px', textAlign: 'center', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>Explore Services</a>
            <a href="#contact" style={{
              width: '100%', padding: '14px 0', borderRadius: '999px',
              background: '#40BFFF', color: '#fff', fontWeight: 600,
              fontSize: '14px', textAlign: 'center', textDecoration: 'none',
            }}>Book Appointment</a>
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

        <div
          className="absolute left-0 right-0 z-10 flex flex-col items-center text-center px-6"
          style={{ top: '68%', transform: 'translateY(-50%)' }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mb-1">
            <img src="/logo wobg.png" alt="EMBOS Beauty Salon & Studio" className="w-72 lg:w-80 xl:w-96 mx-auto object-contain" style={{ mixBlendMode: 'screen' }} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-xs lg:text-sm tracking-[0.2em] text-[#F4C2C2]/90 uppercase font-medium mb-2">
            For Ladies &amp; Kids
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65, duration: 0.6 }} className="w-16 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-3" />

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="max-w-lg text-sm lg:text-base leading-relaxed font-light px-2 mb-5 text-white/90" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
            Architects of grace, beauty therapists by soul. We specialize in the art of the brow and the restoration of skin and hair.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.6 }} className="flex flex-row gap-4 justify-center">
            <a href="#services" className="px-8 py-3.5 rounded-full bg-[#F4C2C2] text-[#1a1a2e] font-semibold tracking-wide hover:bg-white transition-all duration-300 shadow-lg text-sm text-center">Explore Services</a>
            <a href="#contact" className="px-8 py-3.5 rounded-full bg-[#40BFFF] text-white font-semibold tracking-wide hover:bg-[#1c9ff9] transition-all duration-300 text-sm text-center">Book Appointment</a>
          </motion.div>
        </div>

        <div className="invisible" style={{ minHeight: '100svh' }} />

        <div className="absolute bottom-12 left-0 right-0 flex justify-between px-16 pointer-events-none z-10">
          <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.6 }} className="text-xs tracking-[0.3em] text-[#ADD8E6] uppercase font-medium">Korean Beauty</motion.p>
          <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.6 }} className="text-xs tracking-[0.3em] text-[#F4C2C2] uppercase font-medium">Bridal Studio</motion.p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-white/70" />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
