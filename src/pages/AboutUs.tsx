import { motion } from 'framer-motion';
import { Award, CheckCircle, GraduationCap, Heart, Star } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const stats = [
  { icon: Star,  value: '500+', label: 'Happy Clients' },
  { icon: Award, value: '5+',   label: 'Years Experience' },
  { icon: Heart, value: '100%', label: 'Certified Excellence' },
];

const credentials = [
  {
    icon: GraduationCap,
    title: 'Certified Makeup Master',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Professionally trained in advanced bridal and editorial makeup techniques.',
    color: 'from-pink-100 to-rose-50', border: 'border-pink-200', iconColor: 'text-pink-500',
  },
  {
    icon: Award,
    title: 'Eyelash Extension Specialist',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Specialist certification in classic, hybrid, and volume lash extension applications.',
    color: 'from-sky-100 to-blue-50', border: 'border-sky-200', iconColor: 'text-sky-500',
  },
  {
    icon: CheckCircle,
    title: 'Beauty Business Management',
    org: 'Professional Certification',
    desc: 'Formal training in salon management, client relations, and beauty industry standards.',
    color: 'from-purple-100 to-violet-50', border: 'border-purple-200', iconColor: 'text-purple-500',
  },
  {
    icon: Star,
    title: '5+ Years Professional Experience',
    org: 'EMBOS Beauty Salon & Studio',
    desc: 'Over five years of hands-on experience serving 500+ happy clients in Chennai.',
    color: 'from-amber-100 to-yellow-50', border: 'border-amber-200', iconColor: 'text-amber-500',
  },
];

const pinkSmoke = "shadow-[0_0_20px_rgba(255,182,193,0.8)]";

export default function AboutUs() {
  return (
    <div className="bg-[#FFF1F5] min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">

        {/* ── Our Story ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-12 sm:mb-24">

          {/* Studio image */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative pb-10 sm:pb-0">
            <div className={`relative h-72 sm:h-96 rounded-3xl overflow-hidden border-4 border-white ${pinkSmoke}`}>
              <img src="/interior.png" alt="EMBOS Studio" className="w-full h-full object-cover" />
            </div>
            <motion.div className={`absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl p-4 sm:p-5 border border-sky-200 w-40 sm:w-48 ${pinkSmoke}`}>
              <img src="/logo.jpeg" alt="EMBOS Logo" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 object-cover border-2 border-sky-400" />
              <p className="text-center text-xs text-gray-500 font-medium">Est. in Chennai</p>
              <p className="text-center text-xs text-sky-500 font-semibold tracking-wide mt-0.5">Valasaravakkam</p>
            </motion.div>
          </motion.div>

          {/* Story text */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs tracking-[0.35em] text-sky-600 uppercase font-bold mb-3">Our Story</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
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
                    <p className="text-xl sm:text-3xl font-bold text-[#1a1a2e] mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</p>
                    <p className="text-[11px] sm:text-sm text-slate-500 font-medium leading-tight">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Meet the Expert ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className={`mb-12 sm:mb-24 bg-[#FFD1DC] rounded-3xl p-6 sm:p-10 md:p-14 border-2 border-sky-400 ${pinkSmoke}`}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-4 border-white mx-auto md:mx-0">
              <img src="/profile.png" alt="Ms. T. S. Hemavathy" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Meet the Expert</h3>
              <p className="text-base sm:text-lg font-bold text-sky-600 mb-4 uppercase tracking-wide">Ms. T. S. Hemavathy</p>
              <p className="text-gray-700 leading-relaxed text-sm font-medium">
                Led by Ms. T. S. Hemavathy, our studio is dedicated to professional excellence and certified beauty expertise. Hemavathy is a certified Makeup Master and an Eyelash Extension specialist trained by the ISO-certified PISHAA Academy. With a formal background in Beauty Business Management, she ensures every client receives high-quality service backed by professional industry standards.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Certifications & Credentials ───────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.35em] text-sky-500 uppercase font-semibold mb-3">Expertise & Trust</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Certifications & <span className="text-pink-500">Credentials</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Every service at EMBOS is backed by certified expertise, professional training, and a commitment to excellence.
          </p>
        </motion.div>

        {/* Credential Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16">
          {credentials.map((cred, i) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className={`bg-gradient-to-br ${cred.color} rounded-2xl p-6 border ${cred.border} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                  <Icon size={22} className={cred.iconColor} />
                </div>
                <h3 className="text-sm font-bold text-[#1a1a2e] mb-1 leading-snug">{cred.title}</h3>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{cred.org}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{cred.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Certificates ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-xs tracking-[0.35em] text-pink-500 uppercase font-semibold mb-3">Official Documents</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our <span className="text-sky-500">Certificates</span>
          </h3>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="rounded-2xl overflow-hidden shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <img src="/certificate1.jpeg" alt="Pro Makeover & Hair Style Certification - B3 Bridal Studio" className="w-full object-cover" />
            <div className="bg-white p-4">
              <p className="text-sm font-bold text-[#1a1a2e]">Pro Makeover & Hair Style</p>
              <p className="text-xs text-sky-500 font-semibold mt-0.5">B3 Bridal Studio — Nov 2022</p>
            </div>
          </motion.div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
