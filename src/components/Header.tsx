'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, Layers, BarChart2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStoredProgress } from '@/utils/localStorage';

export default function Header() {
  const pathname = usePathname();
  const [learnedCount, setLearnedCount] = useState(0);

  // Listen for progress updates
  useEffect(() => {
    const updateCount = () => {
      const progress = getStoredProgress();
      setLearnedCount(progress.learnedSigns.length);
    };

    updateCount();
    window.addEventListener('isl-progress-update', updateCount);
    return () => window.removeEventListener('isl-progress-update', updateCount);
  }, []);

  const navItems = [
    { href: '/', label: 'Overview', icon: BookOpen },
    { href: '/curriculum', label: 'Curriculum', icon: Compass },
    { href: '/practice', label: 'Practice', icon: Layers },
    { href: '/quiz', label: 'Quiz', icon: CheckCircle2 },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-[#fbfaf7]/85 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-brand-500 transition-colors group-hover:text-brand-600">
                ISL Academy
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-[#5d5a55] hover:bg-brand-50 hover:text-brand-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:flex">
              <span className="h-2 w-2 rounded-full bg-brand-500"></span>
              <span>{learnedCount} learned</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
