import WordPuzzleGame from '@/components/word-puzzle/word-puzzle-game';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 bg-background">
      <WordPuzzleGame />
    </main>
  );
}
