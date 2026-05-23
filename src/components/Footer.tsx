import { motion } from 'framer-motion';
import { Instagram, Phone, MapPin, Heart, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#40BFFF]/40 flex-shrink-0">
                <img src="/logo.jpeg" alt="EMBOS Logo" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold tracking-widest" style={{ fontFamily: 'Playfair Display, serif' }}>EMBOS</p>
                <p className="text-[10px] tracking-[0.2em] text-[#40BFFF]/70 uppercase">Beauty Salon + Studio</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Architects of grace, beauty therapists by soul. Your most radiant self, curated with care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#FFE8F0] uppercase mb-4 sm:mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Our Services', href: '#services' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'About Us', href: '#about' },
                { label: 'Contact Us', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="no-min text-sm text-gray-400 hover:text-[#40BFFF] transition-colors duration-200 flex items-center gap-2 group"
                    style={{ minHeight: 'unset' }}
                  >
                    <span className="w-4 h-px bg-gray-600 group-hover:bg-[#40BFFF] group-hover:w-6 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#40BFFF] uppercase mb-4 sm:mb-5">Connect</h4>
            <div className="space-y-3 sm:space-y-4">
              <a href="https://www.instagram.com/embos_beautysalon" target="_blank" rel="noopener noreferrer"
                className="no-min flex items-center gap-3 text-sm text-gray-400 hover:text-[#F4C2C2] transition-colors group"
                style={{ minHeight: 'unset' }}>
                <Instagram size={15} className="flex-shrink-0" />
                @embos_beautysalon
              </a>
              <a href="tel:+919176160204"
                className="no-min flex items-center gap-3 text-sm text-gray-400 hover:text-[#F4C2C2] transition-colors group"
                style={{ minHeight: 'unset' }}>
                <Phone size={15} className="flex-shrink-0" />
                +91 91761 60204
              </a>
              <a href="https://t.me/Embosbeautysalon_bot" target="_blank" rel="noopener noreferrer"
                className="no-min flex items-center gap-3 text-sm text-gray-400 hover:text-[#40BFFF] transition-colors group"
                style={{ minHeight: 'unset' }}>
                <Send size={15} className="flex-shrink-0" />
                Get Offers on Telegram
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                <span className="leading-snug">148, 3rd Main Rd, Ashtalakshmi Nagar,<br />Valasaravakkam, Chennai 600116</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EMBOS Beauty Salon &amp; Studio. All rights reserved.
          </p>
          <motion.p className="text-xs text-gray-500 flex items-center gap-1.5" whileHover={{ scale: 1.02 }}>
            Made with <Heart size={11} className="text-[#F4C2C2]" fill="#F4C2C2" /> in Chennai
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
