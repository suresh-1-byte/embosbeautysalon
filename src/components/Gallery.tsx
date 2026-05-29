import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type GalleryImage, type Transformation } from '../lib/supabase';

const FILTERS = ['All', 'Bridal', 'Hair', 'Nails', 'Saree', 'Other'];

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  // Bridal
  { id: 'p1',  url: '/bridal look gallery.png',   description: 'Bridal Makeover',         category: 'Bridal', created_at: '' },
  { id: 'p2',  url: '/bridal look gallery 1.png',  description: 'Engagement Look',          category: 'Bridal', created_at: '' },
  { id: 'p3',  url: '/bridal look gallery 2.png',  description: 'Bridal Look',              category: 'Bridal', created_at: '' },
  { id: 'p4',  url: '/bridal look 1.jpeg',         description: 'Bridal Makeup',            category: 'Bridal', created_at: '' },
  { id: 'p5',  url: '/bridal look 2.webp',         description: 'Bridal Look 2',            category: 'Bridal', created_at: '' },
  { id: 'p6',  url: '/bridal look 3.webp',         description: 'Bridal Look 3',            category: 'Bridal', created_at: '' },
  { id: 'p7',  url: '/bridal look 4.jpeg',         description: 'Bridal Look 4',            category: 'Bridal', created_at: '' },
  { id: 'p8',  url: '/bridal look 5.jpeg',         description: 'Bridal Look 5',            category: 'Bridal', created_at: '' },
  { id: 'p9',  url: '/bridal look 6.jpeg',         description: 'Bridal Look 6',            category: 'Bridal', created_at: '' },
  { id: 'p10', url: '/bridal look 7.jpeg',         description: 'Bridal Look 7',            category: 'Bridal', created_at: '' },
  { id: 'p11', url: '/bridal look 8.jpeg',         description: 'Bridal Hair & Makeup',     category: 'Bridal', created_at: '' },
  { id: 'p15', url: '/Engegment look.webp',        description: 'Engagement Look',          category: 'Bridal', created_at: '' },
  // Hair
  { id: 'p17', url: '/hairstyle g.png',            description: 'Hair Styling',             category: 'Hair',   created_at: '' },
  { id: 'p18', url: '/hairstyle g2.png',           description: 'Bridal Hairstyle',         category: 'Hair',   created_at: '' },
  { id: 'p19', url: '/hairstyle g3.png',           description: 'Hair Treatment',           category: 'Hair',   created_at: '' },
  { id: 'p20', url: '/hairstyle g4.png',           description: 'Bridal Hairstyle',         category: 'Hair',   created_at: '' },
  { id: 'p21', url: '/hairstyle g5.png',           description: 'Bridal Hairstyle',         category: 'Hair',   created_at: '' },
  { id: 'p22', url: '/hairstyle g6.png',           description: 'Hair Styling',             category: 'Hair',   created_at: '' },
  { id: 'p23', url: '/hairstyle g7.png',           description: 'Hair Styling',             category: 'Hair',   created_at: '' },
  { id: 'p24', url: '/hairstyling.jpg',            description: 'Hair Styling',             category: 'Hair',   created_at: '' },
  // Nails
  { id: 'p25', url: '/nail gallery 1.png',         description: 'Nail Art',                 category: 'Nails',  created_at: '' },
  { id: 'p26', url: '/mehendi and nail art.jpg',   description: 'Mehendi & Nail Art',       category: 'Nails',  created_at: '' },
  // Saree
  { id: 'p27', url: '/saree g1.png',               description: 'Saree Draping',            category: 'Saree',  created_at: '' },
  { id: 'p28', url: '/saree g2.png',               description: 'Saree Draping',            category: 'Saree',  created_at: '' },
  { id: 'p29', url: '/saree g3.png',               description: 'Saree Draping',            category: 'Saree',  created_at: '' },
  { id: 'p30', url: '/saree draping.jpg',          description: 'Saree Draping',            category: 'Saree',  created_at: '' },
  { id: 'p31', url: '/Madisar mami.webp',          description: 'Madisar Draping',          category: 'Saree',  created_at: '' },
  // Other / Skincare
  { id: 'p33', url: '/prebridal skincare.jpg',     description: 'Pre-Bridal Skincare',      category: 'Other',  created_at: '' },
];

const PLACEHOLDER_TRANSFORMATIONS: Transformation[] = [
  { id: 't1', before_url: '/before 1.png', after_url: '/after 1.png', description: 'Skin Transformation', created_at: '' },
  { id: 't2', before_url: '/before 2.png', after_url: '/after 2.png', description: 'Skin Transformation', created_at: '' },
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
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none shadow-lg cursor-ew-resize"
      style={{ height: 'clamp(200px, 40vw, 288px)' }}
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
        <img
          src={before}
          alt="Before"
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${10000 / sliderPos}%`, maxWidth: 'none' }}
        />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-0.5 h-full bg-white/80" />
        <button
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-[#40BFFF]"
          style={{ minHeight: 'unset' }}
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M5 8L2 5M2 5L5 2M2 5H14M11 8L14 5M14 5L11 2M14 5H2" stroke="#40BFFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">Before</div>
      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#40BFFF]/90 text-white text-xs font-semibold">After</div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm max-w-[60%] truncate">{description}</div>
    </div>
  );
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>(PLACEHOLDER_IMAGES);
  const [transformations, setTransformations] = useState<Transformation[]>(PLACEHOLDER_TRANSFORMATIONS);

  useEffect(() => {
    // Always show all placeholder images PLUS any DB-uploaded images on top.
    // DB images are never deleted from the gallery — only manual delete in admin removes them.
    supabase.from('gallery_images').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      const dbImages = data ?? [];
      // Deduplicate: skip placeholders whose URL already exists in DB (exact match)
      const dbUrls = new Set(dbImages.map((d) => d.url));
      const uniquePlaceholders = PLACEHOLDER_IMAGES.filter((p) => !dbUrls.has(p.url));
      // DB images first (newest uploads on top), then all placeholders
      setImages([...dbImages, ...uniquePlaceholders]);
    });
    supabase.from('transformations').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setTransformations(data);
    });
  }, []);

  const filtered = activeFilter === 'All' ? images : images.filter((img) => img.category === activeFilter);

  return (
    <section id="gallery" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-pink-50 to-pink-100/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">Our Work</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Gallery
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#40BFFF] to-transparent mx-auto" />
        </motion.div>

        {/* Filter buttons — scrollable on mobile */}
        <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-hide px-1">
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileTap={{ scale: 0.97 }}
              style={{ minHeight: 'unset' }}
              className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-[#40BFFF] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-500'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Masonry Grid — 2 cols mobile, 3 tablet, 4 desktop */}
        <motion.div
          layout
          className="columns-2 sm:columns-3 lg:columns-4"
          style={{ columnGap: '0.75rem' }}
        >
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="relative break-inside-avoid rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300 mb-3"
              >
                <img
                  src={img.url}
                  alt={img.description}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold tracking-wide text-[#F4C2C2] uppercase">{img.category}</span>
                    <p className="text-white text-xs mt-0.5 truncate">{img.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Before/After Transformations */}
        {transformations.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-10"
            >
              <p className="text-xs tracking-[0.35em] text-[#40BFFF] uppercase font-semibold mb-3">Real Results</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Transformations
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
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
