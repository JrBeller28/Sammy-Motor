import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";

export const branchDetails = [
  {
    name: "Bumi Indah",
    isMain: true,
    address: "Perumahan Bumi Indah, Pasar Kemis, Tangerang",
    phone: "+62 811-1234-1111",
    hours: "08:00 - 17:00 (Buka Setiap Hari)",
    mapUrl: "https://maps.google.com/maps?q=Sammy%20Motor%20Bumi%20Indah%20Tangerang&t=&z=14&ie=UTF8&iwloc=&output=embed",
    directionUrl: "https://share.google/qHey5wQky9vdUidKQ"
  },
  {
    name: "Jatiuwung",
    isMain: false,
    address: "Jl. Raya Jatiuwung, Kec. Jatiuwung, Kota Tangerang",
    phone: "+62 811-1234-2222",
    hours: "08:00 - 17:00 (Buka Setiap Hari)",
    mapUrl: "https://maps.google.com/maps?q=Sammy%20Motor%20Jatiuwung%20Tangerang&t=&z=14&ie=UTF8&iwloc=&output=embed",
    directionUrl: "https://share.google/ujfRZ3y3uubKckMRb"
  },
  {
    name: "Rajeg",
    isMain: false,
    address: "Jl. Raya Rajeg, Kec. Rajeg, Tangerang",
    phone: "+62 811-1234-3333",
    hours: "08:00 - 17:00 (Buka Setiap Hari)",
    mapUrl: "https://maps.google.com/maps?q=Sammy%20Motor%20Rajeg%20Tangerang&t=&z=14&ie=UTF8&iwloc=&output=embed",
    directionUrl: "https://share.google/gU3Qxvso07mAp1vCk"
  }
];

export function StoreLocation() {
  const [activeBranch, setActiveBranch] = useState(0);

  return (
    <section id="lokasi" className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h2 className="font-display text-4xl uppercase tracking-wide">Temukan Cabang Terdekat</h2>
          <p className="text-gray-500 mt-2">Kunjungi showroom Sammy Motor terdekat di kota Anda (Area Tangerang).</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Branch List */}
          <div className="max-h-[600px] overflow-y-auto pr-4 space-y-4">
            {branchDetails.map((branch, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveBranch(idx)}
                className={`p-5 rounded-lg border-2 transition-all cursor-pointer hover:border-brand-yellow flex flex-col ${
                  activeBranch === idx 
  ? "border-brand-yellow bg-yellow-50 shadow-lg scale-[1.02]" 
  : "border-gray-100 bg-white hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded ${activeBranch === idx ? "bg-brand-yellow text-brand-black" : "bg-gray-200 text-gray-700"}`}>
                       <MapPin className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-lg text-brand-black">{branch.name}</h3>
                  </div>
                  {branch.isMain && (
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-brand-black text-brand-yellow px-2 py-1 rounded">Pusat</span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                  <p className="flex items-start gap-2">
                    <span className="font-medium min-w-16">Alamat:</span> 
                    {branch.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{branch.hours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{branch.phone}</span>
                  </p>
                </div>

                <a 
                  href={branch.directionUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()} /* Prevent triggering active tab when clicking button */
                  className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-black text-brand-yellow rounded font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Buka Google Maps
                </a>
              </div>
            ))}
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-2 relative h-[400px] lg:h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
            <iframe 
  key={branchDetails[activeBranch].mapUrl}
  src={branchDetails[activeBranch].mapUrl}
  className="absolute inset-0 w-full h-full opacity-0 animate-fadeIn"
/>
          </div>

        </div>
      </div>
    </section>
  );
}
