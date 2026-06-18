import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

// Above-the-fold — load eagerly
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';

// Below-the-fold — lazy load to reduce initial bundle
const About = lazy(() => import('../components/About'));
const Credentials = lazy(() => import('../components/Credentials'));
const PillarServices = lazy(() => import('../components/PillarServices'));
const ServiceGrid = lazy(() => import('../components/ServiceGrid'));
const Pricing = lazy(() => import('../components/Pricing'));
const Gallery = lazy(() => import('../components/Gallery'));
const Offers = lazy(() => import('../components/Offers'));
const CustomerReviews = lazy(() => import('../components/CustomerReviews'));
const Contact = lazy(() => import('../components/Contact'));
const Footer = lazy(() => import('../components/Footer'));
const BookingModal = lazy(() => import('../components/BookingModal'));
const WhatsAppButton = lazy(() => import('../components/WhatsAppButton'));
const SubscribePopup = lazy(() => import('../components/SubscribePopup'));

// Lightweight section placeholder while lazy chunks load
function SectionLoader() {
  return <div style={{ minHeight: 200, background: '#FFF1F5' }} />;
}

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

      {/* Below-fold sections wrapped in Suspense */}
      <div className="bg-[#FFF1F5]">
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Credentials />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PillarServices />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ServiceGrid />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Pricing onBookingClick={handleBookingClick} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Offers />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CustomerReviews />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact onBookingClick={() => handleBookingClick()} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </div>

      {/* Modals & Floating UI */}
      <Suspense fallback={null}>
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedService={preselectedService}
        />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <Suspense fallback={null}>
        <SubscribePopup />
      </Suspense>

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
