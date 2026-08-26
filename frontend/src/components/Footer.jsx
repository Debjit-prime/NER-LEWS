import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full py-lg md:py-xl px-margin-mobile md:px-margin-desktop gap-md mt-auto shrink-0 z-20">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        {/* Brand with Hover Tooltip */}
        <div className="relative group cursor-pointer">
          <span
            className="text-label-bold font-bold text-primary flex items-center gap-1.5 border-b border-dashed border-primary/40 group-hover:border-primary"
            title="North Eastern Region, Landslide Early Warning System"
          >
            <span className="material-symbols-outlined text-[20px]">terrain</span>
            <span>NER-LEWS</span>
          </span>

          <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:flex flex-col items-start z-50 pointer-events-none transition-all duration-200">
            <div className="bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-white/20 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">info</span>
              <span>North Eastern Region, Landslide Early Warning System</span>
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary ml-4"></div>
          </div>
        </div>

        <span className="text-body-sm text-on-surface-variant">
          North Eastern Region Landslide Early Warning & Disaster Decision Support Platform
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-md text-on-surface-variant text-body-sm">
        <Link to="/map" className="hover:underline transition-all">GIS Map</Link>
        <Link to="/risk-scoring" className="hover:underline transition-all">Risk Engine</Link>
        <Link to="/report" className="hover:underline transition-all">Citizen Portal</Link>
        <Link to="/authority" className="hover:underline transition-all">Authority Admin</Link>
      </div>

      <div className="text-body-sm text-on-surface text-center md:text-right">
        © 2026 North Eastern Council (NEC) | SDMA Hazard Monitoring Network
      </div>
    </footer>
  );
}
