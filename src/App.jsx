import { useState, useEffect } from 'react';
import { Home, List, Wallet, Settings as SettingsIcon } from 'lucide-react';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import BudgetingView from './components/BudgetingView';
import SettingsView from './components/SettingsView';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'transactions', label: 'Transactions', icon: List },
  { key: 'budgeting', label: 'Budgeting', icon: Wallet },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const i = TABS.findIndex(t => t.key === activeTab);
        const nextIndex = e.key === 'ArrowRight' ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length;
        setActiveTab(TABS[nextIndex].key);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#333333] font-inter">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>

      <header className="sticky top-0 z-20 bg-[#F0F2F5]/80 backdrop-blur border-b border-gray-200" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div aria-hidden className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400" />
            <h1 className="text-lg md:text-xl font-semibold" aria-label="Fintrack - Personal Finance Dashboard">Fintrack</h1>
          </div>
          <nav aria-label="Primary" className="hidden md:flex gap-6">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0F2F5] ${activeTab === key ? 'bg-white text-blue-700' : 'text-gray-700 hover:bg-white/70'}`}
                aria-current={activeTab === key ? 'page' : undefined}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="max-w-6xl mx-auto px-4 py-6" role="main">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'budgeting' && <BudgetingView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-gray-200"
      >
        <ul role="tablist" className="grid grid-cols-4">
          {TABS.map(({ key, label, icon: Icon }) => (
            <li key={key} className="contents">
              <button
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`panel-${key}`}
                tabIndex={0}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs ${activeTab === key ? 'text-blue-700' : 'text-gray-600'}`}
              >
                <Icon className="w-5 h-5" aria-hidden />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
