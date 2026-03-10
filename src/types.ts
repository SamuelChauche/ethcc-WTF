export interface Speaker {
  name: string;
  gender: 'm' | 'f';
  project: string;
  role: string;
  sector: string;
  photo: string;
}

export interface QuizOption {
  label: string;
  correct: boolean;
}

export interface GameState {
  current: number;
  score: number;
  answered: boolean;
  order: number[];
  started: boolean;
}
