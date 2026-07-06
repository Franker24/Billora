import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Invoice, Customer, Payment, MonthlyRevenue, Expense } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface ReportsViewProps {
  invoices: Invoice[];
  customers: Customer[];
  payments: Payment[];
  expenses: Expense[];
}

export function ReportsView({
  invoices,
  customers,
  payments,
  expenses
}: ReportsViewProps) {

  // Standard metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.status !== 'Draft' ? inv.total : 0), 0);
  const totalPaid = payments.reduce((sum, p) => p.status === 'Cleared' ? sum + p.amount : 0, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => inv.status === 'Pending' ? sum + inv.total : 0, 0);
  const totalOverdue = invoices.reduce((sum, inv) => inv.status === 'Overdue' ? sum + inv.total : 0, 0);

  // Collection Efficiency index
  const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;

  // Revenue by customer data preparation
  const customerRevenueData = customers.map(cust => {
    // Total invoiced to this specific client
    const billedToClient = invoices
      .filter(i => i.customerId === cust.id && i.status !== 'Draft')
      .reduce((sum, i) => sum + i.total, 0);
    
    // Total settled by client
    const settledByClient = payments
      .filter(p => p.customerId === cust.id && p.status === 'Cleared')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      name: cust.company || cust.name,
      billed: billedToClient,
      paid: settledByClient,
      outstanding: Math.max(0, billedToClient - settledByClient)
    };
  }).filter(item => item.billed > 0)
    .sort((a, b) => b.billed - a.billed);

  // Colors list for Pie slice charts
  const COLOR_PALETTE = [
    '#2563eb', // blue-600
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
  ];

  // P&L Calculations
  const totalApprovedExpenses = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalPaid - totalApprovedExpenses;
  const operatingMargin = totalPaid > 0 ? (netProfit / totalPaid) * 100 : 0;

  // Build Cash Flow Forecast Data (Weekly projection for next 6 weeks)
  const cashFlowForecastData = (() => {
    let currentBalance = totalPaid;
    const data = [];
    const today = new Date();
    
    // Starting point
    data.push({ week: 'Hoy', balance: currentBalance });

    for (let i = 1; i <= 6; i++) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() + (i - 1) * 7);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + i * 7);

      // Sum pending/overdue invoices due in this week range
      const expectedReceivables = invoices
        .filter(inv => {
          if (inv.status === 'Paid' || inv.status === 'Draft') return false;
          const due = new Date(inv.dueDate);
          return due >= startOfWeek && due < endOfWeek;
        })
        .reduce((sum, inv) => sum + inv.total, 0);

      // Sum pending expenses due in this week range
      const expectedOutflows = expenses
        .filter(exp => {
          if (exp.status === 'Rejected') return false;
          const expDate = new Date(exp.date);
          return expDate >= startOfWeek && expDate < endOfWeek;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      currentBalance += (expectedReceivables - expectedOutflows);
      data.push({
        week: `Sem +${i}`,
        balance: Math.max(0, currentBalance)
      });
    }
    return data;
  })();

  // chronological reports trend
  const monthlyData: MonthlyRevenue[] = [
    { month: 'Sep 25', revenue: 15400, pending: 2200 },
    { month: 'Oct 25', revenue: 18200, pending: 1450 },
    { month: 'Nov 25', revenue: 21000, pending: 3100 },
    { month: 'Dec 25', revenue: 14500, pending: 4200 },
    { month: 'Jan 26', revenue: 24700, pending: 5800 },
    { month: 'Feb 26', revenue: totalPaid, pending: totalOutstanding + totalOverdue }
  ];

  // Format currencies
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="space-y-6" 
      id="reports-workspace-container"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="reports-header-row">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Fintech Analytics & Performance Insights</h1>
          <p className="text-xs text-slate-500">Corporate cash flows, aging ledger categories, and business volume analysis</p>
        </div>
      </div>

      {/* Mini stats cards for Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="reports-kpi-grid">
        <div className="bg-white p-4 rounded-xl border border-slate-205 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
          <span className="text-lg font-bold font-mono text-slate-800 block mt-1">{formatCurrency(totalInvoiced)}</span>
          <p className="text-[10px] text-slate-400 mt-1">Sum of active invoices</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-205 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Collected Funds</span>
          <span className="text-lg font-bold font-mono text-emerald-600 block mt-1">{formatCurrency(totalPaid)}</span>
          <p className="text-[10px] text-slate-400 mt-1">Cleared business cash</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-205 shadow-sm">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Pending Ledger</span>
          <span className="text-lg font-bold font-mono text-amber-600 block mt-1">{formatCurrency(totalOutstanding)}</span>
          <p className="text-[10px] text-slate-400 mt-1">Due within terms window</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-205 shadow-sm">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Overdue Balances</span>
          <span className="text-lg font-bold font-mono text-rose-600 block mt-1">{formatCurrency(totalOverdue)}</span>
          <p className="text-[10px] text-slate-400 mt-1">Requires active collections</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/15 shadow-sm">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Collection Ratio</span>
          <span className="text-lg font-bold font-mono text-blue-800 block mt-1">{collectionRate.toFixed(1)}%</span>
          <p className="text-[10px] text-blue-400 mt-1">Payment recovery health</p>
        </div>
      </div>

      {/* P&L Financial Statement Card & Cash Flow Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profit-and-loss-container">
        {/* P&L Details */}
        <Card className="lg:col-span-1 border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-4">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Pérdidas y Ganancias (P&L)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Total Cobrado (Ingresos):</span>
              <span className="font-mono font-bold text-emerald-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Total Aprobado (Gastos):</span>
              <span className="font-mono font-bold text-rose-600">{formatCurrency(totalApprovedExpenses)}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Margen Operativo Neto:</span>
              <span className={`font-mono font-bold ${netProfit >= 0 ? 'text-blue-650' : 'text-rose-600'}`}>
                {formatCurrency(netProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Porcentaje de Margen:</span>
              <Badge className={operatingMargin >= 25 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-0 border' : 'bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-0 border'}>
                {operatingMargin.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Forecast Chart */}
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-4">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Previsión de Flujo de Caja (6 Semanas)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[145px]" id="cashflow-forecast-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} />
                  <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Saldo Proyectado']}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Graphs Split row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="reports-charts-split">
        {/* Longitudinal billing trend bar-line-chart */}
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">Longitudinal Revenue & Receivables</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Comparative analysis of monthly cleared income vs pending collection backlogs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]" id="revenue-trend-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                   data={monthlyData}
                   margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Cleared Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Receivables Pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue share by client donut pie chart */}
        <Card className="border border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">Account Volume Shares</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Distribution shares of cumulative billings across accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[200px] w-full" id="client-share-chart-container">
              {customerRevenueData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">No customer invoices available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerRevenueData}
                      dataKey="billed"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {customerRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
                      formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Billed Volume']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Custom chart legend list */}
            <div className="w-full space-y-1.5 mt-3 max-h-[90px] overflow-y-auto text-[10px] text-slate-650">
              {customerRevenueData.slice(0, 4).map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }} />
                    <span className="truncate max-w-[120px] font-semibold">{entry.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">{formatCurrency(entry.billed)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer performance ledger table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white" id="performance-aggregates-ledger">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-sm font-bold text-slate-800">Account Receivables Matrix</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Performance metrics, payment ratios, and outstanding balance aging across active clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-500">
                  <th className="px-6 py-3">Client Entity</th>
                  <th className="px-6 py-3">Billed Volume</th>
                  <th className="px-6 py-3">Settled Volume</th>
                  <th className="px-6 py-3">Outstanding balance</th>
                  <th className="px-6 py-3 text-right">Settlement Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {customerRevenueData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-slate-400 font-medium">No revenue logs logged yet.</td>
                  </tr>
                ) : (
                  customerRevenueData.map((item) => {
                    const payRatio = item.billed > 0 ? (item.paid / item.billed) * 100 : 0;
                    return (
                      <tr key={item.name} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-semibold text-slate-900">{item.name}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-600">{formatCurrency(item.billed)}</td>
                        <td className="px-6 py-3.5 font-mono text-emerald-600 font-semibold">{formatCurrency(item.paid)}</td>
                        <td className="px-6 py-3.5 font-mono text-amber-600 font-semibold">{formatCurrency(item.outstanding)}</td>
                        <td className="px-6 py-3.5 text-right font-bold">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-mono text-slate-700">{payRatio.toFixed(0)}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${payRatio}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
