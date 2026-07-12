'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ALPHABET_SIGNS, NUMBER_SIGNS, Sign, ALL_SIGNS } from '@/data/signs';
import { saveQuizScore } from '@/utils/localStorage';
import { CheckCircle2, ArrowRight, RotateCcw, Check, X, Keyboard, HelpCircle } from 'lucide-react';

type QuestionType = 'desc-to-label' | 'label-to-desc';

type Question = {
  type: QuestionType;
  sign: Sign;
  choices: string[]; // Options (labels or descriptions depending on type)
  correctChoice: string;
};

type QuizSession = {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  score: number;
  history: { question: Question; selected: string; passed: boolean }[];
};

function QuizContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'mixed';

  // Lobby state
  const [category, setCategory] = useState<string>(initialCategory);
  const [isLobby, setIsLobby] = useState(true);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Start the quiz
  const startQuiz = () => {
    let sourcePool: Sign[] = [];
    if (category === 'alphabet') {
      sourcePool = [...ALPHABET_SIGNS];
    } else if (category === 'number') {
      sourcePool = [...NUMBER_SIGNS];
    } else {
      sourcePool = [...ALL_SIGNS];
    }

    // Shuffle pool
    const shuffledPool = sourcePool.sort(() => 0.5 - Math.random());
    const quizSize = Math.min(10, shuffledPool.length);
    const selectedSigns = shuffledPool.slice(0, quizSize);

    // Generate 10 questions
    const generatedQuestions: Question[] = selectedSigns.map((sign, idx) => {
      // Alternate question type
      const type: QuestionType = idx % 2 === 0 ? 'desc-to-label' : 'label-to-desc';
      
      // Get choices pool
      const distractorsPool = sourcePool.filter((s) => s.id !== sign.id);
      const shuffledDistractors = distractorsPool.sort(() => 0.5 - Math.random());
      
      const correctChoice = type === 'desc-to-label' ? sign.label : sign.description;
      const distractorChoices = shuffledDistractors.slice(0, 3).map((s) => 
        type === 'desc-to-label' ? s.label : s.description
      );

      // Sift options and shuffle
      const choices = [correctChoice, ...distractorChoices].sort(() => 0.5 - Math.random());

      return {
        type,
        sign,
        choices,
        correctChoice,
      };
    });

    setSession({
      questions: generatedQuestions,
      currentIndex: 0,
      selectedAnswer: null,
      isSubmitted: false,
      score: 0,
      history: [],
    });
    setIsLobby(false);
  };

  const handleSelectAnswer = (choice: string) => {
    if (!session || session.isSubmitted) return;
    setSession({
      ...session,
      selectedAnswer: choice,
    });
  };

  const handleSubmitAnswer = useCallback(() => {
    if (!session || !session.selectedAnswer || session.isSubmitted) return;

    const currentQuestion = session.questions[session.currentIndex];
    const isCorrect = session.selectedAnswer === currentQuestion.correctChoice;
    const nextScore = isCorrect ? session.score + 1 : session.score;

    setSession({
      ...session,
      isSubmitted: true,
      score: nextScore,
      history: [
        ...session.history,
        {
          question: currentQuestion,
          selected: session.selectedAnswer,
          passed: isCorrect,
        },
      ],
    });
  }, [session]);

  const handleNextQuestion = useCallback(() => {
    if (!session || !session.isSubmitted) return;

    const isLastQuestion = session.currentIndex === session.questions.length - 1;
    if (isLastQuestion) {
      // Save result to localStorage
      saveQuizScore(category, session.score, session.questions.length);
    }

    setSession({
      ...session,
      currentIndex: session.currentIndex + 1,
      selectedAnswer: null,
      isSubmitted: false,
    });
  }, [session, category]);

  // Keyboard shortcut controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLobby || !session) return;
      const isFinished = session.currentIndex >= session.questions.length;
      if (isFinished) return;

      const currentQuestion = session.questions[session.currentIndex];

      if (!session.isSubmitted) {
        // Selection keys 1, 2, 3, 4
        if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
          const index = parseInt(e.code.replace('Digit', '')) - 1;
          if (index < currentQuestion.choices.length) {
            e.preventDefault();
            handleSelectAnswer(currentQuestion.choices[index]);
          }
        } else if (e.code === 'Enter' || e.code === 'Space') {
          if (session.selectedAnswer) {
            e.preventDefault();
            handleSubmitAnswer();
          }
        }
      } else {
        // Next key
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLobby, session, handleSubmitAnswer, handleNextQuestion]);

  // Render Lobby view
  if (isLobby) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 mb-4">
              <CheckCircle2 className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1e1e1f] sm:text-4xl">
              Knowledge Check
            </h1>
            <p className="mt-2 text-sm text-[#5d5a55] max-w-md mx-auto">
              Ready to test your Indian Sign Language skills? Complete a 10-question multiple-choice quiz to record your progress.
            </p>
          </div>

          <div className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#1e1e1f] mb-4">Select Quiz Subject</h3>

            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-700 mb-2.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'alphabet', label: 'Alphabet' },
                  { id: 'number', label: 'Numbers' },
                  { id: 'mixed', label: 'Mixed Tracks' },
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

            <button
              onClick={startQuiz}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.99] cursor-pointer"
            >
              <span>Begin Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Active Quiz View
  const { questions, currentIndex, selectedAnswer, isSubmitted, score, history } = session!;
  const isFinished = currentIndex >= questions.length;

  if (isFinished) {
    const total = questions.length;
    const scorePercent = Math.round((score / total) * 100);

    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-12 sm:px-6">
          <div className="text-center rounded-xl border border-brand-100 bg-white p-8 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Quiz Completed
            </span>

            {/* Score Ring */}
            <div className="mx-auto my-6 flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-brand-500 bg-brand-50">
              <span className="text-3xl font-extrabold text-brand-700">{scorePercent}%</span>
              <span className="text-[9px] uppercase font-bold text-[#86827a] mt-0.5">{score}/{total} Passed</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#1e1e1f]">
              {scorePercent >= 80 ? 'Excellent Marks!' : scorePercent >= 50 ? 'Passed!' : 'Needs Revision'}
            </h2>
            <p className="mt-2 text-xs text-[#5d5a55] max-w-sm mx-auto">
              Your results have been logged locally to your progress dashboard. You can review your detailed answers below.
            </p>

            {/* Score History Details */}
            <div className="mt-8 border-t border-brand-50 pt-6 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-850 mb-3">
                Questions Review
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                {history.map((record, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 text-xs leading-relaxed ${
                      record.passed
                        ? 'border-emerald-100 bg-emerald-50/20'
                        : 'border-rose-100 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-semibold">
                      <span className="text-[#86827a]">Question {index + 1}</span>
                      {record.passed ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-0.5">
                          <X className="h-3 w-3" /> Incorrect
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-[#1e1e1f]">
                      {record.question.type === 'desc-to-label'
                        ? `Which sign matches this description: "${record.question.sign.description}"`
                        : `What is the description for the sign "${record.question.sign.label}"?`}
                    </p>
                    <div className="mt-2 text-[11px] text-[#5d5a55] space-y-0.5">
                      <div>Your Answer: <strong className="text-[#1e1e1f]">{record.selected}</strong></div>
                      {!record.passed && (
                        <div>Correct Answer: <strong className="text-emerald-700">{record.question.correctChoice}</strong></div>
                      )}
                    </div>
                  </div>
                ))}
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
                onClick={startQuiz}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition-all cursor-pointer"
              >
                <span>Quiz Again</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6">
        
        {/* Progress header */}
        <div className="flex items-center justify-between text-xs text-[#86827a] mb-6">
          <button
            onClick={() => setIsLobby(true)}
            className="font-semibold text-[#5d5a55] hover:text-[#1e1e1f]"
          >
            Quit Quiz
          </button>
          <div className="font-semibold">
            Question {currentIndex + 1} of {questions.length}
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
              <div><kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">1</kbd> to <kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">4</kbd> Select option</div>
              <div><kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">Space</kbd> / <kbd className="bg-white border border-brand-200 px-1 py-0.5 rounded text-[10px]">Enter</kbd> Submit / Next</div>
            </div>
          </div>
        )}

        {/* Question Panel */}
        <div className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#86827a] mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-brand-500" />
            <span>Multiple Choice</span>
          </div>

          <h2 className="font-serif text-lg font-bold text-[#1e1e1f] leading-relaxed mb-6">
            {currentQuestion.type === 'desc-to-label' ? (
              <>
                Which sign matches the following description? <br />
                <span className="font-sans text-xs font-normal text-[#5d5a55] italic block mt-3 rounded-lg bg-brand-50/40 p-4 border border-brand-50">
                  &ldquo;{currentQuestion.sign.description}&rdquo;
                </span>
              </>
            ) : (
              <>
                What is the correct physical description for the sign for{' '}
                <strong className="text-brand-700 font-serif font-black text-xl">&ldquo;{currentQuestion.sign.label}&rdquo;</strong>?
              </>
            )}
          </h2>

          {/* Options list */}
          <div className="space-y-2">
            {currentQuestion.choices.map((choice, index) => {
              const isSelected = selectedAnswer === choice;
              const isCorrect = choice === currentQuestion.correctChoice;

              let buttonStyle = 'border-brand-50 bg-white text-[#1e1e1f] hover:border-brand-200';
              let badge = null;

              if (isSubmitted) {
                if (isCorrect) {
                  buttonStyle = 'border-emerald-300 bg-emerald-50/50 text-emerald-900';
                  badge = <Check className="h-4 w-4 text-emerald-600 font-bold" />;
                } else if (isSelected) {
                  buttonStyle = 'border-rose-300 bg-rose-50/50 text-rose-900';
                  badge = <X className="h-4 w-4 text-rose-600 font-bold" />;
                } else {
                  buttonStyle = 'border-brand-50 bg-white/50 text-[#86827a] opacity-60';
                }
              } else if (isSelected) {
                buttonStyle = 'border-brand-500 bg-brand-50/50 text-brand-800 ring-1 ring-brand-500';
              }

              return (
                <button
                  key={index}
                  disabled={isSubmitted}
                  onClick={() => handleSelectAnswer(choice)}
                  className={`w-full flex items-center justify-between gap-4 rounded-xl border p-4 text-left text-xs font-semibold transition-all cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100/50 text-[10px] text-brand-700 font-bold">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{choice}</span>
                  </div>
                  {badge}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="mt-8">
            {!isSubmitted ? (
              <button
                disabled={!selectedAnswer}
                onClick={handleSubmitAnswer}
                className="w-full flex items-center justify-center rounded-xl py-3 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:hover:bg-brand-500 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 cursor-pointer transition-all"
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] text-brand-600 font-serif">
        <span className="text-lg font-bold animate-pulse">Loading Quiz...</span>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
