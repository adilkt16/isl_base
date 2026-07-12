'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignMediaPlaceholder from '@/components/SignMediaPlaceholder';
import HandRig from '@/components/HandRig';
import { ALPHABET_SIGNS, NUMBER_SIGNS, Sign } from '@/data/signs';
import { HANDSHAPE_DATA } from '@/lib/handshape-data';
import {
  isSignLearned,
  toggleSignLearned,
  setLastActiveSign,
} from '@/utils/localStorage';
import { ArrowLeft, ArrowRight, Check, Compass, Layers, CheckCircle2 } from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const category = params.category as 'alphabet' | 'number';
  const id = params.id as string;

  const [sign, setSign] = useState<Sign | null>(null);
  const [learned, setLearned] = useState<boolean>(false);
  const [list, setList] = useState<Sign[]>([]);
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    if (!category || !id) return;

    const currentList = category === 'alphabet' ? ALPHABET_SIGNS : NUMBER_SIGNS;
    setList(currentList);

    const foundIndex = currentList.findIndex((s) => s.id === id);
    if (foundIndex >= 0) {
      const foundSign = currentList[foundIndex];
      setSign(foundSign);
      setIndex(foundIndex);
      setLearned(isSignLearned(foundSign.id));
      // Mark as last active
      setLastActiveSign(foundSign.id, category);
    } else {
      setSign(null);
      setIndex(-1);
    }
  }, [category, id]);

  if (!sign) {
    return (
      <>
        <Header />
        <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-800">Lesson Not Found</h2>
          <p className="mt-2 text-sm text-[#5d5a55]">
            The lesson code you are trying to view does not exist in our database.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Go Back Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const prevSign = index > 0 ? list[index - 1] : null;
  const nextSign = index < list.length - 1 ? list[index + 1] : null;

  const handshapeEntry = HANDSHAPE_DATA.find(
    (e) => e.signId.toLowerCase() === sign.id.toLowerCase()
  );

  const handleToggleLearned = () => {
    const nextState = toggleSignLearned(sign.id);
    setLearned(nextState);
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-50 pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#86827a]">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/curriculum" className="hover:text-brand-600 transition-colors">Curriculum</Link>
            <span>/</span>
            <span className="capitalize text-brand-700 font-semibold">{category}</span>
            <span>/</span>
            <span className="font-bold text-[#1e1e1f]">{sign.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/curriculum"
              className="flex items-center gap-1 text-xs font-semibold text-[#5d5a55] hover:text-brand-600 transition-colors"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Map</span>
            </Link>
            <Link
              href={`/practice?category=${category}`}
              className="flex items-center gap-1 text-xs font-semibold text-[#5d5a55] hover:text-brand-600 transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Practice Category</span>
            </Link>
            <Link
              href={`/quiz?category=${category}`}
              className="flex items-center gap-1 text-xs font-semibold text-[#5d5a55] hover:text-brand-600 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Quiz Category</span>
            </Link>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Left Column: Visual Reference Media (Hand Rig) */}
          <div className="flex flex-col justify-center">
            {handshapeEntry ? (
              <HandRig entry={handshapeEntry} />
            ) : (
              <SignMediaPlaceholder label={sign.label} category={sign.category} />
            )}
            <p className="mt-3 text-center text-xs italic text-[#86827a]">
              Figure {index + 1}: {category === 'alphabet' ? 'Alphabetical' : 'Numerical'} representation of &ldquo;{sign.label}&rdquo; in ISL.
            </p>
          </div>

          {/* Right Column: Descriptions & Controls */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-600">
                {category === 'alphabet' ? 'Alphabet Fingerspelling' : 'Numerical System'}
              </span>
              <h2 className="font-serif text-4xl font-extrabold text-[#1e1e1f] mt-1">
                Sign: {sign.label}
              </h2>
              
              <div className="mt-6 border-l-2 border-brand-500 pl-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800">
                  How to Sign
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#1e1e1f] font-medium">
                  {sign.description}
                </p>
              </div>

              {sign.usageNote && (
                <div className="mt-6 rounded-lg bg-brand-50/55 border border-brand-100 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Anatomical Note</span>
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#5d5a55]">
                    {sign.usageNote}
                  </p>
                </div>
              )}
            </div>

            {/* Toggle Learned Button */}
            <div className="mt-8">
              <button
                onClick={handleToggleLearned}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer ${
                  learned
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-sm active:scale-[0.98]'
                }`}
              >
                {learned ? (
                  <>
                    <Check className="h-4.5 w-4.5 stroke-[2.5]" />
                    <span>Learned (Click to mark incomplete)</span>
                  </>
                ) : (
                  <span>Mark as Learned</span>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Nav Bar within category */}
        <div className="mt-12 flex items-center justify-between border-t border-brand-50 pt-6">
          {prevSign ? (
            <Link
              href={`/lessons/${category}/${prevSign.id}`}
              className="group flex items-center gap-2 rounded-lg border border-brand-100 bg-white px-4 py-2.5 text-xs font-semibold text-[#5d5a55] transition-all hover:bg-brand-50 hover:text-brand-700"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-[#86827a]">Previous</span>
                <span className="font-serif text-sm font-bold text-[#1e1e1f]">{prevSign.label}</span>
              </div>
            </Link>
          ) : (
            <div className="opacity-0 w-[100px]" />
          )}

          <div className="text-center text-xs font-medium text-[#86827a]">
            {index + 1} of {list.length} signs
          </div>

          {nextSign ? (
            <Link
              href={`/lessons/${category}/${nextSign.id}`}
              className="group flex items-center gap-2 rounded-lg border border-brand-100 bg-white px-4 py-2.5 text-xs font-semibold text-[#5d5a55] transition-all hover:bg-brand-50 hover:text-brand-700"
            >
              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-wider text-[#86827a]">Next</span>
                <span className="font-serif text-sm font-bold text-[#1e1e1f]">{nextSign.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              href="/curriculum"
              className="group flex items-center gap-2 rounded-lg border border-brand-500 bg-brand-50 px-4 py-2.5 text-xs font-semibold text-brand-700 transition-all hover:bg-brand-100"
            >
              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-wider text-brand-600">Finished</span>
                <span className="font-serif text-sm font-bold">To Curriculum</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}
