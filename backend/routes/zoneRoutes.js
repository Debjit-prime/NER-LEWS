const express = require('express');
const router = express.Router();
const { calculateRiskScore } = require('../riskScoring');

module.exports = function(db) {
  // GET /api/zones - Fetch all hazard monitoring zones
  router.get('/', (req, res) => {
    try {
      const { district, band } = req.query;
      let results = [...db.zones];

      if (district && district !== 'all' && district !== 'All Districts') {
        results = results.filter(z => z.district.toLowerCase() === district.toLowerCase());
      }

      if (band && band !== 'all' && band !== 'All Risks') {
        if (band === 'Severe Risk Only' || band === 'SEVERE') {
          results = results.filter(z => z.riskBand === 'SEVERE');
        } else if (band === 'High Risk +' || band === 'HIGH+') {
          results = results.filter(z => z.riskBand === 'SEVERE' || z.riskBand === 'HIGH');
        } else if (band === 'HIGH') {
          results = results.filter(z => z.riskBand === 'HIGH');
        } else if (band === 'MODERATE') {
          results = results.filter(z => z.riskBand === 'MODERATE');
        } else if (band === 'LOW') {
          results = results.filter(z => z.riskBand === 'LOW');
        }
      }

      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET /api/zones/:id - Get specific zone details
  router.get('/:id', (req, res) => {
    const zone = db.zones.find(z => z.id === req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }
    res.json({ success: true, data: zone });
  });

  // POST /api/zones/:id/telemetry - Update live telemetry & recalculate risk
  router.post('/:id/telemetry', (req, res) => {
    const zoneIndex = db.zones.findIndex(z => z.id === req.params.id);
    if (zoneIndex === -1) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }

    const { rainfall24h, soilMoisture, humidity, temperature, roadStatus } = req.body;
    const currentZone = db.zones[zoneIndex];

    const newRainfall = rainfall24h !== undefined ? Number(rainfall24h) : currentZone.rainfall24h;
    const newSoil = soilMoisture !== undefined ? Number(soilMoisture) : currentZone.soilMoisture;
    const newHumidity = humidity !== undefined ? Number(humidity) : currentZone.humidity;
    const newTemp = temperature !== undefined ? Number(temperature) : currentZone.temperature;

    // Recalculate risk using core algorithm
    const riskResult = calculateRiskScore({
      temperature: newTemp,
      humidity: newHumidity,
      precipitation: newRainfall,
      soilMoisture: newSoil,
      elevation: currentZone.elevation
    });

    db.zones[zoneIndex] = {
      ...currentZone,
      rainfall24h: newRainfall,
      soilMoisture: newSoil,
      humidity: newHumidity,
      temperature: newTemp,
      roadStatus: roadStatus || currentZone.roadStatus,
      riskScore: riskResult.score,
      riskBand: riskResult.band,
      lastUpdated: 'Just now'
    };

    res.json({
      success: true,
      data: db.zones[zoneIndex],
      riskCalculation: riskResult
    });
  });

  return router;
};
