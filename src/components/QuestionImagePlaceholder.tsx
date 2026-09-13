import React, { useState, useEffect, useRef } from 'react';
import { Question, AnswerHotspot } from '../types';

interface QuestionImagePlaceholderProps {
  question: Question;
  mode: 'before' | 'after';
  isAnswering: boolean;
  foundAnswerIds: string[];
  showHint: boolean;
  onSelectHotspot: (answer: AnswerHotspot) => void;
  onMissClick: (clickX: number, clickY: number) => void;
}

export const QuestionImagePlaceholder: React.FC<QuestionImagePlaceholderProps> = ({
  question,
  mode,
  isAnswering,
  foundAnswerIds,
  showHint,
  onSelectHotspot,
  onMissClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageContentFrame, setImageContentFrame] = useState({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  });
  const imageSrc = mode === 'before' ? question.beforeImage : question.afterImage;

  // The image uses object-contain. Keep hit testing and markers aligned to the
  // actual rendered image content, including any contain letterboxing.
  const getImageContentRect = () => {
    const container = containerRef.current;
    const image = imageRef.current;
    const containerRect = container?.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();

    if (!containerRect || !imageRect || !image?.naturalWidth || !image.naturalHeight) {
      return containerRect || null;
    }

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const boxRatio = imageRect.width / imageRect.height;
    let contentWidth = imageRect.width;
    let contentHeight = imageRect.height;

    if (imageRatio > boxRatio) {
      contentHeight = imageRect.width / imageRatio;
    } else {
      contentWidth = imageRect.height * imageRatio;
    }

    return {
      left: imageRect.left + (imageRect.width - contentWidth) / 2,
      top: imageRect.top + (imageRect.height - contentHeight) / 2,
      width: contentWidth,
      height: contentHeight,
    };
  };

  const updateImageContentFrame = () => {
    const container = containerRef.current;
    const contentRect = getImageContentRect();
    if (!container || !contentRect || contentRect.width <= 0 || contentRect.height <= 0) return;

    const containerRect = container.getBoundingClientRect();
    setImageContentFrame({
      left: ((contentRect.left - containerRect.left) / containerRect.width) * 100,
      top: ((contentRect.top - containerRect.top) / containerRect.height) * 100,
      width: (contentRect.width / containerRect.width) * 100,
      height: (contentRect.height / containerRect.height) * 100,
    });
  };

  // Reset img error on question change or mode change
  useEffect(() => {
    setImgError(false);
    setImageContentFrame({ left: 0, top: 0, width: 100, height: 100 });
    updateImageContentFrame();
    window.addEventListener('resize', updateImageContentFrame);

    return () => {
      window.removeEventListener('resize', updateImageContentFrame);
    };
  }, [question.id, mode]);

  // Code label as requested: E01 BEFORE, E01 AFTER, N01 BEFORE, etc.
  const prefix = question.difficulty === 'easy' ? 'E' : question.difficulty === 'normal' ? 'N' : 'H';
  const numStr = question.id.split('_')[1] || '01';
  const codeLabel = `${prefix}${numStr} ${mode.toUpperCase()}`;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnswering) return;
    const rect = getImageContentRect() || e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked inside any unfound answer
    const hit = question.answers.find((ans) => {
      if (foundAnswerIds.includes(ans.id)) return false;
      return (
        clickX >= ans.x &&
        clickX <= ans.x + ans.width &&
        clickY >= ans.y &&
        clickY <= ans.y + ans.height
      );
    });

    if (hit) {
      onSelectHotspot(hit);
    } else {
      onMissClick(clickX, clickY);
    }
  };

  return (
    <div
      id="question-display-area"
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full h-full select-none flex items-center justify-center overflow-hidden bg-[#242b35] cursor-default"
      style={{ touchAction: 'manipulation' }}
    >
      {/* 1. Real Image if present */}
      {!imgError ? (
        <img
          ref={imageRef}
          src={imageSrc}
          alt={`${question.scene} ${mode}`}
          onError={() => setImgError(true)}
          onLoad={updateImageContentFrame}
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : null}

      {/* 2. Schematic Placeholder when image file not yet present */}
      {imgError && (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-[#1f2732] text-amber-50">
          {/* Subtle grid background to simulate blueprint / test chart */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Top Info Bar */}
          <div className="relative z-10 w-full flex items-center justify-between border-b border-amber-200/20 pb-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold tracking-wider text-lg md:text-xl rounded border border-amber-500/30">
                {codeLabel}
              </span>
              <span className="text-xl md:text-2xl font-bold tracking-wide text-amber-100">
                {question.scene}
              </span>
            </div>
            <div className="text-sm md:text-base font-medium px-3 py-1 bg-white/10 rounded-full text-stone-300">
              {mode === 'before' ? '記憶階段：改變前' : '觀察階段：改變後'}
            </div>
          </div>

          {/* Scene Center Stage Layout with schematic visual blocks for items */}
          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-2">
            {/* Stage schematic surface */}
            <div className="relative w-[90%] h-[82%] border-2 border-dashed border-amber-400/30 rounded-xl bg-[#161d27]/70 flex items-center justify-center p-4">
              
              {/* Context items (schematic fixed objects in the room/table) */}
              <div className="absolute top-[15%] left-[10%] px-4 py-2 rounded-lg bg-stone-700/60 border border-stone-600 text-stone-300 text-base md:text-lg font-medium">
                場景固定陳設 A
              </div>
              <div className="absolute bottom-[15%] left-[12%] px-4 py-2 rounded-lg bg-stone-700/60 border border-stone-600 text-stone-300 text-base md:text-lg font-medium">
                場景固定陳設 B
              </div>
              <div className="absolute top-[18%] right-[12%] px-4 py-2 rounded-lg bg-stone-700/60 border border-stone-600 text-stone-300 text-base md:text-lg font-medium">
                背景裝飾品
              </div>

              {/* Dynamic representations based on answers and mode */}
              {question.answers.map((ans, idx) => {
                const isFound = foundAnswerIds.includes(ans.id);
                const isSecondAnswer = idx === 1;

                // In BEFORE mode, show original state
                // In AFTER mode, show changed state or missing state
                let itemStatusText = '';
                if (mode === 'before') {
                  if (ans.label.includes('消失')) {
                    itemStatusText = ans.label.replace('消失', '（在原位）');
                  } else if (ans.label.includes('換成')) {
                    const original = ans.label.split('換成')[0];
                    itemStatusText = `${original}（原物件）`;
                  } else if (ans.label.includes('移動')) {
                    itemStatusText = `${ans.label.replace('移動', '')}（原位置）`;
                  } else {
                    itemStatusText = ans.label;
                  }
                } else {
                  // After mode
                  if (ans.label.includes('消失')) {
                    itemStatusText = '【此處已空】';
                  } else if (ans.label.includes('換成')) {
                    const changed = ans.label.split('換成')[1];
                    itemStatusText = `【新：${changed}】`;
                  } else if (ans.label.includes('移動')) {
                    itemStatusText = `【${ans.label}】`;
                  } else {
                    itemStatusText = `【變化：${ans.label}】`;
                  }
                }

                return (
                  <div
                    key={ans.id}
                    style={{
                      left: `${ans.x}%`,
                      top: `${ans.y}%`,
                      width: `${ans.width}%`,
                      height: `${ans.height}%`,
                    }}
                    className={`absolute flex flex-col items-center justify-center text-center p-1 rounded-lg transition-all duration-300 pointer-events-none select-none ${
                      mode === 'before'
                        ? 'bg-amber-700/70 border-2 border-amber-300 text-white shadow-md'
                        : isFound
                        ? 'bg-emerald-600/80 border-2 border-emerald-300 text-white shadow-lg scale-105'
                        : 'bg-amber-950/60 border-2 border-amber-500/70 text-amber-200'
                    }`}
                  >
                    <span className="text-xs md:text-sm font-semibold opacity-80">
                      {isSecondAnswer ? '變化處 2' : '變化處 1'}
                    </span>
                    <span className="text-sm md:text-base font-bold leading-tight line-clamp-2">
                      {itemStatusText}
                    </span>
                  </div>
                );
              })}

              <div className="text-stone-400 text-base md:text-lg font-medium text-center pointer-events-none">
                【{question.scene} 示意模擬圖】
                <div className="text-sm text-stone-400/80 mt-1">
                  正式題目圖片置入後將自動套用
                </div>
              </div>
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="relative z-10 w-full flex items-center justify-center text-xs md:text-sm text-stone-400">
            {mode === 'before'
              ? '請記住畫面中各物件的擺放與狀態'
              : isAnswering
              ? '請直接點擊上方有發生變化的位置'
              : '觀察中...'}
          </div>
        </div>
      )}

      {/* 3. Correct-answer markers only appear after a real hit. */}
      {mode === 'after' && foundAnswerIds.length > 0 && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            left: `${imageContentFrame.left}%`,
            top: `${imageContentFrame.top}%`,
            width: `${imageContentFrame.width}%`,
            height: `${imageContentFrame.height}%`,
          }}
          aria-hidden="true"
        >
          {question.answers.map((ans) => {
            if (!foundAnswerIds.includes(ans.id)) return null;

            return (
              <div
                key={`answer-marker-${ans.id}`}
                id={`answer-marker-${ans.id}`}
                aria-label={`已找出：${ans.label}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${ans.x + ans.width / 2}%`,
                  top: `${ans.y + ans.height / 2}%`,
                  width: `${Math.max(6, ans.width * 0.9)}%`,
                  height: `${Math.max(8, ans.height * 0.9)}%`,
                  transform: 'translate(-50%, -50%)',
                  border: '3px solid #dc2626',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  boxSizing: 'border-box',
                  zIndex: 20,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
