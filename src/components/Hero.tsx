import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden bg-brand-black w-full">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 sm:opacity-60"></div>

        {/* Dark Overlay - Standardized for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent sm:bg-gradient-to-r sm:from-black sm:via-black/80 sm:to-transparent"></div>

        {/* Glow Effect */}
        <div className="absolute top-20 left-0 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-brand-yellow/10 sm:bg-brand-yellow/20 rounded-full blur-[80px] sm:blur-3xl"></div>

        {/* Accent Graphic - Hidden on small mobile if causing issues, or constrained */}
        <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full bg-brand-yellow transform skew-x-12 translate-x-1/2 sm:translate-x-32 opacity-10 blur-3xl pointer-events-none"></div>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="max-w-2xl px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-black/40 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-ping"></span>
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-[0.1em] sm:tracking-widest uppercase">
                🔥 Stok Terbatas • Bisa Kredit Mudah
              </span>
            </div>
            
            <motion.h1
  className="text-4xl sm:text-6xl md:text-7xl font-display text-white uppercase leading-[0.95] sm:leading-[0.9] tracking-tight mb-6"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  <motion.span
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    Motor{" "}
  </motion.span>

  <motion.span
    className="text-brand-yellow drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    Siap Pakai,
  </motion.span>

  <br className="hidden sm:block" />

  <motion.span
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    Kredit{" "}
  </motion.span>

  <motion.span
    className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-yellow-400 to-yellow-200"
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    }}
    transition={{ duration: 0.4 }}
  >
    Langsung ACC.
  </motion.span>
</motion.h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <p className="text-white/80 text-base sm:text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              Pilihan motor bekas berkualitas dengan garansi mesin dan proses cepat.
            </p>

                <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90 mb-10">
                  <span className="bg-white/10 px-3 py-1.5 rounded border border-white/5 backdrop-blur-sm">✔ Surat Lengkap</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded border border-white/5 backdrop-blur-sm">✔ Pajak Aktif</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded border border-white/5 backdrop-blur-sm">✔ Garansi Mesin</span>
                </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Link to="/katalog" className="bg-brand-yellow text-brand-black px-10 py-4 rounded-lg font-sans font-black text-sm tracking-widest uppercase hover:bg-yellow-300 transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-brand-yellow/10">
                LIHAT STOK UNIT
              </Link>
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-lg border border-white/10 shadow-lg">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/AF-Logo-Sponsor.png" alt="Adira Finance" className="h-6 sm:h-8 object-contain brightness-0 invert opacity-80" />
                <span className="text-[10px] text-white/40 font-sans uppercase tracking-widest border-l border-white/10 pl-4 py-1">Partner Resmi</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
