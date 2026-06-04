import { motion } from 'framer-motion';
import { Award, CheckCircle, GraduationCap, Star } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const credentials = [
  {
    icon: GraduationCap,
    title: 'Certified Makeup Master',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Professionally trained in advanced bridal and editorial makeup techniques.',
    color: 'from-pink-100 to-rose-50',
    border: 'border-pink-200',
    iconColor: 'text-pink-500',
  },
  {
    icon: Award,
    title: 'Eyelash Extension Specialist',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Specialist certification in classic, hybrid, and volume lash extension applications.',
    color: 'from-sky-100 to-blue-50',
    border: 'border-sky-200',
    iconColor: 'text-sky-500',
  },
  {
    icon: CheckCircle,
    title: 'Beauty Business Management',
    org: 'Professional Certification',
    desc: 'Formal training in salon management, client relations, and beauty industry standards.',
    color: 'from-purple-100 to-violet-50',
    border: 'border-purple-200',
    iconColor: 'text-purple-500',
  },
  {
    icon: Star,
    title: '5+ Years Professional Experience',
    org: 'EMBOS Beauty Salon & Studio',
    desc: 'Over five years of hands-on experience serving 500+ happy clients in Chennai.',
    color: 'from-amber-100 to-yellow-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
  },
];

export default function AboutUs() {
  return (
    <div className="bg-[#FFF1F5] min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">

        {/* Meet the Expert */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-24 bg-[#FFD1DC] rounded-3xl p-6 sm:p-10 md:p-14 border-2 border-sky-400 shadow-[0_0_20px_rgba(255,182,193,0.8)]"
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-4 border-white mx-auto md:mx-0">
              <img src="/profile.png" alt="Ms. T. S. Hemavathy" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Meet the Expert
              </h2>
              <p className="text-base sm:text-lg font-bold text-sky-600 mb-4 uppercase tracking-wide">
                Ms. T. S. Hemavathy
              </p>
              <p className="text-gray-700 leading-relaxed text-sm font-medium">
                Led by Ms. T. S. Hemavathy, our studio is dedicated to professional excellence and certified beauty expertise. Hemavathy is a certified Makeup Master and an Eyelash Extension specialist trained by the ISO-certified PISHAA Academy. With a formal background in Beauty Business Management, she ensures every client receives high-quality service backed by professional industry standards.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Credentials Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {credentials.map((cred, i) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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

      </div>

      <Footer />
    </div>
  );
}
