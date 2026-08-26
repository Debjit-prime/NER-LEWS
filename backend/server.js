const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// In-Memory Database initialized with static NER dataset
const dataFilePath = path.join(__dirname, 'data', 'ner_data.json');
let db = {
  zones: [],
  alerts: [],
  reports: [],
  smsQueue: [],
  settings: {
    smsGatewayMode: 'Demo Mode (Simulated)',
    demoMode: true,
    smsProvider: 'Twilio Sandbox / Fast2SMS Simulator',
    alertThresholds: { moderate: 3.1, high: 6.1, severe: 8.1 },
    autoBroadcastOnSevere: true,
    dataSourceMode: 'NER Telemetry Network & Empirical Geotechnical Engine'
  }
};

try {
  if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    db = JSON.parse(rawData);
    console.log(`[NER-LEWS DB] Successfully loaded ${db.zones?.length || 0} zones and ${db.alerts?.length || 0} alerts.`);
  }
} catch (err) {
  console.warn('[NER-LEWS DB] Warning reading ner_data.json, initializing empty db:', err.message);
}

if (!Array.isArray(db.zones)) db.zones = [];
if (!Array.isArray(db.alerts)) db.alerts = [];
if (!Array.isArray(db.reports)) db.reports = [];
if (!Array.isArray(db.smsQueue)) db.smsQueue = [];

// Mount REST Route Handlers
const riskRouter = require('./routes/riskRoutes');
const zoneRouter = require('./routes/zoneRoutes')(db);
const reportRouter = require('./routes/reportRoutes')(db);
const alertRouter = require('./routes/alertRoutes')(db);
const smsRouter = require('./routes/smsRoutes')(db);

app.use('/api/risk', riskRouter);
app.use('/api/zones', zoneRouter);
app.use('/api/reports', reportRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/sms', smsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'NER-LEWS (North Eastern Region Landslide Early Warning System)',
    version: '1.0.0-PROD',
    timestamp: new Date().toISOString(),
    zonesCount: db.zones.length,
    alertsCount: db.alerts.length,
    reportsCount: db.reports.length,
    demoMode: db.settings.demoMode
  });
});

// Production: Serve static Frontend build if present (Single-Server All-in-One Deployment)
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`[NER-LEWS Production] Serving static frontend build from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'NER-LEWS REST API Server is running.',
      endpoints: [
        '/api/health',
        '/api/risk/calculate',
        '/api/zones',
        '/api/reports',
        '/api/alerts',
        '/api/sms/history'
      ]
    });
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 NER-LEWS Backend API Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Risk Scoring: http://localhost:${PORT}/api/risk/calculate`);
  console.log(`======================================================\n`);
});
