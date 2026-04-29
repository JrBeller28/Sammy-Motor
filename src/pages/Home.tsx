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
       limit(3)
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
              <h2 className="font-display text-4xl uppercase tracking-wide text-brand-black">Stok Pilihan</h2>
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
       <section className="py-24 bg-gradient-to-br from-black via-[#111] to-black border-y border-gray-800 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16">
             <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 uppercase tracking-wider">Mengapa Memilih Kami?</h2>
             <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">Kami berkomitmen memberikan pengalaman terbaik dalam membeli motor bekas berkualitas</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { icon: Shield, title: "Garansi Mesin", desc: "Garansi mesin 1 bulan untuk setiap pembelian motor bekas." },
               { icon: Wrench, title: "Servis Lengkap", desc: "Setiap motor telah melalui inspeksi dan servis menyeluruh." },
               { icon: FileCheck, title: "Surat Lengkap", desc: "Jaminan surat-surat kendaraan asli dan lengkap." },
               { icon: HeadphonesIcon, title: "After Sales", desc: "Layanan purna jual dan konsultasi gratis selamanya." }
             ].map((item, i) => (
               <div key={i} className="bg-brand-black border border-gray-800/50 rounded-2xl p-8 text-center shadow-lg hover:border-brand-yellow/30 transition-all group">
                 <div className="w-16 h-16 mx-auto bg-[#1a1a1a] flex items-center justify-center rounded-2xl mb-6 shadow-glow border border-gray-800 group-hover:scale-110 transition-transform">
                   <item.icon className="w-8 h-8 text-brand-yellow" />
                 </div>
                 <h3 className="font-bold text-white mb-3 text-lg">{item.title}</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Merk Populer */}
       <section className="py-24 bg-brand-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[size:20px_20px]" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16">
             <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mb-4 uppercase tracking-wider">Merk Populer</h2>
             <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">Kami menyediakan berbagai merk motor bekas favorit</p>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {["Honda", "Yamaha", "Suzuki", "Kawasaki"].map((merk, i) => (
               <div key={i} onClick={() => navigate('/katalog', { state: { brand: merk } })} className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl hover:border-brand-yellow transition-all cursor-pointer group">
                 <div className="w-14 h-14 mb-4 bg-gray-50 flex flex-col justify-center items-center rounded-full group-hover:scale-110 transition-transform shadow-inner border border-gray-100">
                   <Tag className="w-6 h-6 text-brand-yellow" />
                 </div>
                 <h3 className="font-bold text-brand-black group-hover:text-brand-yellow transition-colors">{merk}</h3>
               </div>
             ))}
           </div>
         </div>
       </section>

       <MediaPromo />
     </div>
   );
}
