import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalConfig,
    closeAuthModal,
    login,
    register,
    quickLogin
  } = useAuth();

  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('citizen'); // 'citizen' | 'authority'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [district, setDistrict] = useState('East Khasi Hills');
  const [state, setState] = useState('Meghalaya');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authModalConfig) {
      setMode(authModalConfig.mode || 'login');
      setRole(authModalConfig.initialRole || 'citizen');
      setError('');
    }
  }, [authModalConfig]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          designation,
          district,
          state,
          phone
        });
      }

      if (authModalConfig.redirectAfterLogin) {
        navigate(authModalConfig.redirectAfterLogin);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (targetRole) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(targetRole);
      if (authModalConfig.redirectAfterLogin) {
        navigate(authModalConfig.redirectAfterLogin);
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-primary px-6 py-5 text-on-primary flex justify-between items-center relative">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[26px] text-secondary-fixed">
              lock
            </span>
            <div>
              <h2 className="text-title-lg font-bold text-white leading-tight">
                {mode === 'login' ? 'Sign In to NER-LEWS' : 'Create an Account'}
              </h2>
              <p className="text-xs text-on-primary-container text-white/80">
                Disaster Intelligence & Early Warning Portal
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Mode Switch Tabs */}
          <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30 rounded-lg text-xs flex items-center gap-2 animate-shake">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Login Box */}
          <div className="p-3.5 bg-surface-container rounded-xl border border-outline-variant flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
              Instant 1-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('authority')}
                disabled={loading}
                className="p-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-xs font-bold flex flex-col items-start transition-all border border-white/10 text-left shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed">shield_person</span>
                  <span>SDMA Officer</span>
                </div>
                <span className="text-[10px] text-white/70 font-normal truncate w-full">Full Admin Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                disabled={loading}
                className="p-2 bg-surface text-primary hover:bg-surface-container-high rounded-lg text-xs font-bold flex flex-col items-start transition-all border border-outline-variant text-left shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                  <span>Citizen User</span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-normal truncate w-full">Field Reporting</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-outline-variant w-full"></div>
            <span className="bg-surface-container-lowest px-3 text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider absolute">
              or enter credentials
            </span>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <>
                {/* Account Role Selector */}
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      onClick={() => setRole('citizen')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        role === 'citizen'
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      <span>Citizen</span>
                    </label>

                    <label
                      onClick={() => setRole('authority')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        role === 'authority'
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">shield_person</span>
                      <span>SDMA Officer</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tenzin Norbu or Rajesh Sangma"
                    className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                {/* Role Designation if authority */}
                {role === 'authority' && (
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">
                      Official Designation / Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. SDMA Field Commander / PWD Executive Engineer"
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                )}

                {/* District & State */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">
                      District
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:border-primary outline-none"
                    >
                      <option value="East Khasi Hills">East Khasi Hills</option>
                      <option value="West Khasi Hills">West Khasi Hills</option>
                      <option value="Ri-Bhoi">Ri-Bhoi</option>
                      <option value="Aizawl">Aizawl</option>
                      <option value="Tawang">Tawang</option>
                      <option value="Dima Hasao">Dima Hasao</option>
                      <option value="East Sikkim">East Sikkim</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:border-primary outline-none"
                    >
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Assam">Assam</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Tripura">Tripura</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.gov.in"
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 px-4 bg-primary text-on-primary hover:bg-primary-container font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">
                    {mode === 'login' ? 'login' : 'how_to_reg'}
                  </span>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
