import React, { useState, useEffect } from "react";
import { MotorCard } from "../components/MotorCard";
import { MotorDetail } from "../components/MotorDetail";
import { Motor } from "../data/motors";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Search, ArrowUpDown, LayoutGrid, List } from "lucide-react";

export function Catalog() {
  const location = useLocation();
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [motors, setMotors] = useState<Motor[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("Semua Cabang");
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Semua Merk");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("200000000"); // Default from image
  const [minYear, setMinYear] = useState("2015");
  const [maxYear, setMaxYear] = useState("2027");
  const [transmission, setTransmission] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Collapse states
  const [hideJenis, setHideJenis] = useState(false);
  const [hideHarga, setHideHarga] = useState(false);
  const [hideMerk, setHideMerk] = useState(false);

  useEffect(() => {
    // Listen to real-time updates for catalog
    const unsub = onSnapshot(collection(db, "motors"), (snap) => {
      let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Motor));
      // Only show available motors in public catalog
      data = data.filter(m => (m.status as string) === 'Tersedia' || (m.status as string) === 'Available');
      
      setMotors(data);
      setLoading(false);
      
      // Select motor if navigated from another page
      const state = location.state as { motorId?: string } | null;
      if (state?.motorId) {
        const m = data.find(x => x.id === state.motorId);
        if (m) setSelectedMotor(m);
      }
    });
    return () => unsub();
  }, [location.state]);
  
  // Clean URL state if back is clicked
  const handleBack = () => {
    setSelectedMotor(null);
    window.history.replaceState({}, document.title)
  }
  
  if (selectedMotor) {
     return <MotorDetail motor={selectedMotor} onBack={handleBack} />;
  }

  // Derived filtered motors
  let filteredMotors = motors.filter(m => {
     if (selectedBranch !== "Semua Cabang" && m.branch !== selectedBranch) return false;
     if (search && !(`${m.brand} ${m.model}`.toLowerCase().includes(search.toLowerCase()))) return false;
     if (brand !== "Semua Merk" && m.brand !== brand) return false;
     if (minPrice && m.price < parseInt(minPrice)) return false;
     if (maxPrice && m.price > parseInt(maxPrice)) return false;
     if (minYear && m.year < parseInt(minYear)) return false;
     if (maxYear && m.year > parseInt(maxYear)) return false;
     if (transmission && m.transmission !== transmission) return false;
     if (condition && m.condition !== condition) return false;
     return true;
  });

  if (sortBy === "Termurah") {
    filteredMotors.sort((a, b) => a.price - b.price);
  } else if (sortBy === "Termahal") {
    filteredMotors.sort((a, b) => b.price - a.price);
  } else {
    // Terbaru (Assuming later in array is newer or ID based, but we don't have createdAt parsed reliably. Reverse for now)
    filteredMotors.reverse();
  }

  // Get unique brands dynamically plus static defaults
  const uniqueBrands = ["Semua Merk", ...Array.from(new Set(motors.map(m => m.brand))).filter(b => b)];
  
  // Get unique branches dynamically plus static defaults (BAGIAN YANG DITAMBAHKAN)
  const uniqueBranches = ["Semua Cabang", ...Array.from(new Set(motors.map(m => m.branch))).filter(b => b)];

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50/30">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 bg-brand-yellow text-brand-black px-4 py-2.5 rounded font-bold text-sm shadow-md"
          >
            <Search className="w-4 h-4" />
            {showMobileFilters ? "Tutup Filter" : "Lihat Filter"}
          </button>
          
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-bold text-sm outline-none text-brand-black shadow-sm flex-1 lg:flex-none"
          >
            {/* OPSI CABANG DIMAPPING SECARA DINAMIS */}
            {uniqueBranches.map((branchName) => (
              <option key={branchName} value={branchName}>
                {branchName === "Semua Cabang" ? "Semua Cabang" : `Cabang ${branchName.replace('Cabang ', '')}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full lg:w-auto bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 border-r pr-4 border-gray-100">
             <ArrowUpDown className="w-4 h-4 text-gray-400" />
             <select 
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)}
               className="text-sm font-bold outline-none bg-transparent text-gray-700"
             >
               <option>Terbaru</option>
               <option>Termurah</option>
               <option>Termahal</option>
             </select>
           </div>
           <div className="flex items-center gap-2 pl-2">
             <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-brand-yellow text-brand-black shadow-md" : "text-gray-400 hover:bg-gray-50 bg-white"}`}
             >
               <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-brand-yellow text-brand-black shadow-md" : "text-gray-400 hover:bg-gray-50 bg-white"}`}
             >
               <List className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* SIDEBAR FILTER */}
        <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0 bg-white rounded-2xl p-6 shadow-xl lg:shadow-md border border-gray-100 sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar transition-all`}>
           <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ffdd00]"><polyline points="18 15 12 9 6 15"></polyline></svg>
               Filter
             </h3>
             <button 
               onClick={() => {
                 setSearch(""); setBrand("Semua Merk"); setMinPrice(""); setMaxPrice("200000000"); setMinYear(""); setMaxYear(""); setTransmission(""); setCondition("");
               }}
               className="text-gray-500 font-medium text-sm hover:text-black"
             >
               Reset
             </button>
           </div>
           
           {/* Cari Motor */}
           <div className="mb-6">
             <div className="relative border-b border-gray-300 pb-2 mb-4">
               <span className="text-sm text-gray-700">Cari Motor</span>
             </div>
             <div className="relative">
               <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
               <input 
                 type="text" 
                 placeholder="Cari..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-transparent border border-gray-300 rounded text-sm outline-none focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] focus:bg-white transition-colors" 
               />
             </div>
           </div>

           {/* Transmisi / Jenis Motor */}
           <div className="mb-6">
             <div onClick={() => setHideJenis(!hideJenis)} className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4 cursor-pointer select-none">
               <span className="text-sm text-gray-700">Jenis Motor (Transmisi)</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#ffdd00] transition-transform ${hideJenis ? 'rotate-180' : ''}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
             </div>
             {!hideJenis && (
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                   <input type="checkbox" checked={transmission === ""} onChange={() => setTransmission("")} className="w-4 h-4 rounded border-gray-300 text-[#ffdd00] focus:ring-[#ffdd00] checked:bg-[#ffdd00]" />
                   Semua
                 </label>
                 {["Matic", "Manual", "Kopling"].map((t) => (
                   <label key={t} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                     <input type="checkbox" checked={transmission === t} onChange={() => setTransmission(t)} className="w-4 h-4 rounded border-gray-300 text-[#ffdd00] focus:ring-[#ffdd00] checked:bg-[#ffdd00]" />
                     {t}
                   </label>
                 ))}
                 <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                   <input type="checkbox" checked={false} onChange={() => {}} className="w-4 h-4 rounded border-gray-300 text-[#ffdd00] focus:ring-[#ffdd00] checked:bg-[#ffdd00]" />
                   Sport
                 </label>
                 <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                   <input type="checkbox" checked={false} onChange={() => {}} className="w-4 h-4 rounded border-gray-300 text-[#ffdd00] focus:ring-[#ffdd00] checked:bg-[#ffdd00]" />
                   EV
                 </label>
               </div>
             )}
           </div>

           {/* Harga Motor */}
           <div className="mb-6">
             <div onClick={() => setHideHarga(!hideHarga)} className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4 cursor-pointer select-none">
               <span className="text-sm text-gray-700">Harga Motor</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#ffdd00] transition-transform ${hideHarga ? 'rotate-180' : ''}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
             </div>
             {!hideHarga && (
               <>
                 <div className="flex items-center gap-2 mb-4">
                   <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-1.5 flex items-center">
                     <span className="text-gray-500 text-xs font-medium mr-1">Rp</span>
                     <input 
                       type="text" 
                       value={minPrice || "0"}
                       onChange={e => setMinPrice(e.target.value)}
                       className="w-full text-xs font-semibold outline-none bg-transparent" 
                     />
                   </div>
                   <span className="text-[#ffdd00] font-bold">-</span>
                   <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-1.5 flex items-center">
                     <span className="text-gray-500 text-xs font-medium mr-1">Rp</span>
                     <input 
                       type="text" 
                       value={parseInt(maxPrice || "0").toLocaleString('id-ID')}
                       onChange={e => setMaxPrice(e.target.value.replace(/\D/g,''))}
                       className="w-full text-xs font-semibold outline-none bg-transparent" 
                     />
                   </div>
                 </div>
                 <input 
                   type="range" 
                   min="0" 
                   max="200000000" 
                   step="1000000"
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(e.target.value)}
                   className="w-full h-1 bg-[#ffdd00] rounded-lg appearance-none cursor-pointer"
                   style={{
                     WebkitAppearance: "none",
                     background: `linear-gradient(to right, #ffdd00 ${(parseInt(maxPrice) / 200000000) * 100}%, #e5e7eb ${(parseInt(maxPrice) / 200000000) * 100}%)`
                   }}
                 />
                 <style>{`
                   input[type=range]::-webkit-slider-thumb {
                     -webkit-appearance: none;
                     height: 14px;
                     width: 14px;
                     border-radius: 50%;
                     background: white;
                     border: 2px solid #ffdd00;
                     cursor: pointer;
                   }
                   .custom-scrollbar::-webkit-scrollbar {
                     width: 4px;
                   }
                   .custom-scrollbar::-webkit-scrollbar-track {
                     background: #e5e7eb;
                     border-radius: 4px;
                   }
                   .custom-scrollbar::-webkit-scrollbar-thumb {
                     background: #cbd5e1;
                     border-radius: 4px;
                   }
                 `}</style>
               </>
             )}
           </div>
           
           {/* Merk (Old Data) */}
           <div className="mb-6">
             <div onClick={() => setHideMerk(!hideMerk)} className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4 cursor-pointer select-none">
               <span className="text-sm text-gray-700">Merk</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#ffdd00] transition-transform ${hideMerk ? 'rotate-180' : ''}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
             </div>
             {!hideMerk && (
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {uniqueBrands.map(b => (
                   <label key={b} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={brand === b}
                       onChange={() => setBrand(b)}
                       className="w-4 h-4 rounded border-gray-300 text-[#ffdd00] focus:ring-[#ffdd00] checked:bg-[#ffdd00] checked:border-transparent"
                     />
                     {b}
                   </label>
                 ))}
               </div>
             )}
           </div>

        </aside>

        {/* LISTING MOTOR */}
        <div className="flex-1">

          {/* ACTIVE FILTER */}
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span 
                onClick={() => setSearch("")}
                className="px-3 py-1 text-xs rounded-full bg-[#ffdd00] text-black cursor-pointer"
              >
                "{search}" ✕
              </span>
            )}

            {brand !== "Semua Merk" && (
              <span 
                onClick={() => setBrand("Semua Merk")}
                className="px-3 py-1 text-xs rounded-full bg-gray-200 cursor-pointer"
              >
                {brand} ✕
              </span>
            )}

            {transmission && (
              <span 
                onClick={() => setTransmission("")}
                className="px-3 py-1 text-xs rounded-full bg-gray-200 cursor-pointer"
              >
                {transmission} ✕
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-gray-500 font-bold">Memuat katalog...</div>
          ) : filteredMotors.length === 0 ? (
            <div className="flex justify-center py-20 text-gray-500 font-bold">Data kosong atau tidak ditemukan.</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
              {filteredMotors.map((motor) => (
                <MotorCard 
                  key={motor.id} 
                  motor={motor} 
                  onClick={(m) => setSelectedMotor(m)} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
