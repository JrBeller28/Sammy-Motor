import React, { useState } from "react";
import { Motor } from "../data/motors";
import { formatCurrency } from "../utils/format";

interface CreditSimulationProps {
  motor: Motor;
  onBook: (dp: number) => void;
}

export function CreditSimulation({ motor, onBook }: CreditSimulationProps) {
  const [dpAmount, setDpAmount] = useState<number>(motor.minDp);
  const [tenor, setTenor] = useState<number>(11);

  // Interest rate assumption: 2% flat per month
  const INTEREST_RATE_PER_MONTH = 0.02;

  const principal = motor.price - dpAmount;
  const totalInterest = principal * INTEREST_RATE_PER_MONTH * tenor;
  const totalDebt = principal + totalInterest;
  const monthlyInstallment = totalDebt / tenor;

  const handleDpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDpAmount(val);
  };

  return (
    <div className="bg-white border-2 border-brand-yellow rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-black w-8 h-8 flex items-center justify-center rounded">
          <span className="text-brand-yellow font-bold">%</span>
        </div>
        <h3 className="font-display text-2xl uppercase tracking-wide">Simulasi Kredit Adira</h3>
      </div>

      <div className="space-y-5">
        {/* DP Input */}
        <div>
          <label className="block font-sans text-sm font-semibold text-gray-700 mb-2">
            Uang Muka (DP)
          </label>
          <input
            type="range"
            min={motor.minDp}
            max={motor.price * 0.7}
            step={500000}
            value={dpAmount}
            onChange={handleDpChange}
            className="w-full accent-brand-yellow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
            <span>Min: {formatCurrency(motor.minDp)}</span>
            <span className="font-bold text-brand-black">{formatCurrency(dpAmount)}</span>
          </div>
        </div>

        {/* Tenor Selection */}
        <div>
          <label className="block font-sans text-sm font-semibold text-gray-700 mb-2">
            Tenor (Bulan)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[11, 17, 23, 35].map((t) => (
              <button
                key={t}
                onClick={() => setTenor(t)}
                className={`py-2 text-sm font-bold rounded border transition-colors ${
                  tenor === t
                    ? "bg-brand-black text-brand-yellow border-brand-black"
                    : "bg-white text-gray-600 border-gray-300 hover:border-brand-yellow"
                }`}
              >
                {t}x
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="bg-brand-light p-4 rounded mt-4 border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Angsuran /Bulan</p>
            <p className="font-sans text-2xl font-bold text-brand-black">{formatCurrency(monthlyInstallment)}</p>
          </div>
          <div className="text-right hidden sm:block text-xs text-gray-400">
            *Estimasi bunga 2% menurun
          </div>
        </div>

        <button 
          onClick={() => onBook(dpAmount)}
          disabled={motor.status === "Booking"}
          className={`w-full py-3.5 rounded font-bold uppercase tracking-widest transition-colors ${
            motor.status === "Booking" 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-brand-yellow text-brand-black hover:bg-yellow-400"
          }`}
        >
          {motor.status === "Booking" ? "Motor Sudah di-Booking" : "Booking Sekarang"}
        </button>
      </div>
    </div>
  );
}
