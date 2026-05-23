import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendBookingEmail } from '../lib/notifications';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const SERVICES = [
  { name: 'Korean Glass Skin Facial', duration: '60 min', price: '₹1,499' },
  { name: 'Bridal Makeup', duration: '120 min', price: '₹5,999' },
  { name: 'Hair Cut & Styling', duration: '45 min', price: '₹499' },
  { name: 'Nail Art & Extensions', duration: '60 min', price: '₹799' },
  { name: 'Mehendi Application', duration: '90 min', price: '₹1,299' },
  { name: 'Gold Facial', duration: '60 min', price: '₹1,199' },
  { name: 'Brow Sculpting', duration: '30 min', price: '₹399' },
  { name: 'Hair Botox', duration: '90 min', price: '₹2,499' },
  { name: 'D-Tan Treatment', duration: '45 min', price: '₹599' },
  { name: 'Keratin Hair Spa', duration: '60 min', price: '₹1,299' },
  { name: 'Other', duration: '', price: '' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM',
];

const LOCATION_OPTIONS = [
  { value: 'salon', label: '🏠 Visit Salon' },
  { value: 'home', label: '🚗 Home Service' },
];

export default function BookingModal({ isOpen, onClose, preselectedService = '' }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    service: preselectedService,
    location: 'salon', date: '', time_slot: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, '')))
      return 'Please enter a valid 10-digit phone number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'Please enter a valid email address';
    if (!formData.service) return 'Please select a service';
    return '';
  };

  const validateStep2 = () => {
    if (!formData.date) return 'Please select a date';
    if (!formData.time_slot) return 'Please select a time slot';
    return '';
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('bookings').insert([{
        name: formData.name.trim(), phone: formData.phone.trim(),
        email: formData.email.trim(), service: formData.service,
        location: formData.location, date: formData.date,
        time_slot: formData.time_slot, notes: formData.notes.trim(), status: 'pending',
      }]);
      if (dbError) throw dbError;
      await sendBookingEmail('new_booking', {
        name: formData.name.trim(), phone: formData.phone.trim(),
        email: formData.email.trim(), service: formData.service,
        date: formData.date, time_slot: formData.time_slot,
        location: formData.location, notes: formData.notes.trim(),
      });
      const msg = `📅 *New Booking Request*\n\n👤 *Name:* ${formData.name}\n📞 *Phone:* ${formData.phone}\n✉️ *Email:* ${formData.email}\n💅 *Service:* ${formData.service}\n📍 *Location:* ${formData.location === 'salon' ? 'Salon Visit' : 'Home Service'}\n📆 *Date:* ${formData.date}\n🕐 *Time:* ${formData.time_slot}${formData.notes ? `\n📝 *Notes:* ${formData.notes}` : ''}`;
      window.open(`https://wa.me/919176160204?text=${encodeURIComponent(msg)}`, '_blank');
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', phone: '', email: '', service: '', location: 'salon', date: '', time_slot: '', notes: '' });
        setSubmitted(false);
        setStep(1);
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setError('');
    setSubmitted(false);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal container — bottom sheet on mobile, centered on desktop */}
          <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
              style={{
                maxHeight: '92dvh',
                /* dvh = dynamic viewport height — accounts for mobile browser chrome */
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile only) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-[#F4C2C2]/10 to-[#ADD8E6]/10 flex-shrink-0 sm:rounded-t-3xl">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Book Appointment
                  </h2>
                  {!submitted && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-7 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#F4C2C2]' : 'bg-gray-200'}`} />
                      <div className={`w-7 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#F4C2C2]' : 'bg-gray-200'}`} />
                      <span className="text-xs text-gray-400">Step {step} of 2</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Scrollable body */}
              <div
                className="overflow-y-auto flex-1 px-4 sm:px-5 py-4"
                style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                      <CheckCircle size={36} className="text-green-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Booking Confirmed!
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Your appointment request has been saved. We'll confirm via WhatsApp shortly.
                    </p>
                    <div className="mt-4 px-4 py-2 rounded-xl bg-[#F4C2C2]/20 text-sm text-[#1a1a2e] font-medium">
                      📅 {formData.date} at {formData.time_slot}
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4"
                        >
                          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-600 leading-snug">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {/* ── STEP 1 ── */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3 pb-20"
                        >
                          {[
                            { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Your name' },
                            { label: 'Phone Number *', name: 'phone', type: 'tel', placeholder: '10-digit number' },
                            { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'your@email.com' },
                          ].map((field) => (
                            <div key={field.name}>
                              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">{field.label}</label>
                              <input
                                type={field.type}
                                name={field.name}
                                value={(formData as any)[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                autoComplete={field.name === 'phone' ? 'tel' : field.name}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] focus:ring-1 focus:ring-[#F4C2C2]"
                                style={{ fontSize: '16px' /* prevents iOS zoom */ }}
                              />
                            </div>
                          ))}

                          <div>
                            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">Select Service *</label>
                            <select
                              name="service"
                              value={formData.service}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] bg-white"
                              style={{ fontSize: '16px' }}
                            >
                              <option value="">Choose a service</option>
                              {SERVICES.map((svc) => (
                                <option key={svc.name} value={svc.name}>
                                  {svc.name}{svc.price ? ` — ${svc.price}` : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">Location *</label>
                            <div className="grid grid-cols-2 gap-2">
                              {LOCATION_OPTIONS.map((opt) => (
                                <label
                                  key={opt.value}
                                  className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                                    formData.location === opt.value
                                      ? 'border-[#F4C2C2] bg-[#F4C2C2]/10 text-[#1a1a2e]'
                                      : 'border-gray-200 text-gray-500'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="location"
                                    value={opt.value}
                                    checked={formData.location === opt.value}
                                    onChange={handleChange}
                                    className="w-3.5 h-3.5 accent-[#F4C2C2]"
                                  />
                                  <span className="text-xs sm:text-sm">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── STEP 2 ── */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4 pb-24"
                        >
                          {/* Summary chip */}
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4C2C2]/15 text-sm text-[#1a1a2e] font-medium overflow-hidden">
                            <span className="flex-shrink-0">💅</span>
                            <span className="truncate text-xs sm:text-sm">{formData.service}</span>
                            <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                              {SERVICES.find(s => s.name === formData.service)?.duration}
                            </span>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">Preferred Date *</label>
                            <input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              min={today}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2]"
                              style={{ fontSize: '16px' }}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                              <Clock size={13} className="inline mr-1 text-[#F4C2C2]" />
                              Select Time Slot *
                            </label>
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                              {TIME_SLOTS.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, time_slot: slot })}
                                  style={{ minHeight: 'unset' }}
                                  className={`py-2.5 px-1 rounded-xl text-[11px] sm:text-xs font-semibold border-2 transition-all ${
                                    formData.time_slot === slot
                                      ? 'border-[#F4C2C2] bg-[#F4C2C2] text-[#1a1a2e]'
                                      : 'border-gray-200 text-gray-500'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">Notes (Optional)</label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleChange}
                              placeholder="Any special requests..."
                              rows={2}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F4C2C2] resize-none"
                              style={{ fontSize: '16px' }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                )}
              </div>

              {/* Sticky footer buttons — always visible above keyboard */}
              {!submitted && (
                <div className="flex-shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 bg-white flex gap-3"
                  style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full py-3.5 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors"
                    >
                      Next — Pick Date & Time →
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setStep(1); setError(''); }}
                        className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:border-gray-300 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit as any}
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl bg-[#F4C2C2] text-[#1a1a2e] font-bold text-sm hover:bg-[#e8a8a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? <><Loader2 size={15} className="animate-spin" /> Booking...</> : 'Confirm Booking ✓'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
