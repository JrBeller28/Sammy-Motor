import React, { useState } from "react";
import { Menu, X, Phone, Bike, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false); // State untuk dropdown versi mobile
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk menutup menu mobile
  const closeMobileMenu = () => {
    setIsOpen(false);
    setIsMobileContactOpen(false); // Reset dropdown contact jika menu ditutup
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 backdrop-blur-md shadow-lg h-16' : 'bg-brand-black h-20'} text-white border-b border-brand-gray/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsYGkMuZWPxSihbIH1DdYmDwW8CRV5jcT4Q&s" 
              alt="Logo"
              className="w-10 h-10 object-cover rounded shadow-md border border-brand-yellow/20"
            />
            <div className="flex flex-col">
              <span className="font-display text-2xl uppercase tracking-wide leading-none text-brand-yellow">Sammy</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold leading-none text-white/80">Motor</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-sans text-sm font-semibold transition-colors tracking-wide uppercase ${isActive('/') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`}>Beranda</Link>
            <Link to="/katalog" className={`font-sans text-sm font-semibold transition-colors tracking-wide uppercase ${isActive('/katalog') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`}>Katalog Motor</Link>
            <Link to="/lokasi" className={`font-sans text-sm font-semibold transition-colors tracking-wide uppercase ${isActive('/lokasi') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`}>Lokasi Toko</Link>
            
            {/* Dropdown Hubungi Kami (Desktop) */}
            <div className="relative group ml-4">
              <button className="flex items-center gap-2 bg-brand-yellow text-brand-black px-5 py-2.5 rounded font-sans text-sm font-bold hover:bg-yellow-300 transition-all shadow-md">
                <Phone className="w-4 h-4" />
                <span>Hubungi Kami</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu Desktop */}
              <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                  <a
                    href="https://wa.me/6288808574705"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-brand-black hover:bg-brand-yellow hover:text-brand-black font-bold transition-colors border-b border-gray-100"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Admin 1
                  </a>
                  <a
                    href="https://wa.me/6282128558029"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-brand-black hover:bg-brand-yellow hover:text-brand-black font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Admin 2
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-brand-yellow transition-colors focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-y-auto transition-all duration-500 ease-in-out custom-scrollbar ${isOpen ? 'max-h-[80vh] bg-brand-dark opacity-100 border-t border-brand-gray/50 shadow-2xl' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-6 pt-6 pb-8 flex flex-col space-y-5">
          <Link to="/" className={`font-sans text-base font-bold transition-colors uppercase tracking-widest flex items-center justify-between group ${isActive('/') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`} onClick={closeMobileMenu}>
            Beranda
            <Bike className={`w-5 h-5 transition-transform ${isActive('/') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
          </Link>
          <Link to="/katalog" className={`font-sans text-base font-bold transition-colors uppercase tracking-widest flex items-center justify-between group ${isActive('/katalog') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`} onClick={closeMobileMenu}>
            Katalog Motor
            <Bike className={`w-5 h-5 transition-transform ${isActive('/katalog') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
          </Link>
          <Link to="/lokasi" className={`font-sans text-base font-bold transition-colors uppercase tracking-widest flex items-center justify-between group ${isActive('/lokasi') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`} onClick={closeMobileMenu}>
            Lokasi Toko
            <Bike className={`w-5 h-5 transition-transform ${isActive('/lokasi') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
          </Link>
          
          {/* Dropdown Hubungi Kami (Mobile) */}
          <div className="pt-4">
            <button
              onClick={() => setIsMobileContactOpen(!isMobileContactOpen)}
              className="flex items-center justify-between px-5 bg-brand-yellow text-brand-black w-full py-4 rounded-lg font-sans text-sm font-black shadow-xl active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>KONSULTASI GRATIS</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileContactOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Opsi Admin Mobile */}
            <div className={`overflow-hidden transition-all duration-300 space-y-3 ${isMobileContactOpen ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
              <a
                href="https://wa.me/6288808574705"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-brand-black w-full py-3.5 rounded-lg font-sans text-sm font-bold shadow-md hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                <Phone className="w-4 h-4" />
                Admin 1 (0888-0857-4705)
              </a>
              <a
                href="https://wa.me/6282128558029"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-brand-black w-full py-3.5 rounded-lg font-sans text-sm font-bold shadow-md hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                <Phone className="w-4 h-4" />
                Admin 2 (0821-2855-8029)
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
