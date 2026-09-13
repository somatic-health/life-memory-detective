import React, { useState, useEffect } from 'react';
import { Difficulty, Question, GameStats } from './types';
import { QUESTIONS_DATA } from './data/questions';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { GamePlayView } from './components/GamePlayView';
import { ResultView } from './components/ResultView';
import { TutorialModal } from './components/TutorialModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'game' | 'result'>('home');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isInitialTutorial, setIsInitialTutorial] = useState<boolean>(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);

  // Check if player has seen tutorial before
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(() => {
    try {
      return localStorage.getItem('detective_has_seen_tutorial') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMute = () => {
    const newMuted = sound.toggleMute();
    setIsMuted(newMuted);
  };

  // Fisher-Yates shuffle array
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Start a game session with 4 questions of chosen difficulty
  const startSession = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    const pool = QUESTIONS_DATA.filter((q) => q.difficulty === diff);
    // Shuffle the 4 questions for replayability
    const sessionQuestions = shuffleArray(pool);
    setCurrentQuestions(sessionQuestions);
    setCurrentView('game');
  };

  // Handle user clicking difficulty on Home
  const handleSelectDifficulty = (diff: Difficulty) => {
    if (!hasSeenTutorial) {
      // First-time play tutorial prompt
      setPendingDifficulty(diff);
      setIsInitialTutorial(true);
      setIsTutorialOpen(true);
    } else {
      startSession(diff);
    }
  };

  // When tutorial modal confirms "開始挑戰"
  const handleTutorialConfirmStart = () => {
    setIsTutorialOpen(false);
    try {
      localStorage.setItem('detective_has_seen_tutorial', 'true');
    } catch {
      // ignore
    }
    setHasSeenTutorial(true);

    if (pendingDifficulty) {
      startSession(pendingDifficulty);
      setPendingDifficulty(null);
    } else if (currentView === 'home') {
      startSession(selectedDifficulty);
    }
  };

  // When game completes all 4 questions
  const handleFinishGame = (stats: GameStats) => {
    setGameStats(stats);
    setCurrentView('result');
  };

  // Action: Play Again (same difficulty)
  const handlePlayAgain = () => {
    startSession(selectedDifficulty);
  };

  // Action: Select another difficulty
  const handleSelectOtherDifficulty = () => {
    setCurrentView('home');
  };

  // Action: Go to home
  const handleGoHome = () => {
    setCurrentView('home');
  };

  return (
    <div
      id="app-root"
      className="min-h-screen flex flex-col justify-between bg-[#fdfaf5] text-[#333333] font-sans antialiased selection:bg-[#e87a5d] selection:text-white overflow-x-hidden"
    >
      {/* Background subtle geometric tint */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 10%, rgba(232, 122, 93, 0.06) 0%, rgba(253, 250, 245, 0.9) 75%)',
        }}
      />

      {/* App Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenTutorial={() => {
          setIsInitialTutorial(false);
          setIsTutorialOpen(true);
        }}
        onGoHome={handleGoHome}
        isInGame={currentView === 'game'}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-start px-2 sm:px-4 py-1 sm:py-2">
        {currentView === 'home' && (
          <HomeView
            onSelectDifficulty={handleSelectDifficulty}
            onOpenTutorial={() => {
              setIsInitialTutorial(false);
              setIsTutorialOpen(true);
            }}
          />
        )}

        {currentView === 'game' && currentQuestions.length > 0 && (
          <GamePlayView
            difficulty={selectedDifficulty}
            questions={currentQuestions}
            onFinishGame={handleFinishGame}
            onGoHome={handleGoHome}
          />
        )}

        {currentView === 'result' && gameStats && (
          <ResultView
            stats={gameStats}
            onPlayAgain={handlePlayAgain}
            onSelectDifficulty={handleSelectOtherDifficulty}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Brand Footer */}
      <Footer isHome={currentView === 'home'} />

      {/* First-time / Help Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onStartGame={handleTutorialConfirmStart}
        isInitialPrompt={isInitialTutorial}
      />
    </div>
  );
}
