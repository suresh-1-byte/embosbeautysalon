import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, GraduationCap, Star, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const credentials = [
  {
    icon: GraduationCap,
    title: 'Certified Makeup Master',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Professionally trained in advanced bridal and editorial makeup techniques.',
    color: 'from-pink-100 to-rose-50',
    border: 'border-pink-200',
    iconColor: 'text-pink-500',
  },
  {
    icon: Award,
    title: 'Eyelash Extension Specialist',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Specialist certification in classic, hybrid, and volume lash extension applications.',
    color: 'from-sky-100 to-blue-50',
    border: 'border-sky-200',
    iconColor: 'text-sky-500',
  },
  {
    icon: CheckCircle,
    title: 'Beauty Business Management',
    org: 'Professional Certification',
    desc: 'Formal training in salon management, client relations, and beauty industry standards.',
    color: 'from-purple-100 to-violet-50',
    border: 'border-purple-200',
    iconColor: 'text-purple-500',
  },
  {
    icon: Star,
    title: '5+ Years Professional Experience',
    org: 'EMBOS Beauty Salon & Studio',
    desc: 'Over five years of hands-on experience serving 500+ happy clients in Chennai.',
    color: 'from-amber-100 to-yellow-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
  },
];

const certificates = [
  { src: '/certificate2.png',   title: 'Certificate in Beauty Technician', org: 'Bharat Sevak Samaj — May 2016' },
  { src: '/certificate3.jpeg',  title: 'Certificate of Excellence', org: 'SK Beauty Academy' },
  { src: '/certificate4.png',   title: 'Pro Makeover & Hair Style Certification', org: 'B3 Bridal Studio — Nov 2022' },
];

const salonImages = [
  { src: '/interior.png', label: 'Our Studio' },
  { src: '/profileadmin.jpeg?v=2', label: 'Lead Artist' },
  { src: '/salon front.jpeg.png', label: 'Our Salon' },
  { src: '/bridal look gallery 1.png', label: 'Bridal Gallery' },
];

export default function Credentials() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + certificates.length) % certificates.length : 0);
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % certificates.length : 0);
  return (
    <>
    <section id="credentials" className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs tracking-[0.35em] text-sky-500 uppercase font-semibold mb-3">Expertise & Trust</p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Certifications &{' '}
            <span className="text-pink-500">Credentials</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Every service at EMBOS is backed by certified expertise, professional training, and a commitment to excellence.
          </p>
        </motion.div>

        {/* Credential Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-24">
          {credentials.map((cred, i) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-gradient-to-br ${cred.color} rounded-2xl p-6 border ${cred.border} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4`}>
                  <Icon size={22} className={cred.iconColor} />
                </div>
                <h3 className="text-sm font-bold text-[#1a1a2e] mb-1 leading-snug">{cred.title}</h3>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{cred.org}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{cred.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Professional Branding Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs tracking-[0.35em] text-pink-500 uppercase font-semibold mb-3">Our Work & Studio</p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Professional <span className="text-sky-500">Branding</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto" />
        </motion.div>

        {/* Branding Image Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-24">
          {salonImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-semibold tracking-wide">{img.label}</span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* Certificates Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs tracking-[0.35em] text-pink-500 uppercase font-semibold mb-3">Official Documents</p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Our <span className="text-sky-500">Certificates</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto" />
        </motion.div>

        {/* 2×2 grid on mobile, centered 3-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={cert.src}
                  alt={cert.title}
                  className="w-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <ZoomIn size={18} className="text-[#1a1a2e]" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 border-t border-pink-50 flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs font-bold text-[#1a1a2e] leading-snug">{cert.title}</p>
                  <p className="text-[10px] text-sky-500 font-semibold mt-0.5">{cert.org}</p>
                </div>
                <button
                  onClick={() => openLightbox(i)}
                  className="mt-auto w-full py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white text-[11px] font-semibold tracking-wide hover:from-pink-500 hover:to-rose-500 transition-all duration-300 shadow-sm"
                >
                  View Certificate
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>

    {/* Lightbox with navigation */}
    <AnimatePresence>
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-2xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Main image */}
            <img
              src={certificates[lightboxIndex].src}
              alt={certificates[lightboxIndex].title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            {/* Caption */}
            <div className="text-center mt-3">
              <p className="text-white font-semibold text-sm">{certificates[lightboxIndex].title}</p>
              <p className="text-white/60 text-xs mt-0.5">{certificates[lightboxIndex].org}</p>
            </div>

            {/* Thumbnail strip */}
            <div className="flex justify-center gap-2 mt-4">
              {certificates.map((cert, i) => (
                <button
                  key={cert.src}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === lightboxIndex ? 'border-pink-400 scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={cert.src} alt={cert.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-200"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-200"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-pink-50 transition-colors duration-200"
            >
              <X size={20} className="text-[#1a1a2e]" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
