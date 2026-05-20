import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type GalleryImage, type Transformation } from '../lib/supabase';

const FILTERS = ['All', 'Bridal','Nails', 'Hair','Saree'];

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  { id: '1', url: '/saree g1.png', description: 'saree preplating', category: 'Saree', created_at: '' },
  { id: '2', url: '/bridal look gallery.png', description: 'Bridal Makeover', category: 'Bridal', created_at: '' },
  { id: '3', url: '/bridal look gallery 1.png', description: 'Engegment look', category: 'Bridal', created_at: '' },
  { id: '4', url: '/nail gallery 1.png', description: 'Nail Art', category: 'Nails', created_at: '' },
  { id: '5', url: '/hairstyle g.png', description: 'Hair Styling', category: 'Hair', created_at: '' },
  { id: '6', url: '/bridal look 8.jpeg', description: 'Bridal Hair & Makeup', category: 'Bridal', created_at: '' },
  { id: '7', url: '/hairstyle g3.png', description: 'Facial Treatment', category: 'Hair', created_at: '' },
  { id: '8', url: '/hairstyle g2.png', description: 'bridal hairstyle', category: 'Hair', created_at: '' },
  { id: '9', url: '/saree g2.png', description: 'saree preplating', category: 'Saree', created_at: '' },
  { id: '10', url: '/hairstyle g4.png', description: 'bridal hairstyle', category: 'Hair', created_at: '' },
  { id: '11', url: '/saree g3.png', description: 'saree preplating', category: 'Saree', created_at: '' },
  { id: '12', url: '/hairstyle g5.png', description: 'bridal hairstyle', category: 'Hair', created_at: '' },
];

const PLACEHOLDER_TRANSFORMATIONS: Transformation[] = [
  {
    id: 't1',
    before_url: '/before 1.png',
    after_url: '/after 1.png',
    description: 'Skin Transformation',
    created_at: '',
  },
  {
    id: 't2',
    before_url: '/before 2.png',
    after_url: '/after 2.png',
    description: 'Skin Transformation',
    created_at: '',
  },
];

function BeforeAfterSlider({ before, after, description }: { before: string; after: string; description: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const el = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((clientX - el.left) / el.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  return (
    <div className="relative w-full h-72 rounded-2xl overflow-hidden select-none shadow-lg cursor-ew-resize"
      onMouseMove={handleMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={handleMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* After (full) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <img src={before} alt="Before" className="w-full h-full object-cover" style={{ width: `${10000 / sliderPos}%`, maxWidth: 'none' }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-0.5 h-full bg-white/80" />
        <button
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-[#40BFFF]"
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8L2 5M2 5L5 2M2 5H14M11 8L14 5M14 5L11 2M14 5H2" stroke="#40BFFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {/* Labels */}
      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-semibold tracking-wide backdrop-blur-sm">Before</div>
      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#40BFFF]/90 text-white text-xs font-semibold tracking-wide">After</div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm whitespace-nowrap">{description}</div>
    </div>
  );
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>(PLACEHOLDER_IMAGES);
  const [transformations, setTransformations] = useState<Transformation[]>(PLACEHOLDER_TRANSFORMATIONS);

  useEffect(() => {
    supabase.from('gallery_images').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setImages(data);
    });
    supabase.from('transformations').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setTransformations(data);
    });
  }, []);

  const filtered = activeFilter === 'All' ? images : images.filter((img) => img.category === activeFilter);

  return (
    <section id="gallery" className="py-24 px-4 bg-gradient-to-b from-pink-150/50 to-pink-100/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.35em] text-[#FFE8F0] uppercase font-semibold mb-3">Our Work</p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Gallery
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#40BFFF] to-transparent mx-auto" />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-[#40BFFF] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-[#40BFFF]'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative break-inside-avoid rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={img.url}
                  alt={img.description}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-xs font-semibold tracking-wide text-[#F4C2C2] uppercase">{img.category}</span>
                    <p className="text-white text-sm mt-1">{img.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Before/After Transformations */}
        {transformations.length > 0 && (
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">Real Results</p>
              <h3
                className="text-3xl font-bold text-[#1a1a2e]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Transformations
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {transformations.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <BeforeAfterSlider before={t.before_url} after={t.after_url} description={t.description} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
