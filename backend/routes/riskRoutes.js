const express = require('express');
const router = express.Router();
const { calculateRiskScore } = require('../riskScoring');

/**
 * POST /api/risk/calculate
 * Computes transparent landslide risk score based on 5 inputs:
 * temperature (°C), humidity (%), precipitation (mm/24h), soilMoisture (%), elevation (m)
 */
router.post('/calculate', (req, res) => {
  try {
    const { temperature, humidity, precipitation, soilMoisture, elevation } = req.body;
    
    const result = calculateRiskScore({
      temperature: Number(temperature),
      humidity: Number(humidity),
      precipitation: Number(precipitation),
      soilMoisture: Number(soilMoisture),
      elevation: Number(elevation)
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error calculating risk score:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compute risk score: ' + error.message
    });
  }
});

module.exports = router;
