import React from 'react';
import { Volume2, VolumeX, HelpCircle, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTutorial: () => void;
  onGoHome?: () => void;
  isInGame?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenTutorial,
  onGoHome,
  isInGame = false,
}) => {
  return (
    <header
      id="app-header"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-center z-20 shrink-0"
    >
      {/* Centered Controls Group */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap w-full max-w-2xl mx-auto">
        {/* If in game, show Back to Home button */}
        {isInGame && onGoHome && (
          <button
            id="btn-return-home"
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="btn-shadow flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] rounded-2xl bg-white hover:bg-[#faf4ec] text-[#4a2c2a] border-2 border-[#4a2c2a] font-bold text-sm sm:text-base md:text-lg transition-all shrink-0 cursor-pointer"
            aria-label="返回首頁"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#e87a5d] shrink-0" />
            <span className="whitespace-nowrap">回首頁</span>
          </button>
        )}

        {/* Sound toggle button */}
        <button
          id="btn-sound-toggle"
          onClick={() => {
            onToggleMute();
            sound.playClick();
          }}
          className={`btn-shadow flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] rounded-2xl border-2 font-bold text-sm sm:text-base md:text-lg transition-all shrink-0 cursor-pointer ${
            isMuted
              ? 'bg-[#f0ebe1] text-stone-500 border-stone-400'
              : 'bg-white text-[#4a2c2a] border-[#8c6a5a] hover:bg-[#faf4ec]'
          }`}
          aria-label={isMuted ? '開啟音效' : '關閉音效'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 shrink-0" />
              <span className="whitespace-nowrap">音效：關</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#e87a5d] shrink-0" />
              <span className="whitespace-nowrap">音效：開</span>
            </>
          )}
        </button>

        {/* Instructions button */}
        <button
          id="btn-open-rules"
          onClick={() => {
            sound.playClick();
            onOpenTutorial();
          }}
          className="btn-shadow flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] rounded-2xl bg-white hover:bg-[#faf4ec] text-[#4a2c2a] border-2 border-[#8c6a5a] font-bold text-sm sm:text-base md:text-lg transition-all shrink-0 cursor-pointer"
          aria-label="查看玩法說明"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#5d8ce8] shrink-0" />
          <span className="whitespace-nowrap">玩法說明</span>
        </button>
      </div>
    </header>
  );
};
