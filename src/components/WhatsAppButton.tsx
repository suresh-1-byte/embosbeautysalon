import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = '919176160204';
const WHATSAPP_MESSAGE = 'Hi EMBOS Beauty Salon! I would like to book an appointment. 💅';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show tooltip after 4 seconds on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem('wa_tooltip_seen');
    if (seen) return;
    const timer = setTimeout(() => {
      setShowTooltip(true);
      sessionStorage.setItem('wa_tooltip_seen', '1');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-24 left-4 z-50 flex flex-col items-start gap-2">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {showTooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-start gap-2 bg-white rounded-2xl shadow-xl border border-green-100 px-4 py-3 max-w-[200px]"
          >
            <div className="flex-1">
              <p className="text-xs font-bold text-[#1a1a2e]">Chat with us!</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Book via WhatsApp instantly</p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
            {/* Arrow pointing down-left */}
            <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-r border-b border-green-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp button */}
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative"
        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: '#25D366' }} />
      </motion.button>
    </div>
  );
}
