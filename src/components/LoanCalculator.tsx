import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Motor } from "../data/motors";

export function LoanCalculator() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [selectedMotorPrice, setSelectedMotorPrice] = useState<number>(0);
  const [selectedMotorId, setSelectedMotorId] = useState<string>("");

  const [uangMukaPercent, setUangMukaPercent] = useState<number>(25);
  const [sukuBunga, setSukuBunga] = useState<number>(8.0);
  const [tenor, setTenor] = useState<number>(3); // 3 Years

  useEffect(() => {
    const q = query(
      collection(db, "motors"), 
      where("status", "in", ["Tersedia", "Available"])
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(t => ({ id: t.id, ...t.data() } as Motor));
      setMotors(data);
    });
    return () => unsub();
  }, []);

  const uangMukaRp = (selectedMotorPrice * uangMukaPercent) / 100;
  const pinjaman = selectedMotorPrice - uangMukaRp;

  // Simple monthly installment calculation
  // Total Bunga = pinjaman * (sukuBunga / 100) * tenor
  // Total Pinjaman = pinjaman + Total Bunga
  // Cicilan = Total Pinjaman / (tenor * 12)
  const cicilanBulan = useMemo(() => {
    if (pinjaman <= 0) return 0;
    const totalBunga = pinjaman * (sukuBunga / 100) * tenor;
    const totalHutang = pinjaman + totalBunga;
    return totalHutang / (tenor * 12);
  }, [pinjaman, sukuBunga, tenor]);

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl text-brand-black mb-3">Kalkulator Pinjaman</h2>
          <p className="text-gray-500 text-sm">Perhitungan akan didasarkan pada jenis kendaraan, tenor dan suku bunga</p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Kredit Mobil</button>
          <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Kredit Mobil Bekas</button>
          <button className="px-6 py-2 rounded-full text-sm font-semibold bg-[#e8fbfd] text-[#00c4cc]">Kredit Motor</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          {/* Left Side: Controls */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <select 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00c4cc]"
                value={selectedMotorId}
                onChange={(e) => {
                  setSelectedMotorId(e.target.value);
                  const m = motors.find(x => x.id === e.target.value);
                  if (m) setSelectedMotorPrice(m.price);
                  else setSelectedMotorPrice(0);
                }}
              >
                <option value="">Silakan Pilih Merek, Model dan Varian</option>
                {motors.map(m => (
                  <option key={m.id} value={m.id}>{m.brand} {m.model} ({m.year}) - Rp {m.price.toLocaleString('id-ID')}</option>
                ))}
              </select>
            </div>

            <div className="mb-8 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">Uang Muka</span>
                <div className="border border-gray-300 rounded-lg px-3 py-1 font-bold text-sm bg-white min-w-[70px] text-center">
                  {uangMukaPercent}%
                </div>
              </div>
              <input 
                type="range" min="10" max="60" step="1" 
                value={uangMukaPercent} onChange={(e) => setUangMukaPercent(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                style={{
                    WebkitAppearance: "none",
                    background: `linear-gradient(to right, #404040 ${((uangMukaPercent - 10) / 50) * 100}%, #e5e7eb ${((uangMukaPercent - 10) / 50) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                <span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>60</span>
              </div>
            </div>

            <div className="mb-8 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">Suku Bunga</span>
                <div className="border border-gray-300 rounded-lg px-3 py-1 font-bold text-sm bg-white min-w-[70px] text-center">
                  {sukuBunga.toFixed(1)}%
                </div>
              </div>
              <input 
                type="range" min="6" max="36" step="0.1" 
                value={sukuBunga} onChange={(e) => setSukuBunga(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                style={{
                    WebkitAppearance: "none",
                    background: `linear-gradient(to right, #404040 ${((sukuBunga - 6) / 30) * 100}%, #e5e7eb ${((sukuBunga - 6) / 30) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                <span>6</span><span>10</span><span>14</span><span>17</span><span>21</span><span>25</span><span>29</span><span>32</span><span>36</span>
              </div>
            </div>

            <div>
               <span className="text-sm text-gray-700 block mb-3">Tenor Pinjaman</span>
               <div className="grid grid-cols-4 gap-2">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(years => (
                   <button 
                     key={years}
                     onClick={() => setTenor(years)}
                     className={`border rounded-lg py-2 text-xs transition-colors ${tenor === years ? 'bg-brand-black text-white border-brand-black' : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'}`}
                   >
                     {years} Tahun
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <div>
                <p className="text-xl font-bold text-brand-black mb-1">Rp {uangMukaRp.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">Uang Muka</p>
              </div>
              <div>
                <p className="text-xl font-bold text-brand-black mb-1">Rp {pinjaman.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">Jumlah Pinjaman</p>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-300 pt-8 mb-8 text-center">
              <p className="text-xs text-gray-500 mb-2">Perkiraan Cicilan Bulanan</p>
              <h3 className="text-4xl font-bold text-[#00c4cc] mb-6">Rp {Math.round(cicilanBulan).toLocaleString('id-ID')}</h3>
              
              <button disabled={!selectedMotorId} className="w-full bg-gray-500 text-white font-bold rounded-lg py-4 uppercase tracking-wide hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Ajukan Pinjaman
              </button>
            </div>

            <div className="text-[10px] text-gray-400 space-y-2 leading-relaxed">
              <p>*Harga dasar (Total biaya) dihitung berdasarkan harga model populer tersedia di area pilihan Anda</p>
              <p>*Simulasi belum termasuk biaya-biaya seperti biaya asuransi, biaya Admin, biaya Provisi, dll</p>
              <p>*Simulasi yang muncul hanyalah gambaran umum dan bukan merupakan simulasi sebenarnya. Simulasi terakhir yang akan ditentukan oleh pemodal.</p>
              <p>*Jangka waktu cicilan pembiayaan mobil baru umumnya 5 tahun. Hanya beberapa pemodal yang memberikan kredit lebih dari 5 tahun dengan syarat dan ketentuan tertentu.</p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-32 text-center">
          <h2 className="font-display font-bold text-4xl text-brand-black mb-3">Mitra Penyalur Pinjaman</h2>
          <p className="text-gray-500 text-sm mb-12">Kami bermitra dengan beberapa pemodal ternama di Indonesia yang siap melayani Anda</p>
          
          <div className="flex justify-center">
            <div className="bg-white px-12 py-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Adira_Finance_logo.png" 
                alt="Adira Finance" 
                className="h-10 object-contain"
              />
            </div>
          </div>
        </div>
        
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 24px;
            border-radius: 4px;
            background: #404040;
            cursor: pointer;
            position: relative;
          }
          input[type=range]::-webkit-slider-thumb::after {
            content: '<>';
            color: white;
            font-size: 8px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
      </div>
    </section>
  );
}
