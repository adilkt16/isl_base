'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ALPHABET_SIGNS, NUMBER_SIGNS } from '@/data/signs';
import { getStoredProgress, clearAllProgress, ProgressState } from '@/utils/localStorage';
import { BarChart2, BookOpen, Layers, Award, Trash2, Calendar, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  const handleReset = () => {
    clearAllProgress();
    setProgress(getStoredProgress());
    setShowConfirmReset(false);
    // Dispatch event to header
    window.dispatchEvent(new Event('isl-progress-update'));
  };

  if (!progress) {
    return (
      <>
        <Header />
        <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-850">Loading Progress...</h2>
        </div>
        <Footer />
      </>
    );
  }

  // Compute metrics
  const learnedAlphabet = ALPHABET_SIGNS.filter((s) => progress.learnedSigns.includes(s.id));
  const learnedNumbers = NUMBER_SIGNS.filter((s) => progress.learnedSigns.includes(s.id));

  const totalAlphabet = ALPHABET_SIGNS.length;
  const totalNumbers = NUMBER_SIGNS.length;

  const alphabetPercent = Math.round((learnedAlphabet.length / totalAlphabet) * 100) || 0;
  const numbersPercent = Math.round((learnedNumbers.length / totalNumbers) * 100) || 0;

  const totalLearned = progress.learnedSigns.length;
  const grandTotal = totalAlphabet + totalNumbers;
  const overallPercent = Math.round((totalLearned / grandTotal) * 100) || 0;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <section className="mb-10 text-left">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1e1e1f] sm:text-4xl">
            Progress Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#5d5a55]">
            An honest, distraction-free log of your Indian Sign Language studies. All data is kept exclusively in your browser&rsquo;s local storage.
          </p>
        </section>

        {/* Top Summary Metrics */}
        <section className="grid gap-6 sm:grid-cols-3 mb-12">
          
          <div className="rounded-xl border border-brand-100 bg-white p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#86827a]">Overall Learning</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-extrabold text-[#1e1e1f]">{overallPercent}%</span>
              <span className="text-xs text-[#5d5a55] font-semibold">{totalLearned} of {grandTotal} signs</span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-brand-50">
              <div
                className="h-1 rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-100 bg-white p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#86827a]">Alphabet Track</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-extrabold text-brand-600">{alphabetPercent}%</span>
              <span className="text-xs text-[#5d5a55] font-semibold">{learnedAlphabet.length} of {totalAlphabet} learned</span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-brand-50">
              <div
                className="h-1 rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${alphabetPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-100 bg-white p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#86827a]">Numbers Track</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-extrabold text-brand-600">{numbersPercent}%</span>
              <span className="text-xs text-[#5d5a55] font-semibold">{learnedNumbers.length} of {totalNumbers} learned</span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-brand-50">
              <div
                className="h-1 rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${numbersPercent}%` }}
              ></div>
            </div>
          </div>

        </section>

        {/* Detailed lists of learned items */}
        <section className="grid gap-8 md:grid-cols-2 mb-12">
          
          {/* Alphabet Learned */}
          <div className="rounded-xl border border-brand-50 bg-white/40 p-6">
            <h3 className="font-serif text-lg font-bold text-[#1e1e1f] flex items-center gap-2 mb-4">
              <BookOpen className="h-4.5 w-4.5 text-brand-500" />
              <span>Alphabet Completed ({learnedAlphabet.length})</span>
            </h3>
            {learnedAlphabet.length === 0 ? (
              <p className="text-xs text-[#86827a] italic">No letters marked as learned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {learnedAlphabet.map((sign) => (
                  <Link
                    key={sign.id}
                    href={`/lessons/alphabet/${sign.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-serif font-bold text-sm hover:bg-emerald-100 transition-colors"
                  >
                    {sign.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Numbers Learned */}
          <div className="rounded-xl border border-brand-50 bg-white/40 p-6">
            <h3 className="font-serif text-lg font-bold text-[#1e1e1f] flex items-center gap-2 mb-4">
              <Layers className="h-4.5 w-4.5 text-brand-500" />
              <span>Numbers Completed ({learnedNumbers.length})</span>
            </h3>
            {learnedNumbers.length === 0 ? (
              <p className="text-xs text-[#86827a] italic">No numbers marked as learned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {learnedNumbers.map((sign) => (
                  <Link
                    key={sign.id}
                    href={`/lessons/number/${sign.id}`}
                    className="flex h-8 px-2.5 items-center justify-center rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-serif font-bold text-sm hover:bg-emerald-100 transition-colors"
                  >
                    {sign.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* Quiz Logs */}
        <section className="rounded-xl border border-brand-100 bg-white p-6 sm:p-8 mb-12">
          <h3 className="font-serif text-lg font-bold text-[#1e1e1f] flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-brand-500" />
            <span>Quiz Log & Academic History</span>
          </h3>

          {progress.quizScores.length === 0 ? (
            <div className="text-center py-8 bg-brand-50/20 border border-brand-50 rounded-lg">
              <p className="text-xs text-[#86827a] italic">No quiz scores recorded yet.</p>
              <Link
                href="/quiz"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <span>Take your first knowledge check</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {[...progress.quizScores].reverse().map((score) => {
                const date = new Date(score.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const percent = Math.round((score.score / score.total) * 100);
                return (
                  <div
                    key={score.id}
                    className="flex items-center justify-between rounded-lg border border-brand-50 px-4 py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-50 text-brand-700">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-[#1e1e1f] capitalize">
                          {score.category} Quiz
                        </span>
                        <span className="block text-[10px] text-[#86827a]">{date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-serif text-base font-extrabold text-brand-600">
                        {percent}%
                      </span>
                      <span className="block text-[10px] text-[#86827a] font-semibold">
                        {score.score} / {score.total} answers
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Reset Action */}
        <section className="border-t border-brand-50 pt-8 flex justify-end">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/10 px-4 py-2.5 text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Storage & Progress</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50/40 p-3">
              <span className="text-xs font-semibold text-rose-800">
                Are you absolutely sure? This cannot be undone.
              </span>
              <button
                onClick={handleReset}
                className="rounded bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-800 transition-colors cursor-pointer"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="rounded border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#5d5a55] hover:bg-brand-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
