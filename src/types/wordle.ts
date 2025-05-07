export type LetterEvaluationStatus = 'correct' | 'misplaced' | 'absent';
export type LetterInputStatus = 'empty' | 'typing' | 'evaluated';


export interface EvaluatedLetter {
  char: string;
  status: LetterEvaluationStatus;
}

export type KeyboardLetterStatus = LetterEvaluationStatus | 'default';

export type GameStatus = 'PLAYING' | 'WON' | 'LOST' | 'LOADING';
