const express = require('express');
const router = express.Router();

module.exports = function(db) {
  // GET /api/reports - Fetch all citizen reports
  router.get('/', (req, res) => {
    try {
      res.json({
        success: true,
        count: db.reports.length,
        data: db.reports
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/reports - Submit a new citizen report
  router.post('/', (req, res) => {
    try {
      const { lat, lng, locationName, district, description, imageUrl, tags } = req.body;

      if (!description || description.trim() === '') {
        return res.status(400).json({ success: false, error: 'Description is required' });
      }

      const newId = `REP-${new Date().getFullYear()}-${String(db.reports.length + 1).padStart(3, '0')}`;
      const newReport = {
        id: newId,
        lat: Number(lat) || 25.5788,
        lng: Number(lng) || 91.8933,
        locationName: locationName || 'Geo-tagged Location (NER)',
        district: district || 'East Khasi Hills',
        description: description.trim(),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        status: 'Under Review',
        tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Slope Hazard', 'Field Submission']
      };

      // Prepend to list so newest is first
      db.reports.unshift(newReport);

      res.status(201).json({
        success: true,
        message: 'Citizen report recorded successfully',
        data: newReport
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PATCH /api/reports/:id/status - Update report workflow status
  router.patch('/:id/status', (req, res) => {
    const report = db.reports.find(r => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    const { status } = req.body;
    if (status) {
      report.status = status;
    }

    res.json({
      success: true,
      data: report
    });
  });

  return router;
};
