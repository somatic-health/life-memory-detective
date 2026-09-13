import React from 'react';

interface FooterProps {
  isHome: boolean;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer
      id="footer"
      className="w-full min-h-12 sm:min-h-14 py-2.5 sm:py-3 flex items-center justify-center text-stone-600 font-medium border-t border-[#e8dfd3] bg-white select-none z-10 px-2 sm:px-4 text-center box-border"
    >
      <span
        className="whitespace-nowrap tracking-tight sm:tracking-normal text-center"
        style={{ fontSize: 'clamp(0.7rem, 3.2vw, 0.95rem)' }}
      >
        臺南市樂齡學習數位示範體驗場域｜儲良均老師 設計開發
      </span>
    </footer>
  );
};
