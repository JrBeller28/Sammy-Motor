import React, { useState } from "react";
import { branches, Motor } from "../data/motors";
import { formatCurrency } from "../utils/format";
import { X, Loader } from "lucide-react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface BookingModalProps {
  motor: Motor;
  dpAmount: number;
  tenor?: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function BookingModal({ motor, dpAmount, tenor = 0, onClose, onConfirm }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch: branches[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "transactions"), {
        type: dpAmount > 0 ? "Kredit" : "Booking",
        motorId: motor.id,
        motorName: `${motor.brand} ${motor.model}`,
        customerName: formData.name,
        phone: formData.phone,
        branch: formData.branch,
        status: "Pending",
        downPayment: dpAmount,
        tenor: tenor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Update the motor status to Booking
      await updateDoc(doc(db, "motors", motor.id), {
        status: "Booking",
        updatedAt: new Date().toISOString()
      });
      
      alert(`Terima kasih ${formData.name}! Pengajuan booking ${motor.model} dengan DP ${formatCurrency(dpAmount)} telah diterima cabang ${formData.branch}. Tim kami akan segera menghubungi Anda.`);
      onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="bg-brand-black p-4 flex justify-between items-center text-white">
          <h2 className="font-display text-xl uppercase tracking-wider text-brand-yellow">Formulir Booking Motor</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white" disabled={isSubmitting}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-brand-light p-4 rounded border border-brand-yellow/30 mb-6 flex items-center gap-4">
            <img src={motor.image} alt={motor.model} className="w-20 h-20 object-cover rounded" />
            <div>
              <p className="font-sans font-bold text-lg leading-tight">{motor.brand} {motor.model}</p>
              <p className="text-sm text-gray-500">Tahun: {motor.year}</p>
              <p className="text-sm font-semibold text-brand-black mt-1">Rencana DP: <span className="text-brand-yellow px-1 bg-brand-black rounded">{formatCurrency(dpAmount)}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap (Sesuai KTP)</label>
              <input 
                type="text" 
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none disabled:bg-gray-100"
                placeholder="Contoh: Budi Santoso"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
              <input 
                type="tel" 
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none disabled:bg-gray-100"
                placeholder="0812xxxxxx"
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cabang Transaksi</label>
              <select 
                value={formData.branch}
                disabled={isSubmitting}
                onChange={e => setFormData({...formData, branch: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none disabled:bg-gray-100"
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Pilih cabang yang terdekat dengan domisili Anda.</p>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-4 flex justify-center items-center gap-2 py-3 bg-brand-yellow text-brand-black font-bold uppercase tracking-widest rounded hover:bg-yellow-400 disabled:opacity-50">
              {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : "Konfirmasi Booking"}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Dengan melakukan booking, Anda setuju untuk dihubungi oleh tim Sammy Motor dan Adira Finance.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
