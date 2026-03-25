import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from '@/firebase';

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category: string;
}

import { useLanguage } from '@/LanguageContext';

export default function Gallery() {
  const { t } = useLanguage();
  const [images, setImages] = React.useState<GalleryItem[]>([]);
  const [selectedImg, setSelectedImg] = React.useState<GalleryItem | null>(null);
  const [filter, setFilter] = React.useState(t('gallery.filterAll'));
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setFilter(t('gallery.filterAll'));
  }, [t]);

  React.useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setImages(imageData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [t('gallery.filterAll'), ...Array.from(new Set(images.map(img => img.category)))];
  const filteredImages = (filter === t('gallery.filterAll')) ? images : images.filter(img => img.category === filter);

  if (loading) {
    return <div className="py-20 text-center">{t('gallery.loading')}</div>;
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('gallery.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('gallery.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                filter === cat ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary hover:bg-primary/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((img) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={img.id}
              className="group relative bg-white rounded-3xl overflow-hidden card-shadow border border-accent/50 cursor-pointer"
              onClick={() => setSelectedImg(img)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="text-white w-8 h-8" />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">{img.category}</span>
                <h3 className="text-lg font-bold text-primary truncate">{img.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-ink/30 font-bold">{t('gallery.notFound')}</div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-secondary transition-colors">
              <X className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImg.url}
              alt={selectedImg.title}
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-8 left-0 right-0 text-center text-white p-4">
              <h3 className="text-2xl font-bold">{selectedImg.title}</h3>
              <p className="text-white/60">{selectedImg.category}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}