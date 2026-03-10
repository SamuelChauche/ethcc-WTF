import type { GameState, QuizOption, Speaker } from './types';
import { speakers } from './data';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const state: GameState = {
  current: 0,
  score: 0,
  answered: false,
  order: [],
  started: false,
};

export function resetState(): void {
  state.current = 0;
  state.score = 0;
  state.answered = false;
  state.started = true;
  state.order = shuffle(speakers.map((_, i) => i));
}

export function getCurrentSpeaker(): Speaker {
  return speakers[state.order[state.current]];
}

export function generateOptions(): QuizOption[] {
  const person = getCurrentSpeaker();
  const sameGender = speakers.filter(
    (s) => s.gender === person.gender && s.name !== person.name,
  );
  const decoyName = sameGender[Math.floor(Math.random() * sameGender.length)].name;

  const pair: [QuizOption, QuizOption] = [
    { label: person.name, correct: true },
    { label: decoyName, correct: false },
  ];

  return Math.random() < 0.5 ? pair : [pair[1], pair[0]];
}

export function totalSpeakers(): number {
  return state.order.length;
}

export function preloadImages(): void {
  speakers.slice(0, 6).forEach((s) => {
    if (s.photo) {
      const img = new Image();
      img.src = s.photo;
    }
  });
}
