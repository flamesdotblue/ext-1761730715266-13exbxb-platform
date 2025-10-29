import { useMemo } from 'react';
import Spline from '@splinetool/react-spline';

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

function BalanceCard({ balance, income, expenses }) {
  return (
    <section aria-labelledby="balance-heading" className="relative overflow-hidden rounded-2xl bg-white border border-gray-200">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-50 via-transparent to-emerald-50" aria-hidden />
      <div className="grid md:grid-cols-2 gap-6 p-6 relative">
        <div>
          <h2 id="balance-heading" className="text-sm font-medium text-gray-600">Account Balance</h2>
          <p className="mt-2 text-3xl md:text-4xl font-semibold text-[#333333]">{currency.format(balance)}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4" aria-label="Income and expenses summary">
            <div className="rounded-lg p-3 bg-blue-50">
              <dt className="text-xs text-blue-700">Income</dt>
              <dd className="text-base font-semibold text-blue-900">{currency.format(income)}</dd>
            </div>
            <div className="rounded-lg p-3 bg-emerald-50">
              <dt className="text-xs text-emerald-700">Expenses</dt>
              <dd className="text-base font-semibold text-emerald-900">{currency.format(expenses)}</dd>
            </div>
          </dl>
        </div>
        <div className="h-48 md:h-56 rounded-xl overflow-hidden border border-gray-100">
          <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} aria-label="3D credit card visual" />
        </div>
      </div>
    </section>
  );
}

function BarChart({ data, max = 200, title, ariaDesc }) {
  return (
    <figure aria-labelledby={`${title}-title`} className="rounded-2xl bg-white border border-gray-200 p-4">
      <figcaption id={`${title}-title`} className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </figcaption>
      <svg role="img" aria-label={ariaDesc} className="w-full h-40" viewBox="0 0 320 160">
        <desc>{ariaDesc}</desc>
        {data.map((d, i) => {
          const barW = 320 / data.length - 8;
          const x = i * (320 / data.length) + 4;
          const h = Math.max(4, (d.amount / max) * 140);
          const y = 150 - h;
          return (
            <g key={i}>
              <title>{`${d.label}: $${d.amount}`}</title>
              <rect x={x} y={y} width={barW} height={h} rx={6} className="fill-blue-500" />
              <text x={x + barW / 2} y={156} textAnchor="middle" className="fill-gray-600 text-[10px]">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function LineChart({ data, max = 1000, title, ariaDesc }) {
  const points = useMemo(() => {
    const w = 320, h = 160, pad = 10;
    return data.map((d, i) => {
      const x = pad + (i * (w - pad * 2)) / (data.length - 1);
      const y = h - pad - (d.value / max) * (h - pad * 2);
      return `${x},${y}`;
    }).join(' ');
  }, [data, max]);

  return (
    <figure aria-labelledby={`${title}-title`} className="rounded-2xl bg-white border border-gray-200 p-4">
      <figcaption id={`${title}-title`} className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </figcaption>
      <svg role="img" aria-label={ariaDesc} className="w-full h-40" viewBox="0 0 320 160">
        <desc>{ariaDesc}</desc>
        <polyline points={points} fill="none" className="stroke-emerald-500" strokeWidth="3" />
        {data.map((d, i) => {
          const w = 320, h = 160, pad = 10;
          const x = pad + (i * (w - pad * 2)) / (data.length - 1);
          const y = h - pad - (d.value / 1000) * (h - pad * 2);
          return <circle key={i} cx={x} cy={y} r="3" className="fill-emerald-500" />;
        })}
      </svg>
    </figure>
  );
}

export default function DashboardView() {
  const balance = 8243.54;
  const income = 5200.0;
  const expenses = 1756.32;

  const dailySpend = [
    { label: 'M', amount: 45 },
    { label: 'T', amount: 72 },
    { label: 'W', amount: 36 },
    { label: 'T', amount: 120 },
    { label: 'F', amount: 88 },
    { label: 'S', amount: 160 },
    { label: 'S', amount: 98 },
  ];

  const cumulative = [
    { value: 200 },
    { value: 350 },
    { value: 500 },
    { value: 780 },
    { value: 910 },
    { value: 980 },
    { value: 1000 },
  ];

  return (
    <div className="space-y-6" aria-labelledby="dashboard-title">
      <h2 id="dashboard-title" className="sr-only">Dashboard</h2>
      <BalanceCard balance={balance} income={income} expenses={expenses} />
      <div className="grid md:grid-cols-2 gap-6">
        <BarChart
          data={dailySpend}
          max={200}
          title="Daily Spending"
          ariaDesc="Bar chart showing daily spending for the last 7 days"
        />
        <LineChart
          data={cumulative}
          max={1000}
          title="Weekly Progress"
          ariaDesc="Line chart showing weekly cumulative spending"
        />
      </div>
    </div>
  );
}
