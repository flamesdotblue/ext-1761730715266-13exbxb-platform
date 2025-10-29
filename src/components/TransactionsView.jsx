import { useMemo, useState } from 'react';

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

const SAMPLE = [
  { id: 't1', date: '2025-10-20', merchant: 'Grocery Mart', category: 'Groceries', amount: -82.35 },
  { id: 't2', date: '2025-10-20', merchant: 'City Transit', category: 'Transport', amount: -2.75 },
  { id: 't3', date: '2025-10-19', merchant: 'Acme Corp', category: 'Salary', amount: 1800.00 },
  { id: 't4', date: '2025-10-18', merchant: 'Coffee House', category: 'Dining', amount: -6.25 },
  { id: 't5', date: '2025-10-17', merchant: 'Streaming Co', category: 'Subscriptions', amount: -12.99 },
];

const categoryColor = (cat) => {
  const map = {
    Groceries: 'bg-emerald-100 text-emerald-800',
    Transport: 'bg-blue-100 text-blue-800',
    Salary: 'bg-violet-100 text-violet-800',
    Dining: 'bg-rose-100 text-rose-800',
    Subscriptions: 'bg-amber-100 text-amber-800',
  };
  return map[cat] || 'bg-gray-100 text-gray-800';
};

export default function TransactionsView() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return SAMPLE.filter(t => {
      const matchesQuery = [t.merchant, t.category, t.date].some(v => v.toLowerCase().includes(query.toLowerCase()));
      const matchesCat = category === 'All' || t.category === category;
      return matchesQuery && matchesCat;
    });
  }, [query, category]);

  return (
    <section aria-labelledby="transactions-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h2 id="transactions-heading" className="text-xl font-semibold">Transactions</h2>
        <div className="flex gap-2 flex-wrap">
          <label className="sr-only" htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by merchant, category, date"
            className="w-56 px-3 py-2 rounded-md border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="sr-only" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All','Groceries','Transport','Salary','Dining','Subscriptions'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div role="table" aria-label="Transaction history" className="divide-y divide-gray-200">
          <div role="row" className="grid grid-cols-4 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">
            <div role="columnheader">Date</div>
            <div role="columnheader">Merchant</div>
            <div role="columnheader">Category</div>
            <div role="columnheader" className="text-right">Amount</div>
          </div>
          {filtered.map(t => (
            <div key={t.id} role="row" className="grid grid-cols-4 px-4 py-3 items-center">
              <div role="cell" className="text-sm text-gray-700">{new Date(t.date).toLocaleDateString()}</div>
              <div role="cell" className="text-sm font-medium">{t.merchant}</div>
              <div role="cell">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColor(t.category)}`}>{t.category}</span>
              </div>
              <div role="cell" className={`text-sm text-right ${t.amount < 0 ? 'text-rose-600' : 'text-emerald-600'} font-semibold`}>
                {t.amount < 0 ? '-' : '+'}{currency.format(Math.abs(t.amount))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div role="row" className="px-4 py-6 text-center text-gray-600">No transactions match your filters.</div>
          )}
        </div>
      </div>
    </section>
  );
}
