import React from 'react';
import { GameStats, Difficulty } from '../types';
import { sound } from '../utils/audio';
import { RotateCcw, ListFilter, Home, Award, CheckCircle } from 'lucide-react';

interface ResultViewProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onSelectDifficulty: () => void;
  onGoHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  stats,
  onPlayAgain,
  onSelectDifficulty,
  onGoHome,
}) => {
  const diffLabels: Record<Difficulty, string> = {
    easy: '簡單',
    normal: '普通',
    hard: '困難',
  };

  const accuracyPercent =
    stats.totalChanges > 0
      ? Math.round((stats.foundChanges / stats.totalChanges) * 100)
      : 100;

  // Senior-friendly positive encouraging feedback, strictly non-medical
  const getEncouragingMessage = () => {
    if (accuracyPercent >= 80) {
      return '觀察得很仔細！每一處生活小細節都難不倒你！';
    } else if (accuracyPercent >= 50) {
      return '觀察得很仔細！日常生活裡的變化都被你掌握了。';
    } else {
      return '再挑戰一次，看看能不能發現更多細節！';
    }
  };

  return (
    <div
      id="view-result"
      className="w-full max-w-xl mx-auto flex-1 flex flex-col items-center justify-center px-4 py-8 select-none text-center"
    >
      <h2
        id="result-title"
        className="text-5xl sm:text-6xl font-black text-[#4a2c2a] tracking-wider mb-6"
      >
        挑戰結束
      </h2>

      {/* Stats Card - Geometric Balance Style */}
      <div
        id="result-stats-card"
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full flex flex-col gap-5 text-center border-4 border-[#4a2c2a]"
      >
        <div className="text-xl sm:text-2xl font-bold text-[#4a2c2a] border-b-2 border-[#f0e6d2] pb-4" id="result-level">
          難度：{diffLabels[stats.difficulty]}
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-b-2 border-[#f0e6d2]">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-[#fdfaf5] border border-[#d6c7a7]">
            <span className="text-base sm:text-lg text-[#666] font-medium">完成題數</span>
            <span className="text-2xl sm:text-3xl font-black text-[#4a2c2a] mt-1">
              {stats.completedQuestions} 題
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-[#fdfaf5] border border-[#d6c7a7]">
            <span className="text-base sm:text-lg text-[#666] font-medium">正確率</span>
            <span className="text-2xl sm:text-3xl font-black text-[#5da349] mt-1">
              {accuracyPercent}%
            </span>
          </div>
        </div>

        <div className="text-xl sm:text-2xl text-[#4a2c2a] font-bold">
          答對變化：
          <span id="result-score" className="font-black text-3xl sm:text-4xl text-[#4a2c2a] ml-1">
            {stats.foundChanges}
          </span>{' '}
          / {stats.totalChanges}
        </div>

        {/* Encouraging copy in theme coral */}
        <div className="text-2xl sm:text-3xl font-black text-[#e87a5d] mt-2" id="result-msg">
          {getEncouragingMessage()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center w-full">
        {/* Play Again */}
        <button
          id="btn-retry"
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="btn-shadow bg-[#4a2c2a] hover:bg-[#3d2321] text-white px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>再玩一次</span>
        </button>

        {/* Change Difficulty */}
        <button
          id="btn-change-difficulty"
          onClick={() => {
            sound.playClick();
            onSelectDifficulty();
          }}
          className="btn-shadow bg-white hover:bg-[#faf4ec] text-[#4a2c2a] border-4 border-[#8c6a5a] px-6 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
        >
          <ListFilter className="w-5 h-5 text-[#5d8ce8]" />
          <span>選擇難度</span>
        </button>

        {/* Return to Home */}
        <button
          id="btn-result-home"
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="btn-shadow bg-white hover:bg-[#faf4ec] border-4 border-[#4a2c2a] text-[#4a2c2a] px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-5 h-5 text-[#e87a5d]" />
          <span>回首頁</span>
        </button>
      </div>
    </div>
  );
};
