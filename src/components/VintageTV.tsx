import React from 'react';

interface VintageTVProps {
  children: React.ReactNode;
  channelName?: string;
}

export const VintageTV: React.FC<VintageTVProps> = ({ children, channelName }) => {
  return (
    <div
      id="vintage-tv-cabinet"
      className="relative w-full max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center select-none shrink-0"
    >
      {/* ── Main Wooden Cabinet Frame - Squat Retro CRT TV Console ── */}
      <div
        className="relative w-full rounded-[28px] sm:rounded-[36px] md:rounded-[44px] px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 border-[7px] sm:border-[9px] md:border-[12px] border-[#5d4037] shadow-2xl"
        style={{
          backgroundColor: '#4a2c2a',
          boxShadow: 'inset 0 0 35px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)',
        }}
      >
        {/* Top Channel Bar - Compact Squat Header */}
        <div className="relative z-10 w-full flex items-center justify-between gap-1.5 px-2 sm:px-2.5 py-1 mb-1 border-b border-[#5d4037]/70 text-[#f0e6d2]">
          <div className="flex items-center gap-1.5 shrink min-w-0">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#e87a5d] shadow-[0_0_6px_#e87a5d] shrink-0" />
            <span className="font-bold tracking-wider text-[10px] sm:text-xs md:text-sm uppercase text-[#f0e6d2] truncate">
              <span className="hidden sm:inline">CRT CONSOLE • </span>RETRO
            </span>
          </div>
          {channelName && (
            <div
              id="tv-channel-badge"
              className="shrink-0 px-2 sm:px-2.5 py-0.5 rounded-md bg-[#2a1716] border border-[#5d4037] text-amber-200 shadow-inner flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap select-none"
            >
              {(() => {
                const parts = channelName.split('•');
                if (parts.length >= 2) {
                  const chPart = parts[0].trim();
                  const scenePart = parts.slice(1).join('•').trim();
                  return (
                    <>
                      <span className="font-mono font-bold text-[10px] sm:text-xs md:text-sm tracking-wide text-amber-300 shrink-0">
                        {chPart}
                      </span>
                      <span className="text-[8px] sm:text-[10px] md:text-xs text-amber-500/75 shrink-0">
                        •
                      </span>
                      <span className="font-bold text-[10px] sm:text-xs md:text-sm tracking-normal sm:tracking-wide text-amber-200 shrink-0">
                        {scenePart}
                      </span>
                    </>
                  );
                }
                return (
                  <span className="font-bold text-[10px] sm:text-xs md:text-sm tracking-wide text-amber-200">
                    {channelName}
                  </span>
                );
              })()}
            </div>
          )}
        </div>

        {/* Middle Section: CRT Screen Tube + Retro Knobs & Speaker Panel */}
        <div className="relative z-10 flex items-stretch gap-1.5 sm:gap-3 md:gap-4 my-1">
          
          {/* ── Left Retro Wooden Slat Accent (Medium to Large Screens) ── */}
          <div
            id="tv-left-door"
            className="hidden md:flex flex-col justify-between w-6 md:w-8 rounded-lg border border-[#3d2321] shadow-inner py-2 px-0.5 shrink-0"
            style={{ backgroundColor: '#3d2321' }}
            title="復古木質邊框飾條"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`left-slat-${i}`} className="w-full h-1 bg-[#2a1716] rounded-sm opacity-80" />
            ))}
            <div className="w-2 h-6 mx-auto bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 rounded-full border border-amber-900 shadow-sm my-1" />
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`left-slat-b-${i}`} className="w-full h-1 bg-[#2a1716] rounded-sm opacity-80" />
            ))}
          </div>

          {/* ── CRT Screen Bezel (Curved Chunky Television Frame) ── */}
          <div
            id="crt-bezel"
            className="relative flex-1 rounded-[22px] sm:rounded-[30px] md:rounded-[38px] p-1.5 sm:p-2.5 md:p-3 bg-[#181818] shadow-[inset_0_0_20px_#000] flex items-center justify-center overflow-hidden"
          >
            {/* CRT Screen Tube: Authentic 4:3 Curved Glass Aspect Ratio */}
            <div
              id="crt-screen-tube"
              className="relative w-full aspect-[4/3] rounded-[16px] sm:rounded-[22px] md:rounded-[28px] bg-[#222222] overflow-hidden shadow-[inset_0_0_28px_rgba(0,0,0,0.85)]"
            >
              {children}

              {/* Scanline overlay */}
              <div className="scanline absolute inset-0 pointer-events-none opacity-35 z-10" />

              {/* Subtle glass reflection highlight */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 12%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)',
                }}
              />
            </div>
          </div>

          {/* ── Retro Control Panel: Tactile Chunky Dials & Speaker ── */}
          <div
            id="tv-knobs-panel"
            className="w-13 sm:w-16 md:w-20 flex flex-col items-center justify-between py-1.5 px-1 rounded-xl sm:rounded-2xl bg-[#3a201e] border-2 border-[#5d4037] shadow-inner shrink-0"
          >
            {/* Knob 1 (Channel Dial) */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#f0e6d2] font-bold">
                CH
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-[#333333] border-3 border-[#222222] shadow-inner flex items-center justify-center cursor-default">
                <div className="w-1.5 h-3 sm:h-3.5 bg-[#e87a5d] rounded-full -translate-y-1 sm:-translate-y-1.5" />
              </div>
            </div>

            {/* Knob 2 (Volume Dial) */}
            <div className="flex flex-col items-center my-1">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#f0e6d2] font-bold">
                VOL
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#333333] border-3 border-[#222222] shadow-inner flex items-center justify-center cursor-default">
                <div className="w-1.5 h-2.5 sm:h-3 bg-amber-400 rounded-full -translate-y-1 sm:-translate-y-1.5" />
              </div>
            </div>

            {/* Speaker Grille Slats */}
            <div className="w-full flex-1 flex flex-col justify-center gap-1 py-1 px-1 bg-[#251211] rounded-lg border border-[#3d2321] min-h-[36px]">
              <div className="w-full h-1 bg-[#4a2c2a] rounded" />
              <div className="w-full h-1 bg-[#4a2c2a] rounded" />
              <div className="w-full h-1 bg-[#4a2c2a] rounded" />
              <div className="w-full h-1 bg-[#4a2c2a] rounded" />
            </div>

            {/* Power indicator */}
            <div className="mt-1 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-[#f0e6d2]/80 font-bold">
                ON
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="relative z-10 w-full flex items-center justify-between px-3 pt-1 border-t border-[#5d4037]/50 text-[10px] sm:text-xs text-[#f0e6d2]/70 font-mono">
          <span>GEOMETRIC BALANCE EDITION</span>
          <span>SOLID STATE RETRO TV</span>
        </div>
      </div>

      {/* Stout Wooden Legs */}
      <div className="w-[80%] flex justify-between px-6 pointer-events-none">
        <div className="w-6 sm:w-8 h-2.5 sm:h-3.5 bg-[#3d2321] rounded-b-md shadow-md transform -skew-x-6 border-b-2 border-[#251211]" />
        <div className="w-6 sm:w-8 h-2.5 sm:h-3.5 bg-[#3d2321] rounded-b-md shadow-md transform skew-x-6 border-b-2 border-[#251211]" />
      </div>
    </div>
  );
};
