import { initialZones, initialAlerts, initialReports } from '../data/seedData';
import { calculateClientRiskScore } from './riskCalculator';

// In production, uses Render live backend; in local development, proxies through Vite to /api
const RAW_API_URL = import.meta.env.VITE_API_URL || '/api';
const API_BASE = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('ner_lews_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Authentication: Login
  async login({ email, password }) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data.data;
    } catch (err) {
      console.warn('[NER-LEWS Auth API] Using local fallback login:', err.message);
      // Client-side fallback for offline testing
      const isOfficer = email.toLowerCase().includes('officer') || email.toLowerCase().includes('sdma') || email.toLowerCase().includes('dm');
      const fallbackUser = {
        id: isOfficer ? 'USR-AUTH-001' : 'USR-CIT-001',
        name: isOfficer ? 'Col. Rajesh Sangma' : 'Tenzin Norbu',
        email: email,
        role: isOfficer ? 'authority' : 'citizen',
        designation: isOfficer ? 'SDMA Field Commander' : 'Citizen Reporter',
        district: 'East Khasi Hills',
        state: 'Meghalaya'
      };
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: fallbackUser
      };
    }
  },

  // Authentication: Register
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data.data;
    } catch (err) {
      console.warn('[NER-LEWS Auth API] Using local fallback register:', err.message);
      const fallbackUser = {
        id: `USR-${Date.now().toString().slice(-6)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'citizen',
        designation: userData.designation || (userData.role === 'authority' ? 'Disaster Response Officer' : 'Citizen Reporter'),
        district: userData.district || 'East Khasi Hills',
        state: userData.state || 'Meghalaya'
      };
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: fallbackUser
      };
    }
  },

  // Authentication: Get Current Session
  async getMe() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Session invalid');
      const data = await res.json();
      return data.data.user;
    } catch (err) {
      return null;
    }
  },

  // Authentication: Get Demo Users list
  async getDemoUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      if (!res.ok) throw new Error('Failed to fetch demo users');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [
        {
          role: 'authority',
          label: 'SDMA Field Commander',
          email: 'officer@sdma.gov.in',
          password: 'Officer@123',
          name: 'Col. Rajesh Sangma',
          badge: 'Authority Access'
        },
        {
          role: 'authority',
          label: 'District Magistrate',
          email: 'dm@shillong.gov.in',
          password: 'Admin@123',
          name: 'Dr. S. K. Marak, IAS',
          badge: 'DDMA Chair'
        },
        {
          role: 'citizen',
          label: 'Citizen / Volunteer',
          email: 'citizen@ner.in',
          password: 'Citizen@123',
          name: 'Tenzin Norbu',
          badge: 'Citizen Access'
        }
      ];
    }
  },

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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE}/sms/history`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      return [];
    }
  }
};
