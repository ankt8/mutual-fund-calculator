import { TrendingUp, Wallet, PiggyBank, ShieldAlert, ArrowDownToLine, Landmark } from 'lucide-react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { formatCurrency } from '../utils/format';

const configs = {
  invested: {
    icon: Wallet,
    label: 'Invested Amount',
    gradient: 'from-accent-500 to-accent-600',
    bg: 'bg-accent-50 dark:bg-accent-900/30',
    text: 'text-accent-600 dark:text-accent-400',
  },
  returns: {
    icon: TrendingUp,
    label: 'Est. Returns',
    gradient: 'from-primary-500 to-primary-600',
    bg: 'bg-primary-50 dark:bg-primary-900/30',
    text: 'text-primary-600 dark:text-primary-400',
  },
  total: {
    icon: PiggyBank,
    label: 'Total Value',
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  inflationAdjusted: {
    icon: ShieldAlert,
    label: 'After Inflation',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
  },
  withdrawn: {
    icon: ArrowDownToLine,
    label: 'Total Withdrawn',
    gradient: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-900/30',
    text: 'text-rose-600 dark:text-rose-400',
  },
  balance: {
    icon: Landmark,
    label: 'Final Balance',
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/30',
    text: 'text-violet-600 dark:text-violet-400',
  },
};

export default function ResultCard({ type, value }) {
  const animated = useAnimatedNumber(value);
  const cfg = configs[type];
  const Icon = cfg.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-100
                 bg-white p-5 shadow-sm transition-all duration-300
                 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Decorative gradient bar */}
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${cfg.gradient}
                    opacity-80 transition-all duration-300 group-hover:h-1.5`}
      />

      <div className="flex items-start gap-3">
        <div className={`shrink-0 rounded-xl ${cfg.bg} p-2.5`}>
          <Icon className={`h-5 w-5 ${cfg.text}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {cfg.label}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-800 dark:text-white sm:text-xl xl:text-2xl">
            {formatCurrency(animated)}
          </p>
        </div>
      </div>
    </div>
  );
}
