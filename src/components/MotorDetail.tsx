import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Motor } from "../data/motors";
import { formatCurrency } from "../utils/format";
import { CreditSimulation } from "./CreditSimulation";
import { BookingModal } from "./BookingModal";
import { motion } from "motion/react";

interface MotorDetailProps {
  motor: Motor;
  onBack: () => void;
}

export function MotorDetail({ motor, onBack }: MotorDetailProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDp, setSelectedDp] = useState(motor.minDp);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const imagesList = motor.images && motor.images.length > 0 ? motor.images : [motor.image];

  const handleBookClick = (dp: number) => {
    setSelectedDp(dp);
    setShowBooking(true);
  };

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-brand-black mb-6 font-semibold uppercase text-sm tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-5">
            {/* Left Col: Image & Description */}
            <div className="lg:col-span-3">
              <div className="relative h-64 md:h-[500px] bg-gray-100">
                <img src={imagesList[activeImageIdx]} alt={motor.model} className="w-full h-full object-cover" />
                
                {imagesList.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {imagesList.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-3 h-3 rounded-full border border-white shadow-sm transition-all ${idx === activeImageIdx ? 'bg-brand-yellow w-8' : 'bg-white/50 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-black text-brand-yellow font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-lg">
                    {motor.year}
                  </span>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100">
                <h2 className="font-display text-4xl mb-2">{motor.brand} {motor.model}</h2>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-brand-light px-4 py-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Kapasitas</p>
                    <p className="font-bold text-brand-black">{motor.engine}</p>
                  </div>
                  <div className="bg-brand-light px-4 py-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Jarak Tempuh</p>
                    <p className="font-bold text-brand-black">{motor.mileage.toLocaleString()} KM</p>
                  </div>
                  <div className="bg-brand-light px-4 py-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Warna</p>
                    <p className="font-bold text-brand-black">{motor.color}</p>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-4">Kondisi & Jaminan Sammy Motor</h3>
                <ul className="space-y-3 font-sans text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Kondisi mesin sangat terawat & normal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Surat-surat lengkap (STNK, BPKB, Faktur)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Pajak hidup panjang</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Bebas tabrakan dan banjir</li>
                </ul>
              </div>
            </div>

            {/* Right Col: Price & Sim */}
            <div className="lg:col-span-2 bg-gray-50 p-6 md:p-8 border-l border-gray-200">
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Harga Tunai</p>
                <p className="font-display text-5xl text-brand-black leading-none">{formatCurrency(motor.price)}</p>
              </div>

              {/* Simulation Block */}
              <CreditSimulation motor={motor} onBook={handleBookClick} />

            </div>
          </div>
        </motion.div>

      </div>

      {showBooking && (
        <BookingModal 
          motor={motor} 
          dpAmount={selectedDp} 
          onClose={() => setShowBooking(false)} 
          onConfirm={() => {
            // Usually we'd reflect this state upstream
            motor.status = "Booking";
          }}
        />
      )}
    </div>
  );
}
