import { useCallback } from 'react';

export default function InputSlider({
  label,
  value,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  onChange,
}) {
  const clamp = useCallback(
    (v) => Math.min(max, Math.max(min, v)),
    [min, max]
  );

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    if (raw === '') return onChange(min);
    onChange(clamp(parseFloat(raw)));
  };

  const handleSlider = (e) => {
    onChange(parseFloat(e.target.value));
  };

  // Calculate fill percentage for the slider track gradient
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div
          className="flex items-center gap-1 rounded-lg border border-slate-200
                     bg-white px-3 py-1.5 dark:border-slate-600 dark:bg-slate-700"
        >
          {prefix && (
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {prefix}
            </span>
          )}
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleInput}
            onBlur={() => onChange(clamp(value))}
            className="w-20 bg-transparent text-right text-sm font-semibold
                       text-slate-800 outline-none dark:text-white"
          />
          {suffix && (
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSlider}
        className="w-full"
        style={{
          background: `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${pct}%, #cbd5e1 ${pct}%, #cbd5e1 100%)`,
        }}
      />

      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>
          {prefix}{min.toLocaleString('en-IN')}{suffix}
        </span>
        <span>
          {prefix}{max.toLocaleString('en-IN')}{suffix}
        </span>
      </div>
    </div>
  );
}
