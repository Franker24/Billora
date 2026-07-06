import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Filter, 
  FolderMinus, 
  Calendar, 
  Briefcase, 
  CheckCircle,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense } from '../types';
import { useToast } from './Toast';
import { motion, AnimatePresence } from 'motion/react';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  triggerOpenCreate?: boolean;
  onResetTriggerOpenCreate?: () => void;
  geminiApiKey: string;
}

export function ExpensesView({ 
  expenses, 
  onAddExpense, 
  onDeleteExpense,
  triggerOpenCreate,
  onResetTriggerOpenCreate,
  geminiApiKey
}: ExpensesViewProps) {
  const { success: showSuccess, error: showError } = useToast();

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Log Expense modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (triggerOpenCreate) {
      setIsModalOpen(true);
      onResetTriggerOpenCreate?.();
    }
  }, [triggerOpenCreate, onResetTriggerOpenCreate]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Software');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Approved' | 'Pending' | 'Rejected'>('Approved');

  const [isCategorizing, setIsCategorizing] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleOCRSimulate = (mockData: { desc: string, merch: string, amt: string, date: string, cat: string }) => {
    setOcrLoading(true);
    setTimeout(() => {
      setOcrLoading(false);
      setDescription(mockData.desc);
      setMerchant(mockData.merch);
      setAmount(mockData.amt);
      setDate(mockData.date);
      setCategory(mockData.cat);
      showSuccess(`OCR Completado: ${mockData.merch} por $${mockData.amt} auto-completado`);
    }, 1200);
  };

  const categories = ['Software', 'Office Utilities', 'Marketing', 'Legal & Professional', 'Travel', 'Contractors'];

  // AI Categorizer handler
  const handleAiCategorize = async () => {
    const textToAnalyze = `${description} ${merchant}`.trim();
    if (!textToAnalyze) {
      showError('Por favor ingresa una descripción o comercio para categorizar.');
      return;
    }

    setIsCategorizing(true);

    if (geminiApiKey && geminiApiKey.startsWith('AIza')) {
      const prompt = `Analiza este gasto de negocio: "${textToAnalyze}".
Categorías disponibles:
- Software
- Office Utilities
- Marketing
- Legal & Professional
- Travel
- Contractors

Responde ÚNICAMENTE con el nombre exacto de la categoría más adecuada (sin explicaciones, sin viñetas, sin puntuación).`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply && categories.includes(reply)) {
            setCategory(reply);
            showSuccess(`Categorizado automáticamente como: ${reply}`);
            setIsCategorizing(false);
            return;
          }
        }
      } catch (err) {
        console.error('AI categorization failed:', err);
      }
    }

    // Smart rules local fallback matching
    await new Promise(r => setTimeout(r, 600));
    const lower = textToAnalyze.toLowerCase();
    let suggested: string = 'Software';

    if (/aws|gcp|vercel|heroku|github|figma|adobe|suscripcion|saas|hosting|software|copilot|chatgpt|openai/i.test(lower)) {
      suggested = 'Software';
    } else if (/facebook|google ads|ads|marketing|publicidad|instagram|newsletter|promo/i.test(lower)) {
      suggested = 'Marketing';
    } else if (/abogado|contador|legal|advocate|lawyer|consultor|accounting|taxes|fiscal/i.test(lower)) {
      suggested = 'Legal & Professional';
    } else if (/hotel|vuelo|viaje|uber|cabify|taxi|restaurante|comida|airport|flight|stay/i.test(lower)) {
      suggested = 'Travel';
    } else if (/freelance|contractor|desarrollador|designer|upwork|fiverr/i.test(lower)) {
      suggested = 'Contractors';
    } else if (/papeleria|silla|luz|agua|internet|oficina|office|utilities|desk|supplies/i.test(lower)) {
      suggested = 'Office Utilities';
    } else {
      suggested = 'Office Utilities';
    }

    setCategory(suggested);
    showSuccess(`Categoría sugerida (Simulación): ${suggested}`);
    setIsCategorizing(false);
  };

  // Handle local submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !merchant) return;

    onAddExpense({
      description,
      amount: Number(amount),
      category,
      merchant,
      date,
      status
    });

    showSuccess(`Expense record for "${description}" (${merchant}) logged successfully`);

    // Reset local state fields
    setDescription('');
    setAmount('');
    setCategory('Software');
    setMerchant('');
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('Approved');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Software': return <Briefcase className="size-4 text-blue-600" />;
      case 'Marketing': return <TrendingDown className="size-4 text-violet-600" />;
      case 'Office Utilities': return <ShoppingBag className="size-4 text-amber-600" />;
      default: return <FolderMinus className="size-4 text-slate-600" />;
    }
  };

  // Calculations
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || exp.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const aggregateTotal = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Compute category breakdown totals for the sidecard list
  const categoryTotals = categories.map(cat => {
    const total = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, total };
  }).filter(c => c.total > 0);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="space-y-6" 
      id="expenses-ledger-workspace"
    >
      {/* Header Info row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="expenses-header">
        <div>
          <h1 className="text-xl font-bold font-sans text-slate-800 tracking-tight">Accounts Outflow Ledger</h1>
          <p className="text-xs text-slate-500">Track company cost centers, software licensing, physical items procurement, and travel receipts</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-xs h-9 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto sm:ml-0"
        >
          <Plus className="size-4" />
          Log Expense Receipt
        </Button>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="expenses-split-grid">
        {/* Statistics and cost centers left col */}
        <div className="space-y-6 col-span-1" id="expenses-sidecards-col">
          {/* Total outflows card */}
          <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-4">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Filtered Outflow</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <span className="text-2xl font-mono font-extrabold text-slate-800 block">{formatCurrency(aggregateTotal)}</span>
              <p className="text-[9px] text-slate-400">Summed from {filteredExpenses.length} filtered transaction rows.</p>
            </CardContent>
          </Card>

          {/* Category split card list */}
          <Card className="border border-slate-205 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-4">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">By Cost Department</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              {categoryTotals.length > 0 ? (
                categoryTotals.map(item => (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-650">
                      <span className="font-semibold flex items-center gap-1.5">
                        {getCategoryIcon(item.name)}
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{formatCurrency(item.total)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (item.total / (aggregateTotal || 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-400 text-center">No categories recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Interactive Expense ledger list right col */}
        <div className="lg:col-span-3 space-y-4" id="expenses-list-col">
          {/* Filtering row options */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs text-xs" id="expenses-filter-bar">
            <div className="flex-1">
              <Input 
                type="text" 
                placeholder="Filter description, supplier merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs border-slate-200 bg-white"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Cost Departments</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Approvals</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Ledger Table listing */}
          <div className="bg-white rounded-xl border border-slate-205 shadow-sm overflow-x-auto w-full" id="expenses-ledger-table-wrapper">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2.5 px-4 font-semibold">Expense Log</th>
                  <th className="py-2.5 px-2 font-semibold">Department</th>
                  <th className="py-2.5 px-2 font-semibold">Merchant</th>
                  <th className="py-2.5 px-2 font-semibold text-right">Amount</th>
                  <th className="py-2.5 px-2 font-semibold text-center">Receipt Approval</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/20 text-slate-750 transition-colors">
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 text-xs block">{exp.description}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">{exp.date}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-slate-100 text-slate-650 hover:bg-slate-100 border-none font-bold text-[9px] uppercase px-1.5 py-0">
                          {exp.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-600">{exp.merchant}</td>
                      <td className="py-3 px-2 font-mono font-bold text-slate-800 text-right">{formatCurrency(exp.amount)}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={`font-extrabold text-[8px] uppercase px-1.5 py-0 border ${
                          exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          exp.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {exp.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the expense for ${exp.description}?`)) {
                              onDeleteExpense(exp.id);
                              showSuccess(`Expense for "${exp.description}" has been deleted`);
                            }
                          }}
                          variant="ghost" 
                          size="sm" 
                          className="size-7 p-0 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 cursor-pointer"
                          title="Erase Cost Entry"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium bg-slate-50/50 rounded-b-xl">
                      No expense receipts found. Click "Log Expense" to record a new business cost.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Expense Dialog modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="expense-modal">
          <Card className="w-full max-w-md border border-slate-200 shadow-2xl bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="size-4 text-blue-600" />
                Log Cost Receipt Outflow
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">Record a standard cash ledger cost entry with department allocations.</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Simulated OCR Drag and Drop zone */}
                <div className="bg-slate-50 border border-dashed border-slate-300 p-3 rounded-lg text-center space-y-2 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="size-3 text-blue-600 animate-pulse" />
                      Simulador de Escaneo OCR por IA
                    </span>
                    {ocrLoading && <Loader2 className="size-3.5 text-blue-600 animate-spin" />}
                  </div>
                  <div className="flex gap-1.5 justify-center">
                    {[
                      { desc: 'AWS Receipt', val: { desc: 'AWS Cloud Monthly Fee', merch: 'Amazon Web Services Inc.', amt: '245.80', date: new Date().toISOString().split('T')[0], cat: 'Software' } },
                      { desc: 'Uber Ticket', val: { desc: 'Client Meeting Ride', merch: 'Uber Technologies Inc.', amt: '42.50', date: new Date().toISOString().split('T')[0], cat: 'Travel' } },
                      { desc: 'Rent Invoice', val: { desc: 'Co-working Office Rent', merch: 'WeWork Labs LLC', amt: '1800.00', date: new Date().toISOString().split('T')[0], cat: 'Office Utilities' } }
                    ].map(rec => (
                      <button
                        key={rec.desc}
                        type="button"
                        onClick={() => handleOCRSimulate(rec.val)}
                        disabled={ocrLoading}
                        className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-750 hover:text-blue-700 text-[10px] font-bold py-1 px-2.5 rounded-md cursor-pointer transition-all active:scale-95"
                      >
                        📄 {rec.desc}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400">Pulsar un ticket para simular escaneo e inserción rápida de campos.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Receipt Description *</label>
                  <Input 
                    type="text" 
                    required 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-8 text-xs border-slate-200 focus:border-blue-500 rounded-md"
                    placeholder="e.g. AWS Cloud Infrastructure Renewal Fee"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Supplier Merchant *</label>
                    <Input 
                      type="text" 
                      required 
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      className="h-8 text-xs border-slate-200 focus:border-blue-500 rounded-md"
                      placeholder="e.g. Amazon Web Services Inc."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Amount (USD) *</label>
                    <Input 
                      type="number" 
                      step="0.01"
                      required 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-8 text-xs border-slate-200 focus:border-blue-500 rounded-md font-mono"
                      placeholder="e.g. 1750.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Date Paid</label>
                    <Input 
                      type="date" 
                      required 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-8 text-xs border-slate-200 focus:border-blue-500 rounded-md font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cost Department</label>
                      <button
                        type="button"
                        onClick={handleAiCategorize}
                        disabled={isCategorizing}
                        className="text-[9px] font-bold text-blue-650 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer disabled:text-slate-400 border-0 bg-transparent"
                        title="Autodetect category using AI"
                      >
                        {isCategorizing ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Sparkles className="size-3 text-blue-500" />
                        )}
                        Autodetectar IA
                      </button>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Receipt Approvals State</label>
                  <div className="flex gap-2">
                    {['Approved', 'Pending', 'Rejected'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStatus(opt as any)}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold border rounded-md transition-colors cursor-pointer ${
                          status === opt 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <Button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost" 
                    size="sm" 
                    className="h-8 rounded-md font-semibold text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-8 rounded-md font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Post Log Entry
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
