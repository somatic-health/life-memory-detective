export type Difficulty = 'easy' | 'normal' | 'hard';

export interface AnswerHotspot {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface Question {
  id: string;
  difficulty: Difficulty;
  scene: string;
  beforeImage: string;
  afterImage: string;
  memoryDuration: number; // in seconds: easy=12, normal=8, hard=6
  changeCount: number; // easy=1, normal=1, hard=2
  answers: AnswerHotspot[];
  changeDescription: string;
}

export type GamePhase = 
  | 'home'
  | 'tutorial'
  | 'memorizing'
  | 'transition'
  | 'answering'
  | 'feedback'
  | 'result';

export interface GameStats {
  difficulty: Difficulty;
  totalQuestions: number;
  completedQuestions: number;
  totalChanges: number;
  foundChanges: number;
}
