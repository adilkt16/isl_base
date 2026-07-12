'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CurriculumMap from '@/components/CurriculumMap';
import { ALPHABET_SIGNS, NUMBER_SIGNS } from '@/data/signs';
import { getStoredProgress, ProgressState } from '@/utils/localStorage';
import { Check, BookOpen, Layers } from 'lucide-react';

export default function CurriculumPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(getStoredProgress());
    
    // Listen for storage changes
    const handleUpdate = () => {
      setProgress(getStoredProgress());
    };
    window.addEventListener('isl-progress-update', handleUpdate);
    return () => window.removeEventListener('isl-progress-update', handleUpdate);
  }, []);

  const isLearned = (id: string) => {
    return progress?.learnedSigns.includes(id) || false;
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <section className="mb-10 text-left">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1e1e1f] sm:text-4xl">
            Curriculum Map
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#5d5a55]">
            Use the interactive roadmap below to visualize your path. Drag to pan, zoom using the controls, and click nodes to open lessons. Or use the detailed listing below to skip directly to specific signs.
          </p>
        </section>

        {/* SVG Node Graph */}
        <section className="mb-16">
          <CurriculumMap />
        </section>

        {/* Detailed Lesson Lists */}
        <section className="grid gap-12 md:grid-cols-2 border-t border-brand-100 pt-12">
          
          {/* Alphabet Track List */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1e1e1f]">Alphabet Lessons (A-Z)</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ALPHABET_SIGNS.map((sign, index) => {
                const learned = isLearned(sign.id);
                return (
                  <Link
                    key={sign.id}
                    href={`/lessons/alphabet/${sign.id}`}
                    className={`flex items-center justify-between rounded-lg border p-3.5 transition-all hover:-translate-y-0.5 ${
                      learned
                        ? 'border-emerald-200 bg-emerald-50/30 text-emerald-900 hover:border-emerald-300'
                        : 'border-brand-50 bg-white text-[#1e1e1f] hover:border-brand-200 hover:bg-brand-50/10'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#86827a]">
                        Lesson {index + 1}
                      </span>
                      <span className="font-serif text-lg font-bold">
                        Letter {sign.label}
                      </span>
                    </div>
                    {learned && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Numbers Track List */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1e1e1f]">Number Lessons</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {NUMBER_SIGNS.map((sign, index) => {
                const learned = isLearned(sign.id);
                return (
                  <Link
                    key={sign.id}
                    href={`/lessons/number/${sign.id}`}
                    className={`flex items-center justify-between rounded-lg border p-3.5 transition-all hover:-translate-y-0.5 ${
                      learned
                        ? 'border-emerald-200 bg-emerald-50/30 text-emerald-900 hover:border-emerald-300'
                        : 'border-brand-50 bg-white text-[#1e1e1f] hover:border-brand-200 hover:bg-brand-50/10'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#86827a]">
                        Lesson {index + 1}
                      </span>
                      <span className="font-serif text-lg font-bold">
                        Number {sign.label}
                      </span>
                    </div>
                    {learned && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

        </section>

      </main>
      <Footer />
    </>
  );
}
