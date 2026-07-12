import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-[#fbfaf7] py-8 text-[#86827a]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm font-semibold text-brand-700">
              Indian Sign Language Learning Platform
            </p>
            <p className="mt-1 text-xs">
              Sourced in compliance with standard ISL two-handed fingerspelling.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/curriculum" className="hover:text-brand-600 transition-colors">
              Curriculum Map
            </Link>
            <Link href="/practice" className="hover:text-brand-600 transition-colors">
              Practice Flashcards
            </Link>
            <Link href="/quiz" className="hover:text-brand-600 transition-colors">
              Knowledge Check
            </Link>
            <Link href="/dashboard" className="hover:text-brand-600 transition-colors">
              Progress
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t border-brand-50 pt-4 text-center text-[10px]">
          <p>
            This platform runs entirely in your browser. All progress is saved locally.
          </p>
        </div>
      </div>
    </footer>
  );
}
