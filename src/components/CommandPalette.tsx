import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, CreditCard, DollarSign, Users, Users2, TrendingUp, Settings, FileText, CornerDownLeft, Sparkles } from 'lucide-react';

interface CommandOption {
  id: string;
  title: string;
  subtitle: string;
  shortcut?: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onTriggerNewInvoice?: () => void;
  onTriggerNewExpense?: () => void;
  onTriggerNewCustomer?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onTriggerNewInvoice,
  onTriggerNewExpense,
  onTriggerNewCustomer
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options: CommandOption[] = [
    // Navigation
    {
      id: 'nav_dash',
      title: 'Go to Dashboard',
      subtitle: 'View cumulative charts, recent activity and KPIs',
      shortcut: '⌥ 1',
      category: 'Navigation',
      icon: Compass,
      action: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'nav_inv',
      title: 'Go to Invoices Ledger',
      subtitle: 'Create, authorize and list corporate invoices',
      shortcut: '⌥ 2',
      category: 'Navigation',
      icon: FileText,
      action: () => { onNavigate('invoices'); onClose(); }
    },
    {
      id: 'nav_exp',
      title: 'Go to Expense Registry',
      subtitle: 'Log and track team expenses, cost receipts',
      shortcut: '⌥ 3',
      category: 'Navigation',
      icon: DollarSign,
      action: () => { onNavigate('expenses'); onClose(); }
    },
    {
      id: 'nav_pay',
      title: 'Go to Cleared Payments',
      subtitle: 'Settle invoices, record wire transfers',
      shortcut: '⌥ 4',
      category: 'Navigation',
      icon: CreditCard,
      action: () => { onNavigate('payments'); onClose(); }
    },
    {
      id: 'nav_cust',
      title: 'Go to Client Accounts',
      subtitle: 'Manage companies, outstanding balance lists',
      shortcut: '⌥ 5',
      category: 'Navigation',
      icon: Users,
      action: () => { onNavigate('customers'); onClose(); }
    },
    {
      id: 'nav_team',
      title: 'Go to Corporate Team',
      subtitle: 'Invite team members, assign ledger permissions',
      shortcut: '⌥ 6',
      category: 'Navigation',
      icon: Users2,
      action: () => { onNavigate('team'); onClose(); }
    },
    {
      id: 'nav_rep',
      title: 'Go to Performance Stats',
      subtitle: 'View cash flow models, revenue indices',
      shortcut: '⌥ 7',
      category: 'Navigation',
      icon: TrendingUp,
      action: () => { onNavigate('reports'); onClose(); }
    },
    {
      id: 'nav_sett',
      title: 'Go to Ledger Config',
      subtitle: 'Configure tax rate, terms, profile setup',
      shortcut: '⌥ 8',
      category: 'Navigation',
      icon: Settings,
      action: () => { onNavigate('settings'); onClose(); }
    },
    // Quick Actions
    {
      id: 'act_new_inv',
      title: 'Create New Invoice...',
      subtitle: 'Draft a brand new corporate invoice ledger',
      shortcut: '⌘ N',
      category: 'Quick Actions',
      icon: Sparkles,
      action: () => {
        onNavigate('invoices');
        onClose();
        if (onTriggerNewInvoice) {
          setTimeout(onTriggerNewInvoice, 250);
        }
      }
    },
    {
      id: 'act_new_exp',
      title: 'Log New Expense...',
      subtitle: 'Record wire receipt or SaaS software expense',
      shortcut: '⌘ E',
      category: 'Quick Actions',
      icon: DollarSign,
      action: () => {
        onNavigate('expenses');
        onClose();
        if (onTriggerNewExpense) {
          setTimeout(onTriggerNewExpense, 250);
        }
      }
    },
    {
      id: 'act_new_cust',
      title: 'Add Client Account...',
      subtitle: 'Register a new customer entity profile',
      shortcut: '⌘ C',
      category: 'Quick Actions',
      icon: Users,
      action: () => {
        onNavigate('customers');
        onClose();
        if (onTriggerNewCustomer) {
          setTimeout(onTriggerNewCustomer, 250);
        }
      }
    }
  ];

  const filtered = options.filter(opt =>
    opt.title.toLowerCase().includes(search.toLowerCase()) ||
    opt.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    opt.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  // Click outside close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] flex items-start justify-center pt-20 px-4 md:pt-32"
          onClick={handleBackdropClick}
          id="cmd-palette-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[460px]"
            id="cmd-palette-box"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="size-4.5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search command actions or navigating views..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-0 focus:outline-hidden focus:ring-0 text-xs text-slate-800 placeholder-slate-400 font-medium"
              />
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-sm text-slate-400 font-extrabold font-mono shrink-0 select-none">
                ESC
              </span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none" id="cmd-palette-list">
              {filtered.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-400 text-xs font-semibold">
                  No actions found for "{search}"
                </div>
              ) : (
                Object.entries(
                  filtered.reduce((groups, option) => {
                    if (!groups[option.category]) groups[option.category] = [];
                    groups[option.category].push(option);
                    return groups;
                  }, {} as Record<string, CommandOption[]>)
                ).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 px-3 py-1.5">
                      {category}
                    </div>
                    {items.map((item) => {
                      const absoluteIndex = filtered.indexOf(item);
                      const isSelected = absoluteIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${isSelected ? 'bg-blue-700' : 'bg-slate-100 border border-slate-150'}`}>
                              <Icon className={`size-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold leading-tight">{item.title}</span>
                              <span className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400 font-medium'}`}>
                                {item.subtitle}
                              </span>
                            </div>
                          </div>
                          {item.shortcut && (
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Help footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold select-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="bg-white border border-slate-200 px-1 py-0.5 rounded shadow-2xs font-mono">↑↓</span> Move
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white border border-slate-200 px-1 py-0.5 rounded shadow-2xs font-mono">
                    <CornerDownLeft className="size-2 inline" /> Enter
                  </span> Select
                </span>
              </div>
              <div>
                Stripe Level Polish
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
