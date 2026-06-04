import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import OneSignalBell from './OneSignalBell';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Our Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Offers', href: '#offers' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-pink-100/60'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 sm:gap-3 group no-min" style={{ minHeight: 'unset' }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-pink-200 shadow-md flex-shrink-0">
                <img src="/logo.jpeg" alt="EMBOS Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className={`text-lg sm:text-xl font-bold tracking-widest ${scrolled ? 'text-[#1a1a2e]' : 'text-white'}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                  EMBOS
                </p>
                <p className={`text-[10px] tracking-[0.25em] font-medium uppercase ${scrolled ? 'text-[#40BFFF]' : 'text-[#ADD8E6]'}`}>
                  Beauty Salon + Studio
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`no-min text-sm font-medium tracking-wide transition-colors duration-200 hover:text-[#F4C2C2] relative group ${
                    scrolled ? 'text-[#1a1a2e]' : 'text-white'
                  }`}
                  style={{ minHeight: 'unset' }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4C2C2] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Desktop right: Bell + Book Now */}
            <div className="hidden md:flex items-center gap-3">
              <OneSignalBell variant={scrolled ? 'dark' : 'light'} />
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide bg-[#40BFFF] text-white hover:bg-[#1c9ff9] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Book Now
              </a>
            </div>

            {/* Mobile: Bell + Hamburger */}
            <div className="md:hidden flex items-center gap-1">
              <OneSignalBell variant={scrolled ? 'dark' : 'light'} />
              <button
                className="p-2 rounded-lg"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen
                  ? <X className={scrolled ? 'text-[#1a1a2e]' : 'text-white'} size={22} />
                  : <Menu className={scrolled ? 'text-[#1a1a2e]' : 'text-white'} size={22} />
                }
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer — z-[60] so it covers the header (z-50) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a1a 40%, #0a1020 100%)',
              gap: 'clamp(1rem, 3.5vh, 1.75rem)',
            }}
          >
            {/* Decorative background glow */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #F4C2C2 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #40BFFF 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

            {/* Logo at top */}
            <div className="absolute top-6 left-5 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                <img src="/logo.jpeg" alt="EMBOS" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white text-sm font-bold tracking-widest" style={{ fontFamily: 'Playfair Display, serif' }}>EMBOS</p>
                <p className="text-[#ADD8E6] text-[9px] tracking-[0.2em] uppercase">Beauty Salon + Studio</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-4 p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mb-2" />

            {/* Nav items */}
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setMenuOpen(false)}
                className="no-min text-xl font-semibold tracking-[0.08em] text-white/90 hover:text-[#F4C2C2] transition-colors relative group"
                style={{ fontFamily: 'Playfair Display, serif', minHeight: 'unset' }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[#F4C2C2] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#40BFFF]/50 to-transparent mt-1" />

            {/* Book Now */}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              onClick={() => setMenuOpen(false)}
              className="px-10 py-3 rounded-full bg-[#40BFFF] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#40BFFF]/30 hover:bg-[#1c9ff9] transition-all duration-300"
            >
              Book Now
            </motion.a>

            {/* Bottom tagline */}
            <p className="absolute bottom-8 text-white/20 text-[10px] tracking-[0.3em] uppercase">For Ladies &amp; Kids</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Book Now — desktop only */}
      <motion.a
        href="#contact"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="hidden md:flex fixed bottom-8 right-6 z-50 px-5 py-3 rounded-full bg-[#40BFFF] text-white font-bold text-sm tracking-wide shadow-xl hover:bg-[#1c9ff9] hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/40 items-center"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        Book Now
      </motion.a>
    </>
  );
}
