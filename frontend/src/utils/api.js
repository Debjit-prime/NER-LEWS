import { initialZones, initialAlerts, initialReports } from '../data/seedData';
import { calculateClientRiskScore } from './riskCalculator';

const API_BASE = '/api';

export const api = {
  // Fetch hazard zones
  async getZones(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/zones?${query}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data || initialZones;
    } catch (err) {
      console.warn('[NER-LEWS API] Using fallback seed zones:', err.message);
      let results = [...initialZones];
      if (params.district && params.district !== 'all') {
        results = results.filter(z => z.district.toLowerCase() === params.district.toLowerCase());
      }
      return results;
    }
  },

  // Calculate risk score
  async calculateRisk(inputs) {
    try {
      const res = await fetch(`${API_BASE}/risk/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[NER-LEWS API] Calculating risk client-side:', err.message);
      return calculateClientRiskScore(inputs);
    }
  },

  // Fetch active emergency alerts
  async getAlerts() {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data || initialAlerts;
    } catch (err) {
      console.warn('[NER-LEWS API] Using fallback seed alerts:', err.message);
      return initialAlerts;
    }
  },

  // Create / broadcast a new alert
  async createAlert(alertData) {
    try {
      const res = await fetch(`${API_BASE}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      if (!res.ok) throw new Error('Failed to broadcast alert');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[NER-LEWS API] Fallback create alert locally:', err.message);
      const newAlert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        time: 'Just now',
        timestamp: new Date().toISOString(),
        ...alertData
      };
      return newAlert;
    }
  },

  // Fetch citizen reports
  async getReports() {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data || initialReports;
    } catch (err) {
      console.warn('[NER-LEWS API] Using fallback seed reports:', err.message);
      return initialReports;
    }
  },

  // Submit a citizen report
  async submitReport(reportData) {
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (!res.ok) throw new Error('Failed to submit report');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[NER-LEWS API] Fallback submit report locally:', err.message);
      return {
        id: `REP-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        status: 'Under Review',
        ...reportData
      };
    }
  },

  // Send / Simulate SMS
  async sendSms(smsData) {
    try {
      const res = await fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsData)
      });
      if (!res.ok) throw new Error('SMS API call failed');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[NER-LEWS API] Fallback simulated SMS:', err.message);
      return {
        id: `SMS-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        deliveryStatus: 'Delivered (Simulated Demo)',
        mode: 'Demo Mode',
        ...smsData
      };
    }
  },

  // Get SMS history
  async getSmsHistory() {
    try {
      const res = await fetch(`${API_BASE}/sms/history`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      return [];
    }
  }
};
