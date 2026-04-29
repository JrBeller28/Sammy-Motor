import { motion } from "motion/react";
import { ShieldCheck, HeartHandshake, PhoneCall, Plane } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Legalitas Terdaftar",
    description: "Perusahaan resmi dan terdaftar di Kemenag RI, memberikan jaminan keamanan bagi perjalanan ibadah Anda."
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Bimbingan Intensif",
    description: "Dibimbing oleh muthawwif berpengalaman dan sesuai sunnah untuk memastikan kesempurnaan ibadah Anda."
  },
  {
    icon: <Plane className="w-8 h-8" />,
    title: "Fasilitas Premium",
    description: "Hotel bintang 4/5 dekat masjid, penerbangan direct/transit terbaik, dan bus eksklusif."
  },
  {
    icon: <PhoneCall className="w-8 h-8" />,
    title: "Layanan 24/7",
    description: "Tim support kami siap membantu Anda kapanpun, termasuk pantauan real-time via WhatsApp."
  }
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-32 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block font-sans text-brand-gold font-medium uppercase tracking-[0.2em] mb-4 text-sm">
            Kenapa Memilih Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-green leading-[1.1] mb-6">
            Biro Perjalanan <i className="text-brand-gold">Terpercaya</i> <br/> Untuk Ibadah Anda
          </h2>
          <p className="font-sans text-brand-green/70 text-lg leading-relaxed font-light">
            Kami berkomitmen memberikan pelayanan terbaik sejak pendaftaran hingga kembali ke tanah air, menjadikan perjalanan Anda khusyuk dan nyaman.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-t border-brand-gold/10 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/5 text-brand-gold flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif text-brand-green mb-3 font-medium">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-brand-green/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
