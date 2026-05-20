import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Flower2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';

const BRIDAL_SERVICES = [
  { name: 'Bridal Makeup Trial', desc: 'Perfect your wedding day look', image: '/bridal makeup trial.jpg' },
  { name: 'Full Bridal Makeover', desc: 'Complete transformation for your special day', image: '/bridal makeover.jpg' },
  { name: 'Mehendi & Nail Art', desc: 'Traditional and modern designs', image: '/mehendi and nail art.jpg' },
  { name: 'Pre-Bridal Skin Package', desc: 'Glow preparation before the big day', image: '/prebridal skincare.jpg' },
  { name: 'Hair Styling & Updo', desc: 'Elegant and lasting bridal hairstyles', image: '/hairstyling.jpg' },
  { name: 'Bridal Glow Facial', desc: 'Luminous, radiant bridal complexion', image: '/facial treatment.jpg' },
  { name: 'Saree Draping Assistance', desc: 'Perfect blouse and saree styling', image: '/saree draping.jpg' },
  { name: 'Jewellery & Blouse Consultation', desc: 'Expert styling advice', image: '/jewellery and blouse consultation.jpg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function BridalStudio() {
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBooking = () => {
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4C2C2]/30 via-[#FFFDD0]/25 to-[#F4C2C2]/20">
      {/* Header */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_15px_60px_rgba(255,255,255,0.8)]"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] hover:text-[#e8a8a8] transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft size={18} /> Back Home
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1a1a2e]">
            <a
              href="#home"
              className="relative text-sm font-semibold text-[#1a1a2e] transition-all duration-300 hover:text-[#e8a8a8] hover:scale-105 hover:shadow-[0_0_20px_rgba(244,194,194,0.45)]"
            >
              Home
            </a>
            <a
              href="#bridal-services"
              className="relative text-sm font-semibold text-[#1a1a2e] transition-all duration-300 hover:text-[#e8a8a8] hover:scale-105 hover:shadow-[0_0_20px_rgba(244,194,194,0.45)]"
            >
              Bridal Service
            </a>
            <a
              href="#bridal-looks"
              className="relative text-sm font-semibold text-[#1a1a2e] transition-all duration-300 hover:text-[#e8a8a8] hover:scale-105 hover:shadow-[0_0_20px_rgba(244,194,194,0.45)]"
            >
              Bridal Look
            </a>
          </nav>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#F4C2C2]">
            <img src="/logo.jpeg" alt="EMBOS" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Hero Banner with Local Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-28 pb-20 px-4 overflow-hidden mt-14"
        id="home"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'url("/bridal page background.png")', // Updated to your local file
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#F4C2C2]/75 via-[#FFFDD0]/60 to-[#F4C2C2]/70" />

        {/* Animated Floral Decorations */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-20 left-10 opacity-40 pointer-events-none"
        >
          <Flower2 size={60} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
          className="absolute bottom-20 right-10 opacity-40 pointer-events-none"
        >
          <Flower2 size={70} className="text-white" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-4">
            <Heart size={20} className="text-white" fill="red" />
            <p className="text-xs tracking-[0.35em] text-black uppercase font-semibold">Your Perfect Day</p>
            <Heart size={20} className="text-white" fill="red" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
            style={{ fontFamily: 'Pinyon Script, cursive' }}
          >
            Your Most<br />Radiant Day
          </motion.h1>
          <motion.p variants={itemVariants} className="text-white/95 max-w-2xl mx-auto text-lg leading-relaxed drop-shadow-md webkit-text-stroke-0.5px #000000">
            From pre-wedding glow to that perfect bridal look—we curate every moment of your beauty journey with elegance, tradition, and modern artistry.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Rest of the content remains the same */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          id="bridal-services"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bridal Services
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {BRIDAL_SERVICES.map((service) => (
            <motion.div
              key={service.name}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 30px 60px rgba(244,194,194,0.3)' }}
              className="group cursor-default rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#F4C2C2] to-[#FFFDD0]">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent" />
              </div>
              <div className="p-5 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className="text-[#F4C2C2]" />
                  <h3 className="font-bold text-[#1a1a2e] text-sm">{service.name}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bride's Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/bridal vision.jpg"
              alt="Bridal Vision"
              className="w-full h-80 md:h-full object-cover"
            />
            <div className="bg-gradient-to-br from-[#F4C2C2]/20 via-[#FFFDD0]/30 to-white p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-[#1a1a2e] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Bridal Vision
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg font-light">
                Every bride deserves to feel absolutely radiant on her special day. We blend the timeless elegance of traditional Indian bridal aesthetics with contemporary beauty techniques.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                We create memories, not just makeup. From your first consultation to the final touch on wedding day, we ensure you feel confident, beautiful, and cherished.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bridal Showcase Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
          id="bridal-looks"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bridal Looks & Moments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              '/bridal look 2.webp',
              '/bridal look 3.webp',
              '/bridal look 4.jpeg',
              '/bridal look 5.jpeg',
              '/bridal look 6.jpeg',
              '/bridal look 7.jpeg',
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(244,194,194,0.25)' }}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <img src={img} alt={`Bridal look ${i + 1}`} className="w-full h-full object-cover object-center" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 bg-gradient-to-r from-[#F4C2C2]/15 via-[#FFFDD0]/30 to-[#F4C2C2]/15 rounded-3xl p-12 border-2 border-[#F4C2C2]/30"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Choose EMBOS for Your Wedding?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Certified Masters', desc: 'Led by Ms. Hemavathy, certified makeup master', icon: '👑' },
              { num: '2', title: 'Premium Products', desc: 'International bridal makeup brands', icon: '💄' },
              { num: '3', title: 'Your Vision', desc: 'Every bride gets a customized consultation', icon: '✨' },
            ].map((item) => (
              <motion.div
                key={item.num}
                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(244,194,194,0.25)' }}
                className="text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Bridal Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Consultation', desc: 'Understand your vision & style', emoji: '💭' },
              { step: '2', title: 'Pre-Bridal Prep', desc: 'Glow treatments & care plan', emoji: '✨' },
              { step: '3', title: 'Trial Run', desc: 'Perfect your wedding look', emoji: '💄' },
              { step: '4', title: 'Wedding Day', desc: 'Look your absolute best', emoji: '👑' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#F4C2C2]/20 to-[#FFFDD0]/30 border-2 border-[#F4C2C2]/30 shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">{item.emoji}</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4C2C2] to-[#e8a8a8] flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                  {item.step}
                </div>
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
          className="text-center bg-gradient-to-br from-[#F4C2C2]/20 via-white to-[#FFFDD0]/20 rounded-3xl p-16 border-2 border-[#F4C2C2]/30"
        >
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Let's Make Your Day Magical
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Book your bridal consultation or service today. We're here to make you feel like the beautiful bride you are.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(64,191,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBooking}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#40BFFF] to-[#80D1FF] text-white font-bold text-lg tracking-wide shadow-lg flex items-center justify-center gap-2 mx-auto hover:shadow-[0_25px_80px_rgba(64,191,255,0.25)]"
          >
            <Heart size={20} fill="currentColor" /> Book Now
          </motion.button>
        </motion.div>
      </div>

      <Footer />

      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </div>
  );
}