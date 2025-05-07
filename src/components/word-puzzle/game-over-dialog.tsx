'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface GameOverDialogProps {
  isOpen: boolean;
  status: 'WON' | 'LOST';
  solution: string;
  onPlayAgain: () => void;
}

export default function GameOverDialog({ isOpen, status, solution, onPlayAgain }: GameOverDialogProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={() => { /* Controlled by parent */ }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            {status === 'WON' ? 'Congratulations!' : 'Game Over!'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">
            {status === 'WON'
              ? 'You guessed the word!'
              : `The word was: `}
            {status === 'LOST' && <strong className="uppercase text-accent">{solution}</strong>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction asChild>
            <Button onClick={onPlayAgain} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Play Again
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
