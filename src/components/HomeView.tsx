import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users2, 
  Compass, 
  ChevronRight, 
  BarChart3,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface HomeViewProps {
  onExploreFeatures: () => void;
  onLaunchConsole: () => void;
  onContactSupport: () => void;
}

export function HomeView({
  onExploreFeatures,
  onLaunchConsole,
  onContactSupport
}: HomeViewProps) {
  // Stagger variants for value proposition cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="space-y-16 py-4" id="marketing-home-view">
      {/* Hero Visual Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative rounded-2xl bg-slate-900 overflow-hidden px-6 py-12 sm:px-12 sm:py-20 text-white shadow-xl flex flex-col lg:flex-row lg:items-center gap-10"
      >
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Left column text */}
        <div className="relative z-10 flex-1 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
            <Flame className="size-3.5 text-blue-400" />
            Next-Gen Billing Engine 2.1
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white lg:max-w-md">
            Painless corporate cash ledger flows.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Draft, authorize, and dispatch micro-payment invoices. Billora centralizes customer ledgers, aging analytics, and settlements through a beautifully tailored workspace.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                onClick={onLaunchConsole} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-10 px-5 text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Launch Live Console
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                onClick={onExploreFeatures} 
                variant="outline" 
                className="bg-slate-800/50 hover:bg-slate-800 text-slate-200 border-slate-700 rounded-md h-10 px-5 text-xs font-semibold cursor-pointer"
              >
                Explore Capabilities
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right column: Sleek Mockup representation */}
        <div className="relative z-10 lg:flex-1 hidden md:block">
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md space-y-4 cursor-default"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500" />
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span className="size-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-mono text-[9px] text-slate-500">ledger.billora.co/active</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">#INV-2026-608</span>
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[9px]">CLEARED</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full w-2/3" />
              <div className="h-10 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-between px-3 text-[10px] font-mono">
                <span className="text-slate-400">ACME Corporation</span>
                <span className="text-white font-bold">$12,450.00</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900 p-2.5 rounded-md border border-slate-800 text-center font-mono">
                   <span className="text-[8px] text-slate-500 block uppercase">Collected</span>
                  <span className="text-xs font-bold text-slate-200">$45.8k</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-md border border-slate-800 text-center font-mono">
                  <span className="text-[8px] text-slate-500 block uppercase">Pending</span>
                  <span className="text-xs font-bold text-slate-200">$18.2k</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-md border border-slate-800 text-center font-mono">
                  <span className="text-[8px] text-slate-500 block uppercase">Rate</span>
                  <span className="text-xs font-bold text-slate-200">92.4%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Corporate Value Propositions Grid */}
      <div className="space-y-6" id="value-props">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Enterprise Standards</span>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Structured to coordinate accounting</h2>
          <p className="text-xs text-slate-500">Every aspect of payment matching, customer ledger maintenance, and fiscal metrics is pre-built to ensure fluid operations.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs space-y-3 hover:shadow-md transition-all duration-305 cursor-default"
          >
            <div className="size-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
              <Zap className="size-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Instant Ledger Drafts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create multiple line-item invoices with calculated tax parameters in standard VAT/Service formats. Add custom payment terms within seconds.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs space-y-3 hover:shadow-md transition-all duration-305 cursor-default"
          >
            <div className="size-8 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <ShieldCheck className="size-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Funds Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Log settlements referencing authorizations, bank wire routing numbers, and transfer modes to ensure that payments match outstanding aging ledgers.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs space-y-3 hover:shadow-md transition-all duration-305 cursor-default"
          >
            <div className="size-8 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <BarChart3 className="size-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Quarterly Performance Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Audit cumulative billed volumes, account shares, settlement indices, and receivables lists using interactive Cartesian models.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Flow Steps Showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="bg-slate-50 border border-slate-150 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="flex gap-4">
          <span className="font-mono text-2xl font-extrabold text-slate-300">01</span>
          <div>
            <h4 className="font-bold text-slate-800 text-xs text-slate-700">Set entity parameters</h4>
            <p className="text-slate-500 text-[11px] mt-1">Configure company registry details, custom state tax rates, and global billing limits in Settings.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="font-mono text-2xl font-extrabold text-slate-300">02</span>
          <div>
            <h4 className="font-bold text-slate-800 text-xs text-slate-700">Register clients</h4>
            <p className="text-slate-500 text-[11px] mt-1">Maintain dedicated client accounts to instantly compute outstanding ledger bills and settlement matrices.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="font-mono text-2xl font-extrabold text-slate-300">03</span>
          <div>
            <h4 className="font-bold text-slate-800 text-xs text-slate-700">Trace and settle</h4>
            <p className="text-slate-500 text-[11px] mt-1">Accept corporate transfers, wire bank clearings, and log verification notes directly onto the ledger index.</p>
          </div>
        </div>
      </motion.div>

      {/* Call to Actions */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="border border-slate-200 bg-white rounded-xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-4 shadow-xs"
      >
        <h3 className="text-lg font-bold text-slate-800">Ready to audit business volume?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Start utilizing Billora's sandbox suite to manage assets, clear receivables, and streamline corporate invoicing operations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={onLaunchConsole} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-9 px-4 text-xs cursor-pointer shadow-sm"
            >
              Launch Active Workspace
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={onContactSupport} 
              variant="outline" 
              className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md h-9 px-4 text-xs font-semibold cursor-pointer bg-white"
            >
              Contact Integration Team
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
