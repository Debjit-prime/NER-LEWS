import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProtectedRoute({ children, role = 'authority' }) {
  const { user, isAuthority, isLoading, openAuthModal, quickLogin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-xl min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-[36px] text-primary mb-2">
          progress_activity
        </span>
        <p className="text-body-sm text-on-surface-variant font-semibold">
          Verifying security authorization...
        </p>
      </div>
    );
  }

  // If authority role is required but user is not logged in as authority
  if (role === 'authority' && !isAuthority) {
    return (
      <main className="flex-grow w-full max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-xl flex flex-col items-center text-center max-w-lg w-full relative overflow-hidden">
          {/* Top red security strip */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-error"></div>

          {/* Security Shield Icon */}
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-4 shadow-inner">
            <span className="material-symbols-outlined text-[32px] text-error">
              admin_panel_settings
            </span>
          </div>

          <h2 className="text-headline-sm font-bold text-primary mb-2">
            Restricted Authority Access
          </h2>

          <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
            The <strong>Authority Incident Portal</strong>, emergency alert broadcasting, and telecom SMS dispatch console are restricted to verified <strong>State Disaster Management Authority (SDMA)</strong>, DDMA, and emergency field commanders.
          </p>

          {user && (
            <div className="w-full p-3 bg-surface-container rounded-lg border border-outline-variant mb-6 text-xs text-on-surface-variant">
              Currently signed in as <strong className="text-primary">{user.name}</strong> ({user.role === 'citizen' ? 'Citizen Account' : user.role}). Citizen accounts do not have administrative dispatch privileges.
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            {/* Instant 1-Click Officer Login */}
            <button
              onClick={() => quickLogin('authority')}
              className="w-full py-3 px-4 bg-primary text-on-primary hover:bg-primary-container font-bold rounded-xl text-body-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
                bolt
              </span>
              <span>1-Click SDMA Officer Login</span>
            </button>

            {/* Custom Sign In */}
            <button
              onClick={() => openAuthModal({ mode: 'login', initialRole: 'authority', redirectAfterLogin: '/authority' })}
              className="w-full py-2.5 px-4 bg-surface text-primary border border-outline-variant hover:bg-surface-container font-bold rounded-xl text-body-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                login
              </span>
              <span>Sign In with Officer Credentials</span>
            </button>

            {/* Return to Dashboard */}
            <Link
              to="/"
              className="mt-2 text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Return to Public Dashboard</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
