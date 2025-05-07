'use client';

import { Button } from '@/components/ui/button';
import type { KeyboardLetterStatus } from '@/types/wordle';
import { cn } from '@/lib/utils';
import { Delete, CornerDownLeft } from 'lucide-react';

interface KeyboardProps {
  letterStatuses: Record<string, KeyboardLetterStatus>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

export default function Keyboard({ letterStatuses, onKeyPress, disabled = false }: KeyboardProps) {
  const getKeyStyle = (key: string): string => {
    const status = letterStatuses[key.toLowerCase()];
    switch (status) {
      case 'correct':
        return 'bg-feedback-correct-bg text-feedback-correct-fg hover:bg-feedback-correct-bg/90';
      case 'misplaced':
        return 'bg-feedback-misplaced-bg text-feedback-misplaced-fg hover:bg-feedback-misplaced-bg/90';
      case 'absent':
        return 'bg-feedback-absent-bg text-feedback-absent-fg hover:bg-feedback-absent-bg/90';
      default:
        return 'bg-key-default-bg text-key-default-fg hover:bg-key-default-bg/80';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-1 sm:space-x-1.5">
          {row.map((key) => {
            const isSpecialKey = key === 'Enter' || key === 'Backspace';
            const keyContent = key === 'Backspace' ? <Delete size={20} /> : key === 'Enter' ? <CornerDownLeft size={20} /> : key;
            
            return (
              <Button
                key={key}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
                className={cn(
                  'h-12 sm:h-14 font-bold uppercase rounded-md text-xs sm:text-sm transition-colors duration-200',
                  isSpecialKey ? 'px-3 sm:px-4 flex-grow' : 'w-8 sm:w-10 md:w-12',
                  !isSpecialKey && getKeyStyle(key)
                )}
                variant={isSpecialKey ? "secondary" : "default"}
                aria-label={key}
              >
                {keyContent}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
