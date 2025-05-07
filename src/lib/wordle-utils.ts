import type { EvaluatedLetter, LetterEvaluationStatus, KeyboardLetterStatus } from '@/types/wordle';
import { WORD_LENGTH } from './constants';

export function evaluateGuess(guess: string, solution: string): EvaluatedLetter[] {
  const guessChars = guess.toLowerCase().split('');
  const solutionChars = solution.toLowerCase().split('');
  const result: EvaluatedLetter[] = [];

  if (guessChars.length !== WORD_LENGTH || solutionChars.length !== WORD_LENGTH) {
    throw new Error("Guess and solution must have the correct word length.");
  }

  const evaluation: LetterEvaluationStatus[] = Array(WORD_LENGTH).fill('absent');
  const solutionLetterCounts: Record<string, number> = {};

  for (const char of solutionChars) {
    solutionLetterCounts[char] = (solutionLetterCounts[char] || 0) + 1;
  }

  // First pass for 'correct' letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      evaluation[i] = 'correct';
      solutionLetterCounts[guessChars[i]]--;
    }
  }

  // Second pass for 'misplaced' letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (evaluation[i] !== 'correct' && solutionLetterCounts[guessChars[i]] > 0) {
      evaluation[i] = 'misplaced';
      solutionLetterCounts[guessChars[i]]--;
    }
  }
  
  for (let i = 0; i < WORD_LENGTH; i++) {
    result.push({ char: guessChars[i], status: evaluation[i] });
  }

  return result;
}

export function getInitialKeyboardStatuses(): Record<string, KeyboardLetterStatus> {
  const keys = "abcdefghijklmnopqrstuvwxyz".split('');
  const statuses: Record<string, KeyboardLetterStatus> = {};
  keys.forEach(key => statuses[key] = 'default');
  return statuses;
}

export function updateKeyboardStatuses(
  currentStatuses: Record<string, KeyboardLetterStatus>,
  evaluatedGuess: EvaluatedLetter[]
): Record<string, KeyboardLetterStatus> {
  const newStatuses = { ...currentStatuses };
  evaluatedGuess.forEach(({ char, status }) => {
    const lowerChar = char.toLowerCase();
    const currentStatus = newStatuses[lowerChar];
    // Update status if new status is "better" (correct > misplaced > absent)
    if (status === 'correct') {
      newStatuses[lowerChar] = 'correct';
    } else if (status === 'misplaced' && currentStatus !== 'correct') {
      newStatuses[lowerChar] = 'misplaced';
    } else if (status === 'absent' && currentStatus !== 'correct' && currentStatus !== 'misplaced') {
      newStatuses[lowerChar] = 'absent';
    }
  });
  return newStatuses;
}
