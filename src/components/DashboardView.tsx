import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ArrowUpRight,
  Eye,
  Search,
  Filter,
  FileDown,
  Activity
} from 'lucide-react';
import { Invoice, Customer, Payment, ActivityLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';
import { AnimatedCounter } from './AnimatedCounter';

interface DashboardViewProps {
  invoices: Invoice[];
  customers: Customer[];
  payments: Payment[];
  logs: ActivityLog[];
  onNavigateToTab: (tab: string) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function DashboardView({
  invoices,
  customers,
  payments,
  logs,
  onNavigateToTab,
  onViewInvoice
}: DashboardViewProps) {
  // Toggle states
  const [showSaaSMetrics, setShowSaaSMetrics] = useState(false);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  // Calculate core metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.status !== 'Draft' ? inv.total : 0), 0);
  const paidAmount = payments.reduce((sum, p) => p.status === 'Cleared' ? sum + p.amount : 0, 0);
  const outstandingAmount = invoices.reduce((sum, inv) => {
    if (inv.status === 'Pending') return sum + inv.total;
    return sum;
  }, 0);
  const overdueAmount = invoices.reduce((sum, inv) => {
    if (inv.status === 'Overdue') return sum + inv.total;
    return sum;
  }, 0);

  // SaaS calculations
  const mrrAmount = invoices
    .filter(inv => inv.isRecurring)
    .reduce((sum, inv) => {
      const freq = inv.recurrenceFrequency || 'Monthly';
      if (freq === 'Weekly') return sum + (inv.total * 4.33);
      if (freq === 'Quarterly') return sum + (inv.total / 3);
      return sum + inv.total;
    }, 0);

  const arrAmount = mrrAmount * 12;
  const ltvAmount = customers.length > 0 ? paidAmount / customers.length : 0;
  const activeSubsCount = invoices.filter(inv => inv.isRecurring).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Growth percentages or stats (represented beautifully)
  const stats = [
    {
      title: 'Total Invoiced',
      value: totalInvoiced,
      description: 'Exc. draft invoices',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      percentage: '+14.2%',
      trend: 'up',
      prefix: '$',
      decimals: 2
    },
    {
      title: 'Payments Received',
      value: paidAmount,
      description: 'Fully cleared funds',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      percentage: '+8.4%',
      trend: 'up',
      prefix: '$',
      decimals: 2
    },
    {
      title: 'Outstanding Balance',
      value: outstandingAmount,
      description: 'Pending Net-30 collection',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      percentage: `${invoices.filter(i => i.status === 'Pending').length} invoices`,
      trend: 'neutral',
      prefix: '$',
      decimals: 2
    },
    {
      title: 'Overdue Amount',
      value: overdueAmount,
      description: 'Requires immediate follow-up',
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      percentage: 'Needs action',
      trend: 'down',
      prefix: '$',
      decimals: 2
    }
  ];

  const saasStats = [
    {
      title: 'Monthly Rec. Revenue (MRR)',
      value: mrrAmount,
      description: 'MRR subscription runrate',
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      percentage: '+18.5%',
      trend: 'up',
      prefix: '$',
      decimals: 2
    },
    {
      title: 'Annual Rec. Revenue (ARR)',
      value: arrAmount,
      description: 'ARR extrapolated runrate',
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      percentage: 'MRR x 12',
      trend: 'neutral',
      prefix: '$',
      decimals: 2
    },
    {
      title: 'Customer Lifetime Value (LTV)',
      value: ltvAmount,
      description: 'Average collection per client',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      percentage: '+5.4%',
      trend: 'up',
      prefix: '$',
      decimals: 2
    },
    {
      title: 'Active Subscriptions',
      value: activeSubsCount,
      description: 'Recurring billing contracts',
      icon: CreditCard,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      percentage: 'Churn 2.1%',
      trend: 'neutral',
      prefix: '',
      decimals: 0
    }
  ];

  const activeStats = showSaaSMetrics ? saasStats : stats;

  // Get active customers count
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;

  // Get recent 5 invoices
  const recentInvoices = [...invoices]
    .filter(inv => inv.status !== 'Draft')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Filter logs based on search / category
  const sortedAllLogs = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - a.date.localeCompare(b.date));

  const filteredLogs = sortedAllLogs.filter(log => {
    if (logSearchTerm && !log.message.toLowerCase().includes(logSearchTerm.toLowerCase())) {
      return false;
    }
    if (logCategoryFilter !== 'all') {
      if (logCategoryFilter === 'invoice' && !log.type.startsWith('invoice_')) return false;
      if (logCategoryFilter === 'payment' && !log.type.startsWith('payment_') && log.type !== 'invoice_paid') return false;
      if (logCategoryFilter === 'expense' && !log.type.startsWith('expense_')) return false;
      if (logCategoryFilter === 'customer' && !log.type.startsWith('customer_')) return false;
    }
    return true;
  });

  const recentLogs = filteredLogs.slice(0, 5);

  // Export logs to CSV
  const handleExportLogsCSV = () => {
    const headers = 'ID,Date,Type,Message,Amount,RefID\n';
    const rows = logs.map(l => 
      `"${l.id}","${l.date}","${l.type}","${l.message.replace(/"/g, '""')}",${l.amount || 0},"${l.refId || ''}"`
    ).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'billora_audit_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome banner & Top level stats summary */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-white via-white to-blue-50/10 p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Professional handcrafted fintech vector visual representation of ledger grow */}
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600">
              <path d="M12 32H16V22H12V32ZM20 32H24V12H20V32ZM28 32H32V17H28V32ZM8 36H36V38H8V36Z" fill="currentColor" fillOpacity="0.2"/>
              <path d="M10 32H14V22H10V32ZM18 32H22V12H18V32ZM26 32H30V17H26V32ZM6 36H38V38H6V36Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 20L18 10L26 15L36 5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="36" cy="5" r="2.5" fill="#10B981" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 font-sans" id="greeting-header">
              Welcome to Billora
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your billing ledger is healthy. You have collected <span className="font-semibold text-slate-950">{formatCurrency(paidAmount)}</span> this quarter.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto" id="dashboard-welcome-actions">
          {/* SaaS Metrics Toggle Switch */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg shrink-0 sm:mr-1.5 h-9">
            <button
              onClick={() => setShowSaaSMetrics(false)}
              className={`px-2.5 h-7 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                !showSaaSMetrics ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-850 border border-transparent'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setShowSaaSMetrics(true)}
              className={`px-2.5 h-7 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                showSaaSMetrics ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-850 border border-transparent'
              }`}
            >
              SaaS Engine
            </button>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigateToTab('reports')}
            className="font-medium text-xs rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 w-full sm:w-auto justify-center h-9"
            id="view-reports-btn"
          >
            <TrendingUp className="mr-1.5 size-3.5 text-slate-500" />
            View Financial Reports
          </Button>
          <Button 
            size="sm" 
            onClick={() => onNavigateToTab('invoices')}
            className="font-semibold text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs w-full sm:w-auto justify-center h-9"
            id="create-invoice-shortcut-btn"
          >
            <PlusIcon className="mr-1.5 size-3.5" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" 
        id="kpi-grid"
      >
        {activeStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
              className="h-full cursor-default"
            >
              <Card className="overflow-hidden h-full bg-white border border-slate-200 rounded-xl transition-shadow shadow-xs hover:shadow-md" id={`kpi-card-${i}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-lg border ${stat.color}`}>
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight font-mono text-slate-900">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      decimals={stat.decimals} 
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {stat.description}
                    </span>
                    {stat.trend === 'up' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                        <ArrowUpRight className="size-2.5 mr-0.5" />
                        {stat.percentage}
                      </span>
                    )}
                    {stat.trend === 'down' && (
                      <span className="text-[10px] font-bold text-rose-755 bg-rose-50 px-1.5 py-0.5 rounded">
                        {stat.percentage}
                      </span>
                    )}
                    {stat.trend === 'neutral' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {stat.percentage}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>


      {/* Business state & Customer directory snap */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.38 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6" 
        id="dashboard-split-grid"
      >
        {/* Recent Invoices Panel */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm" id="recent-invoices-section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Invoices</h2>
              <p className="text-xs text-slate-500">Overview of bills dispatch and collections</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigateToTab('invoices')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700"
              id="view-all-invoices-btn"
            >
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="recent-invoices-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Issued Info</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentInvoices.map((invoice) => {
                  const initials = invoice.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-mono text-slate-650 text-xs font-semibold">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-755 flex items-center justify-center text-[10px] font-bold mr-2">{initials}</div>
                          <div>
                            <div className="font-medium text-slate-900 text-xs">{invoice.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{invoice.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-505 text-xs">
                        <div>
                          <div>Issued: {invoice.date}</div>
                          <div className="text-[10px] text-slate-400">Due: {invoice.dueDate}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold font-mono text-slate-900 text-xs">{formatCurrency(invoice.total)}</td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={
                            invoice.status === 'Paid' ? 'secondary' : 
                            invoice.status === 'Pending' ? 'outline' : 'destructive'
                          }
                          className={
                            invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase border-0' :
                            invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700 text-[11px] font-bold uppercase border-0' :
                            'bg-slate-100 text-slate-700 text-[11px] font-bold uppercase border-0'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost" 
                          size="icon-xs"
                          onClick={() => onViewInvoice(invoice)}
                          title="View Invoice Details"
                          className="text-slate-400 hover:text-blue-600 rounded-md"
                          id={`view-recent-inv-${invoice.id}`}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Activity Feed Section (Advanced Audits) */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between" id="activity-feed-section">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Events Log</h2>
                <p className="text-xs text-slate-500">Real-time ledger updates</p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleExportLogsCSV}
                title="Export Logs to CSV"
                className="text-slate-500 hover:text-blue-600 hover:bg-slate-50 text-[10px] gap-1 px-2 h-7"
              >
                <FileDown className="size-3.5" />
                CSV
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="size-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={logSearchTerm}
                  onChange={(e) => setLogSearchTerm(e.target.value)}
                  className="pl-7 h-7 text-[10.5px] border-slate-200 focus:border-blue-500 rounded-md placeholder-slate-400 w-full"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'invoice', label: 'Facturas' },
                  { id: 'payment', label: 'Pagos' },
                  { id: 'expense', label: 'Gastos' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setLogCategoryFilter(cat.id)}
                    className={`px-2 py-0.5 rounded text-[9.5px] font-bold transition-all border cursor-pointer ${
                      logCategoryFilter === cat.id
                        ? 'bg-slate-100 text-slate-800 border-slate-300'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-650'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs List container */}
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1" id="logs-container">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => {
                  const dateObj = new Date(log.date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  
                  return (
                    <div key={log.id} className="flex gap-2.5 text-xs items-start border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                      <div className={`p-1.5 rounded-lg border mt-0.5 shrink-0 ${
                        log.type === 'invoice_paid' || log.type === 'payment_received' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : log.type === 'invoice_overdue' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {log.type === 'invoice_paid' || log.type === 'payment_received' ? (
                          <CheckCircle className="size-3" />
                        ) : log.type === 'invoice_overdue' ? (
                          <AlertCircle className="size-3" />
                        ) : (
                          <FileText className="size-3" />
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-slate-700 font-medium leading-snug break-words">{log.message}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-400 text-[9px]">{formattedDate}</span>
                          {log.amount && (
                            <span className="font-mono font-bold text-slate-900 text-[9px]">
                              ({formatCurrency(log.amount)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-[10px]">
                  No se encontraron eventos coincidentes.
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => setIsAuditModalOpen(true)}
            variant="outline"
            className="w-full h-8 text-[11px] font-bold text-slate-600 hover:text-slate-800 border-slate-205 mt-2 rounded-lg"
          >
            Ver Auditoría Completa
          </Button>

          {/* Full Audit Log Modal Dialog */}
          <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
            <DialogContent className="sm:max-w-3xl p-6 rounded-xl border border-slate-200 bg-white shadow-xl max-h-[85vh] flex flex-col">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="size-5 text-blue-600" />
                  Registro General de Auditoría del Ledger (Events Log)
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Historial completo y trazabilidad de transacciones, recurrentes y facturación del Sandbox.
                </DialogDescription>
              </DialogHeader>

              {/* Modal Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 py-3 border-y border-slate-100">
                <div className="relative flex-1">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Buscar en toda la auditoría..."
                    value={logSearchTerm}
                    onChange={(e) => setLogSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-xs border-slate-200 focus:border-blue-500 rounded-md"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <select
                    value={logCategoryFilter}
                    onChange={(e) => setLogCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="all">Categorías: Todas</option>
                    <option value="invoice">Solo Facturas</option>
                    <option value="payment">Solo Pagos</option>
                    <option value="expense">Solo Gastos</option>
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportLogsCSV}
                    className="text-xs gap-1 border-slate-200 text-slate-650"
                  >
                    <FileDown className="size-3.5" />
                    Exportar CSV
                  </Button>
                </div>
              </div>

              {/* Modal Logs Table */}
              <div className="flex-1 overflow-y-auto min-h-[300px] border border-slate-150 rounded-lg mt-3">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                      <th className="px-4 py-3">Código Evento</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Detalle / Mensaje</th>
                      <th className="px-4 py-3 text-right">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-750 font-medium">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400">{log.id}</td>
                          <td className="px-4 py-2.5 text-slate-500">{log.date}</td>
                          <td className="px-4 py-2.5 text-slate-800 font-semibold">{log.message}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                            {log.amount ? formatCurrency(log.amount) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-400 italic">
                          No se encontraron registros de auditoría coincidentes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-between sm:justify-between w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Total Registros: {filteredLogs.length}
                </span>
                <Button size="sm" onClick={() => setIsAuditModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs border-0">
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </motion.div>

      {/* Quick Access cards for other entities */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.38 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6" 
        id="quick-links-grid"
      >
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: '0 8px 30px rgba(59, 130, 246, 0.08)' }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex items-center justify-between p-4 bg-blue-50/40 border border-blue-100/50 rounded-xl cursor-pointer" 
          onClick={() => onNavigateToTab('customers')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100/50 rounded-xl text-blue-700 border border-blue-200/50">
              <Users className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-blue-900">Active Customers</h3>
              <p className="text-[11px] text-blue-700/80">{activeCustomersCount} accounts onboarded</p>
            </div>
          </div>
          <ArrowUpRight className="size-4 text-blue-600 mr-1" />
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: '0 8px 30px rgba(16, 185, 129, 0.08)' }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex items-center justify-between p-4 bg-emerald-50/40 border border-emerald-100/50 rounded-xl cursor-pointer" 
          onClick={() => onNavigateToTab('payments')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100/50 rounded-xl text-emerald-700 border border-emerald-200/50">
              <CreditCard className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-900">Payments</h3>
              <p className="text-[11px] text-emerald-700/80">{payments.length} settled transaction wires</p>
            </div>
          </div>
          <ArrowUpRight className="size-4 text-emerald-600 mr-1" />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Inline small helpers
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
