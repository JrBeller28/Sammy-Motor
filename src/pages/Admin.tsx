import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { PieChart as PieChartIcon, LogOut, Package, FileText, RefreshCw, Lock, User as UserIcon, Plus, BarChart, ArrowLeft, Download, FileSpreadsheet, FileText as PdfIcon, X } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMemo } from "react";
import { db } from "../lib/firebase";
import { Motor } from "../data/motors";
import { AdminMotorForm } from "../components/AdminMotorForm";

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<'dashboard'|'motors'|'bookings'|'transactions'|'reports'>('dashboard');
  const [reportMonth, setReportMonth] = useState<string>("All");
  const [reportYear, setReportYear] = useState<string>(new Date().getFullYear().toString());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Sales State
  const [salesSearch, setSalesSearch] = useState("");
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [saleForm, setSaleForm] = useState({
    motorId: "",
    motorName: "",
    customerName: "",
    phone: "",
    type: "Cash",
    address: "",
    hargaJual: "",
    profit: "",
    catatan: ""
  });
  
  // Data states
  const [motorsList, setMotorsList] = useState<Motor[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMotor, setIsAddingMotor] = useState(false);
  const [editingMotor, setEditingMotor] = useState<Motor | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const pwa = username.toLowerCase();
    const validUsers = ['admin', 'pusat', 'jatiuwung', 'rajeg'];
    
    if (validUsers.includes(pwa) && password === "123456") {
      const roleMatch = pwa === 'admin' ? 'Admin' :
                        pwa === 'pusat' ? 'Pusat' :
                        pwa === 'jatiuwung' ? 'Jatiuwung' : 'Rajeg';

      setIsLoggedIn(true);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminRole', roleMatch);
      setLoginError("");
    } else {
      setLoginError("Username atau Password salah!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminRole');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentRole = localStorage.getItem('adminRole') || 'Admin';

      // Fetch motors
      const mSnap = await getDocs(collection(db, "motors"));
      let mData = mSnap.docs.map(t => ({ id: t.id, ...t.data() } as Motor));
      if (currentRole !== 'Admin') {
        mData = mData.filter(m => m.branch === currentRole);
      }
      setMotorsList(mData);

      // Fetch transactions
      const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
      const tSnap = await getDocs(q);
      let tData = tSnap.docs.map(t => ({ id: t.id, ...(t.data() as any) }));
      if (currentRole !== 'Admin') {
        tData = tData.filter(t => t.branch === currentRole);
      }
      setTransactions(tData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const seedData = async () => {
    try {
      const { motors } = await import("../data/motors");
      for (const m of motors) {
        await addDoc(collection(db, "motors"), {
            brand: m.brand,
            model: m.model,
            year: m.year,
            price: m.price,
            mileage: m.mileage,
            engine: m.engine,
            color: m.color,
            image: m.image,
            minDp: m.minDp,
            status: m.status,
            createdAt: new Date().toISOString()
        });
      }
      alert("Seed data berhasil");
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Gagal copy data");
    }
  }

  // Quick action: update transaction status
  const updateStatus = async (t: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, "transactions", t.id), { status: newStatus, updatedAt: new Date().toISOString() });
      
      if (t.motorId) {
        let motorStatus = "Tersedia";
        if (newStatus === "Pending" || newStatus === "Approved") motorStatus = "Booking";
        if (newStatus === "Completed") motorStatus = "Terjual";
        if (newStatus === "Rejected") motorStatus = "Tersedia";

        await updateDoc(doc(db, "motors", t.motorId), { 
          status: motorStatus, 
          updatedAt: new Date().toISOString() 
        });
      }
      
      fetchData();
    } catch (e) {
      alert("Gagal update status");
    }
  }

  const updateTransactionField = async (id: string, field: string, value: any) => {
    try {
      await updateDoc(doc(db, "transactions", id), { [field]: value, updatedAt: new Date().toISOString() });
      fetchData();
    } catch (e) {
      alert("Gagal update data");
    }
  }

  const updateBookingStatus = async (booking: any, newStatus: "Terjual" | "Cancel") => {
    try {
      setIsLoading(true);
      if (newStatus === "Terjual") {
        let m = motorsList.find(x => x.id === booking.motorId);
        
        await updateDoc(doc(db, "transactions", booking.id), { status: "Completed", updatedAt: new Date().toISOString() });
        
        await addDoc(collection(db, "transactions"), {
          motorName: booking.motorName, 
          motorId: booking.motorId,
          customerName: booking.customerName,
          phone: booking.phone,
          type: booking.type, // Credit/Booking
          address: "", 
          recordType: 'Penjualan',
          status: 'Completed',
          hargaJual: m ? m.price : 0,
          profit: 0,
          catatan: "Penjualan otomatis dari Data Booking",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          branch: booking.branch
        });
        
        if (booking.motorId) {
          await updateDoc(doc(db, "motors", booking.motorId), { 
            status: "Terjual", 
            updatedAt: new Date().toISOString() 
          });
        }
        alert("Booking berhasil diubah ke Penjualan");
      } else if (newStatus === "Cancel") {
        await updateDoc(doc(db, "transactions", booking.id), { status: "Rejected", updatedAt: new Date().toISOString() });
        if (booking.motorId) {
          await updateDoc(doc(db, "motors", booking.motorId), { 
            status: "Tersedia", 
            updatedAt: new Date().toISOString() 
          });
        }
        alert("Booking dibatalkan. Motor kembali Tersedia.");
      }
      fetchData();
    } catch (e) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        motorName: saleForm.motorName, // We omit motorId or save it anyway
        motorId: saleForm.motorId,
        customerName: saleForm.customerName,
        phone: saleForm.phone,
        type: saleForm.type,
        address: saleForm.address,
        recordType: 'Penjualan',
        status: 'Completed',
        hargaJual: parseInt(saleForm.hargaJual) || 0,
        profit: parseInt(saleForm.profit) || 0,
        catatan: saleForm.catatan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        branch: localStorage.getItem('adminRole') || 'Pusat'
      });
      
      if (saleForm.motorId) {
        await updateDoc(doc(db, "motors", saleForm.motorId), { 
          status: "Terjual", 
          updatedAt: new Date().toISOString() 
        });
      }

      setIsAddingSale(false);
      setSaleForm({
        motorId: "", motorName: "", customerName: "", phone: "", type: "Cash",
        address: "", hargaJual: "", profit: "", catatan: ""
      });
      fetchData();
    } catch (error) {
      alert("Gagal menyimpan data penjualan");
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyData = useMemo(() => {
    const months = 'Jan Feb Mar Apr Mei Jun Jul Ags Sep Okt Nov Des'.split(' ');
    const data = months.map(m => ({ name: m, Total: 0, Sukses: 0 }));
    transactions.forEach(t => {
      const d = new Date(t.createdAt);
      if (!isNaN(d.getTime())) {
        const mIdx = d.getMonth();
        data[mIdx].Total += 1;
        if (['Approved', 'Completed'].includes(t.status)) {
          data[mIdx].Sukses += 1;
        }
      }
    });
    return data;
  }, [transactions]);

  const filteredReports = useMemo(() => {
    return transactions.filter(t => {
      if (t.status !== 'Completed') return false;
      const d = new Date(t.updatedAt);
      if (isNaN(d.getTime())) return false;
      if (reportYear !== "All" && d.getFullYear().toString() !== reportYear) return false;
      if (reportMonth !== "All" && d.getMonth().toString() !== reportMonth) return false;
      return true;
    });
  }, [transactions, reportMonth, reportYear]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredReports.map(t => ({
      "Tanggal": new Date(t.updatedAt).toLocaleDateString('id-ID'),
      "Waktu": new Date(t.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' }),
      "Customer": t.customerName,
      "Telepon": t.phone,
      "Tipe": t.type,
      "Motor": t.motorName || t.motorId,
      "Status": t.status,
      "Cabang": t.branch
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_Sammy_Motor_${reportMonth}_${reportYear}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(255, 200, 0); // brand-yellow
    doc.text("Sammy Motor", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Laporan Transaksi Kendaraan", 14, 28);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Periode: ${reportMonth === 'All' ? 'Semua Bulan' : parseInt(reportMonth) + 1} - ${reportYear === 'All' ? 'Semua Tahun' : reportYear}`, 14, 34);

    const tableData = filteredReports.map(t => [
      new Date(t.updatedAt).toLocaleDateString('id-ID'),
      t.customerName,
      t.phone,
      t.motorName || t.motorId,
      t.type,
      t.status,
      t.branch
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Tanggal', 'Customer', 'Telepon', 'Motor', 'Tipe', 'Status', 'Cabang']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40], textColor: [255, 200, 0] },
      styles: { fontSize: 8 }
    });

    doc.save(`Laporan_Sammy_Motor_${reportMonth}_${reportYear}.pdf`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 relative overflow-hidden">
        <button onClick={() => window.location.href = '/'} className="absolute top-4 left-4 z-20 flex items-center gap-2 text-brand-black/70 hover:text-brand-black bg-white/50 backdrop-blur px-4 py-2 rounded-lg font-semibold border border-brand-black/10 shadow-sm transition-all hover:scale-105">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-black/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-brand-yellow/10 blur-[100px] pointer-events-none"></div>

        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-sm w-full relative z-10 border border-brand-yellow/30">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center shadow-lg border-2 border-brand-yellow">
              <Lock className="w-8 h-8 text-brand-yellow" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl text-brand-black uppercase tracking-wider">Admin Portal</h2>
            <p className="text-sm text-gray-500 mt-2 font-sans">
              Masuk sebagai <span className="font-bold">Admin, Pusat, Jatiuwung,</span> atau <span className="font-bold">Rajeg</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <UserIcon className="w-3 h-3" /> Username
              </label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none transition-colors font-sans"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none transition-colors font-sans"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center border border-red-100">
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-brand-black text-brand-yellow px-4 py-3.5 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors mt-2 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Layout */}
      <aside className={`fixed lg:relative lg:flex w-64 bg-brand-black text-white h-full flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="font-display text-2xl text-brand-yellow font-bold uppercase tracking-widest flex items-center gap-2">
              <PieChartIcon className="w-6 h-6" /> Admin
            </h2>
            <p className="text-xs text-gray-400 mt-1">Sammy Motor Dashboard</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Menu</p>
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-brand-yellow text-brand-black shadow-md' : 'text-gray-300 hover:bg-white/10'}`}
          >
            <PieChartIcon className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('motors'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-semibold ${activeTab === 'motors' ? 'bg-brand-yellow text-brand-black shadow-md' : 'text-gray-300 hover:bg-white/10'}`}
          >
            <Package className="w-4 h-4" /> Katalog Motor
          </button>
          <button 
            onClick={() => { setActiveTab('bookings'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-semibold ${activeTab === 'bookings' ? 'bg-brand-yellow text-brand-black shadow-md' : 'text-gray-300 hover:bg-white/10'}`}
          >
            <FileText className="w-4 h-4" /> Data Booking
          </button>
          <button 
            onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-semibold ${activeTab === 'transactions' ? 'bg-brand-yellow text-brand-black shadow-md' : 'text-gray-300 hover:bg-white/10'}`}
          >
            <FileText className="w-4 h-4" /> Penjualan
          </button>
          <button 
            onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-semibold ${activeTab === 'reports' ? 'bg-brand-yellow text-brand-black shadow-md' : 'text-gray-300 hover:bg-white/10'}`}
          >
            <BarChart className="w-4 h-4" /> Laporan
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-5 flex justify-between items-center z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <PieChartIcon className="w-6 h-6" />
            </button>
            <h1 className="font-display text-lg sm:text-2xl text-gray-800 font-bold truncate">
              {activeTab === 'dashboard' ? 'Dashboard Statistik' :
               activeTab === 'motors' ? 'Kelola Katalog Motor' : 
               activeTab === 'bookings' ? 'Data Booking' : 
               activeTab === 'transactions' ? 'Kelola Transaksi & Kredit' : 'Laporan Penjualan'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-2">
                <UserIcon className="w-3 h-3 sm:w-4 h-4" /> <span className="hidden sm:inline">{localStorage.getItem('adminRole') || 'Admin'}</span>
             </div>
             <button onClick={fetchData} className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-brand-yellow text-brand-black rounded shadow-sm text-sm font-semibold hover:bg-yellow-400 transition-colors">
               <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Refresh Data</span>
             </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-gray-50/50">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                <p className="text-sm font-semibold text-gray-500 uppercase">Total Motor Tersedia</p>
                <p className="font-display text-3xl text-brand-black mt-2">
                  {motorsList.filter(m => m.status === 'Tersedia' || m.status === 'Available').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
                <p className="text-sm font-semibold text-gray-500 uppercase">Motor Booking</p>
                <p className="font-display text-3xl text-brand-black mt-2">
                  {motorsList.filter(m => m.status === 'Booking').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
                <p className="text-sm font-semibold text-gray-500 uppercase">Transaksi Aktif</p>
                <p className="font-display text-3xl text-brand-black mt-2">
                  {transactions.filter(t => ['Pending', 'Approved'].includes(t.status)).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                <p className="text-sm font-semibold text-gray-500 uppercase">Sudah Terjual</p>
                <p className="font-display text-3xl text-brand-black mt-2">
                  {transactions.filter(t => t.status === 'Completed').length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="font-bold text-gray-800 mb-6">Status Transaksi</h3>
                 <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsBarChart
                       data={[
                         { name: 'Pending', count: transactions.filter(t => t.status === 'Pending').length },
                         { name: 'Approved', count: transactions.filter(t => t.status === 'Approved').length },
                         { name: 'Completed', count: transactions.filter(t => t.status === 'Completed').length },
                         { name: 'Rejected', count: transactions.filter(t => t.status === 'Rejected').length },
                       ]}
                     >
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                       <RechartsTooltip cursor={{fill: 'transparent'}} />
                       <Bar dataKey="count" fill="#ffc800" radius={[4, 4, 0, 0]} />
                     </RechartsBarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="font-bold text-gray-800 mb-6">Rekap Kredit vs Tunai/Booking</h3>
                 <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsBarChart
                       data={[
                         { 
                           name: 'Kredit', 
                           Pending: transactions.filter(t => t.type === 'Kredit' && t.status === 'Pending').length,
                           Sukses: transactions.filter(t => t.type === 'Kredit' && ['Approved', 'Completed'].includes(t.status)).length 
                         },
                         { 
                           name: 'Booking', 
                           Pending: transactions.filter(t => t.type === 'Booking' && t.status === 'Pending').length,
                           Sukses: transactions.filter(t => t.type === 'Booking' && ['Approved', 'Completed'].includes(t.status)).length 
                         }
                       ]}
                     >
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                       <RechartsTooltip cursor={{fill: 'transparent'}} />
                       <Bar dataKey="Pending" fill="#ccc" radius={[4, 4, 0, 0]} />
                       <Bar dataKey="Sukses" fill="#1e1e1e" radius={[4, 4, 0, 0]} />
                     </RechartsBarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-800 mb-6">Grafik Transaksi Tahunan ({new Date().getFullYear()})</h3>
               <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={monthlyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                     <RechartsTooltip />
                     <Line type="monotone" name="Total Pengajuan" dataKey="Total" stroke="#ccc" strokeWidth={2} />
                     <Line type="monotone" name="Sukses/Approved" dataKey="Sukses" stroke="#ffc800" strokeWidth={3} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'motors' && (
          <div>
            <div className="flex justify-between mb-4">
               <button onClick={() => setIsAddingMotor(true)} className="bg-green-600 text-white px-4 py-2 text-sm font-bold rounded hover:bg-green-700 flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Tambah Motor
               </button>
               <button onClick={seedData} className="bg-brand-black text-brand-yellow px-4 py-2 text-sm font-bold uppercase rounded hover:bg-gray-800 flex items-center gap-2">
                 Import 12 Data Dummy Motor
               </button>
            </div>
            
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Gambar</th>
                    <th className="px-6 py-4">Brand/Model</th>
                    <th className="px-6 py-4">Harga / Tahun</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {motorsList.filter(m => (m.status as string) === 'Tersedia' || (m.status as string) === 'Available' || (m.status as string) === 'Booking').map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4">
                         <img src={m.image} alt={m.model} className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200" />
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-bold text-brand-black">{m.brand} {m.model}</p>
                         <p className="text-gray-500">KM: {m.mileage.toLocaleString()} | {m.engine}</p>
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-semibold text-brand-black">Rp {m.price.toLocaleString('id-ID')}</p>
                         <p className="text-gray-500">{m.year}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${m.status === 'Tersedia' ? 'bg-green-100 text-green-700' : m.status === 'Booking' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                           {m.status}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                          <button onClick={() => setEditingMotor(m)} className="text-blue-600 hover:underline text-sm font-semibold mr-4">Edit</button>
                          <button 
                            onClick={async () => {
                              if(confirm("Yakin ingin menghapus unit motor ini dari katalog?")) {
                                await deleteDoc(doc(db, "motors", m.id));
                                fetchData();
                              }
                            }} 
                            className="text-red-600 hover:underline text-sm font-semibold"
                          >Hapus</button>
                       </td>
                    </tr>
                  ))}
                  {motorsList.filter(m => (m.status as string) === 'Tersedia' || (m.status as string) === 'Available' || (m.status as string) === 'Booking').length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">Katalog kosong. Silakan import data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (() => {
          const bookingData = transactions.filter(t => t.recordType !== 'Penjualan' && (t.type === 'Booking' || t.type === 'Kredit'));
          
          return (
            <div>
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
                  <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                    <tr>
                      <th className="px-6 py-4">Gambar</th>
                      <th className="px-6 py-4">Brand/Model</th>
                      <th className="px-6 py-4">Harga / Tahun</th>
                      <th className="px-6 py-4">Info Pemesan</th>
                      <th className="px-6 py-4">DP</th>
                      <th className="px-6 py-4">Status & Cabang</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookingData.map(b => {
                      const m = motorsList.find(x => x.id === b.motorId);
                      return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {m?.image ? <img src={m.image} alt={b.motorName} className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200" /> : "-"}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-brand-black">{b.motorName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-brand-black">{m ? `Rp ${m.price.toLocaleString('id-ID')}` : '-'}</p>
                            <p className="text-gray-500">{m ? m.year : '-'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-brand-black">{b.customerName}</p>
                            <p className="text-gray-500 text-xs">{b.phone}</p>
                          </td>
                          <td className="px-6 py-4 text-green-600 font-semibold border-x border-gray-100">
                            Rp {(b.downPayment || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              b.status === 'Completed' ? 'bg-green-100 text-green-700' : b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {b.status}
                            </span>
                            <p className="text-gray-500 text-xs mt-2">{b.branch}</p>
                          </td>
                          <td className="px-6 py-4">
                            {['Pending', 'Approved'].includes(b.status as string) && (
                              <div className="flex flex-col gap-2 w-24">
                                <button 
                                  onClick={() => updateBookingStatus(b, 'Terjual')}
                                  className="w-full text-center bg-green-100 text-green-700 hover:bg-green-200 py-1.5 px-3 rounded font-bold text-xs transition"
                                >
                                  Terjual
                                </button>
                                <button 
                                  onClick={() => updateBookingStatus(b, 'Cancel')}
                                  className="w-full text-center bg-red-100 text-red-700 hover:bg-red-200 py-1.5 px-3 rounded font-bold text-xs transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            {b.status === 'Completed' && (
                              <span className="text-green-600 font-bold text-sm">Selesai (Terjual)</span>
                            )}
                            {b.status === 'Rejected' && (
                              <span className="text-red-500 font-bold text-sm">Dibatalkan</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {bookingData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">Belum ada data booking.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })()}

        {activeTab === 'transactions' && (() => {
          const salesData = transactions.filter(t => t.recordType === 'Penjualan');
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const thisMonthSales = salesData.filter(s => {
            const d = new Date(s.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          });

          const totalPenjualanBulanIni = thisMonthSales.length;
          const pendapatanBulanIni = thisMonthSales.reduce((acc, curr) => acc + (curr.hargaJual || 0), 0);
          const profitBulanIni = thisMonthSales.reduce((acc, curr) => acc + (curr.profit || 0), 0);

          const filteredSales = salesData.filter(s => 
            (s.customerName || "").toLowerCase().includes(salesSearch.toLowerCase()) ||
            (s.motorName || "").toLowerCase().includes(salesSearch.toLowerCase())
          );

          return (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-500">Total Penjualan Bulan Ini</p>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold font-display text-gray-800">{totalPenjualanBulanIni}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-500">Pendapatan Bulan Ini</p>
                    <div className="p-2 bg-green-50 text-green-600 rounded font-bold text-lg leading-none flex items-center justify-center w-9 h-9">$</div>
                  </div>
                  <h3 className="text-3xl font-bold font-display text-gray-800">Rp {pendapatanBulanIni.toLocaleString('id-ID')}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-500">Profit Bulan Ini</p>
                    <div className="p-2 bg-red-50 text-red-600 rounded">
                      <BarChart className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold font-display text-gray-800">Rp {profitBulanIni.toLocaleString('id-ID')}</h3>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                   </div>
                   <input
                     type="text"
                     placeholder="Cari penjualan..."
                     value={salesSearch}
                     onChange={(e) => setSalesSearch(e.target.value)}
                     className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm w-64 outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
                   />
                </div>
                <button 
                  onClick={() => setIsAddingSale(true)} 
                  className="bg-red-600 text-white px-4 py-2 text-sm font-bold rounded shadow hover:bg-red-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Catat Penjualan
                </button>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Motor</th>
                      <th className="px-6 py-4 font-semibold">Pembeli</th>
                      <th className="px-6 py-4 font-semibold">Harga Jual</th>
                      <th className="px-6 py-4 font-semibold">Profit</th>
                      <th className="px-6 py-4 font-semibold">Tanggal</th>
                      <th className="px-6 py-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSales.map((s: any) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{s.motorName}</td>
                        <td className="px-6 py-4">{s.customerName}</td>
                        <td className="px-6 py-4">Rp {parseInt(s.hargaJual || 0).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-green-600 font-semibold">Rp {parseInt(s.profit || 0).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(s.createdAt).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={async () => {
                              if(confirm("Yakin ingin menghapus data penjualan ini?")) {
                                await deleteDoc(doc(db, "transactions", s.id));
                                if (s.motorId) {
                                  await updateDoc(doc(db, "motors", s.motorId), { 
                                    status: "Tersedia", 
                                    updatedAt: new Date().toISOString() 
                                  });
                                }
                                fetchData();
                              }
                            }} 
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-300 mb-2" />
                            <p>Belum ada penjualan</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {activeTab === 'reports' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  value={reportMonth} 
                  onChange={e => setReportMonth(e.target.value)}
                  className="bg-white border rounded px-4 py-2 text-sm outline-none font-semibold text-gray-700 w-full md:w-auto"
                >
                  <option value="All">Semua Bulan</option>
                  {'Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember'.split(' ').map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
                <select 
                  value={reportYear} 
                  onChange={e => setReportYear(e.target.value)}
                  className="bg-white border rounded px-4 py-2 text-sm outline-none font-semibold text-gray-700 w-full md:w-auto"
                >
                  <option value="All">Semua Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button onClick={exportExcel} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-green-700 transition">
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <button onClick={exportPDF} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-red-700 transition">
                  <PdfIcon className="w-4 h-4" /> PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Tipe & Motor</th>
                    <th className="px-6 py-4">Info Pelanggan</th>
                    <th className="px-6 py-4">Status & Cabang</th>
                    <th className="px-6 py-4">Tgl Approved/Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4">
                         <p className="font-bold text-brand-black">{t.motorName || t.motorId}</p>
                         <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">{t.type}</p>
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-semibold text-brand-black">{t.customerName}</p>
                         <p className="text-gray-500 text-xs">{t.phone}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                         }`}>
                           {t.status}
                         </span>
                         <p className="text-gray-500 text-xs mt-2">{t.branch}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-brand-black font-semibold">
                             {new Date(t.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
                          </p>
                          <p className="text-gray-500 text-xs">
                             {new Date(t.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })}
                          </p>
                       </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                     <tr>
                       <td colSpan={4} className="text-center py-8 text-gray-500">Belum ada data laporan.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {isAddingMotor || editingMotor ? (
        <AdminMotorForm 
          motorToEdit={editingMotor}
          onClose={() => {
            setIsAddingMotor(false);
            setEditingMotor(null);
          }} 
          onSaved={() => {
            setIsAddingMotor(false);
            setEditingMotor(null);
            fetchData();
          }} 
        />
      ) : null}

      {isAddingSale && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <div>
                <h3 className="font-display font-bold text-xl text-brand-black">Catat Penjualan Baru</h3>
                <p className="text-sm text-gray-500">Isi detail penjualan motor</p>
              </div>
              <button onClick={() => setIsAddingSale(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSale} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Motor</label>
                  <select 
                    required
                    value={`${saleForm.motorName}|${saleForm.motorId}`} 
                    onChange={e => {
                      const val = e.target.value;
                      if (!val) {
                        setSaleForm({...saleForm, motorName: "", motorId: ""});
                      } else {
                        const [mName, mId] = val.split("|");
                        setSaleForm({...saleForm, motorName: mName, motorId: mId});
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                  >
                    <option value="|">Pilih motor...</option>
                    {motorsList.filter(m => m.status === 'Tersedia' || m.status === 'Available').map(m => (
                      <option key={m.id} value={`${m.brand} ${m.model} (${m.year})|${m.id}`}>
                        {m.brand} {m.model} ({m.year})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pembeli</label>
                    <input 
                      type="text" required
                      value={saleForm.customerName}
                      onChange={e => setSaleForm({...saleForm, customerName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">No. Telepon</label>
                    <input 
                      type="text" required
                      value={saleForm.phone}
                      onChange={e => setSaleForm({...saleForm, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Metode Pembayaran</label>
                    <select 
                      value={saleForm.type}
                      onChange={e => setSaleForm({...saleForm, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Kredit">Kredit</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat</label>
                  <textarea 
                    rows={2} required
                    value={saleForm.address}
                    onChange={e => setSaleForm({...saleForm, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Jual (Rp)</label>
                    <input 
                      type="number" required min="0"
                      value={saleForm.hargaJual}
                      onChange={e => setSaleForm({...saleForm, hargaJual: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Profit (Rp)</label>
                    <input 
                      type="number" required min="0"
                      value={saleForm.profit}
                      onChange={e => setSaleForm({...saleForm, profit: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan</label>
                  <textarea 
                    rows={2} 
                    value={saleForm.catatan}
                    onChange={e => setSaleForm({...saleForm, catatan: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsAddingSale(false)} className="px-4 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <X className="w-4 h-4" /> Batal
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold shadow-sm hover:bg-red-700 flex items-center gap-2">
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
