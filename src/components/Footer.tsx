import { motion } from 'framer-motion';
import { Instagram, Phone, MapPin, Heart, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#40BFFF]/40">
                <img
                  src="/logo.jpeg"
                  alt="EMBOS Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xl font-bold tracking-widest" style={{ fontFamily: 'Playfair Display, serif' }}>EMBOS</p>
                <p className="text-[10px] tracking-[0.25em] text-[#40BFFF]/70 uppercase">Beauty Salon + Studio</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Architects of grace, beauty therapists by soul. Your most radiant self, curated with care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-[0.2em] text-[#FFE8F0] uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Our Services', 'Gallery', 'About Us', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
                    className="text-sm text-gray-400 hover:text-[#40BFFF] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-gray-600 group-hover:bg-[#40BFFF] group-hover:w-6 transition-all duration-200" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold tracking-[0.2em] text-[#40BFFF] uppercase mb-5">Connect</h4>
            <div className="space-y-4">
              <a href="https://www.instagram.com/embos_beautysalon" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#F4C2C2] transition-colors group">
                <Instagram size={16} className="group-hover:scale-110 transition-transform" />
                @embos_beautysalon
              </a>
              <a href="tel:+919876543210"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#F4C2C2] transition-colors group">
                <Phone size={16} className="group-hover:scale-110 transition-transform" />
                Call for Bookings
              </a>
              <a href="https://t.me/Embosbeautysalon_bot" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#40BFFF] transition-colors group">
                <Send size={16} className="group-hover:scale-110 transition-transform" />
                Get Offers on Telegram
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Valasaravakkam, Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EMBOS Beauty Salon & Studio. All rights reserved.
          </p>
          <motion.p
            className="text-xs text-gray-500 flex items-center gap-1.5"
            whileHover={{ scale: 1.02 }}
          >
            Made with <Heart size={11} className="text-[#F4C2C2]" fill="#F4C2C2" /> in Chennai
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
