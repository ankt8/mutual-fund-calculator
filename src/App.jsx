import { useState, useEffect } from 'react';
import { Moon, Sun, Calculator as CalcIcon } from 'lucide-react';
import Calculator from './components/Calculator';

export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('mfcalc-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('mfcalc-dark', String(dark));
  }, [dark]);

  return (
    <div className="min-h-screen bg-bg-light transition-colors duration-300 dark:bg-bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
              <CalcIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-800 dark:text-white">
                MF Calculator
              </h1>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Mutual Fund Returns Calculator
              </p>
            </div>
          </div>

          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600
                       transition-all hover:bg-slate-100 hover:text-slate-800
                       dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
                       dark:hover:bg-slate-700 dark:hover:text-white"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 sm:py-12">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-400 dark:border-slate-700/60 dark:text-slate-600">
        Built with React, Tailwind CSS & Recharts
      </footer>
    </div>
  );
}
