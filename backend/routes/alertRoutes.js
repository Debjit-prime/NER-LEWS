const express = require('express');
const router = express.Router();

module.exports = function(db) {
  // GET /api/alerts - Fetch active notifications & emergency alerts
  router.get('/', (req, res) => {
    try {
      res.json({
        success: true,
        count: db.alerts.length,
        data: db.alerts
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/alerts - Create/broadcast an official emergency alert
  router.post('/', (req, res) => {
    try {
      const { severity, title, location, message, title_as, title_hi, message_as, message_hi } = req.body;

      if (!title || !message) {
        return res.status(400).json({ success: false, error: 'Title and message are required' });
      }

      const band = (severity || 'High').toUpperCase();
      let color = '#ea580c';
      if (band === 'SEVERE') color = '#ba1a1a';
      else if (band === 'MODERATE') color = '#eab308';
      else if (band === 'LOW') color = '#22c55e';

      const newAlert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        severity: severity || 'High',
        band,
        color,
        title,
        title_as: title_as || title,
        title_hi: title_hi || title,
        location: location || 'Regional North Eastern Zone',
        time: 'Just now',
        timestamp: new Date().toISOString(),
        message,
        message_as: message_as || message,
        message_hi: message_hi || message
      };

      db.alerts.unshift(newAlert);

      res.status(201).json({
        success: true,
        message: 'Emergency alert dispatched successfully',
        data: newAlert
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
