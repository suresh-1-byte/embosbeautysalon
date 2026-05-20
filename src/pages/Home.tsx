import { useState } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Offers from '../components/Offers';
import PillarServices from '../components/PillarServices';
import ServiceGrid from '../components/ServiceGrid';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import Pricing from '../components/Pricing';
import CustomerReviews from '../components/CustomerReviews';
import WhatsAppButton from '../components/WhatsAppButton';
import { useNotifications } from '../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import SubscribePopup from '../components/SubscribePopup';

export default function Home() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');
  const { showBanner, handleAllow, handleDismiss } = useNotifications();

  const handleBookingClick = (service?: string) => {
    setPreselectedService(service ?? '');
    setBookingModalOpen(true);
  };

  return (
    <div className="font-sans bg-[#FFF1F5] min-h-screen">
      <Navigation />
      <Hero />
      <PillarServices />
      <ServiceGrid />
      <Pricing onBookingClick={handleBookingClick} />
      <Gallery />
      <Offers />
      <CustomerReviews />
      <About />
      <Contact onBookingClick={() => handleBookingClick()} />
      <Footer />

      {/* Modals & Floating UI */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={preselectedService}
      />
      <WhatsAppButton />
      <SubscribePopup />

      {/* Notification permission banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#F4C2C2]/30 flex items-center justify-center flex-shrink-0">
              <Bell size={20} className="text-[#e8a8a8]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a2e]">Stay Updated!</p>
              <p className="text-xs text-gray-400 mt-0.5">Get notified about new offers & updates from EMBOS</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={handleAllow}
                className="px-3 py-1.5 rounded-lg bg-[#F4C2C2] text-[#1a1a2e] text-xs font-bold hover:bg-[#e8a8a8] transition-colors">
                Allow
              </button>
              <button onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors">
                No thanks
              </button>
            </div>
            <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
