import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentLang = 'en', onLanguageChange, unreadAlertsCount = 3 }) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAuthority, openAuthModal, logout, quickLogin } = useAuth();

  const languages = [
    { code: 'en', label: 'English (EN)', flag: '🇮🇳' },
    { code: 'as', label: 'অসমীয়া (AS)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी (HI)', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা (BN)', flag: '🇮🇳' }
  ];

  const navLinks = [
    { to: '/', label: 'Dashboard', exact: true },
    { to: '/map', label: 'Map View' },
    { to: '/risk-scoring', label: 'Risk Scoring' },
    { to: '/alerts', label: 'Alerts', badge: unreadAlertsCount },
    { to: '/report', label: 'Citizen Report' },
    { to: '/authority', label: 'Authority Portal' }
  ];

  return (
    <nav className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 shrink-0 sticky top-0 z-50 shadow-sm">
      {/* Brand & Desktop Navigation */}
      <div className="flex items-center gap-lg">
        {/* Brand Logo with Interactive Hover Tooltip for Full Form */}
        <div className="relative group">
          <Link
            to="/"
            className="flex items-center gap-2 text-headline-sm font-bold text-primary tracking-tight py-1"
            title="North Eastern Region, Landslide Early Warning System"
          >
            <span className="material-symbols-outlined text-primary text-[28px] group-hover:rotate-12 transition-transform duration-300">
              terrain
            </span>
            <span className="border-b-2 border-transparent group-hover:border-primary transition-colors">
              NER-LEWS
            </span>
            <span className="hidden lg:inline-block ml-1 px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold rounded-full border border-secondary-fixed-dim">
              Live System v1.0
            </span>
          </Link>

          {/* Interactive Hover Tooltip */}
          <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col items-start z-50 pointer-events-none transition-all duration-200 animate-fadeIn">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-primary ml-4"></div>
            <div className="bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-white/20 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">info</span>
              <span>North Eastern Region, Landslide Early Warning System</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-md lg:gap-lg ml-md">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? location.pathname === link.to 
              : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive: active }) =>
                  `flex items-center gap-1.5 py-2 px-3 text-label-bold font-label-bold rounded transition-colors ${
                    active || isActive
                      ? 'text-primary border-b-2 border-primary font-bold bg-surface-container-low/50'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`
                }
              >
                <span>{link.label}</span>
                {link.badge && link.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-error text-white text-[10px] flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Right Controls: Language Selector, Notifications, User Auth */}
      <div className="flex items-center gap-sm md:gap-md text-primary relative">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setLangMenuOpen(!langMenuOpen); setUserMenuOpen(false); }}
            aria-label="Language Selector"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-surface-container-low border border-outline-variant/60 transition-colors text-body-sm font-semibold text-primary"
            title="Switch Language (EN / AS / HI / BN)"
          >
            <span className="material-symbols-outlined text-[20px]">language</span>
            <span className="uppercase text-xs font-bold">{currentLang}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-fadeIn">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant bg-surface-container-low">
                Select Language
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    if (onLanguageChange) onLanguageChange(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-body-sm flex items-center justify-between hover:bg-surface-container transition-colors ${
                    currentLang === l.code ? 'bg-secondary-fixed/50 font-bold text-primary' : 'text-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {currentLang === l.code && (
                    <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <Link
          to="/alerts"
          aria-label="Active Alerts"
          className="hover:bg-surface-container-low p-2 rounded-full transition-colors relative flex items-center justify-center text-primary"
          title="Active Alerts"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface animate-pulse"></span>
          )}
        </Link>

        {/* User Authentication Menu / Button */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setLangMenuOpen(false); }}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-colors"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${isAuthority ? 'bg-primary' : 'bg-secondary'}`}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-bold text-on-surface leading-tight truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </span>
                <span className={`text-[9px] font-semibold uppercase px-1 rounded ${isAuthority ? 'bg-primary/10 text-primary' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                  {isAuthority ? 'Officer' : 'Citizen'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-fadeIn">
                {/* User Info Card */}
                <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isAuthority ? 'bg-primary text-white' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                      {isAuthority ? 'SDMA Authority' : 'Citizen Reporter'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-on-surface truncate">{user.name}</div>
                  <div className="text-xs text-on-surface-variant truncate">{user.email}</div>
                  {user.designation && (
                    <div className="text-[11px] text-primary font-medium mt-1">
                      {user.designation} ({user.district})
                    </div>
                  )}
                </div>

                {/* Navigation Options */}
                <div className="py-1">
                  {isAuthority && (
                    <Link
                      to="/authority"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      <span>Authority Incident Portal</span>
                    </Link>
                  )}
                  <Link
                    to="/report"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                    <span>Submit Citizen Report</span>
                  </Link>
                </div>

                <div className="border-t border-outline-variant my-1"></div>

                {/* Quick Role Switcher for Demo */}
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Switch Demo Identity
                </div>
                <button
                  onClick={() => { quickLogin(isAuthority ? 'citizen' : 'authority'); setUserMenuOpen(false); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-on-surface hover:bg-surface-container flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">sync_alt</span>
                    <span>Switch to {isAuthority ? 'Citizen' : 'SDMA Officer'}</span>
                  </span>
                </button>

                <div className="border-t border-outline-variant my-1"></div>

                {/* Logout Button */}
                <button
                  onClick={() => { logout(); setUserMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-error-container/30 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal({ mode: 'login' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">lock</span>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
