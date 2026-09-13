import React from 'react';
import { sound } from '../utils/audio';
import { CheckCircle2, Tv, Sparkles, Hand } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame?: () => void;
  isInitialPrompt?: boolean;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  isInitialPrompt = false,
}) => {
  if (!isOpen) return null;

  const handleStart = () => {
    sound.playClick();
    if (onStartGame) {
      onStartGame();
    } else {
      onClose();
    }
  };

  return (
    <div
      id="tutorial-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm select-none px-4 flex justify-center box-border"
      style={{
        minHeight: '100dvh',
        paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
        paddingBottom: 'max(24px, calc(24px + env(safe-area-inset-bottom, 0px)))',
      }}
      onClick={onClose}
    >
      <div
        id="tutorial-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg my-auto rounded-3xl bg-white border-4 border-[#4a2c2a] shadow-2xl p-5 sm:p-8 text-[#4a2c2a] box-border"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
          <Tv className="w-7 h-7 sm:w-8 sm:h-8 text-[#e87a5d] shrink-0" />
          <h2 className="text-2xl sm:text-4xl font-black text-[#4a2c2a] tracking-wider whitespace-nowrap">
            遊戲三步驟
          </h2>
        </div>

        {/* 3 Short Core Steps */}
        <div className="flex flex-col gap-2.5 sm:gap-4 mb-5 sm:mb-8">
          {/* Step 1 */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#fdfaf5] border border-[#d6c7a7]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#e87a5d] text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-sm shrink-0">
              1
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#4a2c2a] leading-snug">
              先記住電視裡的畫面。
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#fdfaf5] border border-[#d6c7a7]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#5d8ce8] text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-sm shrink-0">
              2
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#4a2c2a] leading-snug">
              彩色測試條出現後，畫面會有變化。
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#fdfaf5] border border-[#d6c7a7]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#5da349] text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-sm shrink-0">
              3
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#4a2c2a] leading-snug">
              找出不同的地方，直接點一下。
            </div>
          </div>
        </div>

        {/* Large Senior-Friendly Button in normal document flow - centered with balanced margins */}
        <div className="w-full flex justify-center mt-2 px-1 box-border">
          <button
            id="btn-tutorial-start"
            onClick={handleStart}
            className="btn-shadow w-full max-w-sm sm:max-w-md min-h-[52px] sm:min-h-[60px] py-3 sm:py-3.5 px-3 sm:px-6 rounded-2xl bg-[#4a2c2a] hover:bg-[#3d2321] text-white font-black transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer mx-auto box-border"
          >
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#22c55e] shrink-0" />
            <span
              className="whitespace-nowrap text-center"
              style={{ fontSize: 'clamp(1rem, 4.2vw, 1.5rem)' }}
            >
              {isInitialPrompt ? '開始挑戰' : '我知道了，開始挑戰'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
