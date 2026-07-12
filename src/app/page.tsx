'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getStoredProgress, LastActiveSign, ProgressState } from '@/utils/localStorage';
import { ALPHABET_SIGNS, NUMBER_SIGNS } from '@/data/signs';
import { ArrowRight, BookOpen, Layers, Award, Landmark, HelpCircle } from 'lucide-react';

export default function Home() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [lastActive, setLastActive] = useState<LastActiveSign | null>(null);

  useEffect(() => {
    setProgress(getStoredProgress());
    const active = localStorage.getItem('isl_learning_platform_progress_v1');
    if (active) {
      try {
        const parsed = JSON.parse(active);
        if (parsed.lastActiveSign) {
          setLastActive(parsed.lastActiveSign);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const learnedCount = progress ? progress.learnedSigns.length : 0;
  const alphabetLearned = progress
    ? progress.learnedSigns.filter((id) => ALPHABET_SIGNS.some((s) => s.id === id)).length
    : 0;
  const numbersLearned = progress
    ? progress.learnedSigns.filter((id) => NUMBER_SIGNS.some((s) => s.id === id)).length
    : 0;

  const totalAlphabet = ALPHABET_SIGNS.length;
  const totalNumbers = NUMBER_SIGNS.length;

  const alphabetProgressPercent = Math.round((alphabetLearned / totalAlphabet) * 100) || 0;
  const numbersProgressPercent = Math.round((numbersLearned / totalNumbers) * 100) || 0;

  // Find sign details for resuming
  const resumeSign = lastActive
    ? [...ALPHABET_SIGNS, ...NUMBER_SIGNS].find((s) => s.id === lastActive.id)
    : null;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="mb-16 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700 mb-6">
            <Landmark className="h-3.5 w-3.5" />
            <span>Interactive Learning Initiative</span>
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1e1e1f] sm:text-5xl lg:text-6xl max-w-3xl leading-[1.15]">
            Learn Indian Sign Language <span className="text-brand-500 italic font-semibold">Fingerspelling</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#5d5a55]">
            Unlike American Sign Language (ASL), fingerspelling in <strong>Indian Sign Language (ISL)</strong> is primarily two-handed. This platform provides an interactive curriculum map to master the alphabet and numbers with clear anatomical instructions.
          </p>
        </section>

        {/* Continue Learning Block */}
        {resumeSign && (
          <section className="mb-12">
            <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    Welcome Back
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#1e1e1f]">
                    Continue where you left off
                  </h2>
                  <p className="mt-1 text-sm text-[#5d5a55]">
                    You were learning the sign for{' '}
                    <strong className="text-brand-700 font-semibold">&ldquo;{resumeSign.label}&rdquo;</strong>{' '}
                    in {resumeSign.category === 'alphabet' ? 'Alphabet' : 'Numbers'}.
                  </p>
                </div>
                <div>
                  <Link
                    href={`/lessons/${resumeSign.category}/${resumeSign.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.98]"
                  >
                    <span>Resume Lesson</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Two Clear Entry Points */}
        <section className="grid gap-6 sm:grid-cols-2 mb-16">
          
          {/* Alphabet Entry */}
          <div className="flex flex-col justify-between rounded-xl border border-brand-100 bg-white p-6 transition-all hover:shadow-md hover:border-brand-200">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <BookOpen className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-[#1e1e1f]">
                Alphabet (A&ndash;Z)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5d5a55]">
                Master the full two-handed fingerspelling alphabet. Essential for spelling names, locations, and words that don&rsquo;t have dedicated signs.
              </p>
              
              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold text-[#5d5a55] mb-1.5">
                  <span>Progress</span>
                  <span>{alphabetLearned} of {totalAlphabet} learned ({alphabetProgressPercent}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-brand-50">
                  <div
                    className="h-1.5 rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${alphabetProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/lessons/alphabet/a"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 px-4 py-2.5 text-sm font-semibold text-[#1e1e1f] transition-all hover:bg-brand-50 hover:text-brand-700"
              >
                <span>Start Alphabet</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Numbers Entry */}
          <div className="flex flex-col justify-between rounded-xl border border-brand-100 bg-white p-6 transition-all hover:shadow-md hover:border-brand-200">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <Layers className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-[#1e1e1f]">
                Numbers (0&ndash;9 & Decimals)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5d5a55]">
                Learn single digits from 0 to 9, how they combine to form numbers 6 to 9, and the sequential slides used for double-digit values.
              </p>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold text-[#5d5a55] mb-1.5">
                  <span>Progress</span>
                  <span>{numbersLearned} of {totalNumbers} learned ({numbersProgressPercent}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-brand-50">
                  <div
                    className="h-1.5 rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${numbersProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/lessons/number/0"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 px-4 py-2.5 text-sm font-semibold text-[#1e1e1f] transition-all hover:bg-brand-50 hover:text-brand-700"
              >
                <span>Start Numbers</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </section>

        {/* Educational details about ISL */}
        <section className="border-t border-brand-100 pt-12 mb-8">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#1e1e1f]">Quick Reference Guide</h3>
            <p className="text-xs text-[#86827a] mt-1">Understanding the structure of fingerspelling and numbers</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-brand-50/30 border border-brand-50 p-5">
              <div className="flex items-center gap-2 font-serif font-semibold text-brand-800 text-sm">
                <Award className="h-4 w-4 text-brand-500" />
                Two-Handed System
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#5d5a55]">
                Most alphabetical signs require a steady &ldquo;base hand&rdquo; (typically the left hand) and an &ldquo;action hand&rdquo; (typically the right hand) touching specific points to spell.
              </p>
            </div>
            
            <div className="rounded-lg bg-brand-50/30 border border-brand-50 p-5">
              <div className="flex items-center gap-2 font-serif font-semibold text-brand-800 text-sm">
                <Award className="h-4 w-4 text-brand-500" />
                Vowel Mechanics
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#5d5a55]">
                Vowels A, E, I, O, U are signed by touching the tip of the left thumb, index, middle, ring, and pinky finger respectively with your right index finger.
              </p>
            </div>

            <div className="rounded-lg bg-brand-50/30 border border-brand-50 p-5">
              <div className="flex items-center gap-2 font-serif font-semibold text-brand-800 text-sm">
                <HelpCircle className="h-4 w-4 text-brand-500" />
                Number Composition
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#5d5a55]">
                Digits 1 to 5 use single hand shapes. Digits 6 to 9 represent addition (an open 5-finger palm touched by 1, 2, 3, or 4 fingers from the other hand).
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
