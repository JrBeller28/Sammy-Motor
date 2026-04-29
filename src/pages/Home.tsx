import React, { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { MotorCard } from "../components/MotorCard";
import { MediaPromo } from "../components/MediaPromo";
import { Motor } from "../data/motors";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Wrench, FileCheck, HeadphonesIcon, Tag } from "lucide-react";
import { collection, onSnapshot, query, limit, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export function Home() {
   const navigate = useNavigate();
   const [featuredMotors, setFeaturedMotors] = useState<Motor[]>([]);
   
   useEffect(() => {
     // Fetch top 3 motors
     const q = query(
       collection(db, "motors"), 
       where("status", "in", ["Tersedia", "Available"]),
       limit(6)
     );
     const unsub = onSnapshot(q, (snap) => {
        setFeaturedMotors(snap.docs.map(t => ({ id: t.id, ...t.data() } as Motor)));
     });
     return () => unsub();
   }, []);
   
   return (
     <div className="bg-brand-light">
       <Hero />
       
       <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-brand-yellow blur-[120px] rounded-full -translate-x-1/2 opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="font-display font-extrabold text-4xl uppercase tracking-wide text-brand-black">Stok Pilihan</h2>
              <p className="text-gray-500 mt-2">Unit terbaik siap dibawa pulang hari ini.</p>
            </div>
            <Link to="/katalog" className="text-sm font-bold uppercase tracking-widest text-brand-black hover:text-brand-yellow flex items-center gap-2 transition-colors group">
              Katalog Lengkap <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {featuredMotors.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-bold border-2 border-dashed border-gray-200 rounded bg-white/50">
              Tidak ada unit untuk ditampilkan. Import data di panel Admin.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMotors.map(m => (
                <MotorCard key={m.id} motor={m} onClick={() => navigate('/katalog', { state: { motorId: m.id } })} />
              ))}
            </div>
          )}
        </div>
       </section>

       {/* Mengapa Memilih Kami */}
       <section className="py-24 bg-brand-black relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none"></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16">
             <span className="inline-block text-brand-yellow font-bold tracking-widest uppercase text-xs sm:text-sm mb-3">Keunggulan Sammy Motor</span>
             <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white mb-6 uppercase tracking-tight">Mengapa Memilih Kami?</h2>
             <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
               Kami tidak sekadar menjual motor bekas. Kami memberikan jaminan kualitas, keamanan, dan ketenangan pikiran untuk setiap perjalanan Anda.
             </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
             {[
               { icon: Shield, title: "Garansi Mesin", desc: "Nikmati garansi mesin 1 bulan untuk perlindungan esktra pada setiap unit." },
               { icon: Wrench, title: "Servis Total", desc: "Telah melewati QC ketat, ganti oli, dan servis menyeluruh sebelum dijual." },
               { icon: FileCheck, title: "Legalitas Terjamin", desc: "100% aman. Surat-surat kendaraan asli (BPKB & STNK), hidup, dan lengkap." },
               { icon: HeadphonesIcon, title: "Layanan Prioritas", desc: "Konsultasi gratis selamanya dan layanan purna jual terbaik untuk Anda." }
             ].map((item, i) => (
               <div key={i} className="group relative bg-[#111] p-8 rounded-2xl border border-white/5 hover:border-brand-yellow/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(250,204,21,0.05)] overflow-hidden">
                 {/* Decorative background glow on hover */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                 
                 <div className="w-14 h-14 bg-white/5 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 group-hover:bg-brand-yellow/10 transition-all duration-300">
                   <item.icon className="w-6 h-6 text-gray-400 group-hover:text-brand-yellow transition-colors" />
                 </div>
                 <h3 className="font-bold text-white text-xl mb-3">{item.title}</h3>
                 <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
                 
                 {/* Progress line */}
                 <div className="absolute bottom-0 left-0 h-1 bg-brand-yellow w-0 group-hover:w-full transition-all duration-500"></div>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Merk Populer */}
       <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16 flex flex-col items-center">
             <div className="h-1 w-20 bg-brand-yellow mb-6 rounded-full"></div>
             <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-brand-black mb-4 uppercase tracking-tighter">Merk Terpopuler</h2>
             <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">Temukan motor idaman Anda dari berbagai brand ternama di Indonesia</p>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
             {[
               { name: "Honda", logo: "H" },
               { name: "Yamaha", logo: "Y" },
               { name: "Suzuki", logo: "S" },
               { name: "Kawasaki", logo: "K" }
             ].map((merk, i) => (
               <div 
                 key={i} 
                 onClick={() => navigate('/katalog', { state: { brand: merk.name } })} 
                 className="group bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-brand-yellow/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
               >
                 <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md border border-gray-100 group-hover:border-brand-yellow/20 transition-all">
                   <span className="font-display text-2xl sm:text-3xl text-gray-400 group-hover:text-brand-black transition-colors">{merk.logo}</span>
                 </div>
                 <h3 className="font-bold text-gray-500 text-lg uppercase tracking-widest group-hover:text-brand-black transition-colors">{merk.name}</h3>
                 
                 <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-xs font-bold text-brand-yellow bg-brand-black px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      Lihat Stok <ArrowRight className="w-3 h-3" />
                    </span>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>

       <MediaPromo />
     </div>
   );
}
