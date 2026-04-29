import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, ThumbsUp, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-brand-black text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mb-16">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-brand-yellow font-bold tracking-widest uppercase text-sm mb-4">Tentang Kami</span>
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter mb-6 leading-tight">
              Lebih Dari Sekadar <br/> <span className="text-brand-yellow">Showroom Motor</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Sammy Motor hadir dengan satu misi: memberikan pengalaman jual beli motor bekas yang jujur, transparan, dan terpercaya. Kami memastikan setiap pelanggan membawa pulang motor impian dengan tenang.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-brand-black mb-6">Dedikasi Untuk <br/> Kualitas Terbaik</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                Berawal dari kecintaan kami terhadap otomotif, Sammy Motor didirikan dengan standar tinggi. Kami menyadari bahwa membeli motor bekas seringkali disertai dengan keraguan tentang kondisi mesin dan keaslian dokumen.
              </p>
              <p>
                Oleh karena itu, kami mengubah cara pandang tersebut dengan menerapkan Quality Control (QC) yang ketat. Setiap unit yang masuk ke showroom kami harus melewati inspeksi menyeluruh oleh teknisi berpengalaman. Jika tidak memenuhi standar kami, motor tersebut tidak akan pernah berada di etalase kami.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-sans font-extrabold text-4xl text-brand-black mb-2">10+</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tahun Pengalaman</p>
              </div>
              <div>
                <h4 className="font-sans font-extrabold text-4xl text-brand-black mb-2">5000+</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pelanggan Puas</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-200 shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop" 
                alt="Sammy Motor Showroom" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-brand-yellow rounded-full blur-[80px] opacity-40 z-0 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Detail */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-brand-black mb-4">Pilar Kepercayaan Kami</h2>
            <p className="text-gray-500 text-lg">Prinsip bisnis yang kami pegang teguh untuk menjaga kepercayaan Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Legal & Aman", desc: "Setiap BPKB, STNK, dan faktur diperiksa ketat. Kami memastikan legalitas yang sah di mata hukum." },
              { icon: Award, title: "Kondisi Prima", desc: "Bukan sekadar poles body. Kami pastikan mesin, kelistrikan, dan kaki-kaki dalam kondisi optimal." },
              { icon: ThumbsUp, title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi. Anda mendapatkan sesuai dengan yang Anda bayar, dengan kualitas sepadan." },
              { icon: Users, title: "Pelayanan Sepenuh Hati", desc: "Dari konsultasi hingga serah terima unit, tim kami siap melayani dan memberikan solusi terbaik." }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-brand-yellow/50 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors">
                  <item.icon className="w-7 h-7 text-brand-black" />
                </div>
                <h3 className="font-bold text-xl text-brand-black mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-brand-black mb-6">Siap Menemukan Motor Impian Anda?</h2>
        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">Tim kami siap membantu Anda memilih unit yang paling sesuai dengan kebutuhan dan budget Anda. Kunjungi showroom kami atau lihat stok secara online.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/katalog" className="bg-brand-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black w-full sm:w-auto shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            Lihat Stok Motor <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/lokasi" className="bg-white border-2 border-brand-black text-brand-black px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-50 w-full sm:w-auto transition-colors">
            Kunjungi Showroom
          </Link>
        </div>
      </section>
    </div>
  );
}
