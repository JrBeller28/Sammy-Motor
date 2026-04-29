import React from "react";
import { Motor } from "../data/motors";
import { formatCurrency } from "../utils/format";
import { Calendar, Gauge } from "lucide-react";

interface MotorCardProps {
  key?: React.Key;
  motor: Motor;
  onClick: (motor: Motor) => void;
  viewMode?: "grid" | "list";
}

export function MotorCard({ motor, onClick, viewMode = "grid" }: MotorCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex ${viewMode === "list" ? "flex-col sm:flex-row h-auto" : "flex-col h-full"}`} 
      onClick={() => onClick(motor)}
    >
      <div className={`relative bg-gray-100 flex-shrink-0 ${viewMode === "list" ? "w-full sm:w-72 h-56 sm:h-auto" : "h-56 w-full"}`}>
        <img 
          src={motor.image} 
          alt={`${motor.brand} ${motor.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3">
          <span className="bg-[#ffdd00] text-black text-[11px] font-bold tracking-wide py-1.5 px-3 rounded-full shadow-sm">
            Unggulan
          </span>
        </div>

        {motor.condition && (
          <div className="absolute top-3 right-3">
            <span className="bg-white text-gray-800 text-[11px] font-semibold tracking-wide py-1.5 px-3 rounded-full shadow-sm">
              {motor.condition}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow bg-white z-10 w-full">
        <h3 className="font-bold text-[16px] text-gray-900 leading-tight mb-2">{motor.brand} {motor.model}</h3>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {motor.year}
          </span>
          {motor.mileage !== undefined && (
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-gray-400" />
              {motor.mileage.toLocaleString('id-ID')} km
            </span>
          )}
        </div>
        
        <div className="mt-auto">
           <p className="text-gray-900 font-bold text-lg tracking-tight">{formatCurrency(motor.price)}</p>
        </div>
      </div>
    </div>
  );
}

