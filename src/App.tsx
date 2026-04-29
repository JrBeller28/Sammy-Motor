import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { Location } from "./pages/Location";
import About from "./pages/About";
import { Admin } from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-yellow selection:text-brand-black flex flex-col overflow-x-hidden">
        <Routes>
          {/* Admin routes without Navbar/Footer */}
          <Route path="/admin/*" element={<Admin />} />
          
          {/* Public Routes with Navbar/Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/katalog" element={<Catalog />} />
                  <Route path="/lokasi" element={<Location />} />
                  <Route path="/tentang-kami" element={<About />} />
                </Routes>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
