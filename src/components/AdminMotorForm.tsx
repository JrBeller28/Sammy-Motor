import React, { useState } from "react";
import { X, Upload, Loader } from "lucide-react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Motor } from "../data/motors";

export function AdminMotorForm({ motorToEdit, onClose, onSaved }: { motorToEdit?: Motor | null, onClose: () => void, onSaved: () => void }) {
  const adminRole = localStorage.getItem("adminRole") || "Admin";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand: motorToEdit?.brand || "Honda",
    model: motorToEdit?.model || "",
    price: motorToEdit?.price?.toString() || "",
    year: motorToEdit?.year?.toString() || "",
    engine: motorToEdit?.engine || "",
    mileage: motorToEdit?.mileage?.toString() || "",
    color: motorToEdit?.color || "",
    conditions: (motorToEdit as any)?.conditionsList?.join(", ") || "",
    status: motorToEdit?.status || "Tersedia",
    minDp: motorToEdit?.minDp?.toString() || "",
    branch: motorToEdit?.branch || (adminRole !== "Admin" ? adminRole : "Pusat"),
    transmission: motorToEdit?.transmission || "Matic",
    condition: motorToEdit?.condition || "Bagus"
  });
  const [imagesBase64, setImagesBase64] = useState<string[]>(motorToEdit?.images || (motorToEdit?.image ? [motorToEdit.image] : []));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; // max width for catalog image
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to base64 webp
          const dataUrl = canvas.toDataURL("image/webp", 0.8);
          setImagesBase64(prev => [...prev, dataUrl]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagesBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Split conditions by comma and trim
      const conditionsList = formData.conditions.split(",").map(c => c.trim()).filter(c => c.length > 0);

      const motorData = {
        brand: formData.brand,
        model: formData.model,
        price: Number(formData.price),
        year: Number(formData.year),
        engine: formData.engine,
        mileage: Number(formData.mileage),
        color: formData.color,
        conditionsList: conditionsList,
        status: formData.status,
        minDp: Number(formData.minDp) || 0,
        image: imagesBase64.length > 0 ? imagesBase64[0] : "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800",
        images: imagesBase64,
        branch: formData.branch,
        transmission: formData.transmission,
        condition: formData.condition,
        updatedAt: new Date().toISOString()
      };

      if (motorToEdit) {
        await updateDoc(doc(db, "motors", motorToEdit.id), motorData);
        
        // If status changed to Booking, create a dummy transaction
        if (formData.status === "Booking" && motorToEdit.status !== "Booking") {
            await addDoc(collection(db, "transactions"), {
                type: "Booking",
                motorId: motorToEdit.id,
                motorName: `${formData.brand} ${formData.model}`,
                customerName: "Offline/Direct Booking",
                phone: "-",
                branch: formData.branch,
                status: "Pending",
                downPayment: 0,
                tenor: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        
        alert("Motor berhasil diperbarui!");
      } else {
        const docRef = await addDoc(collection(db, "motors"), { ...motorData, createdAt: new Date().toISOString() });

        // IMPORTANT: if status is Booking, we create a dummy transaction to make it show up in Transaksi Menu
        if (formData.status === "Booking") {
            await addDoc(collection(db, "transactions"), {
                type: "Booking",
                motorId: docRef.id,
                motorName: `${formData.brand} ${formData.model}`,
                customerName: "Offline/Direct Booking",
                phone: "-",
                branch: formData.branch,
                status: "Pending",
                downPayment: 0,
                tenor: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        alert("Motor berhasil ditambahkan!");
      }

      onSaved();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan motor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 flex flex-col">
        <div className="bg-brand-black p-4 flex justify-between items-center text-white rounded-t-xl shrink-0">
          <h2 className="font-display text-xl uppercase tracking-wider text-brand-yellow">
            {motorToEdit ? "Edit Motor" : "Tambah Katalog Motor"}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white" disabled={isSubmitting}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Merek Motor</label>
                <select 
                   value={formData.brand} 
                   onChange={e => setFormData({...formData, brand: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow outline-none"
                   required
                >
                   <option>Honda</option>
                   <option>Yamaha</option>
                   <option>Kawasaki</option>
                   <option>Suzuki</option>
                   <option>Vespa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Model (Contoh: Vario 160 CBS)</label>
                <input 
                  type="text" 
                  required
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tahun Pembuatan</label>
                <input 
                  type="number" 
                  required
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kapasitas (cc)</label>
                <input 
                  type="text" 
                  required
                  value={formData.engine}
                  placeholder="Contoh: 150cc"
                  onChange={e => setFormData({...formData, engine: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Jarak Tempuh (Km)</label>
                <input 
                  type="number" 
                  required
                  value={formData.mileage}
                  placeholder="Contoh: 12500"
                  onChange={e => setFormData({...formData, mileage: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Warna</label>
                <input 
                  type="text" 
                  required
                  value={formData.color}
                  placeholder="Contoh: Hitam Doff"
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">DP Minimal (Opsional)</label>
                <input 
                  type="number" 
                  value={formData.minDp}
                  onChange={e => setFormData({...formData, minDp: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cabang</label>
                <select 
                   value={formData.branch} 
                   onChange={e => setFormData({...formData, branch: e.target.value})}
                   disabled={adminRole !== "Admin"}
                   className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                   required
                >
                   <option value="Pusat">Pusat</option>
                   <option value="Jatiuwung">Jatiuwung</option>
                   <option value="Rajeg">Rajeg</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Transmisi</label>
                <select 
                   value={formData.transmission} 
                   onChange={e => setFormData({...formData, transmission: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow outline-none"
                   required
                >
                   <option value="Matic">Matic</option>
                   <option value="Manual">Manual</option>
                   <option value="Kopling">Kopling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kondisi</label>
                <select 
                   value={formData.condition} 
                   onChange={e => setFormData({...formData, condition: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-yellow outline-none"
                   required
                >
                   <option value="Sangat Bagus">Sangat Bagus</option>
                   <option value="Bagus">Bagus</option>
                   <option value="Cukup">Cukup</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">List Kondisi / Jaminan (Pisahkan dengan koma)</label>
              <textarea 
                rows={2}
                value={formData.conditions}
                placeholder="Contoh: Mesin Segel Pabrik, Pajak Hidup Panjang, Body Mulus 95%"
                onChange={e => setFormData({...formData, conditions: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select 
                 value={formData.status} 
                 onChange={e => setFormData({...formData, status: e.target.value})}
                 className="w-full px-4 py-2 border border-gray-300 rounded outline-none"
              >
                 <option value="Tersedia">Tersedia</option>
                 <option value="Booking">Booking</option>
                 <option value="Terjual">Terjual</option>
              </select>
              {formData.status === "Booking" && (
                <p className="text-xs text-brand-yellow font-bold mt-1 bg-brand-black px-2 py-1 rounded inline-block">Mengeset Booking otomatis mencatat motor ke Menu Transaksi</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar Motor (Upload bisa banyak)</label>
              <div className="flex flex-col gap-4">
                 <label className="w-full cursor-pointer bg-gray-100 hover:bg-gray-200 border border-dashed border-gray-400 px-4 py-3 rounded flex items-center justify-center gap-2 text-sm font-semibold">
                   <Upload className="w-4 h-4" /> Pilih Gambar
                   <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                 </label>
                 
                 {imagesBase64.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                     {imagesBase64.map((imgSrc, idx) => (
                       <div key={idx} className="relative">
                         <img src={imgSrc} alt="Preview" className="h-20 w-20 object-cover rounded shadow-sm border" />
                         <button 
                           type="button" 
                           onClick={() => removeImage(idx)}
                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 py-3 bg-brand-yellow text-brand-black font-bold uppercase tracking-widest rounded hover:bg-yellow-400 disabled:opacity-50">
                {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : motorToEdit ? "Perbarui Motor" : "Simpan Motor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
