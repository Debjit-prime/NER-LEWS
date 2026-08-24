import React, { useState } from 'react';
import { speechService } from '../utils/speech';
import { getTranslation } from '../utils/i18n';

export default function AvatarGuide({ 
  currentLang = 'en', 
  activeAlertMessage = "High risk detected in East Khasi Hills. Heavy rainfall anticipated. Evacuation protocols recommended for vulnerable areas.",
  customTitle,
  customSubtitle
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = getTranslation(currentLang);

  const handleToggleVoice = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = `${t.home.greetingTitle} ${t.home.greetingSubtitle}. ${activeAlertMessage}`;
    
    setIsPlaying(true);
    speechService.speak(textToSpeak, {
      lang: currentLang,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: (err) => {
        console.warn('Voice playback error:', err);
        setIsPlaying(false);
      }
    });
  };

  return (
    <section className="flex flex-col md:flex-row items-center gap-lg bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm relative overflow-hidden">
      {/* Decorative subtle backdrop highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl -z-0 pointer-events-none"></div>

      {/* Avatar Image Container */}
      <div className="relative w-32 h-32 md:w-44 md:h-44 shrink-0 rounded-full overflow-hidden border-4 border-surface-container-high bg-surface-container-low flex items-center justify-center shadow-md">
        <img
          alt="NER-LEWS Humanoid AI Assistant Guide"
          className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'hover:scale-105'}`}
          src="/avatar.png"
          onError={(e) => {
            // Fallback to stylized emergency icon if local image path fails
            e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
          }}
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-6 bg-white rounded-full animate-bounce"></span>
              <span className="w-1.5 h-10 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-8 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1.5 h-4 bg-white rounded-full animate-bounce [animation-delay:0.45s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Speech Bubble Card */}
      <div className="flex-1 text-center md:text-left bg-surface-container p-md md:p-lg rounded-xl relative z-10 w-full">
        {/* Speech Bubble Arrow */}
        <div className="hidden md:block absolute -left-sm top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-surface-container border-b-[8px] border-b-transparent"></div>
        <div className="md:hidden absolute -top-sm left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-surface-container border-r-[8px] border-r-transparent"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-md">
          <div>
            <h1 className="text-headline-sm md:text-headline-md font-bold text-on-surface mb-xs">
              {customTitle || t.home.greetingTitle}
            </h1>
            <p className="text-body-lg text-on-surface-variant font-normal">
              {customSubtitle || t.home.greetingSubtitle}
            </p>
          </div>

          {/* Web Speech API Trigger Button */}
          <button
            onClick={handleToggleVoice}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-bold text-body-sm transition-all min-h-[44px] shadow-sm ${
              isPlaying
                ? 'bg-error text-white animate-pulse'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
            title="Read advisory aloud using Browser Text-to-Speech"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isPlaying ? 'volume_off' : 'volume_up'}
            </span>
            <span>{isPlaying ? t.home.playingAudio : t.home.listenAudio}</span>
          </button>
        </div>

        {/* Multilingual Voice Badge */}
        <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-primary">record_voice_over</span>
          <span>Web Speech API Active: <strong className="uppercase">{currentLang}</strong> audio synthesis</span>
        </div>
      </div>
    </section>
  );
}
