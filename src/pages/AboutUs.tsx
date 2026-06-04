import { motion } from 'framer-motion';
import { Award, CheckCircle, GraduationCap, Heart, Star, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const stats = [
  { icon: Star,  value: '500+', label: 'Happy Clients',       color: 'from-pink-500 to-rose-400' },
  { icon: Award, value: '5+',   label: 'Years Experience',    color: 'from-sky-500 to-blue-400' },
  { icon: Heart, value: '100%', label: 'Certified Excellence',color: 'from-purple-500 to-violet-400' },
];

const credentials = [
  {
    icon: GraduationCap,
    title: 'Certified Makeup Master',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Professionally trained in advanced bridal and editorial makeup techniques.',
    gradient: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-500',
  },
  {
    icon: Award,
    title: 'Eyelash Extension Specialist',
    org: 'PISHAA Academy (ISO Certified)',
    desc: 'Specialist certification in classic, hybrid, and volume lash extension applications.',
    gradient: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-500',
  },
  {
    icon: CheckCircle,
    title: 'Beauty Business Management',
    org: 'Professional Certification',
    desc: 'Formal training in salon management, client relations, and beauty industry standards.',
    gradient: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
  },
  {
    icon: Star,
    title: '5+ Years Professional Experience',
    org: 'EMBOS Beauty Salon & Studio',
    desc: 'Over five years of hands-on experience serving 500+ happy clients in Chennai.',
    gradient: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
  },
];

export default function AboutUs() {
  return (
    <div className="bg-[#FFF1F5]">
      <Navigation />

      {/* ── Hero Section ─────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ minHeight: '45vh', paddingTop: '80px' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/bridal page background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles size={14} className="text-[#F4C2C2]" />
            <span className="text-xs tracking-[0.35em] text-[#F4C2C2] uppercase font-semibold">EMBOS Beauty Salon & Studio</span>
            <Sparkles size={14} className="text-[#F4C2C2]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
          >
            Our Story
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-20 h-px bg-gradient-to-r from-transparent via-[#F4C2C2] to-transparent mx-auto mb-5"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto"
          >
            Discover the passion, expertise, and certified excellence behind EMBOS Beauty Salon & Studio.
          </motion.p>
        </div>
      </section>

      {/* ── About EMBOS ──────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

            {/* Studio image */}
            <motion.div {...fadeUp(0)} className="relative pb-10 sm:pb-0">
              <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border-4 border-white shadow-[0_0_30px_rgba(255,182,193,0.6)]">
                <img src="/interior.png" alt="EMBOS Studio" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating card */}
              <motion.div
                {...fadeUp(0.3)}
                className="absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl p-4 sm:p-5 border border-sky-200 w-40 sm:w-48 shadow-[0_0_20px_rgba(255,182,193,0.6)]"
              >
                <img src="/logo.jpeg" alt="EMBOS Logo" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 object-cover border-2 border-sky-400" />
                <p className="text-center text-xs text-gray-500 font-medium">Est. in Chennai</p>
                <p className="text-center text-xs text-sky-500 font-semibold tracking-wide mt-0.5">Valasaravakkam</p>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div {...fadeUp(0.2)}>
              <p className="text-xs tracking-[0.35em] text-sky-600 uppercase font-bold mb-3">Our Story</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="text-[#1a1a2e]">About</span>
                <span className="text-sky-500"> EM</span>
                <span className="text-pink-500">B</span>
                <span className="text-sky-500">OS</span>
              </h2>
              <div className="w-12 h-1 bg-sky-400 mb-6 rounded-full" />
              <p className="text-gray-700 leading-relaxed mb-4 text-base font-medium">
                EMBOS Beauty Salon & Studio is a sanctuary of beauty nestled in the heart of Valasaravakkam, Chennai. We blend the delicate artistry of Korean beauty techniques with the rich, vibrant traditions of Indian bridal culture.
              </p>
              <p className="text-gray-600 leading-relaxed text-base font-light mb-10">
                Our team of passionate beauty therapists specializes in brow architecture, skin restoration, and hair transformation — delivering results that honor your natural beauty while elevating it to its most radiant form.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      {...fadeUp(0.3 + i * 0.1)}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-br from-white to-pink-50 border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-sm`}>
                        <Icon size={18} className="text-white" strokeWidth={1.5} />
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Meet the Expert ──────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-[#FFF1F5]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] text-pink-500 uppercase font-semibold mb-3">The Face Behind EMBOS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Meet the <span className="text-sky-500">Expert</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto" />
          </motion.div>

          <motion.div
            {...fadeUp(0.2)}
            className="bg-gradient-to-br from-[#FFD1DC] to-[#FFE8F0] rounded-3xl p-6 sm:p-10 md:p-14 border-2 border-sky-300 shadow-[0_0_30px_rgba(255,182,193,0.5)]"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Profile image */}
              <div className="flex-shrink-0">
                <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                  <img src="/profile.png" alt="Ms. T. S. Hemavathy" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 border border-sky-200">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-sky-600 font-semibold">Certified Expert</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Ms. T. S. Hemavathy
                </h3>
                <p className="text-sm sm:text-base font-bold text-sky-600 mb-5 uppercase tracking-widest">
                  Founder & Lead Artist
                </p>
                <div className="w-10 h-0.5 bg-sky-400 mb-5 mx-auto md:mx-0 rounded-full" />
                <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                  Led by Ms. T. S. Hemavathy, our studio is dedicated to professional excellence and certified beauty expertise.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                  Hemavathy is a <strong>Certified Makeup Master</strong> and an <strong>Eyelash Extension Specialist</strong> trained by the ISO-certified PISHAA Academy.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  With a formal background in <strong>Beauty Business Management</strong>, she ensures every client receives high-quality service backed by professional industry standards.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Certifications & Credentials ─────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12 sm:mb-16">
            <p className="text-xs tracking-[0.35em] text-sky-500 uppercase font-semibold mb-3">Expertise & Trust</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Certifications & <span className="text-pink-500">Credentials</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Every service at EMBOS is backed by certified expertise, professional training, and a commitment to excellence.
            </p>
          </motion.div>

          {/* 4 Credential Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16">
            {credentials.map((cred, i) => {
              const Icon = cred.icon;
              return (
                <motion.div
                  key={cred.title}
                  {...fadeUp(0.1 + i * 0.1)}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className={`bg-gradient-to-br ${cred.gradient} rounded-2xl p-6 border ${cred.border} shadow-sm transition-all duration-300 flex flex-col`}
                >
                  <div className={`w-12 h-12 rounded-xl ${cred.iconBg} flex items-center justify-center mb-4 flex-shrink-0`}>
                    <Icon size={22} className={cred.iconColor} />
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a2e] mb-1 leading-snug">{cred.title}</h3>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">{cred.org}</p>
                  <p className="text-xs text-gray-600 leading-relaxed flex-1">{cred.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Certificates */}
          <motion.div {...fadeUp(0.5)} className="text-center mb-8">
            <p className="text-xs tracking-[0.35em] text-pink-500 uppercase font-semibold mb-3">Official Documents</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our <span className="text-sky-500">Certificates</span>
            </h3>
            <div className="w-14 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              {...fadeUp(0.6)}
              whileHover={{ y: -4 }}
              className="rounded-2xl overflow-hidden shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300"
            >
              <img src="/certificate1.jpeg" alt="Pro Makeover & Hair Style Certification" className="w-full object-cover" />
              <div className="bg-white p-4 border-t border-pink-50">
                <p className="text-sm font-bold text-[#1a1a2e]">Pro Makeover & Hair Style</p>
                <p className="text-xs text-sky-500 font-semibold mt-0.5">B3 Bridal Studio — Nov 2022</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
