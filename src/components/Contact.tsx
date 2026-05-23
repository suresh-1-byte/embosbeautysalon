import { motion } from 'framer-motion';
import { Phone, Instagram, MapPin, ExternalLink, MessageCircle, Send } from 'lucide-react';

interface ContactProps {
  onBookingClick?: () => void;
}

export default function Contact({ onBookingClick }: ContactProps) {
  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-b from-pink-100 via-pink-150/50 to-pink-100/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">Get In Touch</p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Contact Us
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FFE8F0] to-transparent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact cards */}
          <div className="space-y-5">
            <motion.button
              onClick={onBookingClick}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: 6 }}
              className="w-full flex items-center gap-5 p-5 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#40BFFF]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#40BFFF]/30 transition-colors">
                <Phone size={20} className="text-[#40BFFF]" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">Book Appointment</p>
                <p className="font-semibold text-[#1a1a2e]">Fill Your Details</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-300 group-hover:text-[#F4C2C2] transition-colors" />
            </motion.button>

            <motion.a
              href="https://wa.me/919876543210?text=Hi%20EMBOS%20Beauty%20Salon%2C%20I%20would%20like%20to%20book%20an%20appointment"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <MessageCircle size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">WhatsApp</p>
                <p className="font-semibold text-[#1a1a2e]">Message on WhatsApp</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-300 group-hover:text-green-400 transition-colors" />
            </motion.a>

            <motion.a
              href="https://t.me/Embosbeautysalon_bot"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.5 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#40BFFF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#40BFFF]/20 transition-colors">
                <Send size={20} className="text-[#40BFFF]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">Telegram</p>
                <p className="font-semibold text-[#1a1a2e]">Get Offers & Updates</p>
                <p className="text-xs text-gray-400 mt-0.5">@Embosbeautysalon_bot</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-300 group-hover:text-[#40BFFF] transition-colors" />
            </motion.a>

            <motion.a
              href="https://www.instagram.com/embos_beautysalon"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFE8F0]/20 to-[#40BFFF]/20 flex items-center justify-center flex-shrink-0">
                <Instagram size={20} className="text-[#40BFFF]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">Instagram</p>
                <p className="font-semibold text-[#1a1a2e]">@embos_beautysalon</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-300 group-hover:text-[#F4C2C2] transition-colors" />
            </motion.a>

            <motion.a
              href="https://jsdl.in/DT-20D8MGUKDYT"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ADD8E6]/20 flex items-center justify-center flex-shrink-0">
                <ExternalLink size={20} className="text-[#ADD8E6]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">JustDial</p>
                <p className="font-semibold text-[#1a1a2e]">View on JustDial</p>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-300 group-hover:text-[#ADD8E6] transition-colors" />
            </motion.a>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">Location</p>
                <p className="font-semibold text-[#1a1a2e]">Valasaravakkam, Chennai</p>
                <p className="text-xs text-gray-400 mt-0.5">Tamil Nadu, India</p>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden shadow-xl border border-pink-100 h-96 lg:h-full min-h-80"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.215!2d80.1976!3d12.9876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sEMBOS%20Beauty%20Salon%20Valasaravakkam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EMBOS Beauty Salon Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
