import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function Promo() {
  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <svg fill="none" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-brand-green">
           <path stroke="currentColor" strokeWidth="0.5" d="M0 100C30 30 70 30 100 0" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-brand-green rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden"
        >
          {/* Subtle glow / highlight */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-gold/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-brand-cream/10 blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block font-sans text-brand-gold font-medium uppercase tracking-[0.2em] mb-4 text-sm">
              Mulai Langkah Anda
            </span>
            <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-balance">
              Siapkah Anda Menjadi Tamu Allah?
            </h2>
            <p className="font-sans text-brand-cream/80 text-lg mb-10 leading-relaxed font-light">
              Daftar sekarang melalui aplikasi Tanur Muthmainnah atau hubungi konsultan kami untuk merencanakan perjalanan ibadah terbaik Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-brand-gold text-brand-green px-8 py-4 rounded-full font-sans font-medium text-sm tracking-wide uppercase hover:bg-white hover:text-brand-green transition-all flex items-center justify-center gap-2">
                Download Aplikasi <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
