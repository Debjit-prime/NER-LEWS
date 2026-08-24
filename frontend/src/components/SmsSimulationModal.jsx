import React, { useState } from 'react';

export default function SmsSimulationModal({ isOpen, onClose, zone, initialMessage, onSendSuccess }) {
  const [message, setMessage] = useState(
    initialMessage || `[NER-LEWS CRITICAL ALERT] Landslide warning in ${zone?.name || 'Sector'}. High rainfall & soil saturation detected. Road closure initiated on ${zone?.roadAffected || 'NH-6'}. Take caution.`
  );
  const [demoMode, setDemoMode] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentLog, setSentLog] = useState(null);

  if (!isOpen) return null;

  const recipients = [
    'District Field Officers (East Khasi Hills)',
    'State Disaster Management Authority (SDMA)',
    'PWD Highway Emergency Response Unit',
    'Local Village Council Headmen (+91 98620 XXXXX)'
  ];

  const handleSend = async () => {
    setIsSending(true);
    // Simulate real SMS dispatch delay
    setTimeout(() => {
      const log = {
        id: `SMS-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleTimeString(),
        zoneName: zone?.name || 'Regional Zone',
        recipientsCount: recipients.length,
        status: demoMode ? 'Delivered (Simulated Demo)' : 'Sent via Twilio Gateway',
        message
      };
      setSentLog(log);
      setIsSending(false);
      if (onSendSuccess) onSendSuccess(log);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">sms</span>
            <h3 className="text-headline-sm font-bold text-primary">Emergency SMS Dispatcher</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-lg overflow-y-auto flex-1 flex flex-col gap-md">
          {/* Demo Mode Banner */}
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl border border-secondary-fixed-dim flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">SMS Gateway Mode</p>
                <p className="text-body-sm font-semibold">{demoMode ? 'Demo Mode (Simulated SMS)' : 'Twilio Free Sandbox'}</p>
              </div>
            </div>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className="px-3 py-1 bg-surface-container-lowest text-primary rounded-lg text-xs font-bold border border-outline-variant hover:bg-surface-container transition-colors"
            >
              Toggle
            </button>
          </div>

          {/* Zone Details */}
          {zone && (
            <div className="text-xs bg-surface-container p-2.5 rounded-lg border border-outline-variant flex justify-between">
              <span><strong>Target Zone:</strong> {zone.name}</span>
              <span><strong>Severity:</strong> <span className="font-bold text-error">{zone.riskBand}</span></span>
            </div>
          )}

          {/* Recipient Groups */}
          <div>
            <label className="block text-label-bold font-bold text-on-surface mb-1 text-xs uppercase tracking-wider">
              Dispatched Recipient Broadcast List ({recipients.length})
            </label>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-2.5 flex flex-col gap-1 text-xs text-on-surface-variant font-mono">
              {recipients.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-[#22c55e]">check_circle</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Message Editor */}
          <div>
            <label className="block text-label-bold font-bold text-on-surface mb-1 text-xs uppercase tracking-wider">
              SMS Advisory Message Content
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-sans"
              placeholder="Enter emergency SMS warning message..."
            />
            <span className="text-[11px] text-on-surface-variant text-right block mt-1">
              {message.length} characters (1 SMS segment)
            </span>
          </div>

          {/* Sent Log Terminal Preview */}
          {sentLog && (
            <div className="bg-[#091426] text-[#22c55e] p-3 rounded-xl font-mono text-xs border border-outline-variant">
              <div className="flex items-center justify-between mb-1 border-b border-white/10 pb-1 text-white">
                <span className="font-bold">TELECOM LOG OUTPUT</span>
                <span>{sentLog.timestamp}</span>
              </div>
              <p>✔ Status: {sentLog.status}</p>
              <p>✔ Broadcast: {sentLog.recipientsCount} recipient endpoints alerted</p>
              <p>✔ Alert ID: {sentLog.id}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-md border-t border-outline-variant bg-surface-container-low flex justify-end gap-sm">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-on-surface border border-outline-variant rounded-lg text-body-sm font-bold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className={`px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-colors ${
              isSending ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSending ? 'hourglass_top' : 'send'}
            </span>
            <span>{isSending ? 'Transmitting SMS...' : 'Broadcast SMS Alert'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
