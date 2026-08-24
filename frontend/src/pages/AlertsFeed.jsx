import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { speechService } from '../utils/speech';
import { initialAlerts } from '../data/seedData';

export default function AlertsFeed({ currentLang = 'en', onLanguageChange }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeAlertIdPlaying, setActiveAlertIdPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  const langPills = [
    { code: 'en', label: 'EN' },
    { code: 'as', label: 'AS' },
    { code: 'hi', label: 'HI' },
    { code: 'bn', label: 'BN' }
  ];

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await api.getAlerts();
        if (data && data.length > 0) setAlerts(data);
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const handlePlayAudio = (alertItem) => {
    if (activeAlertIdPlaying === alertItem.id) {
      speechService.stop();
      setActiveAlertIdPlaying(null);
      return;
    }

    // Determine translated title and message
    let textToSpeak = `${alertItem.title}. Location: ${alertItem.location}. Advisory: ${alertItem.message}`;
    if (currentLang === 'as' && alertItem.title_as) {
      textToSpeak = `${alertItem.title_as}। অৱস্থান: ${alertItem.location}। ${alertItem.message_as || alertItem.message}`;
    } else if (currentLang === 'hi' && alertItem.title_hi) {
      textToSpeak = `${alertItem.title_hi}। स्थान: ${alertItem.location}। ${alertItem.message_hi || alertItem.message}`;
    } else if (currentLang === 'bn' && alertItem.title_bn) {
      textToSpeak = `${alertItem.title_bn}। অবস্থান: ${alertItem.location}। ${alertItem.message_bn || alertItem.message}`;
    }

    setActiveAlertIdPlaying(alertItem.id);
    speechService.speak(textToSpeak, {
      lang: currentLang,
      onStart: () => setActiveAlertIdPlaying(alertItem.id),
      onEnd: () => setActiveAlertIdPlaying(null),
      onError: () => setActiveAlertIdPlaying(null)
    });
  };

  const getAlertUIProps = (severity) => {
    const s = (severity || '').toUpperCase();
    if (s === 'SEVERE') {
      return {
        borderTop: 'border-t-error',
        iconBg: 'bg-error-container text-on-error-container',
        badgeBg: 'bg-error-container text-on-error-container',
        iconName: 'warning',
        label: 'Severe'
      };
    }
    if (s === 'HIGH') {
      return {
        borderTop: 'border-t-[#ea580c]',
        iconBg: 'bg-[#ffedd5] text-[#9a3412]',
        badgeBg: 'bg-[#ffedd5] text-[#9a3412]',
        iconName: 'crisis_alert',
        label: 'High'
      };
    }
    return {
      borderTop: 'border-t-[#eab308]',
      iconBg: 'bg-[#fef9c3] text-[#854d0e]',
      badgeBg: 'bg-[#fef9c3] text-[#854d0e]',
      iconName: 'info',
      label: 'Moderate'
    };
  };

  return (
    <main className="flex-grow w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-lg md:py-xl flex flex-col gap-xl">
      {/* Header & Language Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
            Active Emergency Alerts
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Live hazard notifications, road blockages, and prescriptive evacuation advisories.
          </p>
        </div>

        {/* Multilingual Pill Bar */}
        <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full p-1 shadow-sm">
          {langPills.map((pill) => (
            <button
              key={pill.code}
              onClick={() => {
                if (onLanguageChange) onLanguageChange(pill.code);
              }}
              className={`px-4 py-1.5 rounded-full text-label-bold font-bold transition-all text-xs ${
                currentLang === pill.code
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex flex-col gap-md">
        {alerts.map((alertItem) => {
          const ui = getAlertUIProps(alertItem.severity);
          const isPlaying = activeAlertIdPlaying === alertItem.id;

          // Select localized title and message
          let displayTitle = alertItem.title;
          let displayMessage = alertItem.message;
          if (currentLang === 'as' && alertItem.title_as) {
            displayTitle = alertItem.title_as;
            displayMessage = alertItem.message_as || alertItem.message;
          } else if (currentLang === 'hi' && alertItem.title_hi) {
            displayTitle = alertItem.title_hi;
            displayMessage = alertItem.message_hi || alertItem.message;
          } else if (currentLang === 'bn' && alertItem.title_bn) {
            displayTitle = alertItem.title_bn;
            displayMessage = alertItem.message_bn || alertItem.message;
          }

          return (
            <div
              key={alertItem.id}
              className={`bg-surface-container-lowest border-t-4 ${ui.borderTop} border border-outline-variant rounded-xl p-md md:p-lg flex flex-col sm:flex-row gap-md justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex gap-md items-start flex-1">
                <div className={`${ui.iconBg} p-3 rounded-full flex-shrink-0 mt-1 flex items-center justify-center`}>
                  <span className="material-symbols-outlined filled text-[24px]">
                    {ui.iconName}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-sm flex-wrap">
                    <span className={`${ui.badgeBg} text-label-bold font-bold px-2.5 py-0.5 rounded text-xs`}>
                      {ui.label}
                    </span>
                    <span className="text-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{alertItem.time || 'Active'}</span>
                    </span>
                  </div>

                  <h2 className="text-alert-callout font-bold text-on-surface mt-1">
                    {displayTitle}
                  </h2>

                  <p className="text-body-md font-semibold text-primary flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>{alertItem.location}</span>
                  </p>

                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {displayMessage}
                  </p>
                </div>
              </div>

              {/* Play Audio Web Speech Button */}
              <button
                onClick={() => handlePlayAudio(alertItem)}
                className={`shrink-0 flex items-center gap-2 border border-outline-variant px-4 py-3 rounded-lg text-on-surface transition-all w-full sm:w-auto justify-center min-h-[46px] ${
                  isPlaying
                    ? 'bg-error text-white font-bold animate-pulse'
                    : 'bg-surface-container-low hover:bg-surface-container-highest'
                }`}
                title="Listen to broadcast in current language"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPlaying ? 'volume_off' : 'volume_up'}
                </span>
                <span className="text-label-bold font-bold text-sm">
                  {isPlaying ? 'Stop Voice' : 'Play Audio'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
