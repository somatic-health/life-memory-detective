import React from 'react';

interface ColorBarTransitionProps {
  isVisible: boolean;
}

export const ColorBarTransition: React.FC<ColorBarTransitionProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  // SMPTE standard color sequence: White, Yellow, Cyan, Green, Magenta, Red, Blue
  const topBars = [
    '#c0c0c0', // 75% white / light gray
    '#c0c000', // yellow
    '#00c0c0', // cyan
    '#00c000', // green
    '#c000c0', // magenta
    '#c00000', // red
    '#0000c0', // blue
  ];

  const middleBars = [
    '#0000c0', // blue
    '#131313', // black
    '#c000c0', // magenta
    '#131313', // black
    '#00c0c0', // cyan
    '#131313', // black
    '#c0c0c0', // gray
  ];

  const bottomBlocks = [
    { color: '#00214c', width: '16.66%' }, // dark blue
    { color: '#ffffff', width: '16.66%' }, // white
    { color: '#32006a', width: '16.66%' }, // dark purple
    { color: '#131313', width: '25%' },    // dark gray
    { color: '#090909', width: '8.33%' },  // true black
    { color: '#1a1a1a', width: '16.69%' }, // dark black
  ];

  return (
    <div 
      id="vintage-color-bars" 
      className="absolute inset-0 z-30 flex flex-col w-full h-full overflow-hidden select-none pointer-events-none"
      aria-label="復古彩色電視測試訊號"
    >
      {/* Top 67% standard color bars */}
      <div className="flex w-full h-[67%]">
        {topBars.map((color, idx) => (
          <div key={`top-${idx}`} className="flex-1 h-full" style={{ backgroundColor: color }} />
        ))}
      </div>

      {/* Middle 8% split bars */}
      <div className="flex w-full h-[8%]">
        {middleBars.map((color, idx) => (
          <div key={`mid-${idx}`} className="flex-1 h-full" style={{ backgroundColor: color }} />
        ))}
      </div>

      {/* Bottom 25% calibration blocks */}
      <div className="flex w-full h-[25%]">
        {bottomBlocks.map((block, idx) => (
          <div 
            key={`bot-${idx}`} 
            className="h-full" 
            style={{ backgroundColor: block.color, width: block.width }} 
          />
        ))}
      </div>

      {/* Subtle CRT scanline overlay (gentle, no harsh flickering) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 2px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Vintage test tone station label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/80 text-amber-200 text-sm md:text-base font-mono tracking-widest rounded border border-amber-500/40 shadow-md">
        TEST PATTERN 1982
      </div>
    </div>
  );
};
