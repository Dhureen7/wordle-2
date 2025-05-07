'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import GuessGrid from './guess-grid';
import Keyboard from './keyboard';
import GameOverDialog from './game-over-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WORD_LENGTH, MAX_GUESSES } from '@/lib/constants';
import { getRandomWord } from '@/services/word-generator';
import { evaluateGuess, getInitialKeyboardStatuses, updateKeyboardStatuses } from '@/lib/wordle-utils';
import type { EvaluatedLetter, GameStatus, KeyboardLetterStatus } from '@/types/wordle';

export default function WordPuzzleGame() {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<EvaluatedLetter[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
  const [keyboardStatuses, setKeyboardStatuses] = useState<Record<string, KeyboardLetterStatus>>(getInitialKeyboardStatuses());
  const [gameStatus, setGameStatus] = useState<GameStatus>('LOADING');
  const [isShakingCurrentRow, setIsShakingCurrentRow] = useState<boolean>(false);
  const { toast } = useToast();
  const gameContainerRef = useRef<HTMLDivElement>(null);


  const initializeGame = useCallback(async () => {
    setGameStatus('LOADING');
    try {
      const newWord = await getRandomWord(WORD_LENGTH);
      setSolution(newWord.toLowerCase());
      setGuesses([]);
      setCurrentGuess('');
      setCurrentRowIndex(0);
      setKeyboardStatuses(getInitialKeyboardStatuses());
      setGameStatus('PLAYING');
    } catch (error) {
      console.error("Failed to fetch new word:", error);
      toast({ title: "Error", description: "Could not start a new game. Please try again.", variant: "destructive" });
      setGameStatus('LOADING'); // Stay in loading or an error state
    }
  }, [toast]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  useEffect(() => {
    // Focus the game container for keyboard input when the game is active
    if (gameStatus === 'PLAYING' && gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, [gameStatus]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'PLAYING') return;

    if (key === 'Enter') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      } else {
        toast({ title: "Not enough letters", variant: "destructive", duration: 2000 });
        setIsShakingCurrentRow(true);
        setTimeout(() => setIsShakingCurrentRow(false), 500);
      }
      return;
    }

    if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (currentGuess.length < WORD_LENGTH && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  }, [currentGuess, gameStatus, toast]);

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || !solution) return;

    // For now, we assume all words are valid.
    // TODO: Add dictionary check here if desired.
    // if (!isValidWord(currentGuess)) { 
    //   toast({ title: "Not a valid word", variant: "destructive", duration: 2000 });
    //   setIsShakingCurrentRow(true);
    //   setTimeout(() => setIsShakingCurrentRow(false), 500);
    //   return;
    // }

    const evaluated = evaluateGuess(currentGuess, solution);
    const newGuesses = [...guesses, evaluated];
    setGuesses(newGuesses);
    setKeyboardStatuses(updateKeyboardStatuses(keyboardStatuses, evaluated));

    if (currentGuess.toLowerCase() === solution.toLowerCase()) {
      setGameStatus('WON');
    } else if (newGuesses.length === MAX_GUESSES) {
      setGameStatus('LOST');
    } else {
      setCurrentRowIndex((prev) => prev + 1);
      setCurrentGuess('');
    }
  };


  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [handleKeyPress]);

  if (gameStatus === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="mt-4 text-lg text-foreground">Loading Word Puzzle...</p>
      </div>
    );
  }

  return (
    <div 
      ref={gameContainerRef}
      tabIndex={-1} // Make it focusable
      className="flex flex-col items-center p-4 outline-none max-w-md w-full mx-auto"
      aria-labelledby="game-title"
    >
      <header className="mb-6 text-center">
        <h1 id="game-title" className="text-4xl font-bold tracking-tight text-foreground">Word Puzzle</h1>
        <Button variant="outline" size="sm" onClick={initializeGame} className="mt-2">
          <RotateCcw className="mr-2 h-4 w-4" /> New Game
        </Button>
      </header>
      
      <GuessGrid 
        guesses={guesses} 
        currentGuess={currentGuess} 
        currentRowIndex={currentRowIndex}
        isShakingCurrentRow={isShakingCurrentRow}
      />
      
      <Keyboard 
        letterStatuses={keyboardStatuses} 
        onKeyPress={handleKeyPress} 
        disabled={gameStatus !== 'PLAYING'} 
      />
      
      <GameOverDialog
        isOpen={gameStatus === 'WON' || gameStatus === 'LOST'}
        status={gameStatus === 'WON' ? 'WON' : 'LOST'}
        solution={solution}
        onPlayAgain={initializeGame}
      />
    </div>
  );
}
