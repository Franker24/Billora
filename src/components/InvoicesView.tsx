import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Eye, 
  CreditCard, 
  FileText, 
  Calendar,
  X,
  PlusCircle,
  FileDown,
  Mail,
  Sparkles,
  Globe,
  Loader2
} from 'lucide-react';
import { Invoice, Customer, Payment, InvoiceStatus, PaymentMethod, InvoiceItem } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from './Toast';
import { getTransition } from '../lib/motion';

interface InvoicesViewProps {
  invoices: Invoice[];
  customers: Customer[];
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onRecordPayment: (payment: Omit<Payment, 'id'>) => void;
  onDeleteInvoice: (id: string) => void;
  companyProfile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxRate: number;
    termsDays: number;
  };
  triggerOpenCreate?: boolean;
  onResetTriggerOpenCreate?: () => void;
  geminiApiKey: string;
  onViewClientPortal: (invoiceId: string) => void;
}

export function InvoicesView({
  invoices,
  customers,
  onAddInvoice,
  onRecordPayment,
  onDeleteInvoice,
  companyProfile,
  triggerOpenCreate,
  onResetTriggerOpenCreate,
  geminiApiKey,
  onViewClientPortal
}: InvoicesViewProps) {
  const { success: showSuccess, error: showError } = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog Open states
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (triggerOpenCreate) {
      setIsCreateOpen(true);
      onResetTriggerOpenCreate?.();
    }
  }, [triggerOpenCreate, onResetTriggerOpenCreate]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Selected Invoice for viewing or recording payments
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Create Invoice Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('new');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + (companyProfile?.termsDays ?? 30));
    return d.toISOString().split('T')[0];
  });
  const [invoiceItems, setInvoiceItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [taxRate, setTaxRate] = useState<number>(companyProfile?.taxRate ?? 0.08); // Default configured tax rate
  const [status, setStatus] = useState<InvoiceStatus>('Pending');
  const [notes, setNotes] = useState('');

  // Recurring settings states
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'Weekly' | 'Monthly' | 'Quarterly'>('Monthly');

  // AI Reminder states
  const [isAiReminderOpen, setIsAiReminderOpen] = useState(false);
  const [aiReminderText, setAiReminderText] = useState('');
  const [aiReminderTone, setAiReminderTone] = useState<'Friendly' | 'Professional' | 'Urgent'>('Friendly');
  const [isGeneratingReminder, setIsGeneratingReminder] = useState(false);

  // Record Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [paymentRef, setPaymentRef] = useState('');

  // Filtering
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerEmail && inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && inv.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Calculate totals for NEW invoice
  const calculateInvoiceTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const { subtotal: formSubtotal, taxAmount: formTaxAmount, total: formTotal } = calculateInvoiceTotals();

  // Handle Customer Selection in Form
  const handleCustomerSelection = (id: string) => {
    setSelectedCustomerId(id);
    if (id !== 'new') {
      const existing = customers.find(c => c.id === id);
      if (existing) {
        setNewCustomerName(existing.name);
        setNewCustomerEmail(existing.email);
      }
    } else {
      setNewCustomerName('');
      setNewCustomerEmail('');
    }
  };

  // Handle Item Changes
  const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    const newItems = [...invoiceItems];
    const item = newItems[index];

    if (field === 'description') {
      item.description = value as string;
    } else if (field === 'quantity') {
      item.quantity = Math.max(1, Number(value));
    } else if (field === 'unitPrice') {
      item.unitPrice = Math.max(0, Number(value));
    }

    item.amount = item.quantity * item.unitPrice;
    setInvoiceItems(newItems);
  };

  // Add Item Line
  const handleAddItemLine = () => {
    setInvoiceItems([...invoiceItems, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  // Remove Item Line
  const handleRemoveItemLine = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index));
    }
  };

  // Handle Create Invoice Submission
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerEmail) {
      showError('Please specify customer contact name and email');
      return;
    }

    const validItems = invoiceItems.filter(item => item.description.trim() !== '');
    if (validItems.length === 0) {
      showError('Please enter at least one line item with a description.');
      return;
    }

    // Prepare complete item list with generated IDs
    const itemsWithIds: InvoiceItem[] = validItems.map((item, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      ...item
    }));

    const nextInvoiceNumber = `INV-2026-0${invoices.length + 1}`;

    // Helper to calculate next recurring date
    const calculateNextRecurrenceDate = (baseDateStr: string, freq: 'Weekly' | 'Monthly' | 'Quarterly') => {
      const d = new Date(baseDateStr + 'T12:00:00');
      if (freq === 'Weekly') d.setDate(d.getDate() + 7);
      else if (freq === 'Monthly') d.setMonth(d.getMonth() + 1);
      else if (freq === 'Quarterly') d.setMonth(d.getMonth() + 3);
      return d.toISOString().split('T')[0];
    };

    const newInvoice: Omit<Invoice, 'id'> = {
      invoiceNumber: nextInvoiceNumber,
      customerId: selectedCustomerId === 'new' ? `cust_gen_${Date.now()}` : selectedCustomerId,
      customerName: newCustomerName,
      customerEmail: newCustomerEmail,
      date: issueDate,
      dueDate: dueDate,
      items: itemsWithIds,
      subtotal: formSubtotal,
      taxRate: taxRate,
      taxAmount: formTaxAmount,
      total: formTotal,
      status: status,
      notes: notes,
      isRecurring: isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      recurrenceNextDate: isRecurring ? calculateNextRecurrenceDate(issueDate, recurrenceFrequency) : undefined
    };

    onAddInvoice(newInvoice);
    showSuccess(`Invoice ${nextInvoiceNumber} drafted and stored successfully`);

    // Reset Form & Close
    setIsCreateOpen(false);
    setSelectedCustomerId('new');
    setNewCustomerName('');
    setNewCustomerEmail('');
    setInvoiceItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    setNotes('');
    setIsRecurring(false);
    setRecurrenceFrequency('Monthly');
  };

  // AI Reminder generator helper
  const handleGenerateAiReminder = async (tone: 'Friendly' | 'Professional' | 'Urgent') => {
    if (!selectedInvoice) return;
    setIsGeneratingReminder(true);
    setAiReminderTone(tone);

    const clientName = selectedInvoice.customerName;
    const invNo = selectedInvoice.invoiceNumber;
    const totalAmt = formatCurrency(selectedInvoice.total);
    const dueDateText = selectedInvoice.dueDate;

    if (geminiApiKey && geminiApiKey.startsWith('AIza')) {
      const prompt = `Escribe un correo electrónico para recordar el pago de la factura ${invNo} a nuestro cliente ${clientName}.
Monto: ${totalAmt}
Fecha de vencimiento: ${dueDateText}.
El tono debe ser: ${tone === 'Friendly' ? 'Amistoso y cercano' : tone === 'Professional' ? 'Profesional y corporativo' : 'Urgente y firme'}.
Escribe solo el Asunto y el Cuerpo del correo en español. No agregues comentarios adicionales de salida.`;

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
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            setAiReminderText(text);
            setIsGeneratingReminder(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching AI reminder:', err);
      }
    }

    // Fallback template matching the selected tone
    await new Promise(r => setTimeout(r, 600));
    let text = '';
    if (tone === 'Friendly') {
      text = `Asunto: Recordatorio amistoso: Factura ${invNo} de Billora

Hola ${clientName},

Espero que estés teniendo una excelente semana.

Solo queríamos pasarte un recordatorio rápido sobre la factura ${invNo} por un total de ${totalAmt}, la cual tenía vencimiento para el día ${dueDateText}.

Te agradeceríamos mucho si pudieras procesar el pago cuando tengas un momento libre a través de nuestro portal del cliente. Si ya realizaste la transferencia, por favor avísanos para registrarla.

¡Muchas gracias por tu apoyo de siempre!
Saludos cordiales,
El equipo de Finanzas`;
    } else if (tone === 'Professional') {
      text = `Asunto: Notificación de saldo pendiente - Factura ${invNo}

Estimado/a ${clientName},

Por medio de la presente, le recordamos que el pago correspondiente a la factura ${invNo} por el monto de ${totalAmt} se encuentra pendiente de recepción. La fecha límite de vencimiento establecida fue el ${dueDateText}.

Le solicitamos amablemente que revise el estado de su cuenta y gestione la transferencia a la brevedad posible para evitar interrupciones en el servicio. Puede acceder a su portal de cliente para realizar el pago con tarjeta o consultar las cuentas de transferencia.

Agradecemos de antemano su atención a este recordatorio.

Atentamente,
Departamento de Facturación y Finanzas`;
    } else {
      text = `Asunto: URGENTE: Factura VENCIDA ${invNo} - Acción Requerida

Estimado/a ${clientName},

Nos comunicamos con carácter de urgencia para notificarle que la factura ${invNo} por un total de ${totalAmt} ha superado su fecha de vencimiento (${dueDateText}) y se encuentra en estado de mora.

Le solicitamos regularizar esta situación en las próximas 24-48 horas. De lo contrario, nos veremos en la necesidad de suspender los servicios y aplicar cargos por retraso según nuestros términos comerciales.

Puede realizar la liquidación inmediata ingresando al portal del cliente. Si existe algún inconveniente con el pago, por favor póngase en contacto inmediato con nosotros.

Sin otro particular, quedamos a la espera de sus comentarios.

Atentamente,
Dirección de Cobranzas`;
    }
    setAiReminderText(text);
    setIsGeneratingReminder(false);
  };

  // Prepare & Open Record Payment form
  const handleOpenRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.total);
    setPaymentRef(`REC_PAY_${Date.now().toString().slice(-5)}`);
    setIsPaymentOpen(true);
  };

  // Handle Submit Payment
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    onRecordPayment({
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.invoiceNumber,
      customerId: selectedInvoice.customerId,
      customerName: selectedInvoice.customerName,
      amount: paymentAmount,
      date: paymentDate,
      method: paymentMethod,
      reference: paymentRef,
      status: 'Cleared'
    });

    showSuccess(`Payment of ${formatCurrency(paymentAmount)} received and cleared on ${selectedInvoice.invoiceNumber}`);

    setIsPaymentOpen(false);
    setIsDetailsOpen(false);
  };

  // Currency utility
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="space-y-6" 
      id="invoices-manager-wrapper"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="invoices-view-title-row">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Active Invoices Workspace</h1>
          <p className="text-xs text-slate-500">Dispatch, tracking, collection, and deletion tools</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 cursor-pointer text-xs h-8 px-4 shadow-xs"
          id="trigger-create-invoice-modal-btn"
        >
          <Plus className="size-4" />
          Create New Invoice
        </Button>
      </div>

      {/* Search and Filters Segment */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm" id="invoice-filters-container">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice number, customer name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-205 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Invoices' },
              { id: 'paid', label: 'Paid' },
              { id: 'pending', label: 'Pending' },
              { id: 'overdue', label: 'Overdue' },
              { id: 'draft', label: 'Draft' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold select-none transition-all cursor-pointer ${
                  statusFilter === filter.id 
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices List Card */}
      <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden rounded-xl" id="invoices-list-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[750px]" id="invoices-ledger-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Invoice #</th>
                  <th className="px-6 py-3.5">Client & Contact</th>
                  <th className="px-6 py-3.5">Issue & Due Dates</th>
                  <th className="px-6 py-3.5">Amount Due</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileText className="size-8 mx-auto text-slate-300" />
                        <p className="text-sm font-semibold text-slate-900">No invoices matched filters</p>
                        <p className="text-[11px] text-slate-400">Try adjusting your search variables or add a new invoice.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900">{inv.customerName}</div>
                          <div className="text-[10px] text-slate-400">{inv.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div>
                          <div>Issued: <span className="font-medium text-slate-700">{inv.date}</span></div>
                          <div className="text-[10px] text-red-500/85">
                            Due: <span className="font-semibold">{inv.dueDate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {formatCurrency(inv.total)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold border-0 rounded-sm' :
                            inv.status === 'Pending' ? 'bg-amber-100 text-amber-700 text-[10px] uppercase font-bold border-0 rounded-sm' :
                            inv.status === 'Draft' ? 'bg-slate-100 text-slate-700 text-[10px] uppercase font-bold border-0 rounded-sm' :
                            'bg-rose-100 text-rose-700 text-[10px] uppercase font-bold border-0 rounded-sm'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="View Invoice Ledger"
                            onClick={() => { setSelectedInvoice(inv); setIsDetailsOpen(true); }}
                            className="text-slate-400 hover:text-blue-600 rounded-md"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          
                          {(inv.status === 'Pending' || inv.status === 'Overdue') && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              title="Record Payment Check"
                              onClick={() => handleOpenRecordPayment(inv)}
                              className="text-slate-500 hover:text-emerald-600 rounded-md"
                            >
                              <CreditCard className="size-3.5" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Delete Record"
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete invoice ${inv.invoiceNumber}?`)) {
                                onDeleteInvoice(inv.id);
                                showSuccess(`Invoice ${inv.invoiceNumber} has been deleted`);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-650 rounded-md hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ==================== CREATE INVOICE DIALOG ==================== */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[calc(100%-16px)] sm:max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 scrollbar-thin rounded-xl border border-slate-200 bg-white shadow-lg mx-auto">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-800">Draft Customer Invoice</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Complete invoice attributes, due intervals, and multi-line billing details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs mt-2">
            {/* Customer select section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Choose Customer Profile</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerSelection(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="new">+ Dynamic Client Addition</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.company ? `${c.name} (${c.company})` : c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pricing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Pending">Pending (Issues immediately)</option>
                  <option value="Draft">Draft (Offline planning)</option>
                </select>
              </div>
            </div>

            {/* If New Customer, enter details manually */}
            {selectedCustomerId === 'new' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/15 border border-blue-100 rounded-xl">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Contact Name *</label>
                  <Input 
                    placeholder="e.g. John Doe"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="h-8 bg-white border-slate-200 text-xs rounded-md focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Email Address *</label>
                  <Input 
                    type="email"
                    required
                    placeholder="e.g. jdoe@example.com"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    className="h-8 bg-white border-slate-200 text-xs rounded-md focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Dates row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="h-8 font-mono text-xs rounded-md border-slate-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</label>
                <Input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-8 font-mono text-xs rounded-md border-slate-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Dynamic Items list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Line Items Ledger</span>
                <Button 
                  type="button" 
                  variant="outline"
                  size="xs" 
                  onClick={handleAddItemLine}
                  className="h-6 gap-1 border-blue-200 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700 font-semibold cursor-pointer rounded-md text-xs"
                >
                  <PlusCircle className="size-3.5" />
                  Add item line
                </Button>
              </div>

              <div className="space-y-2.5 max-h-[190px] sm:max-h-[220px] overflow-y-auto pr-1">
                {invoiceItems.map((item, index) => (
                  <div key={index} className="bg-slate-50/60 p-3 sm:p-2 border border-slate-100 rounded-lg space-y-2 sm:space-y-0 sm:flex sm:gap-2 sm:items-center">
                    <div className="flex-1">
                      <label className="sm:hidden text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                      <input
                        type="text"
                        required
                        placeholder="Description of deliverables..."
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 h-8 sm:h-7 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 sm:w-16">
                        <label className="sm:hidden text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Qty</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 h-8 sm:h-7 font-mono text-xs text-center bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="flex-2 sm:w-24">
                        <label className="sm:hidden text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price ($)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1 h-8 sm:h-7 font-mono text-xs text-right bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {invoiceItems.length > 1 && (
                        <div className="shrink-0 self-end sm:self-auto">
                          <label className="sm:hidden text-[9px] font-bold text-transparent uppercase tracking-wider block mb-1">Action</label>
                          <button
                            type="button"
                            onClick={() => handleRemoveItemLine(index)}
                            className="p-1.5 sm:p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-md transition-colors border border-slate-200 sm:border-0 bg-white sm:bg-transparent h-8 sm:h-auto flex items-center justify-center w-8 sm:w-auto"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations and tax rates */}
            <div className="p-3 bg-slate-50 border border-slate-150/75 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corporate Tax Rate</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="px-2 py-1 bg-white border border-slate-205 rounded-md font-semibold font-mono focus:outline-none text-xs"
                >
                  <option value={0.00}>0% (Tax Exempt)</option>
                  <option value={0.05}>5% (VAT Standard)</option>
                  <option value={0.08}>8% (State Tax)</option>
                  <option value={0.10}>10% (Corporate Standard)</option>
                  <option value={0.15}>15% (Special VAT)</option>
                </select>
              </div>

              {/* Aggregates Summary */}
              <div className="text-right space-y-1 font-semibold text-slate-650 text-[11px]">
                <div className="flex justify-between md:justify-end gap-6">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900">{formatCurrency(formSubtotal)}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-6 text-[10px] text-slate-400 font-normal">
                  <span className="font-sans">Tax ({(taxRate * 100).toFixed(0)}%):</span>
                  <span className="font-mono">{formatCurrency(formTaxAmount)}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-6 border-t border-slate-200 pt-1 text-sm font-bold text-blue-600">
                  <span className="font-sans">Estimated Total:</span>
                  <span className="font-mono">{formatCurrency(formTotal)}</span>
                </div>
              </div>
            </div>

            {/* Facturación Recurrente */}
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isRecurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 size-4 cursor-pointer"
                />
                <div>
                  <label htmlFor="isRecurring" className="text-xs font-bold text-slate-700 block cursor-pointer">Facturación Recurrente</label>
                  <span className="text-[9px] text-slate-400">Generar facturas de forma periódica en esta cuenta.</span>
                </div>
              </div>
              
              {isRecurring && (
                <div className="flex items-center gap-2">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Frecuencia:</label>
                  <select
                    value={recurrenceFrequency}
                    onChange={(e) => setRecurrenceFrequency(e.target.value as any)}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold text-[11px] focus:outline-none"
                  >
                    <option value="Weekly">Semanal</option>
                    <option value="Monthly">Mensual</option>
                    <option value="Quarterly">Trimestral</option>
                  </select>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer Terms Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify banking routing details, wire terms, or payment constraints..."
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors h-14"
              />
            </div>

            <DialogFooter className="mt-2 pt-3 border-t border-slate-150/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)} className="rounded-md border-slate-200 text-slate-600 h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 cursor-pointer h-8 text-xs">
                Dispatch Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================== VIEW INVOICE LEDGER DETAILS MODAL ==================== */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 border border-slate-200 overflow-hidden bg-white shadow-lg rounded-xl">
          {selectedInvoice && (
            <div className="text-xs" id="invoice-details-card">
              {/* Top corporate branding strip */}
              <div className="bg-slate-900 text-white p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold font-sans tracking-wide">BILLORA</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">Fintech Invoicing Corp</p>
                  </div>
                  <Badge 
                    className={
                      selectedInvoice.status === 'Paid' ? 'bg-emerald-500 text-white font-extrabold px-2.5 border-0 rounded-sm' :
                      selectedInvoice.status === 'Pending' ? 'bg-amber-500 text-white font-extrabold px-2.5 border-0 rounded-sm' :
                      selectedInvoice.status === 'Draft' ? 'bg-slate-500 text-white font-extrabold px-2.5 border-0 rounded-sm' :
                      'bg-rose-500 text-white font-extrabold px-2.5 border-0 rounded-sm'
                    }
                  >
                    {selectedInvoice.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-end border-t border-slate-800 pt-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Invoice Number</div>
                    <div className="text-sm font-mono font-bold">{selectedInvoice.invoiceNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Dispatched Date</div>
                    <div className="font-mono font-medium">{selectedInvoice.date}</div>
                  </div>
                </div>
              </div>

              {/* Invoicing info */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Billed From</h4>
                    <p className="font-bold text-slate-800 mt-1">{companyProfile?.name || 'Billora Ledger Services LLC'}</p>
                    <div className="text-slate-400 text-[10px] leading-relaxed mt-0.5">
                      {companyProfile?.address.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                          {line}<br />
                        </React.Fragment>
                      )) || (
                        <>
                          100 Pine Street, Floor 18<br />
                          San Francisco, CA 94111
                        </>
                      )}
                      {companyProfile?.email && <><br />{companyProfile.email}</>}
                      {companyProfile?.phone && <><br />{companyProfile.phone}</>}
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Billed To</h4>
                    <p className="font-bold text-slate-800 mt-1">{selectedInvoice.customerName}</p>
                    <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">
                      {selectedInvoice.customerEmail}<br />
                      Client ID: {selectedInvoice.customerId.split('_').slice(1).join('') || 'N/A'}<br />
                      Due Date: <span className="text-rose-500 font-bold font-mono">{selectedInvoice.dueDate}</span>
                    </p>
                  </div>
                </div>

                {/* Items Ledger */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-350 mb-2">Deliverables Log</h4>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 pb-1 uppercase">
                        <th className="py-1">Line Item</th>
                        <th className="py-1 text-center w-12">Qty</th>
                        <th className="py-1 text-right w-24">Price</th>
                        <th className="py-1 text-right w-24">Sum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 text-slate-800 font-medium">{item.description}</td>
                          <td className="py-2 text-center font-mono font-medium text-slate-500">{item.quantity}</td>
                          <td className="py-2 text-right font-mono text-slate-500">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals aggregate */}
                <div className="border-t border-slate-100 pt-3 flex flex-col items-end">
                  <div className="w-48 text-right space-y-1 text-slate-500 text-[11px] font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono text-slate-800">{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Tax ({(selectedInvoice.taxRate * 100).toFixed(0)}%):</span>
                      <span className="font-mono">{formatCurrency(selectedInvoice.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-blue-600">
                      <span className="font-sans">Grand Total:</span>
                      <span className="font-mono">{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice notes */}
                {selectedInvoice.notes && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h5 className="font-bold text-slate-500 uppercase text-[9px] tracking-wide">Invoice Footnotes & Terms</h5>
                    <p className="text-slate-500 leading-relaxed mt-0.5 text-[10px]">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>

              {/* Dialog Footer Actions */}
              <div className="bg-slate-50 p-4 border-t border-slate-205 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button 
                  onClick={() => {
                    const printContents = document.getElementById('invoice-details-card')?.innerHTML;
                    if (printContents) {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Invoice - ${selectedInvoice.invoiceNumber}</title>
                              <script src="https://cdn.tailwindcss.com"></script>
                            </head>
                            <body class="p-8">
                              <div class="max-w-2xl mx-auto border border-gray-200 p-6 rounded-lg font-sans">
                                ${printContents}
                              </div>
                              <script>window.print();</script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      } else {
                        alert('Unable to open print tab. Please check pop-up blocker or use window features.');
                      }
                    }
                  }} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-md gap-1.5 border-slate-200 text-slate-600 h-8 text-xs font-semibold"
                >
                  <FileDown className="size-4 text-slate-500" />
                  Print Ledger / Export HTML
                </Button>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsDetailsOpen(false);
                      onViewClientPortal(selectedInvoice.id);
                    }} 
                    className="rounded-md gap-1.5 border-slate-200 text-slate-650 h-8 text-xs font-semibold"
                  >
                    <Globe className="size-4 text-blue-500" />
                    Portal Cliente
                  </Button>

                  {(selectedInvoice.status === 'Pending' || selectedInvoice.status === 'Overdue') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsAiReminderOpen(true);
                        handleGenerateAiReminder('Friendly');
                      }} 
                      className="rounded-md gap-1.5 border-slate-200 text-slate-650 h-8 text-xs font-semibold"
                    >
                      <Sparkles className="size-4 text-amber-500 animate-pulse" />
                      Recordatorio IA
                    </Button>
                  )}

                  <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)} className="rounded-md border-slate-200 text-slate-650 h-8 text-xs">
                    Close Details
                  </Button>
                  {(selectedInvoice.status === 'Pending' || selectedInvoice.status === 'Overdue') && (
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenRecordPayment(selectedInvoice)}
                      className="rounded-md gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-8 text-xs font-semibold"
                    >
                      <CreditCard className="size-4" />
                      Record Settlement
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== RECORD PAYMENT DIALOG ==================== */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-800">Record Settlement Receipt</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Apply ledger balance settlement to transaction records in real-time.
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-md border border-slate-100 grid grid-cols-2 gap-2 font-semibold">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Invoiced Client</span>
                  <p className="text-slate-800 font-bold text-xs">{selectedInvoice.customerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Ledger Balance</span>
                  <p className="text-blue-600 font-mono font-bold text-xs">{formatCurrency(selectedInvoice.total)}</p>
                </div>
              </div>

              {/* Amount applied */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount Received ($) *</label>
                <Input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="font-mono text-xs h-8 rounded-md border-slate-200 focus:border-blue-500"
                />
              </div>

              {/* Reference */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authorization Reference Code *</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. FED_TXN_00281"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="font-mono h-8 rounded-md border-slate-200 focus:border-blue-500 text-xs"
                />
              </div>

              {/* Dates & Methods row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Settlement Date</label>
                  <Input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="font-mono h-8 rounded-md border-slate-200 focus:border-blue-500 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transfer Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors h-8"
                  >
                    <option value="Bank Transfer">Bank ACH Wire Transfer</option>
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="PayPal">PayPal Holdings</option>
                    <option value="Cash">Cash Ledger</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="mt-2 pt-3 border-t border-slate-150/50">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPaymentOpen(false)} className="rounded-md border-slate-200 text-slate-600 h-8 text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-8 text-xs font-semibold px-4 shadow-xs">
                  Clear Funds & mark invoice Paid
                </Button>
              </DialogFooter>
             </form>
            )}
          </DialogContent>
        </Dialog>

        {/* ==================== AI REMINDER EMAIL MODAL ==================== */}
        <Dialog open={isAiReminderOpen} onOpenChange={setIsAiReminderOpen}>
          <DialogContent className="sm:max-w-md p-6 rounded-xl border border-slate-200 bg-white shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="size-4.5 text-blue-600 animate-pulse" />
                Borrador de Recordatorio por IA
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Usa inteligencia artificial para redactar un correo persuasivo sobre esta factura vencida.
              </DialogDescription>
            </DialogHeader>

            {/* Tone Selector */}
            <div className="flex gap-2 mb-3">
              {[
                { id: 'Friendly', label: 'Amistoso' },
                { id: 'Professional', label: 'Profesional' },
                { id: 'Urgent', label: 'Urgente' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => handleGenerateAiReminder(t.id as any)}
                  disabled={isGeneratingReminder}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    aiReminderTone === t.id 
                      ? 'bg-blue-50 border-blue-200 text-blue-705 font-bold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {isGeneratingReminder ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium flex flex-col items-center justify-center">
                <Loader2 className="size-8 text-blue-600 animate-spin mb-3" />
                Generando recordatorio...
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={aiReminderText}
                  onChange={(e) => setAiReminderText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium leading-relaxed h-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(aiReminderText);
                      showSuccess('Recordatorio copiado al portapapeles');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs px-4"
                  >
                    Copiar Contenido
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAiReminderOpen(false)}
                    className="border-slate-250 text-slate-650 h-8 text-xs font-semibold"
                  >
                    Cerrar
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    );
}
