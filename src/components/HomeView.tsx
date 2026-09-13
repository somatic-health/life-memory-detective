import React from 'react';
import { Difficulty } from '../types';
import { sound } from '../utils/audio';
import { Sparkles, Eye, Brain } from 'lucide-react';

interface HomeViewProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onOpenTutorial: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectDifficulty, onOpenTutorial }) => {
  const handleDifficultyClick = (diff: Difficulty) => {
    sound.playClick();
    onSelectDifficulty(diff);
  };

  return (
    <div
      id="home-view"
      className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-10 text-center select-none"
    >
      {/* Decorative Tag */}
      <div className="relative mb-5 max-w-full">
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#f0e6d2] border border-[#d6c7a7] text-[#4a2c2a] font-bold text-sm sm:text-base md:text-lg shadow-sm whitespace-nowrap max-w-full">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#e87a5d] shrink-0" />
          <span className="whitespace-nowrap">樂齡生活觀察與記憶挑戰</span>
        </div>
      </div>

      {/* Main Title & Subtitle - Guaranteed Single Line */}
      <h1
        id="game-main-title"
        className="font-black tracking-wide text-[#4a2c2a] mb-3 whitespace-nowrap select-none max-w-full"
        style={{ fontSize: 'clamp(2.1rem, 8.5vw, 4.25rem)', lineHeight: 1.2 }}
      >
        生活記憶偵探
      </h1>
      
      <p
        id="game-subtitle"
        className="font-bold text-[#4a2c2a]/80 tracking-wide mb-8 whitespace-nowrap select-none max-w-full"
        style={{ fontSize: 'clamp(1.15rem, 4.5vw, 2.25rem)', lineHeight: 1.3 }}
      >
        仔細看看，剛剛哪裡不一樣？
      </p>

      {/* Three Large Difficulty Buttons - Geometric Balance Style */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mb-8">
        {/* 1. 簡單 (Easy) */}
        <button
          id="btn-difficulty-easy"
          onClick={() => handleDifficultyClick('easy')}
          className="btn-shadow-coral flex-1 min-h-[96px] sm:h-36 bg-[#e87a5d] text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-4 sm:p-5 border-2 border-[#d0674b] cursor-pointer"
        >
          <span className="text-3xl sm:text-4xl font-black tracking-wide whitespace-nowrap">簡單</span>
          <span className="text-base sm:text-lg font-medium opacity-95 whitespace-nowrap">慢慢看，找出 1 個變化</span>
          <span className="text-xs sm:text-sm font-bold bg-white/20 px-3 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
            4 題 • 12 秒
          </span>
        </button>

        {/* 2. 普通 (Normal) */}
        <button
          id="btn-difficulty-normal"
          onClick={() => handleDifficultyClick('normal')}
          className="btn-shadow-blue flex-1 min-h-[96px] sm:h-36 bg-[#5d8ce8] text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-4 sm:p-5 border-2 border-[#4a77ce] cursor-pointer"
        >
          <span className="text-3xl sm:text-4xl font-black tracking-wide whitespace-nowrap">普通</span>
          <span className="text-base sm:text-lg font-medium opacity-95 whitespace-nowrap">記住畫面，找出 1 個變化</span>
          <span className="text-xs sm:text-sm font-bold bg-white/20 px-3 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
            4 題 • 8 秒
          </span>
        </button>

        {/* 3. 困難 (Hard) */}
        <button
          id="btn-difficulty-hard"
          onClick={() => handleDifficultyClick('hard')}
          className="btn-shadow-green flex-1 min-h-[96px] sm:h-36 bg-[#5da349] text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-4 sm:p-5 border-2 border-[#4d8c3c] cursor-pointer"
        >
          <span className="text-3xl sm:text-4xl font-black tracking-wide whitespace-nowrap">困難</span>
          <span className="text-base sm:text-lg font-medium opacity-95 whitespace-nowrap">記住更多，找出 2 個變化</span>
          <span className="text-xs sm:text-sm font-bold bg-white/20 px-3 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
            4 題 • 6 秒
          </span>
        </button>
      </div>

      {/* Brief Description */}
      <div
        id="game-brief-desc"
        className="w-full max-w-xl mx-auto text-stone-600 font-medium text-center leading-relaxed mb-6 whitespace-nowrap px-2 box-border"
        style={{ fontSize: 'clamp(0.8rem, 4.05vw, 1.5rem)' }}
      >
        看看、記住、找變化，挑戰你的生活觀察力。
      </div>

      {/* Bottom Auxiliary Action: Tutorial guide */}
      <button
        id="btn-home-how-to-play"
        onClick={() => {
          sound.playClick();
          onOpenTutorial();
        }}
        className="btn-shadow max-w-full px-5 sm:px-7 py-3 sm:py-3.5 min-h-[52px] rounded-2xl bg-white hover:bg-[#faf4ec] text-[#4a2c2a] border-2 border-[#8c6a5a] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
      >
        <Sparkles className="w-5 h-5 text-[#e87a5d] shrink-0" />
        <span className="text-base sm:text-lg md:text-xl whitespace-nowrap">第一次玩？先看新手說明</span>
      </button>
    </div>
  );
};
