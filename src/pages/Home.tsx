import { useState } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Offers from '../components/Offers';
import PillarServices from '../components/PillarServices';
import ServiceGrid from '../components/ServiceGrid';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Credentials from '../components/Credentials';
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
    <div className="font-sans overflow-x-hidden w-full max-w-full" style={{ margin: 0, padding: 0, background: '#000' }}>
      <Navigation />
      <Hero />
      <div className="bg-[#FFF1F5]">
      <PillarServices />
      <ServiceGrid />
      <Pricing onBookingClick={handleBookingClick} />
      <Gallery />
      <Offers />
      <CustomerReviews />
      <About />
      <Credentials />
      <Contact onBookingClick={() => handleBookingClick()} />
      <Footer />
      </div>

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
            className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 z-[200] bg-white rounded-2xl shadow-2xl border border-pink-100 p-3 sm:p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F4C2C2]/30 flex items-center justify-center flex-shrink-0">
              <Bell size={18} className="text-[#e8a8a8]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a2e] leading-tight">Stay Updated!</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">Get notified about new offers & updates</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={handleAllow}
                className="px-3 py-1.5 rounded-lg bg-[#F4C2C2] text-[#1a1a2e] text-xs font-bold hover:bg-[#e8a8a8] transition-colors whitespace-nowrap">
                Allow
              </button>
              <button onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                No thanks
              </button>
            </div>
            <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 p-1">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
