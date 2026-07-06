import React, { useState } from 'react';
import { 
  FileText, 
  CreditCard, 
  BarChart3, 
  Sparkles, 
  Check, 
  Clock, 
  Workflow, 
  Database,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface FeaturesViewProps {
  onLaunchConsole: () => void;
}

export function FeaturesView({ onLaunchConsole }: FeaturesViewProps) {
  // Demo interactive state
  const [activeDemoTab, setActiveDemoTab] = useState<'invoice' | 'payment' | 'report'>('invoice');

  return (
    <div className="space-y-12 py-4" id="marketing-features-view">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Product Details</span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Designed to capture corporate receivables</h1>
        <p className="text-xs text-slate-500">
          Billora transitions standard PDF receipts into dynamic live assets, ensuring every single business payment matches its registered client ledger.
        </p>
      </div>

      {/* Main interactive demo mockup section */}
      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-blue-600" />
              Interactive Feature Playground
            </h3>
            <p className="text-[10px] text-slate-400">Click tabs below to preview the active UI workflow components.</p>
          </div>
          <div className="flex gap-1 bg-slate-205 p-1 rounded-lg border border-slate-200">
            {[
              { id: 'invoice', label: 'Invoices Ledger', icon: FileText },
              { id: 'payment', label: 'Payment Settle', icon: CreditCard },
              { id: 'report', label: 'Corporate Report', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDemoTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  activeDemoTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-6">
          {activeDemoTab === 'invoice' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 text-xs">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 uppercase text-[9px] font-bold px-2 py-0 border">
                    01. Draft & Dispatch
                  </Badge>
                  <h4 className="text-base font-bold text-slate-800 tracking-tight">Structured Multi-Line Invoicing</h4>
                  <p className="text-slate-500 leading-relaxed text-xs">
                    Draft customer invoices instantly. Add multiple deliverables, customize tax rates, map default terms, and store client footnotes. The calculations compute dynamically.
                  </p>
                  <ul className="space-y-1.5 text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Multi-item billing arrays</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Real-time state tax calculations</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Inline PDF & printable layouts</li>
                  </ul>
                </div>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3 text-[11px] font-mono shadow-xs">
                  <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg">
                    <span className="font-sans text-xs font-bold text-slate-700">Digital Deliverables Log</span>
                    <span className="text-blue-600 font-bold">$14,500.00</span>
                  </div>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Software Development Contract</span>
                      <span>160 hrs @ $80/hr</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>AWS Cloud Infrastructure Provisioning</span>
                      <span>Flat fee @ $1,700</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-700">
                      <span>Total Invoice</span>
                      <span>$14,500.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'payment' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 text-xs">
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 uppercase text-[9px] font-bold px-2 py-0 border">
                    02. Secure Settle
                  </Badge>
                  <h4 className="text-base font-bold text-slate-800 tracking-tight">Financial Wire Ledger matching</h4>
                  <p className="text-slate-500 leading-relaxed text-xs">
                    Clear transaction funds. Pick your payment channel, reference bank transaction hashes, and match cash balances with pending collections instantly.
                  </p>
                  <ul className="space-y-1.5 text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Wire, ACH and cash matching</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Transaction reference code trails</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Auto balances updates</li>
                  </ul>
                </div>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3 text-[11px] font-mono shadow-xs">
                  <span className="text-slate-400 text-[9px] block uppercase font-bold">Matching parameters</span>
                  <div className="p-2.5 bg-white border border-slate-100 rounded-lg space-y-1">
                    <div className="flex justify-between font-bold text-[10px] text-slate-800">
                      <span>Ref Code</span>
                      <span>TXN_98782_FED</span>
                    </div>
                    <div className="flex justify-between text-slate-550 text-[9px]">
                      <span>Amount matched</span>
                      <span className="text-emerald-600 font-bold font-mono">$10,000.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'report' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 text-xs">
                  <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 uppercase text-[9px] font-bold px-2 py-0 border">
                    03. Corporate Audit
                  </Badge>
                  <h4 className="text-base font-bold text-slate-800 tracking-tight">Fintech Analytics Dashboard</h4>
                  <p className="text-slate-500 leading-relaxed text-xs">
                    Evaluate account volume allocation, comparative longitudinal bills vs clearances, payment recovery health indices, and client settlement matrices.
                  </p>
                  <ul className="space-y-1.5 text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Accounts volume distribution share</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Cleared income vs Receivables ratios</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" /> Detailed client settlement ledger matrix</li>
                  </ul>
                </div>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2 text-[11px] font-mono shadow-xs">
                  <span className="text-slate-400 text-[9px] block uppercase font-bold">Billing trend benchmark</span>
                  <div className="space-y-1.5 pt-1">
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Cleared Cash</span>
                        <span className="font-bold text-slate-800">84%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '84%' }} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Receivables Aging</span>
                        <span className="font-bold text-slate-800">16%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 rounded-full" style={{ width: '16%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid of features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="features-box-grid">
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-5 bg-white border border-slate-205 rounded-xl space-y-2 text-xs hover:shadow-md transition-all duration-300 cursor-default"
        >
          <Clock className="size-5 text-blue-600" />
          <h4 className="font-bold text-slate-800 text-sm">Aging Ledger Management</h4>
          <p className="text-slate-500 leading-relaxed subtitle-[11px]">
            Invoices dynamically update status to <Badge className="bg-rose-50 text-rose-700 px-1 hover:bg-rose-50 hover:text-rose-700 font-mono text-[8px] py-0 border border-rose-100 rounded-sm">Overdue</Badge> once the specified net terms window passes, notifying accounting pools immediately.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-5 bg-white border border-slate-205 rounded-xl space-y-2 text-xs hover:shadow-md transition-all duration-300 cursor-default"
        >
          <Calculator className="size-5 text-blue-600" />
          <h4 className="font-bold text-slate-800 text-sm">Adaptive Taxes</h4>
          <p className="text-slate-500 leading-relaxed subtitle-[11px]">
            Switch corporate taxes between standard VAT, Local Service Taxes, state brackets, or pure Tax Exempt categories instantly during the invoice writing phase.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-5 bg-white border border-slate-205 rounded-xl space-y-2 text-xs hover:shadow-md transition-all duration-300 cursor-default"
        >
          <Workflow className="size-5 text-blue-600" />
          <h4 className="font-bold text-slate-800 text-sm">Unified Account Profiles</h4>
          <p className="text-slate-500 leading-relaxed subtitle-[11px]">
            Track total billed volumes and unpaid outstanding logs categorized automatically for each registered client, allowing for deep client assessments.
          </p>
        </motion.div>
      </div>

      {/* CTA bottom */}
      <div className="text-center">
        <Button 
          onClick={onLaunchConsole}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-9 px-5 text-xs flex items-center gap-1.5 mx-auto cursor-pointer"
        >
          Explore Sandbox Ledger
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
