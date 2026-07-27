import { useState, useMemo, useRef, useCallback } from 'react';
import { Download, Share2 } from 'lucide-react';
import InputSlider from './InputSlider';
import ResultCard from './ResultCard';
import ChartSection from './ChartSection';
import { calculateSIP, calculateLumpsum, calculateSWP, getYearlyGrowth } from '../utils/calculations';
import { formatCurrency } from '../utils/format';

const MODES = [
  { id: 'sip', label: 'SIP' },
  { id: 'lumpsum', label: 'Lumpsum' },
  { id: 'swp', label: 'SWP' },
];

export default function Calculator() {
  const [mode, setMode] = useState('sip');
  const [sipAmount, setSipAmount] = useState(5000);
  const [lumpAmount, setLumpAmount] = useState(100000);
  const [swpCorpus, setSwpCorpus] = useState(5000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(25000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflationEnabled, setInflationEnabled] = useState(false);
  const [inflation, setInflation] = useState(6);
  const summaryRef = useRef(null);

  const activeInflation = inflationEnabled ? inflation : 0;

  const results = useMemo(() => {
    if (mode === 'sip') return calculateSIP(sipAmount, rate, years, activeInflation);
    if (mode === 'lumpsum') return calculateLumpsum(lumpAmount, rate, years, activeInflation);
    return calculateSWP(swpCorpus, swpWithdrawal, rate, years, activeInflation);
  }, [mode, sipAmount, lumpAmount, swpCorpus, swpWithdrawal, rate, years, activeInflation]);

  const yearlyData = useMemo(() => {
    if (mode === 'sip') return getYearlyGrowth('sip', sipAmount, rate, years, activeInflation);
    if (mode === 'lumpsum') return getYearlyGrowth('lumpsum', lumpAmount, rate, years, activeInflation);
    return getYearlyGrowth('swp', swpCorpus, rate, years, activeInflation, swpWithdrawal);
  }, [mode, sipAmount, lumpAmount, swpCorpus, swpWithdrawal, rate, years, activeInflation]);

  const handleDownload = useCallback(async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = summaryRef.current;
      if (!el) return;
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `mfcalc-${mode}-summary.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Could not generate image. Please try again.');
    }
  }, [mode]);

  const handleShare = useCallback(async () => {
    const lines = [`📊 MF Calculator — ${mode.toUpperCase()} Summary`];
    if (mode === 'swp') {
      lines.push(
        `Corpus: ${formatCurrency(results.totalInvested)}`,
        `Total Withdrawn: ${formatCurrency(results.totalWithdrawn)}`,
        `Final Balance: ${formatCurrency(results.finalBalance)}`,
        `Rate: ${rate}% | Duration: ${years} yrs`,
      );
    } else {
      lines.push(
        `Invested: ${formatCurrency(results.totalInvested)}`,
        `Returns: ${formatCurrency(results.estimatedReturns)}`,
        `Total Value: ${formatCurrency(results.totalValue)}`,
        `Rate: ${rate}% | Duration: ${years} yrs`,
      );
    }
    if (inflationEnabled) {
      lines.push(`Inflation: ${inflation}% p.a.`);
      lines.push(`After Inflation: ${formatCurrency(results.inflationAdjusted)}`);
    }
    const text = lines.join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: 'MF Calculator', text });
        return;
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  }, [mode, results, rate, years, inflationEnabled, inflation]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1
                     dark:border-slate-700 dark:bg-slate-800"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-200
                ${
                  mode === m.id
                    ? 'bg-white text-primary-700 shadow-sm dark:bg-slate-700 dark:text-primary-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs Panel */}
        <div
          className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6
                     shadow-sm lg:col-span-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {mode === 'sip' ? 'SIP Investment' : mode === 'lumpsum' ? 'Lumpsum Investment' : 'SWP Withdrawal'}
          </h2>

          {mode === 'sip' && (
            <InputSlider
              label="Monthly Investment"
              value={sipAmount}
              min={500}
              max={100000}
              step={500}
              prefix="₹"
              onChange={setSipAmount}
            />
          )}

          {mode === 'lumpsum' && (
            <InputSlider
              label="Investment Amount"
              value={lumpAmount}
              min={5000}
              max={10000000}
              step={5000}
              prefix="₹"
              onChange={setLumpAmount}
            />
          )}

          {mode === 'swp' && (
            <>
              <InputSlider
                label="Total Corpus"
                value={swpCorpus}
                min={100000}
                max={50000000}
                step={50000}
                prefix="₹"
                onChange={setSwpCorpus}
              />
              <InputSlider
                label="Monthly Withdrawal"
                value={swpWithdrawal}
                min={1000}
                max={500000}
                step={1000}
                prefix="₹"
                onChange={setSwpWithdrawal}
              />
            </>
          )}

          <InputSlider
            label="Expected Return (p.a.)"
            value={rate}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
            onChange={setRate}
          />

          <InputSlider
            label="Time Period"
            value={years}
            min={1}
            max={40}
            step={1}
            suffix=" Yrs"
            onChange={setYears}
          />

          {/* Inflation Toggle */}
          <div className="space-y-4 rounded-xl border border-dashed border-slate-200 p-4
                          dark:border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Adjust for Inflation
              </span>
              <button
                role="switch"
                aria-checked={inflationEnabled}
                onClick={() => setInflationEnabled((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200
                  ${inflationEnabled
                    ? 'bg-amber-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                  }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow
                    transition-transform duration-200
                    ${inflationEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {inflationEnabled && (
              <InputSlider
                label="Yearly Inflation"
                value={inflation}
                min={1}
                max={15}
                step={0.5}
                suffix="%"
                onChange={setInflation}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl
                         border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium
                         text-slate-600 transition-all hover:bg-slate-100
                         dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300
                         dark:hover:bg-slate-600"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl
                         bg-primary-600 py-2.5 text-sm font-medium text-white
                         transition-all hover:bg-primary-700 active:scale-[0.97]"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6 lg:col-span-8" ref={summaryRef}>
          {/* Summary Cards */}
          {mode === 'swp' ? (
            <div className={`grid gap-3 grid-cols-2 ${inflationEnabled ? 'lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
              <ResultCard type="invested" value={results.totalInvested} />
              <ResultCard type="withdrawn" value={results.totalWithdrawn} />
              <ResultCard type="balance" value={results.finalBalance} />
              {inflationEnabled && (
                <ResultCard type="inflationAdjusted" value={results.inflationAdjusted} />
              )}
            </div>
          ) : (
            <div className={`grid gap-3 grid-cols-2 ${inflationEnabled ? 'lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
              <ResultCard type="invested" value={results.totalInvested} />
              <ResultCard type="returns" value={results.estimatedReturns} />
              <ResultCard type="total" value={results.totalValue} />
              {inflationEnabled && (
                <ResultCard type="inflationAdjusted" value={results.inflationAdjusted} />
              )}
            </div>
          )}

          {/* Charts */}
          <ChartSection
            invested={mode === 'swp' ? results.totalWithdrawn : results.totalInvested}
            returns={mode === 'swp' ? results.finalBalance : results.estimatedReturns}
            yearlyData={yearlyData}
            showInflation={inflationEnabled}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}
