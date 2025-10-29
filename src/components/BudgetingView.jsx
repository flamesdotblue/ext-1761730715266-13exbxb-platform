import { useEffect, useId, useState } from 'react';

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

function Progress({ value, max, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const statusColor = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-700 mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`${label} progress`}>
        <div className={`h-2 ${statusColor} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function BudgetingView() {
  const dailyId = useId();
  const monthlyId = useId();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ daily: 75, monthly: 2000 });

  function validate(name, value) {
    const errs = { ...errors };
    if (value === '' || isNaN(Number(value)) || Number(value) <= 0) {
      errs[name] = 'Please enter a positive number.';
    } else {
      delete errs[name];
    }
    setErrors(errs);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    validate('daily', form.daily);
    validate('monthly', form.monthly);
  }

  useEffect(() => {
    // Live validation
    validate('daily', form.daily);
    validate('monthly', form.monthly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spentToday = 62;
  const spentMonth = 1430;

  return (
    <section aria-labelledby="budgeting-heading" className="space-y-6">
      <h2 id="budgeting-heading" className="text-xl font-semibold">Budgeting</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Set Budgets</h3>
          <form onSubmit={onSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor={dailyId} className="block text-sm font-medium text-gray-700">Daily Budget</label>
                <div className="mt-1 relative">
                  <input
                    id={dailyId}
                    name="daily"
                    inputMode="decimal"
                    aria-invalid={Boolean(errors.daily)}
                    aria-describedby={errors.daily ? `${dailyId}-error` : undefined}
                    className={`w-full px-3 py-2 rounded-md border ${errors.daily ? 'border-rose-500 ring-rose-200' : 'border-gray-300'} bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={form.daily}
                    onChange={onChange}
                  />
                  {errors.daily && (
                    <p id={`${dailyId}-error`} className="mt-1 text-sm text-rose-600">{errors.daily}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor={monthlyId} className="block text-sm font-medium text-gray-700">Monthly Budget</label>
                <div className="mt-1 relative">
                  <input
                    id={monthlyId}
                    name="monthly"
                    inputMode="decimal"
                    aria-invalid={Boolean(errors.monthly)}
                    aria-describedby={errors.monthly ? `${monthlyId}-error` : undefined}
                    className={`w-full px-3 py-2 rounded-md border ${errors.monthly ? 'border-rose-500 ring-rose-200' : 'border-gray-300'} bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={form.monthly}
                    onChange={onChange}
                  />
                  {errors.monthly && (
                    <p id={`${monthlyId}-error`} className="mt-1 text-sm text-rose-600">{errors.monthly}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">Save Budgets</button>
              <button type="button" onClick={() => setForm({ daily: 75, monthly: 2000 })} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">Reset</button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Tracking</h3>
          <div className="space-y-3">
            <Progress value={spentToday} max={Number(form.daily) || 1} label={`Today: ${currency.format(spentToday)} / ${currency.format(Number(form.daily) || 0)}`} />
            <Progress value={spentMonth} max={Number(form.monthly) || 1} label={`This Month: ${currency.format(spentMonth)} / ${currency.format(Number(form.monthly) || 0)}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
