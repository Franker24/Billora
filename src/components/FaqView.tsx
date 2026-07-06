import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, FileQuestion, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface FaqViewProps {
  onContactSupport: () => void;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'Billing' | 'Technical' | 'Business';
}

export function FaqView({ onContactSupport }: FaqViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(1); // default expand first item
  const [activeCategory, setActiveCategory] = useState<'All' | 'Billing' | 'Technical' | 'Business'>('All');

  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'Is my data synchronized with external database clouds?',
      answer: 'By default, the Billora sandbox uses Web LocalStorage APIs. Your cliente database, invoices log, payment clearances, expenses ledger, and profile settings persist securely locally in your browser cache. Secure enterprise installations connect directly with low-latency Firestore servers.',
      category: 'Technical'
    },
    {
      id: 2,
      question: 'How do Net-Terms and Aging Invoices operate inside the ledger?',
      answer: 'Each customer invoice contains an Issue Date and a Due Date calculated automatically based on your Entity Term preferences (e.g. Net 30, Net 45). If the active date passes the Due Date and the status is not marked as Paid, Billora marks it as "Overdue" or "Pending overdue" respectively.',
      category: 'Billing'
    },
    {
      id: 3,
      question: 'Can I apply custom or multiple Tax Rates to business deals?',
      answer: 'Yes! In the Settings configuration card, you can define your Default Company Tax Rate (0% standard exempt, 5% VAT, 8% LLC state, etc.). You can also overwrite the tax rate instantly inside the Invoice Drafting engine before sending documents.',
      category: 'Billing'
    },
    {
      id: 4,
      question: 'How do I record payment transactions and secure bank routing codes?',
      answer: 'Open the Payments tab or click "Record Payment" from an active invoice. Input the payment amount, select from wire transfer modes (ACH Wire, Card, Cash Pools, etc.), write down the legal reference authorization keys, and save. The invoice balances recalculate instantly.',
      category: 'Business'
    },
    {
      id: 5,
      question: 'What happens when I trigger the Factory Restore option?',
      answer: 'The Factory Restore function accessible from Settings empties your custom browser database caches and imports original mock corporate templates (clients, ledger list logs, payment indices, team members) back into active state. Use it to reset standard demo sandboxes.',
      category: 'Technical'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="space-y-12 py-4" id="faq-workspace">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Customer Support</span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Got questions? We have answers.</h1>
        <p className="text-xs text-slate-500">
          Search our comprehensive support material covering default cash ledgers, accounting rules, terms configuration, and payment traces.
        </p>

        {/* Search Input bar */}
        <div className="max-w-md mx-auto relative mt-2">
          <Input 
            type="text" 
            placeholder="Search help topics (e.g., matching wire clearings, tax exempt)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 px-3.5 text-xs rounded-lg border-slate-205 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Category triggers */}
        <div className="flex justify-center gap-1.5 flex-wrap pt-1">
          {['All', 'Billing', 'Technical', 'Business'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-white text-slate-550 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="max-w-2xl mx-auto space-y-3" id="faq-accordion-rows">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <motion.div 
                key={faq.id}
                whileHover={{ y: -2, scale: 1.005 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-white border border-slate-205 rounded-xl overflow-hidden transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-xs cursor-pointer hover:bg-slate-50/50"
                >
                  <span className="flex items-center gap-2">
                    <FileQuestion className="size-4 text-slate-400 shrink-0" />
                    {faq.question}
                  </span>
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-slate-500 text-xs leading-relaxed border-t border-slate-50">
                        <p>{faq.answer}</p>
                        <div className="flex items-center justify-between mt-3 text-[9px] text-slate-400 font-bold border-t border-slate-100 pt-2 uppercase">
                          <span>Category: {faq.category}</span>
                          <span className="text-[8px] text-emerald-600 font-extrabold flex items-center gap-0.5">● Dynamic Help verified</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-xs">
            No matching help topics were found. Try another search phrase like "tax" or "factory".
          </div>
        )}
      </div>

      {/* Footer support desk */}
      <div className="border border-slate-200 bg-white rounded-xl p-6 text-center max-w-lg mx-auto space-y-3">
        <div className="size-10 bg-blue-10/20 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="size-5" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">Still searching for custom finance advice?</h4>
        <p className="text-xs text-slate-500">
          Our engineering support desk coordinates directly with enterprise accounting departments to implement dedicated high-performance ledgers.
        </p>
        <Button 
          onClick={onContactSupport} 
          variant="outline" 
          className="rounded-md border-slate-200 hover:bg-slate-50 text-blue-600 font-bold text-xs h-8 px-4 cursor-pointer"
        >
          Open Support Ticket
        </Button>
      </div>
    </div>
  );
}
