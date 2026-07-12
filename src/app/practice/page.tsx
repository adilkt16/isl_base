'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignMediaPlaceholder from '@/components/SignMediaPlaceholder';
import { ALPHABET_SIGNS, NUMBER_SIGNS, Sign, ALL_SIGNS } from '@/data/signs';
import { getStoredProgress, ProgressState } from '@/utils/localStorage';
import { Layers, ArrowRight, RotateCcw, Check, X, Keyboard, ArrowLeft } from 'lucide-react';

type PracticeSession = {
  deck: Sign[];
  currentIndex: number;
  isFlipped: boolean;
  results: { [key: string]: boolean }; // signId -> isCorrect
};

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'mixed';

  // State
  const [category, setCategory] = useState<string>(initialCategory);
  const [deckSize, setDeckSize] = useState<number>(10);
  const [isLobby, setIsLobby] = useState(true);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Stats from localStorage
  const [progress, setProgress] = useState<ProgressState | null>(null);
  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  // Initialize deck
  const startSession = () => {
    let sourcePool: Sign[] = [];
    if (category === 'alphabet') {
      sourcePool = [...ALPHABET_SIGNS];
    } else if (category === 'number') {
      sourcePool = [...NUMBER_SIGNS];
    } else {
      sourcePool = [...ALL_SIGNS];
    }

    // Shuffle array
    const shuffled = sourcePool.sort(() => 0.5 - Math.random());
    // Slice size
    const finalSize = deckSize === -1 ? shuffled.length : Math.min(deckSize, shuffled.length);
    const selectedDeck = shuffled.slice(0, finalSize);

    setSession({
      deck: selectedDeck,
      currentIndex: 0,
      isFlipped: false,
      results: {},
    });
    setIsLobby(false);
  };

  // Grade card
  const gradeCard = useCallback((isCorrect: boolean) => {
    if (!session) return;
    
    const currentSign = session.deck[session.currentIndex];
    const nextResults = { ...session.results, [currentSign.id]: isCorrect };

    if (session.currentIndex < session.deck.length - 1) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        isFlipped: false,
        results: nextResults,
      });
    } else {
      // Finished
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        isFlipped: false,
        results: nextResults,
      });
    }
  }, [session]);

  const flipCard = useCallback(() => {
    if (!session) return;
    setSession((prev) => prev ? { ...prev, isFlipped: !prev.isFlipped } : null);
  }, [session]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLobby || !session) return;
      // If we finished the session, don't trigger normal practice shortcuts
      const isFinished = session.currentIndex >= session.deck.length;
      if (isFinished) return;

      if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
      } else if (session.isFlipped) {
        if (e.code === 'ArrowLeft' || e.code === 'Digit1') {
          e.preventDefault();
          gradeCard(false);
        } else if (e.code === 'ArrowRight' || e.code === 'Digit2') {
          e.preventDefault();
          gradeCard(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLobby, session, flipCard, gradeCard]);

  // Render Lobby
  if (isLobby) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 mb-4">
              <Layers className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1e1e1f] sm:text-4xl">
              Practice Mode
            </h1>
            <p className="mt-2 text-sm text-[#5d5a55] max-w-md mx-auto">
              Test your memory with customizable flashcards. View the front, visualize the hand shape, and flip to review.
            </p>
          </div>

          <div className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#1e1e1f] mb-4">Configure Session</h3>

            {/* Category Select */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'alphabet', label: 'Alphabet' },
                  { id: 'number', label: 'Numbers' },
                  { id: 'mixed', label: 'Mixed' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                    className={`rounded-lg border py-3 text-xs font-semibold cursor-pointer transition-all ${
                      category === item.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-brand-50 bg-white text-[#5d5a55] hover:border-brand-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deck Size Select */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
                Session Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 10, label: '10 Cards' },
                  { value: 20, label: '20 Cards' },
                  { value: -1, label: 'Full Deck' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setDeckSize(item.value)}
                    className={`rounded-lg border py-3 text-xs font-semibold cursor-pointer transition-all ${
                      deckSize === item.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-brand-50 bg-white text-[#5d5a55] hover:border-brand-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.99] cursor-pointer"
            >
              <span>Begin Session</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Active Session
  const { deck, currentIndex, isFlipped, results } = session!;
  const isFinished = currentIndex >= deck.length;

  if (isFinished) {
    const total = deck.length;
    const correct = Object.values(results).filter(Boolean).length;
    const scorePercent = Math.round((correct / total) * 100);

    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-12 sm:px-6">
          <div className="text-center rounded-xl border border-brand-100 bg-white p-8 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Practice Complete
            </span>
            
            {/* Score Ring */}
            <div className="mx-auto my-6 flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-brand-500 bg-brand-50">
              <span className="text-3xl font-extrabold text-brand-700">{scorePercent}%</span>
              <span className="text-[9px] uppercase font-bold text-[#86827a] mt-0.5">{correct}/{total} Correct</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#1e1e1f]">
              {scorePercent >= 80 ? 'Fantastic Memory!' : scorePercent >= 50 ? 'Good Progress!' : 'Keep Practicing'}
            </h2>
            <p className="mt-2 text-xs text-[#5d5a55] max-w-sm mx-auto">
              Reviewing the mechanical instructions for signs you missed is the fastest way to commit them to memory.
            </p>

            {/* List breakdown */}
            <div className="mt-8 border-t border-brand-50 pt-6 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-850 mb-3">
                Card Breakdown
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {deck.map((sign) => {
                  const passed = results[sign.id];
                  return (
                    <div
                      key={sign.id}
                      className="flex items-center justify-between rounded-lg border border-brand-50 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-brand-800 text-sm">{sign.label}</span>
                        <span className="text-[9px] text-[#86827a] uppercase">({sign.category})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passed ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <Check className="h-3 w-3" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                            <X className="h-3 w-3" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setIsLobby(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-brand-200 px-4 py-2.5 text-xs font-semibold text-[#1e1e1f] hover:bg-brand-50 transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Configure New</span>
              </button>
              <button
                onClick={startSession}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition-all cursor-pointer"
              >
                <span>Practice Again</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentSign = deck[currentIndex];

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs text-[#86827a] mb-6">
          <button
            onClick={() => setIsLobby(true)}
            className="flex items-center gap-1 text-[#5d5a55] hover:text-[#1e1e1f] font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quit</span>
          </button>
          <div className="font-semibold">
            Card {currentIndex + 1} of {deck.length}
          </div>
          <button
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className="flex items-center gap-1 text-xs font-semibold text-[#86827a] hover:text-[#1e1e1f]"
          >
            <Keyboard className="h-4 w-4" />
            <span>Keys</span>
          </button>
        </div>

        {showKeyboardHelp && (
          <div className="mb-4 rounded-lg bg-brand-50 border border-brand-100 p-3 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
              Keyboard Shortcuts
            </h4>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#5d5a55]">
              <div><kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">Space</kbd> Flip card</div>
              <div><kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">1</kbd> / <kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">←</kbd> Incorrect</div>
              <div><kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">2</kbd> / <kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">→</kbd> Correct</div>
            </div>
          </div>
        )}

        {/* Flashcard container */}
        <div 
          onClick={flipCard}
          className="relative min-h-[300px] w-full cursor-pointer rounded-xl border border-brand-100 bg-white p-8 text-center shadow-sm select-none flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          {!isFlipped ? (
            // Card Front
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#86827a] mb-6">
                Fingerspelling Prompt
              </span>
              <div className="font-serif text-8xl font-black text-brand-500 animate-in zoom-in-95 duration-200">
                {currentSign.label}
              </div>
              <p className="mt-6 text-xs text-[#86827a]">
                Visualize the hand gesture, then click or press Space to flip.
              </p>
            </div>
          ) : (
            // Card Back
            <div className="flex flex-col flex-1 justify-between text-left animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between border-b border-brand-50 pb-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                    Sign Details
                  </span>
                  <span className="font-serif text-lg font-bold text-brand-700">
                    {currentSign.label}
                  </span>
                </div>
                
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                  Description
                </h4>
                <p className="mt-1 text-xs text-[#1e1e1f] font-medium leading-relaxed">
                  {currentSign.description}
                </p>

                {currentSign.usageNote && (
                  <div className="mt-3 bg-brand-50/50 rounded p-2.5 border border-brand-50">
                    <span className="block text-[9px] font-bold uppercase text-brand-700">Usage Note</span>
                    <p className="text-[10px] text-[#5d5a55] leading-relaxed mt-0.5">{currentSign.usageNote}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <SignMediaPlaceholder label={currentSign.label} category={currentSign.category} />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6">
          {!isFlipped ? (
            <button
              onClick={flipCard}
              className="w-full flex items-center justify-center rounded-xl border border-brand-200 bg-white py-3 text-sm font-semibold text-[#1e1e1f] hover:bg-brand-50 transition-all cursor-pointer"
            >
              Flip Card
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => gradeCard(false)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/40 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>Incorrect (1)</span>
              </button>
              <button
                onClick={() => gradeCard(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/40 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Correct (2)</span>
              </button>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] text-brand-600 font-serif">
        <span className="text-lg font-bold animate-pulse">Loading Practice Session...</span>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
