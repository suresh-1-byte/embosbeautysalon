import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import OneSignalBell from './OneSignalBell';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Offers', href: '#offers' },
  { label: 'About Us', href: '#about' },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200 shadow-md group-hover:shadow-pink-200 transition-shadow duration-300">
                <img
                  src="/logo.jpeg"
                  alt="EMBOS Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xl font-bold tracking-widest text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  EMBOS
                </p>
                <p className="text-[10px] tracking-[0.25em] text-[#ADD8E6] font-medium uppercase">
                  Beauty Salon + Studio
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-[#F4C2C2] relative group ${
                    scrolled ? 'text-[#1a1a2e]' : 'text-white'
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4C2C2] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Desktop right side: Bell + Book Now */}
            <div className="hidden md:flex items-center gap-3">
              <OneSignalBell variant={scrolled ? 'dark' : 'light'} />
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide bg-[#40BFFF] text-white hover:bg-[#1c9ff9] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Book Now
              </a>
            </div>

            {/* Mobile: Bell + Menu Toggle */}
            <div className="md:hidden flex items-center gap-1">
              <OneSignalBell variant={scrolled ? 'dark' : 'light'} />
              <button
                className="p-2 rounded-lg"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className={scrolled ? 'text-[#1a1a2e]' : 'text-white'} size={24} />
                ) : (
                  <Menu className={scrolled ? 'text-[#1a1a2e]' : 'text-white'} size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-semibold text-[#1a1a2e] tracking-wide hover:text-[#F4C2C2] transition-colors"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              onClick={() => setMenuOpen(false)}
              className="mt-4 px-8 py-3 rounded-full bg-[#40BFFF] text-white font-semibold text-lg tracking-wide shadow-md hover:bg-[#1c9ff9] transition-all duration-300"
            >
              Book Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Book Now */}
      <motion.a
        href="#contact"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="fixed bottom-8 right-6 z-50 px-5 py-3 rounded-full bg-[#40BFFF] text-white font-bold text-sm tracking-wide shadow-xl hover:bg-[#1c9ff9] hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/40"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        Book Now
      </motion.a>
    </>
  );
}
