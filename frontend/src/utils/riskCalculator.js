/**
 * Client-Side Risk Calculator Mirroring Backend Logic
 * Enables instantaneous offline feedback and live slider rendering.
 */

export function normalizePrecipitation(precip) {
  const p = Math.max(0, Number(precip) || 0);
  if (p === 0) return 0;
  if (p <= 50) return (p / 50) * 3;
  if (p <= 100) return 3 + ((p - 50) / 50) * 3;
  if (p <= 150) return 6 + ((p - 100) / 50) * 4;
  return 10;
}

export function normalizeSoilMoisture(soilMoisture) {
  const sm = Math.max(0, Math.min(100, Number(soilMoisture) || 0));
  return sm / 10;
}

export function normalizeHumidity(humidity) {
  const h = Math.max(0, Math.min(100, Number(humidity) || 0));
  return h / 10;
}

export function normalizeElevation(elevation) {
  const elev = Math.max(0, Number(elevation) || 0);
  if (elev <= 500) return 2;
  if (elev <= 1500) return 5;
  if (elev <= 2500) return 8;
  return 10;
}

export function getTemperatureModifier(temp) {
  const t = Number(temp);
  if (isNaN(t)) return 0;
  if (t >= 15 && t <= 30) return 0;
  return 0.5;
}

export function calculateClientRiskScore({
  temperature = 28.5,
  humidity = 82,
  precipitation = 145,
  soilMoisture = 68,
  elevation = 1250
} = {}) {
  const pScore = normalizePrecipitation(precipitation);
  const smScore = normalizeSoilMoisture(soilMoisture);
  const hScore = normalizeHumidity(humidity);
  const eScore = normalizeElevation(elevation);
  const tMod = getTemperatureModifier(temperature);

  const wPrecip = pScore * 0.35;
  const wSoil = smScore * 0.30;
  const wHum = hScore * 0.15;
  const wElev = eScore * 0.20;

  const rawScore = wPrecip + wSoil + wHum + wElev + tMod;
  const clamped = Math.max(0.0, Math.min(10.0, rawScore));
  const finalScore = Number(clamped.toFixed(1));

  let band = 'LOW';
  let bandLabel = 'LOW RISK';
  let color = '#22c55e';
  let badgeClass = 'bg-[#dcfce7] text-[#15803d] border-[#22c55e]/30';
  let advisoryText = 'Conditions stable. Continue routine monitoring.';

  if (finalScore > 8.0) {
    band = 'SEVERE';
    bandLabel = 'SEVERE RISK';
    color = '#ba1a1a';
    badgeClass = 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/30';
    advisoryText = 'Critical risk. Recommend immediate evacuation advisory and road closure.';
  } else if (finalScore > 6.0) {
    band = 'HIGH';
    bandLabel = 'HIGH RISK';
    color = '#ea580c';
    badgeClass = 'bg-[#ffedd5] text-[#9a3412] border-[#ea580c]/30';
    advisoryText = 'High risk conditions. Recommend road advisory and resident alert.';
  } else if (finalScore > 3.0) {
    band = 'MODERATE';
    bandLabel = 'MODERATE RISK';
    color = '#eab308';
    badgeClass = 'bg-[#fef9c3] text-[#854d0e] border-[#eab308]/30';
    advisoryText = 'Increased risk detected. Notify local field officers for inspection.';
  }

  return {
    score: finalScore,
    band,
    bandLabel,
    color,
    badgeClass,
    advisoryText,
    breakdown: {
      precipitation: { raw: Number(precipitation), subScore: Number(pScore.toFixed(2)), weight: 0.35, weighted: Number(wPrecip.toFixed(2)) },
      soilMoisture: { raw: Number(soilMoisture), subScore: Number(smScore.toFixed(2)), weight: 0.30, weighted: Number(wSoil.toFixed(2)) },
      humidity: { raw: Number(humidity), subScore: Number(hScore.toFixed(2)), weight: 0.15, weighted: Number(wHum.toFixed(2)) },
      elevation: { raw: Number(elevation), subScore: Number(eScore.toFixed(2)), weight: 0.20, weighted: Number(wElev.toFixed(2)) },
      temperature: { raw: Number(temperature), modifier: tMod }
    }
  };
}
