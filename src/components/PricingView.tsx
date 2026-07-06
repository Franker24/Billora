import React, { useState } from 'react';
import { Check, CheckCircle, ShieldCheck, HelpCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface PricingViewProps {
  onLaunchConsole: () => void;
}

export function PricingView({ onLaunchConsole }: PricingViewProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  const plans = [
    {
      name: 'Seed Starter',
      description: 'Perfect for sole contractors and starting boutique consultancies.',
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        'Up to 15 Registered Clients',
        'Unlimited Digital Invoices',
        'Standard PDF Export Theme',
        'Manual Payment Clearance Settle',
        'Weekly Activity Audit Trails'
      ],
      popular: false,
      badge: 'Solopreneur Tier'
    },
    {
      name: 'Growth Professional',
      description: 'Optimized for rapidly expanding corporate teams and active SaaS entities.',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        'Unlimited Registered Clients',
        'Unlimited Digital Invoices',
        '6 Dynamic Multi-Color Layout Themes',
        'Integrated Team Members Log (Up to 8)',
        'Full Accounts Share & Settlement Indices',
        'Advanced Expense Tracking Ledger',
        'Priority Technical Support Desk'
      ],
      popular: true,
      badge: 'Highly Requested'
    },
    {
      name: 'Enterprise Core',
      description: 'Tailored for multi-entity networks requiring strict ledger controls and audits.',
      monthlyPrice: 129,
      annualPrice: 99,
      features: [
        'Unlimited Multi-Entity Ledgers',
        'Uncapped Team Collaboration Seats',
        'White-labeled Corporate Billing PDF',
        'Automated Invoice Recurring Engines',
        'Authorized API Access Key Token',
        'Dedicated Financial Success Officer',
        'SLA Standard Response Commitments'
      ],
      popular: false,
      badge: 'High Performance'
    }
  ];

  return (
    <div className="space-y-12 py-4" id="marketing-pricing-view">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Licensing Options</span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Structured plans for business of any scale</h1>
        <p className="text-xs text-slate-500">
          Begin leveraging the local sandbox environment completely free. Upgrade the billing limits as your ledger transactions mount.
        </p>

        {/* Toggle billing period */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 mt-2">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              billingPeriod === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Bill Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annually')}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              billingPeriod === 'annually' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Bill Annually <span className="text-emerald-600 font-extrabold text-[9px] bg-emerald-50 px-1 rounded-sm ml-0.5">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="pricing-matrix">
        {plans.map((plan) => {
          const currentPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
          return (
            <motion.div 
              key={plan.name}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`p-6 bg-white rounded-xl border flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                plan.popular 
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10 hover:shadow-lg' 
                  : 'border-slate-205 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-600 border-none font-bold text-[9px] py-0.5 tracking-wider uppercase shadow-sm">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              {!plan.popular && (
                <div className="absolute -top-3 left-6">
                  <Badge className="bg-slate-50 text-slate-650 hover:bg-slate-50 text-[8px] font-bold border border-slate-200 py-0 uppercase">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Top part block */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base">{plan.name}</h3>
                  <p className="text-slate-500 leading-relaxed text-[11px] min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-1 border-b border-slate-100 pb-3">
                  <span className="text-2xl font-extrabold font-mono text-slate-800">$</span>
                  <span className="text-3xl font-extrabold font-mono text-slate-800 tracking-tight">{currentPrice}</span>
                  <span className="text-slate-400 text-xs font-semibold">/month</span>
                  {billingPeriod === 'annually' && (
                    <span className="text-[9px] text-slate-400 block ml-2">Billed ${currentPrice * 12}/year</span>
                  )}
                </div>

                {/* Features block */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Features included</span>
                  <ul className="space-y-2 text-xs text-slate-650">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="size-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action trigger button */}
              <div>
                <Button 
                  onClick={onLaunchConsole}
                  className={`w-full justify-center rounded-md font-semibold text-xs h-9 cursor-pointer transition-colors ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-205'
                  }`}
                >
                  {plan.popular ? 'Deploy Professional Sandbox' : 'Initiate Sandbox Trial'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compliance / Guarantee */}
      <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 text-left">
          <div className="size-9 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Sovereign Accounting Standard Guarantee</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">All local metrics comply fully with GAAS criteria and general audit trace standards.</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">No hidden clearance fees or settlement surcharges.</p>
      </div>
    </div>
  );
}
