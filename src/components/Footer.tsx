import { MapPin, Phone, Instagram } from "lucide-react";
import { branches } from "../data/motors";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-20 pb-10 border-t border-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsYGkMuZWPxSihbIH1DdYmDwW8CRV5jcT4Q&s" 
                alt="Sammy Motor Logo" 
                className="w-12 h-12 object-cover rounded shadow-md border border-brand-yellow/20"
              />
              <div className="flex flex-col">
                <span className="font-display text-2xl uppercase tracking-wide leading-none text-brand-yellow">Sammy</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold leading-none text-white/80">Motor</span>
              </div>
            </div>
            <p className="font-sans text-white/60 text-sm leading-relaxed">
              Showroom motor bekas terpercaya di Tangerang. Kami menjamin kualitas mesin dan surat-surat kendaraan Anda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-brand-yellow transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Lokasi Cabang */}
          <div>
            <h4 className="font-sans font-bold text-sm text-brand-yellow mb-6 uppercase tracking-wider">Cabang Kami</h4>
            <ul className="space-y-4">
              {branches.map((branch, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-sm text-white/70">{branch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-sans font-bold text-sm text-brand-yellow mb-6 uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-3 font-sans text-sm text-white/70">
              <li>Jual Beli Motor Bekas</li>
              <li>Tukar Tambah (Trade-in)</li>
              <li>Simulasi Kredit Adira</li>
              <li>Perpanjang Pajak Kendaraan</li>
            </ul>
          </div>

          {/* Kemitraan */}
          <div>
            <h4 className="font-sans font-bold text-sm text-brand-yellow mb-6 uppercase tracking-wider">Partner Kredit Resmi</h4>
            <div className="bg-white p-4 rounded inline-block mb-4 shadow"><img src="https://i0.wp.com/www.adirafinance.id/wp-content/uploads/2020/07/adira-finance.png?resize=443%2C114&ssl=1" alt="Adira Finance" className="h-6 object-contain" />
            </div>
            <p className="font-sans text-xs text-white/50 leading-relaxed">
              Kredit motor aman, angsuran ringan, dan proses cepat didukung penuh oleh Adira Finance.
            </p>
          </div>

        </div>

        <div className="border-t border-brand-gray pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/40">
            &copy; {new Date().getFullYear()} Sammy Motor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-sans text-xs text-white/40 hover:text-brand-yellow transition-colors font-bold tracking-wider uppercase border border-white/10 px-3 py-1.5 rounded bg-white/5">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
