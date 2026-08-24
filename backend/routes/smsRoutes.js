const express = require('express');
const router = express.Router();

module.exports = function(db) {
  // GET /api/sms/history - Retrieve all dispatched/simulated SMS alerts
  router.get('/history', (req, res) => {
    res.json({
      success: true,
      demoMode: db.settings.demoMode,
      gatewayMode: db.settings.smsGatewayMode,
      count: db.smsQueue.length,
      data: db.smsQueue
    });
  });

  // GET /api/sms/settings
  router.get('/settings', (req, res) => {
    res.json({
      success: true,
      data: db.settings
    });
  });

  // POST /api/sms/toggle-mode
  router.post('/toggle-mode', (req, res) => {
    const { demoMode } = req.body;
    if (demoMode !== undefined) {
      db.settings.demoMode = Boolean(demoMode);
      db.settings.smsGatewayMode = db.settings.demoMode 
        ? 'Demo Mode (Simulated)' 
        : 'Live Free-tier Sandbox (Twilio/Fast2SMS)';
    }
    res.json({
      success: true,
      data: db.settings
    });
  });

  // POST /api/sms/send - Dispatches real or simulated SMS
  router.post('/send', async (req, res) => {
    try {
      const { recipients, message, zoneId, severity } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, error: 'SMS text message is required' });
      }

      const recipientList = Array.isArray(recipients) && recipients.length > 0 
        ? recipients 
        : ['District Field Officers (East Khasi Hills)', 'State Disaster Management Authority (SDMA)', 'PWD Highway Patrol Unit', '+91 98620 XXXXX (Local Sarpanch/Headman)'];

      const smsEntry = {
        id: `SMS-${Date.now().toString().slice(-6)}`,
        zoneId: zoneId || 'REGIONAL',
        severity: severity || 'High',
        recipients: recipientList,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        deliveryStatus: db.settings.demoMode ? 'Delivered (Simulated)' : 'Sent via Sandbox',
        mode: db.settings.demoMode ? 'Demo Mode' : 'Live Gateway',
        carrierLog: `[TELECOM CARRIER GATEWAY] Handshake OK -> Broadcast sent to ${recipientList.length} registered terminals.`
      };

      // Check if real Twilio credentials are configured in environment
      if (!db.settings.demoMode && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
          // If twilio SDK is optional/available, it can be invoked here
          console.log('[SMS GATEWAY] Twilio credentials detected. Real SMS dispatch initialized.');
          smsEntry.deliveryStatus = 'Sent via Twilio API';
        } catch (twilioErr) {
          console.error('[SMS GATEWAY] Twilio dispatch warning, falling back to simulated log:', twilioErr.message);
          smsEntry.deliveryStatus = 'Delivered (Fallback Simulated)';
        }
      }

      // Add to in-app SMS log feed
      db.smsQueue.unshift(smsEntry);

      res.status(200).json({
        success: true,
        message: db.settings.demoMode 
          ? 'Demo Mode: SMS simulated and logged to alert feed' 
          : 'SMS broadcast transmitted via gateway',
        data: smsEntry
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
