import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
} from 'recharts';
import { formatCurrency, formatShort } from '../utils/format';

const DONUT_COLORS = ['#3b82f6', '#14b8a6'];
const DONUT_COLORS_SWP = ['#f43f5e', '#8b5cf6'];

function CustomTooltipPie({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {payload[0].name}
      </p>
      <p className="text-sm font-bold text-slate-800 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function CustomTooltipBar({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function ChartSection({ invested, returns, yearlyData, showInflation = false, mode = 'sip' }) {
  const isSWP = mode === 'swp';

  const donutData = isSWP
    ? [
        { name: 'Withdrawn', value: invested },
        { name: 'Balance', value: returns },
      ]
    : [
        { name: 'Invested', value: invested },
        { name: 'Returns', value: returns },
      ];

  const colors = isSWP ? DONUT_COLORS_SWP : DONUT_COLORS;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Donut Chart */}
      <div
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm
                   dark:border-slate-700 dark:bg-slate-800"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wide dark:text-slate-300">
          {isSWP ? 'Withdrawal Breakdown' : 'Investment Breakdown'}
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              stroke="none"
            >
              {donutData.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipPie />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-2 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: colors[0] }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{donutData[0].name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: colors[1] }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{donutData[1].name}</span>
          </div>
        </div>
      </div>

      {/* Bar Chart — yearly growth / withdrawal */}
      <div
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm
                   dark:border-slate-700 dark:bg-slate-800"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wide dark:text-slate-300">
          {isSWP ? 'Year-by-Year Balance' : 'Year-by-Year Growth'}
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={yearlyData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              interval={yearlyData.length > 15 ? Math.floor(yearlyData.length / 8) : 0}
            />
            <YAxis
              tickFormatter={(v) => formatShort(v)}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip content={<CustomTooltipBar />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
            {isSWP ? (
              <>
                <Bar dataKey="withdrawn" name="Withdrawn" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} animationDuration={600} />
                <Bar dataKey="balance" name="Balance" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={600} />
              </>
            ) : (
              <>
                <Bar dataKey="invested" name="Invested" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} animationDuration={600} />
                <Bar dataKey="returns" name="Returns" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} animationDuration={600} />
              </>
            )}
            {showInflation && (
              <Line
                dataKey="inflationAdjusted"
                name="After Inflation"
                type="monotone"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                animationDuration={600}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
