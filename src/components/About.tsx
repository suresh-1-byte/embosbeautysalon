import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Star, GraduationCap } from 'lucide-react';

const stats = [
  { icon: Star, value: '500+', label: 'Happy Clients' },
  { icon: Award, value: '5+', label: 'Years Experience' },
  { icon: Heart, value: '100%', label: 'Certified Excellence' },
];

export default function About() {
  const [showGoogleMore, setShowGoogleMore] = useState(false);
  const [showStickyMore, setShowStickyMore] = useState(false);

  // Pink Smoke Effect Class
  const pinkSmoke = "shadow-[0_0_20px_rgba(255,182,193,0.8)]";

  return (
    <section id="about" className="py-24 px-4 bg-[#FFF1F5]"> {/* Main Background Baby Pink */}
      <div className="max-w-6xl mx-auto">

        {/* Main Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-12 sm:mb-24">

          {/* Image Collage with Pink Smoke Highlight */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pb-10 sm:pb-0"
          >
            <div className={`relative h-72 sm:h-96 rounded-3xl overflow-hidden border-4 border-white ${pinkSmoke}`}>
              <img
                src="/interior.png" 
                alt="EMBOS Studio"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Logo Card */}
            <motion.div
              className={`absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl p-4 sm:p-5 border border-sky-200 w-40 sm:w-48 ${pinkSmoke}`}
            >
              <img
                src="/logo.jpeg"
                alt="EMBOS Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 object-cover border-2 border-sky-400"
              />
              <p className="text-center text-xs text-gray-500 font-medium">Est. in Chennai</p>
              <p className="text-center text-xs text-sky-500 font-semibold tracking-wide mt-0.5">Valasaravakkam</p>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.35em] text-sky-600 uppercase font-bold mb-3">Our Story</p>

            {/* Heading Logic: 'b' is Pink, Others Sky Blue */}
            <h2 
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight" 
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="text-black">About</span>
              <span className="text-sky-500"> EM</span>
              <span className="text-pink-500">B</span>
              <span className="text-sky-500">OS</span>
            </h2>

            <div className="w-12 h-1 bg-sky-400 mb-6" />

            <p className="text-gray-700 leading-relaxed mb-4 text-base font-medium">
              EMBOS Beauty Salon & Studio is a sanctuary of beauty nestled in the heart of Valasaravakkam, Chennai. We blend the delicate artistry of Korean beauty techniques with the rich, vibrant traditions of Indian bridal culture.
            </p>

            <p className="text-gray-700 leading-relaxed text-base font-light">
              Our team of passionate beauty therapists specializes in brow architecture, skin restoration, and hair transformation — delivering results that honor your natural beauty while elevating it to its most radiant form.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-10 sm:mt-12">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#fee2e2] flex items-center justify-center mb-2 sm:mb-4">
                      <Icon size={20} className="text-sky-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-xl sm:text-3xl font-bold text-[#1a1a2e] mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] sm:text-sm text-slate-500 font-medium leading-tight">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Meet the Expert: Pink Background, Sky Blue Outline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-12 sm:mb-24 bg-[#FFD1DC] rounded-3xl p-6 sm:p-10 md:p-14 border-2 border-sky-400 ${pinkSmoke}`}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-4 border-white mx-auto md:mx-0">
              <img
                src="/profile.png"
                alt="Ms. T. S. Hemavathy"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Meet the Expert
              </h3>
              <p className="text-base sm:text-lg font-bold text-sky-600 mb-4 uppercase tracking-wide">
                Ms. T. S. Hemavathy
              </p>

              <p className="text-gray-700 leading-relaxed mb-3 text-sm font-medium">
                Led by Ms. T. S. Hemavathy, our studio is dedicated to professional excellence and certified beauty expertise. Hemavathy is a certified Makeup Master and an Eyelash Extension specialist trained by the ISO-certified PISHAA Academy.

                With a formal background in Beauty Business Management, she ensures every client receives high-quality service backed by professional industry standards.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Client Reviews
          </h2>

          {/* GOOGLE REVIEWS */}
          <div className="mb-12 sm:mb-24">
            <h3 className="text-xl sm:text-2xl font-bold text-sky-700 mb-6 sm:mb-8">Google Reviews</h3>
            
            <div 
              className={`p-4 transition-all duration-300 h-[400px] rounded-2xl border-2 border-sky-400 bg-white/30 ${
                showGoogleMore ? 'overflow-y-auto' : 'overflow-hidden'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <img src="/review1.png" alt="Review" className="rounded-2xl shadow-sm border border-white w-full" />
                <img src="/review2.png" alt="Review" className="rounded-2xl shadow-sm border border-white w-full" />
                <img src="/review3.png" alt="Review" className="rounded-2xl shadow-sm border border-white w-full" />
                <img src="/review4.png" alt="Review" className="rounded-2xl shadow-sm border border-white w-full" />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowGoogleMore(!showGoogleMore)}
                className="px-8 py-3 rounded-full bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 shadow-md transition-transform active:scale-95"
              >
                {showGoogleMore ? 'View Less' : 'View More'}
              </button>
            </div>
          </div>

          {/* STICKY NOTES: Sky Blue Outline */}
          <div>
            <h3 className="text-2xl font-bold text-sky-700 mb-8">Sticky Love Notes 💌</h3>
            
            <div 
              className={`p-4 transition-all duration-300 h-[340px] rounded-2xl border-2 border-sky-400 bg-white/30 ${
                showStickyMore ? 'overflow-y-auto' : 'overflow-hidden'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <img src="/sticky1.png" alt="Note" className="rounded-2xl shadow-md border border-white w-full" />
                <img src="/sticky2.png" alt="Note" className="rounded-2xl shadow-md border border-white w-full" />
                <img src="/sticky3.png" alt="Note" className="rounded-2xl shadow-md border border-white w-full" />
                <img src="/sticky4.png" alt="Note" className="rounded-2xl shadow-md border border-white w-full" />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowStickyMore(!showStickyMore)}
                className="px-8 py-3 rounded-full bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 shadow-md transition-transform active:scale-95"
              >
                {showStickyMore ? 'View Less' : 'View More'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}