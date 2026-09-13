import React, { useState, useEffect, useRef, useId } from 'react';
import { Question, AnswerHotspot, Difficulty, GameStats } from '../types';
import { VintageTV } from './VintageTV';
import { ColorBarTransition } from './ColorBarTransition';
import { QuestionImagePlaceholder } from './QuestionImagePlaceholder';
import { sound } from '../utils/audio';
import { Timer, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface GamePlayViewProps {
  difficulty: Difficulty;
  questions: Question[];
  onFinishGame: (stats: GameStats) => void;
  onGoHome: () => void;
}

export const GamePlayView: React.FC<GamePlayViewProps> = ({
  difficulty,
  questions,
  onFinishGame,
  onGoHome,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQuestion = questions[currentIdx] || questions[0];

  // Sub-phases: 'memorizing' | 'transition' | 'answering' | 'completed_question'
  const [phase, setPhase] = useState<'memorizing' | 'transition' | 'answering' | 'completed_question'>('memorizing');
  
  // Countdown timer for memorization
  const [timeLeft, setTimeLeft] = useState<number>(currentQuestion ? currentQuestion.memoryDuration : 12);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Answering tracking
  const [foundAnswerIds, setFoundAnswerIds] = useState<string[]>([]);
  const [missCount, setMissCount] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'neutral' | 'success' | 'partial' | 'miss'>('neutral');

  // Stats
  const [totalFoundAnswers, setTotalFoundAnswers] = useState<number>(0);

  // Clean up all timers on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Initialize or reset when moving to next question
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (currentQuestion) {
      setTimeLeft(currentQuestion.memoryDuration);
    }
    setFoundAnswerIds([]);
    setMissCount(0);
    setFeedbackMessage('');
    setFeedbackType('neutral');
    setPhase('memorizing');
  }, [currentIdx, currentQuestion]);

  // Countdown timer logic
  useEffect(() => {
    if (phase !== 'memorizing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleMemoryTimeUp();
          return 0;
        }
        // Play soft tick when 3 seconds or less remaining
        if (prev <= 4) {
          sound.playCountdownTick(prev === 2);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentQuestion]);

  // Trigger color bar transition (0.8s ~ 1.2s)
  const handleMemoryTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('transition');
    sound.playTVStatic();

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      setPhase('answering');
      setFeedbackMessage('剛剛哪裡不一樣？請直接點擊畫面的變化處。');
      setFeedbackType('neutral');
      transitionTimerRef.current = null;
    }, 1000); // 1.0 second transition exactly in range 0.8 ~ 1.2s
  };

  // User manual skip memorization button ("我記住了")
  const handleSkipMemorize = () => {
    sound.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    handleMemoryTimeUp();
  };

  // Click on valid hotspot
  const handleSelectHotspot = (answer: AnswerHotspot) => {
    if (foundAnswerIds.includes(answer.id)) return;

    const newFound = [...foundAnswerIds, answer.id];
    setFoundAnswerIds(newFound);
    setTotalFoundAnswers((prev) => prev + 1);

    const isAllFound = newFound.length >= currentQuestion.changeCount;

    if (isAllFound) {
      sound.playSuccess();
      setFeedbackMessage('答對了！你觀察得很仔細。');
      setFeedbackType('success');
      setPhase('completed_question');

      // Auto advance to next question after 1.8s, or let player click next
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      autoAdvanceTimerRef.current = setTimeout(() => {
        advanceNextQuestion(newFound.length);
      }, 1800);
    } else {
      // Hard mode: 1st found
      sound.playSuccess();
      setFeedbackMessage('很好，還有 1 個地方不一樣。');
      setFeedbackType('partial');
    }
  };

  // Miss click anywhere else on image
  const handleMissClick = (_x: number, _y: number) => {
    if (phase !== 'answering') return;
    sound.playMiss();
    setMissCount((prev) => prev + 1);
    setFeedbackMessage('差一點，再仔細看看。');
    setFeedbackType('miss');
  };

  // Advance to next question or results
  const advanceNextQuestion = (lastQFoundCount: number) => {
    // Crucial: clear any pending auto-advance timer immediately to prevent duplicate advancement
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => Math.min(prev + 1, questions.length - 1));
    } else {
      // Game completed! Calculate stats
      const totalChangesInSession = questions.reduce((sum, q) => sum + q.changeCount, 0);
      // Ensure we include the last found count in the total calculation
      const finalFoundCount = totalFoundAnswers + (lastQFoundCount > foundAnswerIds.length ? (lastQFoundCount - foundAnswerIds.length) : 0);
      
      onFinishGame({
        difficulty,
        totalQuestions: questions.length,
        completedQuestions: questions.length,
        totalChanges: totalChangesInSession,
        foundChanges: finalFoundCount,
      });
    }
  };

  const difficultyNames: Record<Difficulty, string> = {
    easy: '簡單',
    normal: '普通',
    hard: '困難',
  };

  return (
    <div
      id="gameplay-view"
      className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-start gap-2.5 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 select-none box-border"
    >
      {/* Top Status & Instructions Bar - Geometric Balance Theme */}
      <div
        id="game-top-bar"
        className="w-full max-w-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white border-2 border-[#8c6a5a] shadow-sm text-[#4a2c2a] shrink-0 box-border"
      >
        {/* Row 1 (Mobile) / Left Column (Desktop): Progress info */}
        <div id="game-status" className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <span
              id="level-tag"
              className="px-2.5 sm:px-3 py-1 rounded-xl bg-[#f0e6d2] text-[#4a2c2a] border border-[#d6c7a7] text-xs sm:text-sm font-bold uppercase tracking-wider shrink-0"
            >
              {difficultyNames[difficulty]}
            </span>
            <span id="q-count" className="text-lg sm:text-xl md:text-2xl font-black text-[#4a2c2a] tracking-wide whitespace-nowrap">
              題目 {currentIdx + 1} / {questions.length}
            </span>
          </div>
          <span className="text-sm sm:text-base md:text-lg text-[#666] font-medium whitespace-nowrap">
            • {currentQuestion.scene}
          </span>
        </div>

        {/* Row 2 (Mobile) / Right Column (Desktop): Phase Status or Action */}
        <div id="game-phase-action" className="flex items-center justify-end w-full sm:w-auto shrink-0">
          {phase === 'memorizing' && (
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div
                id="timer-box"
                className="w-full sm:w-auto bg-[#4a2c2a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-base sm:text-lg font-mono flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm whitespace-nowrap box-border"
              >
                <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-[#e87a5d] shrink-0" />
                <span id="timer-label" className="opacity-80 text-xs sm:text-sm">記憶中...</span>
                <span id="timer-val" className="font-black text-lg sm:text-xl text-[#f3d3a1] tabular-nums inline-block min-w-[20px] text-right">
                  {timeLeft}
                </span>
                <span className="text-xs sm:text-sm">s</span>
              </div>
              <button
                id="btn-skip-memorize"
                onClick={handleSkipMemorize}
                className="btn-shadow-coral px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#e87a5d] hover:bg-[#d96b4f] text-white font-bold text-sm sm:text-base border border-[#d0674b] whitespace-nowrap cursor-pointer shrink-0 box-border"
              >
                我記住了
              </button>
            </div>
          )}

          {phase === 'transition' && (
            <div className="w-full sm:w-auto bg-[#4a2c2a] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold text-sm sm:text-base text-center shadow-sm whitespace-nowrap">
              訊號切換中...
            </div>
          )}

          {phase === 'answering' && (
            <div className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#f0e6d2] border border-[#d6c7a7] text-[#4a2c2a] font-bold text-sm sm:text-base text-center whitespace-nowrap">
              <span>
                請找出不同處（{foundAnswerIds.length} / {currentQuestion.changeCount}）
              </span>
            </div>
          )}

          {phase === 'completed_question' && (
            <button
              id="btn-next-question"
              onClick={() => advanceNextQuestion(foundAnswerIds.length)}
              className="btn-shadow-green flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-[#5da349] hover:bg-[#4f903e] text-white font-bold text-base sm:text-lg border border-[#4d8c3c] cursor-pointer whitespace-nowrap"
            >
              <span>下一題</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Vintage TV Container */}
      <div className="w-full flex-1 flex items-center justify-center min-h-0 px-1 sm:px-2 my-auto">
        <VintageTV channelName={`CH 0${currentIdx + 1} • ${currentQuestion.scene}`}>
          {/* CRT Content Frame */}
          <div className="relative w-full h-full">
            {/* Color Bar Transition Overlay */}
            <ColorBarTransition isVisible={phase === 'transition'} />

            {/* Question Display Area */}
            <QuestionImagePlaceholder
              question={currentQuestion}
              mode={phase === 'memorizing' ? 'before' : 'after'}
              isAnswering={phase === 'answering'}
              foundAnswerIds={foundAnswerIds}
              showHint={difficulty === 'easy' && missCount >= 1}
              onSelectHotspot={handleSelectHotspot}
              onMissClick={handleMissClick}
            />
          </div>
        </VintageTV>
      </div>

      {/* Bottom Interactive Prompt & Feedback Notification Box */}
      <div
        id="game-feedback-box"
        className="w-full max-w-3xl shrink-0 min-h-[48px] sm:min-h-[56px] flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 transition-colors duration-200 shadow-sm bg-white box-border"
        style={{
          borderColor:
            feedbackType === 'success'
              ? '#22c55e'
              : feedbackType === 'partial'
              ? '#5d8ce8'
              : feedbackType === 'miss'
              ? '#e87a5d'
              : '#8c6a5a',
        }}
      >
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center w-full min-w-0">
          {phase === 'memorizing' && (
            <p
              className="font-bold text-[#4a2c2a] tracking-normal sm:tracking-wide whitespace-nowrap text-center"
              style={{ fontSize: 'clamp(0.78rem, 3.2vw, 1.2rem)' }}
            >
              請仔細記住電視畫面中的物品與位置
            </p>
          )}

          {phase === 'transition' && (
            <p
              className="font-bold text-[#4a2c2a] font-mono tracking-normal sm:tracking-wide whitespace-nowrap text-center"
              style={{ fontSize: 'clamp(0.78rem, 3.2vw, 1.2rem)' }}
            >
              電視訊號切換中，請保持專注...
            </p>
          )}

          {phase === 'answering' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 w-full min-w-0">
              <p
                id="feedback-text"
                className={`font-black whitespace-nowrap text-center tracking-normal sm:tracking-wide ${
                  feedbackType === 'miss'
                    ? 'text-[#e87a5d]'
                    : feedbackType === 'partial'
                    ? 'text-[#5d8ce8]'
                    : 'text-[#4a2c2a]'
                }`}
                style={{ fontSize: 'clamp(0.74rem, 3.1vw, 1.15rem)' }}
              >
                {feedbackMessage || '剛剛哪裡不一樣？請直接點擊畫面的變化處。'}
              </p>
            </div>
          )}

          {phase === 'completed_question' && (
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#22c55e] shrink-0" />
              <p
                className="font-black text-[#22c55e] whitespace-nowrap"
                style={{ fontSize: 'clamp(0.85rem, 3.4vw, 1.25rem)' }}
              >
                答對了！你觀察得很仔細。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
