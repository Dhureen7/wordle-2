'use client';

import LetterCell from './letter-cell';
import type { EvaluatedLetter, LetterInputStatus } from '@/types/wordle';
import { WORD_LENGTH, MAX_GUESSES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GuessGridProps {
  guesses: EvaluatedLetter[][];
  currentGuess: string;
  currentRowIndex: number;
  isShakingCurrentRow: boolean;
}

export default function GuessGrid({ guesses, currentGuess, currentRowIndex, isShakingCurrentRow }: GuessGridProps) {
  const rows = Array(MAX_GUESSES).fill(null);

  return (
    <div className="grid grid-rows-6 gap-1.5 mb-6">
      {rows.map((_, rowIndex) => {
        const isCurrentActiveRow = rowIndex === currentRowIndex;
        const evaluatedGuess = guesses[rowIndex];
        
        return (
          <div 
            key={rowIndex} 
            className={cn(
              "grid grid-cols-5 gap-1.5",
              isCurrentActiveRow && isShakingCurrentRow && "animate-shake-row"
            )}
          >
            {Array(WORD_LENGTH).fill(null).map((_, colIndex) => {
              let char: string | undefined = undefined;
              let evalStatus = undefined;
              let inputStatus: LetterInputStatus = 'empty';
              let revealDelay = colIndex * 100;

              if (evaluatedGuess) { // Past guess
                char = evaluatedGuess[colIndex]?.char;
                evalStatus = evaluatedGuess[colIndex]?.status;
                inputStatus = 'evaluated';
              } else if (isCurrentActiveRow) { // Current active guess row
                char = currentGuess[colIndex];
                inputStatus = char ? 'typing' : 'empty';
                revealDelay = 0; // No reveal delay for typing row
              }
              // Otherwise, it's an empty future row, default values apply

              return (
                <LetterCell
                  key={colIndex}
                  char={char}
                  evalStatus={evalStatus}
                  inputStatus={inputStatus}
                  revealDelay={revealDelay}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
