import { motion } from "motion/react";
import { Check } from "lucide-react";

const packages = [
  {
    title: "Umrah Hemat",
    duration: "9 Hari",
    price: "Rp 25.500.000",
    description: "Solusi hemat untuk perjalanan ibadah Anda dengan fasilitas yang tetap nyaman.",
    features: [
      "Penerbangan Ekonomi",
      "Hotel Bintang 3",
      "Visa Umrah",
      "Muthawwif Berpengalaman",
      "Air Zamzam 5 Liter"
    ],
    featured: false
  },
  {
    title: "Umrah Reguler",
    duration: "12 Hari",
    price: "Rp 32.000.000",
    description: "Paket favorit jamaah dengan durasi lebih lama dan fasilitas premium.",
    features: [
      "Penerbangan Direct (Saudi/Garuda)",
      "Hotel Bintang 4 di ring 1",
      "Kereta Cepat Haramain",
      "City Tour Ekstra",
      "Perlengkapan Eksklusif"
    ],
    featured: true
  },
  {
    title: "Umrah Plus Turki",
    duration: "14 Hari",
    price: "Rp 40.500.000",
    description: "Gabungan spiritual dan tadabbur alam menikmati keindahan sejarah Turki.",
    features: [
      "Penerbangan Turkish Airlines",
      "Hotel Bintang 5 Mecca & Madinah",
      "City Tour Istanbul & Cappadocia",
      "Full Board Meals Premium",
      "Pemandu Khusus di Turki"
    ],
    featured: false
  }
];

export function Packages() {
  return (
    <section id="paket" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block font-sans text-brand-gold font-medium uppercase tracking-[0.2em] mb-4 text-sm">
            Pilihan Paket
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-green leading-[1.1] mb-6 text-balance">
            Temukan Paket <i className="text-brand-gold">Perjalanan</i> Yang Tepat
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`relative p-8 rounded-[32px] transition-all duration-300 ${
                pkg.featured 
                  ? "bg-brand-green text-white shadow-2xl scale-100 lg:scale-105 border border-brand-green" 
                  : "bg-brand-cream border border-brand-gold/20 text-brand-green"
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-brand-gold text-brand-green text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Terpopuler
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className={`text-2xl font-serif font-medium mb-1 ${pkg.featured ? "text-brand-gold" : "text-brand-green"}`}>
                  {pkg.title}
                </h3>
                <p className={`font-sans text-sm mb-4 ${pkg.featured ? "text-brand-cream/80" : "text-brand-green/60"}`}>
                  Durasi: {pkg.duration}
                </p>
                <div className="text-3xl font-serif font-semibold mb-4">
                  {pkg.price}
                </div>
                <p className={`font-sans text-sm leading-relaxed ${pkg.featured ? "text-brand-cream/90" : "text-brand-green/80"}`}>
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {pkg.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${pkg.featured ? "text-brand-gold" : "text-brand-green"}`} />
                    <span className={`font-sans text-sm ${pkg.featured ? "text-white" : "text-brand-green"}`}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-full font-sans font-medium text-sm tracking-wide uppercase transition-colors ${
                pkg.featured 
                  ? "bg-brand-gold text-brand-green hover:bg-white" 
                  : "bg-brand-green text-white hover:bg-brand-green/90"
              }`}>
                Pilih Paket Ini
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
