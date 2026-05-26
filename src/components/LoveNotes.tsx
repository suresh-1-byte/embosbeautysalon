import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { supabase, type StickyNote } from '../lib/supabase';

export default function LoveNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('sticky_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setNotes(data ?? []);
        setLoading(false);
      });
  }, []);

  if (!loading && notes.length === 0) return null;

  // Slight random rotations for sticky note feel
  const rotations = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];

  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#FFFDD0]/40 to-[#FFF1F5]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs tracking-[0.35em] text-[#F4C2C2] uppercase font-semibold mb-3 flex items-center justify-center gap-2">
            <Heart size={12} fill="#F4C2C2" /> Love from Our Clients <Heart size={12} fill="#F4C2C2" />
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sticky Love Notes
          </h2>
          <p className="text-gray-400 text-sm mt-3">Handwritten messages from our happy clients</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#F4C2C2]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {notes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotations[i % rotations.length] }}
                whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative bg-[#FFFDE7] rounded-sm shadow-md border border-yellow-200 p-3 cursor-pointer"
                style={{
                  boxShadow: '3px 3px 10px rgba(0,0,0,0.12), inset 0 -2px 4px rgba(0,0,0,0.04)',
                }}
              >
                {/* Pin */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F4C2C2] border-2 border-white shadow-sm z-10" />
                <img
                  src={note.image_url}
                  alt={note.caption || 'Love note'}
                  className="w-full object-contain rounded-sm"
                  style={{ maxHeight: '180px' }}
                />
                {note.caption && (
                  <p className="text-xs text-amber-800 mt-2 text-center font-medium leading-snug"
                    style={{ fontFamily: 'Georgia, serif' }}>
                    {note.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
