import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, BellRing, Loader2, X } from 'lucide-react';
import { useFCMSubscription } from '../hooks/useFCMSubscription';

interface Props {
  /** Pass 'light' when rendered on a dark/hero background */
  variant?: 'light' | 'dark';
}

export default function OneSignalBell({ variant = 'dark' }: Props) {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } = useFCMSubscription();
  const [tooltip, setTooltip] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);

  const handleClick = async () => {
    if (isLoading || permission === 'loading') return;

    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
      if (permission !== 'denied') {
        setJustSubscribed(true);
        setTimeout(() => setJustSubscribed(false), 3000);
      }
    }
  };

  // Don't render if push notifications aren't supported
  if (!('Notification' in window)) return null;

  const baseColor =
    variant === 'light'
      ? 'text-white hover:text-[#F4C2C2]'
      : 'text-[#1a1a2e] hover:text-[#F4C2C2]';

  const BellIcon =
    isLoading || permission === 'loading'
      ? Loader2
      : isSubscribed
      ? BellRing
      : permission === 'denied'
      ? BellOff
      : Bell;

  const tooltipText =
    permission === 'denied'
      ? 'Notifications blocked — enable in browser settings'
      : isSubscribed
      ? 'Unsubscribe from notifications'
      : 'Get notified about offers & updates';

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        disabled={isLoading || permission === 'loading' || permission === 'denied'}
        aria-label={tooltipText}
        className={`relative p-2 rounded-full transition-all duration-200 ${baseColor} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <BellIcon
          size={20}
          className={`${isLoading || permission === 'loading' ? 'animate-spin' : ''} ${
            isSubscribed ? 'text-[#F4C2C2]' : ''
          }`}
        />

        {/* Subscribed indicator dot */}
        {isSubscribed && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-400 border border-white" />
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 z-50 w-52 px-3 py-2 rounded-xl bg-[#1a1a2e] text-white text-xs text-center shadow-xl pointer-events-none"
          >
            {tooltipText}
            <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#1a1a2e] rotate-45 rounded-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* "You're subscribed!" toast */}
      <AnimatePresence>
        {justSubscribed && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1a1a2e] text-white text-sm shadow-2xl border border-[#F4C2C2]/30"
          >
            <BellRing size={16} className="text-[#F4C2C2] flex-shrink-0" />
            <div>
              <p className="font-semibold text-xs">You're subscribed!</p>
              <p className="text-[10px] text-gray-400 mt-0.5">We'll notify you about offers & updates.</p>
            </div>
            <button
              onClick={() => setJustSubscribed(false)}
              className="ml-1 text-gray-500 hover:text-white"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
