import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Instagram } from "lucide-react";

export function MediaPromo() {
 const videos = [
  { id: "7360707456336514310", duration: 8000 },
  { id: "7607373117224193287", duration: 10000 },
  { id: "7631115475837062408", duration: 9000 },
];

const [index, setIndex] = useState(0);
const timeoutRef = useRef<any>(null);

useEffect(() => {
  const currentDuration = videos[index].duration;

  timeoutRef.current = setTimeout(() => {
    setIndex((prev) => (prev + 1) % videos.length);
  }, currentDuration);

  return () => clearTimeout(timeoutRef.current);
}, [index]);

  return (
    <section className="py-24 bg-brand-gray border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Instagram className="w-8 h-8 text-brand-yellow" />
          </div>
          <h2 className="font-display text-4xl uppercase tracking-wide">
            Promo & Update Terbaru
          </h2>
          <p className="text-white/60 mt-2">
            Ikuti instagram kami di{" "}
            <span className="text-brand-yellow font-bold">
              @sammy_motor
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* 🔥 SLIDER TIKTOK */}
          
          <div className="overflow-hidden rounded-xl border border-white/10 bg-brand-black p-4">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {videos.map((video, i) => (
                <div key={i} className="min-w-full flex justify-center overflow-hidden">
                  <div className="w-full max-w-[325px] aspect-[9/16]">
                    <iframe
                      src={`https://www.tiktok.com/player/v1/${video.id}?autoplay=1&controls=1`}
                      className="w-full h-full rounded-lg"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* DOT */}
            <div className="flex justify-center mt-4 gap-2">
              {videos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === index
                      ? "bg-brand-yellow"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="bg-brand-black/50 p-8 rounded-xl border border-brand-yellow/20 backdrop-blur-sm">
            <h3 className="font-display text-3xl mb-4 text-brand-yellow">
              Pusat Jual Beli Motor Bekas Berkualitas
            </h3>

            <p className="text-white/80 font-sans mb-6 leading-relaxed">
              Miliki motor impianmu hari ini dengan syarat super mudah. Kami siap melayani pembelian secara tunai maupun kredit untuk area Tangerang dan sekitarnya.
            </p>

            <ul className="space-y-4 font-sans text-white/90 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <span><strong>Cash & Kredit:</strong> Proses mudah sampai ACC.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <span><strong>Tukar Tambah:</strong> Bisa upgrade motor.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <span><strong>Syarat Mudah:</strong> KTP, KK, bukti kerja.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <span><strong>Terpercaya:</strong> Surat asli & transparan.</span>
              </li>
            </ul>

            <a
              href="https://www.instagram.com/sammy_motor/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-black rounded font-bold"
            >
              <Instagram className="w-4 h-4" /> Buka Instagram
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}