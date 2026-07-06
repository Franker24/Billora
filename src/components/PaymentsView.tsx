import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  PlusCircle, 
  FileCheck, 
  Percent, 
  Calendar,
  Filter,
  CheckCircle,
  Hash,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Payment, PaymentMethod, Customer, Invoice } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';

interface PaymentsViewProps {
  payments: Payment[];
  customers: Customer[];
  invoices: Invoice[];
  onRecordPayment: (payment: Omit<Payment, 'id'>) => void;
}

export function PaymentsView({
  payments,
  customers,
  invoices,
  onRecordPayment
}: PaymentsViewProps) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Bank Feed Reconciliation States
  const [activePaymentTab, setActivePaymentTab] = useState<'history' | 'reconciliation'>('history');
  const [bankTransactions, setBankTransactions] = useState([
    { id: 'tx_1', name: 'Transferencia Recibida GLOBEX CORP', amount: 5400.00, date: new Date().toISOString().split('T')[0] },
    { id: 'tx_2', name: 'ACH Deposit ACME INC', amount: 12450.00, date: new Date().toISOString().split('T')[0] },
    { id: 'tx_3', name: 'Wire Transfer Reference #88439', amount: 1500.00, date: new Date().toISOString().split('T')[0] }
  ]);
  const [aiMatchResult, setAiMatchResult] = useState<{ [txId: string]: { invoice: Invoice; score: number } | null }>({});
  const [matchingTxId, setMatchingTxId] = useState<string | null>(null);

  const handleAIMatch = (txId: string, amount: number, txName: string) => {
    setMatchingTxId(txId);
    setTimeout(() => {
      setMatchingTxId(null);
      
      // Look for a pending invoice with matching amount
      let match = invoices.find(inv => 
        (inv.status === 'Pending' || inv.status === 'Overdue') &&
        Math.abs(inv.total - amount) < 0.01
      );
      
      // If no amount matches, look for customer name keyword matching
      if (!match) {
        match = invoices.find(inv => 
          (inv.status === 'Pending' || inv.status === 'Overdue') &&
          txName.toLowerCase().includes(inv.customerName.toLowerCase().split(' ')[0])
        );
      }

      if (match) {
        setAiMatchResult(prev => ({
          ...prev,
          [txId]: { invoice: match!, score: Math.abs(match!.total - amount) < 0.01 ? 98 : 75 }
        }));
      } else {
        const anyPending = invoices.find(inv => inv.status === 'Pending' || inv.status === 'Overdue');
        if (anyPending) {
          setAiMatchResult(prev => ({
            ...prev,
            [txId]: { invoice: anyPending, score: 62 }
          }));
        } else {
          setAiMatchResult(prev => ({
            ...prev,
            [txId]: null
          }));
        }
      }
    }, 1200);
  };

  const handleConfirmReconcile = (txId: string, tx: any, matchedInvoice: Invoice) => {
    onRecordPayment({
      invoiceId: matchedInvoice.id,
      invoiceNumber: matchedInvoice.invoiceNumber,
      customerId: matchedInvoice.customerId,
      customerName: matchedInvoice.customerName,
      amount: tx.amount,
      date: tx.date,
      method: 'Bank Transfer',
      reference: `RECONCILED_ACH_${txId.toUpperCase()}`,
      status: 'Cleared'
    });
  };

  // Form states
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [reference, setReference] = useState('');

  // Filter payments
  const filteredPayments = payments.filter(pay => {
    const matchesSearch = 
      pay.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === 'all' || pay.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  // Load unpaid invoices for select dropdown
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');

  // Handle invoice selection in form
  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    const linkedInvoice = invoices.find(i => i.id === invId);
    if (linkedInvoice) {
      setAmount(linkedInvoice.total);
      setReference(`REC_WIRE_${Date.now().toString().slice(-4)}`);
    } else {
      setAmount(0);
      setReference('');
    }
  };

  // Submit payment record
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId) {
      alert('Please connect this payment to an active outstanding invoice.');
      return;
    }

    const linkedInvoice = invoices.find(i => i.id === selectedInvoiceId);
    if (!linkedInvoice) return;

    onRecordPayment({
      invoiceId: linkedInvoice.id,
      invoiceNumber: linkedInvoice.invoiceNumber,
      customerId: linkedInvoice.customerId,
      customerName: linkedInvoice.customerName,
      amount: amount,
      date: date,
      method: method,
      reference: reference,
      status: 'Cleared'
    });

    // Reset Form & Close
    setIsAddOpen(false);
    setSelectedInvoiceId('');
    setAmount(0);
    setReference('');
  };

  // Currency format
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="space-y-6" 
      id="payments-workspace"
    >
      {/* Header layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="payments-header-row">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <CreditCard className="size-5 text-blue-600" />
            Control de Cobros y Liquidaciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">Registra cobros o concilia transferencias electrónicas entrantes.</p>
        </div>

        {/* Tab switch & Add buttons */}
        <div className="flex items-center gap-2">
          {/* Reconciliation Toggle Switch */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-205 p-0.5 rounded-lg shrink-0 h-9">
            <button
              onClick={() => setActivePaymentTab('history')}
              className={`px-2.5 h-7 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activePaymentTab === 'history' ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-850 border-transparent bg-transparent'
              }`}
            >
              Historial
            </button>
            <button
              onClick={() => setActivePaymentTab('reconciliation')}
              className={`px-2.5 h-7 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activePaymentTab === 'reconciliation' ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-850 border-transparent bg-transparent'
              }`}
            >
              Conciliación Bancaria (IA)
            </button>
          </div>

          <Button 
            onClick={() => {
              if (pendingInvoices.length === 0) {
                alert('There are no active Pending or Overdue invoices to settle.');
                return;
              }
              setIsAddOpen(true);
            }}
            className="rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 cursor-pointer text-xs h-9 px-4 shadow-xs border-0"
            id="trigger-record-payment-btn"
          >
            <PlusCircle className="size-4" />
            Registrar Cobro
          </Button>
        </div>
      </div>

      {activePaymentTab === 'history' ? (
        <>
          {/* Searching filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm" id="payment-filters-container">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client name, invoice number, bank reference coordinate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="size-4 text-slate-450 shrink-0" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-655 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Payment Channels</option>
                  <option value="Bank Transfer">Bank ACH Wire Transfer</option>
                  <option value="Credit Card">Corporate Credit Cards</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Liquid Cash Pools</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments list grid table */}
          <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden rounded-xl" id="payments-ledger-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]" id="payments-ledger-table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-3.5">Settlement Date</th>
                      <th className="px-6 py-3.5">Invoice Connected</th>
                      <th className="px-6 py-3.5">Client Party</th>
                      <th className="px-6 py-3.5">Reference Authorization</th>
                      <th className="px-6 py-3.5">Channel</th>
                      <th className="px-6 py-3.5">Settle Amount</th>
                      <th className="px-6 py-3.5 text-right">Fund Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <div className="max-w-xs mx-auto space-y-2">
                            <CreditCard className="size-8 mx-auto text-slate-300" />
                            <p className="text-sm font-semibold text-slate-900">No payment wires matched filters</p>
                            <p className="text-[11px] text-slate-400">Clear filters or process invoice settlements.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-500 font-mono font-medium">
                            {pay.date}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-blue-700">
                            {pay.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {pay.customerName}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500 flex items-center gap-1.5">
                            <Hash className="size-3 text-slate-400" />
                            <span>{pay.reference}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-650 font-medium font-sans">
                            {pay.method}
                          </td>
                          <td className="px-6 py-4 font-mono font-extrabold text-emerald-600">
                            {formatCurrency(pay.amount)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Badge className="bg-emerald-100 text-emerald-805 text-[10px] font-bold uppercase border-0 rounded-sm">
                              CLEARED
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-bold text-slate-805 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="size-4 text-blue-600 animate-pulse" />
              Simulador de Bank Feed Conciliaciones
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              Transferencias electrónicas entrantes de tu extracto bancario. Usa la IA para emparejarlas con facturas pendientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {bankTransactions.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs font-medium text-slate-700" id="bank-feed-list">
                {bankTransactions.map(tx => {
                  const match = aiMatchResult[tx.id];
                  const isLoading = matchingTxId === tx.id;
                  
                  return (
                    <div key={tx.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-slate-50/30 border-b border-slate-100 last:border-b-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{tx.name}</span>
                          <Badge variant="outline" className="font-mono text-[9px] font-bold text-slate-550 uppercase py-0 px-1.5 border-slate-200 bg-slate-50">
                            {tx.date}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          Monto Recibido: <span className="font-bold text-slate-850 font-mono">{formatCurrency(tx.amount)}</span>
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        {match === undefined ? (
                          <Button
                            onClick={() => handleAIMatch(tx.id, tx.amount, tx.name)}
                            disabled={isLoading}
                            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg h-8 cursor-pointer gap-1.5"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                Analizando Ledger...
                              </>
                            ) : (
                              <>
                                <Sparkles className="size-3.5" />
                                Conciliar con IA
                              </>
                            )}
                          </Button>
                        ) : match === null ? (
                          <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1 p-2 bg-rose-50 rounded-lg border border-rose-100">
                            No se encontraron facturas pendientes coincidentes.
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <div className="text-left leading-tight sm:pr-3">
                              <span className="text-[10px] text-slate-400 block font-bold">SUGERENCIA DE IA ({match.score}% match)</span>
                              <span className="text-[11px] font-bold text-slate-850 block">
                                Factura {match.invoice.invoiceNumber} ({match.invoice.customerName})
                              </span>
                              <span className="text-[9px] text-slate-500 block">
                                Vence: {match.invoice.dueDate} · Restante: {formatCurrency(match.invoice.total)}
                              </span>
                            </div>
                            <div className="flex gap-1.5 mt-1 sm:mt-0">
                              <Button
                                size="xs"
                                onClick={() => {
                                  handleConfirmReconcile(tx.id, tx, match.invoice);
                                  setBankTransactions(prev => prev.filter(t => t.id !== tx.id));
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] h-7 px-2.5 rounded-lg border-0 cursor-pointer animate-pulse"
                              >
                                Confirmar
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => setAiMatchResult(prev => {
                                  const updated = { ...prev };
                                  delete updated[tx.id];
                                  return updated;
                                })}
                                className="text-slate-500 hover:text-slate-700 font-bold text-[10px] h-7 px-2"
                              >
                                Ignorar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-450 italic space-y-2">
                <p>No hay transferencias entrantes pendientes en tu extracto.</p>
                <p className="text-[10px] text-slate-400 font-normal">Todos los cobros de tus cuentas bancarias han sido conciliados con éxito.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Record Payment Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-xl border border-slate-200 bg-white shadow-xl text-slate-850 font-sans">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="size-5 text-blue-600" />
              Settle Pending Invoice Funds
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Record a customer wire, credit clearance or check against an outstanding debt.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Select Customer Invoice *</label>
              <select
                value={selectedInvoiceId}
                onChange={(e) => handleInvoiceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors h-8"
              >
                <option value="">-- Associate with Invoice --</option>
                {pendingInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.customerName} (Due: {inv.dueDate} · Balance: {formatCurrency(inv.total)})
                  </option>
                ))}
              </select>
            </div>

            {selectedInvoiceId && (
              <div className="space-y-4 border-t border-slate-100 pt-3 animate-fadeIn">
                {/* Amount input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Amount (USD) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="font-mono h-8 rounded-md border-slate-200 focus:border-blue-500 text-xs"
                  />
                </div>

                {/* Reference */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authorization Reference Code</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. TXN_BANK_882A"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="font-mono h-8 rounded-md border-slate-200 focus:border-blue-500 text-xs"
                  />
                </div>

                {/* Date & method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clearing Date</label>
                    <Input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="font-mono h-8 rounded-md border-slate-200 focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Channel</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors h-8"
                    >
                      <option value="Bank Transfer">Bank ACH Wire Transfer</option>
                      <option value="Credit Card">Corporate Credit Card</option>
                      <option value="PayPal">PayPal Holdings</option>
                      <option value="Cash">Cash Ledger</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-slate-150/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="rounded-md text-slate-600 border-slate-200 h-8 text-xs">
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                disabled={!selectedInvoiceId}
                className="rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 h-8 text-xs font-semibold px-4"
              >
                Clear Funds
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
