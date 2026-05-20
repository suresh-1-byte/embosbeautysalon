import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookingModal from '../components/BookingModal';

const KOREAN_SERVICES = [
  { name: 'Glass Skin Facial', desc: 'Deep hydration and skin brightening therapy', image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg' },
  { name: 'Brow Lamination & Sculpting', desc: 'Perfectly shaped and groomed eyebrows', image: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg' },
  { name: 'Korean Hydra Facial', desc: 'Advanced multi-step facial treatment', image: 'https://images.pexels.com/photos/3945687/pexels-photo-3945687.jpeg' },
  { name: 'Skin Brightening Therapy', desc: 'Luminous, radiant skin transformation', image: 'https://images.pexels.com/photos/3945689/pexels-photo-3945689.jpeg' },
  { name: 'Meso Glow Treatment', desc: 'Micro-needling with nourishing serums', image: 'https://images.pexels.com/photos/3945691/pexels-photo-3945691.jpeg' },
  { name: 'Pore Minimizing Peel', desc: 'Professional chemical peel for clarity', image: 'https://images.pexels.com/photos/3945693/pexels-photo-3945693.jpeg' },
  { name: 'Gold Facial', desc: 'Luxurious anti-aging treatment', image: 'https://images.pexels.com/photos/3945695/pexels-photo-3945695.jpeg' },
  { name: 'Korean Sheet Mask Therapy', desc: 'Intensive hydration and healing', image: 'https://images.pexels.com/photos/3945697/pexels-photo-3945697.jpeg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function KoreanBeauty() {
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBooking = () => {
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF1F5]">
      {/* Header */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#ADD8E6]/20 shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] hover:text-[#ADD8E6] transition-colors hover:gap-3"
          >
            <ArrowLeft size={18} /> Back Home
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ADD8E6]">
            <img src="/logo.jpeg" alt="EMBOS" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-28 pb-20 px-4 overflow-hidden mt-14"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ADD8E6]/75 via-[#FFFDD0]/60 to-[#ADD8E6]/70" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={20} className="text-white" />
            <p className="text-xs tracking-[0.35em] text-white uppercase font-semibold">Premium Korean Beauty</p>
            <Sparkles size={20} className="text-white" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Glass Skin<br />Radiant Beauty
          </motion.h1>
          <motion.p variants={itemVariants} className="text-white/95 max-w-2xl mx-auto text-lg leading-relaxed drop-shadow-md">
            Discover the essence of Korean beauty philosophy: achieving luminous, poreless, glass-like skin through advanced treatments and expert care.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Services Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Korean Beauty Services
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#ADD8E6] to-transparent mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {KOREAN_SERVICES.map((service) => (
            <motion.div
              key={service.name}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 30px 60px rgba(173,216,230,0.3)' }}
              className="group cursor-default rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#ADD8E6] to-[#FFFDD0]">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent" />
              </div>
              <div className="p-5 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Check size={16} className="text-[#ADD8E6]" />
                  <h3 className="font-bold text-[#1a1a2e] text-sm">{service.name}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg"
              alt="Korean Beauty Philosophy"
              className="w-full h-80 md:h-full object-cover"
            />
            <div className="bg-gradient-to-br from-[#ADD8E6]/20 via-[#FFFDD0]/30 to-white p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-[#1a1a2e] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                The Philosophy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg font-light">
                Korean beauty focuses on achieving a dewy, youthful complexion through layering lightweight, nourishing products and treatments. We've mastered this art at EMBOS.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                The goal? Luminous, poreless, glass-like skin that radiates natural beauty and vitality.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Before & After Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Transformation Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { before: 'https://images.pexels.com/photos/3945675/pexels-photo-3945675.jpeg', after: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg', title: 'Glass Skin Glow' },
              { before: 'https://images.pexels.com/photos/3945677/pexels-photo-3945677.jpeg', after: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg', title: 'Brightening Therapy' },
              { before: 'https://images.pexels.com/photos/3945679/pexels-photo-3945679.jpeg', after: 'https://images.pexels.com/photos/3945687/pexels-photo-3945687.jpeg', title: 'Radiant Skin' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden shadow-xl border-2 border-[#ADD8E6]/30"
              >
                <div className="grid grid-cols-2 h-64">
                  <div className="relative overflow-hidden">
                    <img src={item.before} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold">Before</div>
                  </div>
                  <div className="relative overflow-hidden">
                    <img src={item.after} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-[#ADD8E6]/90 text-[#1a1a2e] text-xs font-semibold">After</div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-[#ADD8E6]/10 to-[#FFFDD0]/20">
                  <p className="text-center font-bold text-[#1a1a2e]">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 bg-gradient-to-r from-[#ADD8E6]/15 via-[#FFFDD0]/30 to-[#ADD8E6]/15 rounded-3xl p-12 border-2 border-[#ADD8E6]/30"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why EMBOS Korean Beauty?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Expert Certification', desc: 'Professional training from ISO-certified academies', icon: '🎓' },
              { num: '2', title: 'Premium Products', desc: 'Korean and international beauty brands', icon: '✨' },
              { num: '3', title: 'Customized Care', desc: 'Every treatment tailored to your skin', icon: '💎' },
            ].map((item) => (
              <motion.div
                key={item.num}
                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(173,216,230,0.25)' }}
                className="text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-[#ADD8E6]/20 via-white to-[#FFFDD0]/20 rounded-3xl p-16 border-2 border-[#ADD8E6]/30"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready for Your Glass Skin Transformation?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Book your Korean Beauty treatment today and experience the glow of radiant, luminous skin.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(64,191,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBooking}
            className="px-10 py-4 rounded-full bg-[#40BFFF] text-white font-bold text-lg tracking-wide shadow-lg hover:bg-[#1c9ff9]"
          >
            Book Service Now
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-gray-200 py-12 px-4 mt-24 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm font-semibold">EMBOS Beauty Salon & Studio</p>
          <p className="text-gray-400 text-xs mt-2">Valasaravakkam, Chennai | For Ladies & Kids | Professional Beauty Excellence</p>
        </div>
      </motion.div>

      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </div>
  );
}