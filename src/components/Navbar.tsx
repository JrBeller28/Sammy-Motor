import React, { useState } from "react";
import { Menu, X, Phone, Bike } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 backdrop-blur-md shadow-lg h-16' : 'bg-brand-black h-20'} text-white border-b border-brand-gray/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsYGkMuZWPxSihbIH1DdYmDwW8CRV5jcT4Q&s" 
              
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
            
            
              
              <a
  href="https://wa.me/6288808574705"
  target="_blank"
  rel="noreferrer"
  className="ml-4 flex items-center gap-2 bg-brand-yellow text-brand-black px-5 py-2.5 rounded font-sans text-sm font-bold hover:bg-yellow-300 transition-all shadow-md"
>
  <Phone className="w-4 h-4" />
  <span>Hubungi Kami</span>
</a>
            
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
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] bg-brand-dark opacity-100 border-t border-brand-gray/50 shadow-2xl' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-6 pt-6 pb-8 flex flex-col space-y-5">
          <Link to="/" className={`font-sans text-base font-bold transition-colors uppercase tracking-widest flex items-center justify-between group ${isActive('/') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`} onClick={() => setIsOpen(false)}>
            Beranda
            <Bike className={`w-5 h-5 transition-transform ${isActive('/') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
          </Link>
          <Link to="/katalog" className={`font-sans text-base font-bold transition-colors uppercase tracking-widest flex items-center justify-between group ${isActive('/katalog') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`} onClick={() => setIsOpen(false)}>
            Katalog Motor
            <Bike className={`w-5 h-5 transition-transform ${isActive('/katalog') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
          </Link>
          <Link to="/lokasi" className={`font-sans text-base font-bold transition-colors uppercase tracking-widest flex items-center justify-between group ${isActive('/lokasi') ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'}`} onClick={() => setIsOpen(false)}>
            Lokasi Toko
            <Bike className={`w-5 h-5 transition-transform ${isActive('/lokasi') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`} />
          </Link>
          <div className="pt-4">
            <a
              href="https://wa.me/6288808574705"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-brand-yellow text-brand-black w-full py-4 rounded-lg font-sans text-sm font-black shadow-xl active:scale-95 transition-transform"
            >
              <Phone className="w-5 h-5" />
              <span>KONSULTASI GRATIS</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
