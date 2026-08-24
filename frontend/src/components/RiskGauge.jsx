import React from 'react';

export default function RiskGauge({ score = 7.4, maxScore = 10 }) {
  const normalizedScore = Math.max(0, Math.min(maxScore, Number(score) || 0));
  const percentage = (normalizedScore / maxScore) * 100;

  // Determine color based on score band
  let strokeColor = '#22c55e'; // Green (Low)
  let bandLabel = 'LOW RISK';
  if (normalizedScore > 8.0) {
    strokeColor = '#ba1a1a'; // Red (Severe)
    bandLabel = 'SEVERE RISK';
  } else if (normalizedScore > 6.0) {
    strokeColor = '#ea580c'; // Orange (High)
    bandLabel = 'HIGH RISK';
  } else if (normalizedScore > 3.0) {
    strokeColor = '#eab308'; // Yellow (Moderate)
    bandLabel = 'MODERATE RISK';
  }

  // SVG Gauge calculations
  // Arc radius = 75, Circumference of half circle (180 deg) = PI * R = 3.14159 * 75 = 235.62
  const radius = 75;
  const halfCircumference = Math.PI * radius;
  const strokeDashoffset = halfCircumference - (halfCircumference * (percentage / 100));

  return (
    <div className="relative flex flex-col items-center justify-center py-2 select-none">
      <div className="relative w-[260px] h-[145px] flex items-end justify-center overflow-hidden">
        {/* SVG Normal Upward Arching Gauge */}
        <svg className="w-[260px] h-[145px]" viewBox="0 0 200 115">
          {/* Background Track Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="#e0e3e5"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Active Colored Value Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease'
            }}
          />
        </svg>

        {/* Center Score Value Display */}
        <div className="absolute bottom-2 text-center flex flex-col items-center justify-center">
          <span className="text-[44px] md:text-[50px] font-black leading-none text-on-surface tracking-tight">
            {normalizedScore.toFixed(1)}
          </span>
          <span className="text-body-sm font-bold text-on-surface-variant mt-0.5">
            / {maxScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Scale Tick Labels */}
      <div className="w-[240px] flex justify-between text-[11px] font-bold text-on-surface-variant px-2 mt-1">
        <span className="text-[#22c55e]">0.0 (Low)</span>
        <span className="text-[#eab308]">3.1</span>
        <span className="text-[#ea580c]">6.1</span>
        <span className="text-[#ba1a1a]">10.0 (Severe)</span>
      </div>
    </div>
  );
}
