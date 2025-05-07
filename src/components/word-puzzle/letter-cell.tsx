'use client';

import type { LetterEvaluationStatus, LetterInputStatus } from '@/types/wordle';
import { cn } from '@/lib/utils';

interface LetterCellProps {
  char?: string;
  evalStatus?: LetterEvaluationStatus;
  inputStatus: LetterInputStatus;
  revealDelay?: number; 
}

export default function LetterCell({ char, evalStatus, inputStatus, revealDelay = 0 }: LetterCellProps) {
  const getBgColor = () => {
    if (inputStatus === 'evaluated' && evalStatus) {
      switch (evalStatus) {
        case 'correct': return 'bg-feedback-correct-bg';
        case 'misplaced': return 'bg-feedback-misplaced-bg';
        case 'absent': return 'bg-feedback-absent-bg';
        default: return 'bg-feedback-empty-bg';
      }
    }
    return 'bg-feedback-empty-bg dark:bg-background'; // Or slightly different for typing
  };

  const getTextColor = () => {
    if (inputStatus === 'evaluated' && evalStatus) {
      switch (evalStatus) {
        case 'correct': return 'text-feedback-correct-fg';
        case 'misplaced': return 'text-feedback-misplaced-fg';
        case 'absent': return 'text-feedback-absent-fg';
        default: return 'text-feedback-empty-fg';
      }
    }
    return 'text-feedback-empty-fg dark:text-foreground';
  };
  
  const getBorderColor = () => {
    if (inputStatus === 'typing' && char) {
      return 'border-foreground/50';
    }
    if (inputStatus === 'evaluated') {
       switch (evalStatus) {
        case 'correct': return 'border-feedback-correct-bg';
        case 'misplaced': return 'border-feedback-misplaced-bg';
        case 'absent': return 'border-feedback-absent-bg';
        default: return 'border-border';
      }
    }
    return 'border-border';
  }

  const isRevealed = inputStatus === 'evaluated';

  return (
    <div
      className={cn(
        'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase select-none transition-all duration-300',
        getBgColor(),
        getTextColor(),
        getBorderColor(),
        isRevealed && 'animate-flip-reveal'
      )}
      style={{ animationDelay: isRevealed ? `${revealDelay}ms` : undefined }}
    >
      <div style={{ transform: isRevealed ? 'rotateX(0deg)' : 'rotateX(0deg)' }}> {/* Inner div for stable content during flip if needed */}
        {char}
      </div>
    </div>
  );
}
