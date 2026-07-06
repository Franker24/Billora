import React, { useState } from 'react';
import { FileText, Printer, CheckCircle, CreditCard, ChevronLeft, Loader2, Sparkles, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice, PaymentMethod } from '../types';

interface ClientPortalViewProps {
  invoice: Invoice;
  companyProfile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxRate: number;
    termsDays: number;
    portalTitle?: string;
    portalColor?: string;
    portalWelcome?: string;
    portalPayMethods?: string[];
  };
  onPaymentSettled: (invoiceId: string, amount: number, method: PaymentMethod, reference: string) => void;
  onExitPortal: () => void;
}

export function ClientPortalView({
  invoice,
  companyProfile,
  onPaymentSettled,
  onExitPortal
}: ClientPortalViewProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'card' | 'ach' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Card states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // ACH states
  const [achBankName, setAchBankName] = useState('');
  const [achRouting, setAchRouting] = useState('');
  const [achAccount, setAchAccount] = useState('');
  
  // PayPal states
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
  };

  const handleFakeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);
    
    // Simulate payment clearing steps
    setProcessingStep('Iniciando pasarela segura...');
    await new Promise(r => setTimeout(r, 700));
    
    setProcessingStep(checkoutType === 'ach' 
      ? 'Verificando fondos de cuenta corriente ACH...' 
      : checkoutType === 'paypal' 
      ? 'Autenticando token seguro de PayPal...' 
      : 'Autorizando transacción con el banco...');
    await new Promise(r => setTimeout(r, 800));
    
    setProcessingStep('Conciliando fondos contables...');
    await new Promise(r => setTimeout(r, 700));

    // Finish processing
    setIsProcessing(false);
    setPaymentSuccess(true);
    await new Promise(r => setTimeout(r, 1200));

    // Fire actual callback to update App state
    const randomRef = checkoutType === 'ach' 
      ? `ACH_MOCK_${Math.floor(10000 + Math.random() * 90000)}`
      : checkoutType === 'paypal'
      ? `PAYPAL_MOCK_${Math.floor(10000 + Math.random() * 90000)}`
      : `STRIPE_MOCK_${Math.floor(10000 + Math.random() * 90000)}`;

    const payMethodName = checkoutType === 'ach' 
      ? 'Bank Transfer' 
      : checkoutType === 'paypal' 
      ? 'PayPal' 
      : 'Credit Card';

    onPaymentSettled(invoice.id, invoice.total, payMethodName, randomRef);

    // Reset local modal state
    setIsCheckoutOpen(false);
    setPaymentSuccess(false);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setAchBankName('');
    setAchAccount('');
    setAchRouting('');
    setPaypalEmail('');
    setPaypalPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-800 antialiased print:p-0 print:bg-white print:min-h-0" id="client-portal-root">
      
      {/* Header bar - Hidden in Print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onExitPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
        >
          <ChevronLeft className="size-4" />
          Volver a Consola
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Printer className="size-4" />
            Imprimir / Descargar PDF
          </button>
          
          {invoice.status !== 'Paid' && (
            <div className="flex gap-2">
              {(companyProfile.portalPayMethods || ['card']).map(method => {
                if (method === 'card') return (
                  <button
                    key="card"
                    onClick={() => {
                      setCheckoutType('card');
                      setIsCheckoutOpen(true);
                    }}
                    style={{ backgroundColor: companyProfile.portalColor || '#2563eb' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-bold cursor-pointer transition-all hover:opacity-90 shadow-sm border-0"
                  >
                    <CreditCard className="size-4" />
                    Pagar con Tarjeta
                  </button>
                );
                if (method === 'ach') return (
                  <button
                    key="ach"
                    onClick={() => {
                      setCheckoutType('ach');
                      setIsCheckoutOpen(true);
                    }}
                    style={{ backgroundColor: companyProfile.portalColor || '#10b981' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-bold cursor-pointer transition-all hover:opacity-90 shadow-sm border-0"
                  >
                    <Building2 className="size-4" />
                    Pagar por ACH (Banco)
                  </button>
                );
                if (method === 'paypal') return (
                  <button
                    key="paypal"
                    onClick={() => {
                      setCheckoutType('paypal');
                      setIsCheckoutOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm border-0"
                  >
                    <span className="font-extrabold italic font-sans text-xs">PayPal</span>
                  </button>
                );
                return null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Invoice Card Sheet */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none" id="invoice-printable-sheet">
        {/* Banner for Status */}
        <div className={`py-4 px-6 sm:px-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          invoice.status === 'Paid' ? 'bg-emerald-50/40' : 'bg-blue-50/20'
        }`}>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Enlace de Pago Oficial</span>
            <h1 className="text-lg font-bold text-slate-800 mt-0.5">Factura {invoice.invoiceNumber}</h1>
          </div>
          <div>
            {invoice.status === 'Paid' ? (
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <CheckCircle className="size-4 text-emerald-600" />
                Factura Pagada
              </div>
            ) : (
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {invoice.status === 'Overdue' ? 'Vencida' : 'Pendiente de Pago'}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Body Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {companyProfile.portalWelcome && (
            <div className="p-4 rounded-xl text-xs border border-dashed border-slate-200 bg-slate-50/50" style={{ borderLeftColor: companyProfile.portalColor || '#2563eb', borderLeftWidth: '4px' }}>
              <p className="text-slate-600 font-semibold italic">"{companyProfile.portalWelcome}"</p>
            </div>
          )}

          {/* Logo & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-sans" style={{ backgroundColor: companyProfile.portalColor || '#2563eb' }}>
                  <FileText className="size-3.5" />
                </div>
                <span className="font-extrabold text-sm tracking-widest uppercase font-sans" style={{ color: companyProfile.portalColor || '#2563eb' }}>
                  {companyProfile.portalTitle || 'BILLORA LEDGER'}
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">{companyProfile.name}</p>
                <p className="whitespace-pre-line">{companyProfile.address}</p>
                <p>Email: {companyProfile.email}</p>
              </div>
            </div>

            <div className="md:text-right space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Importe Total</span>
              <span className="text-3xl font-extrabold font-mono text-slate-800 block leading-none">
                {formatCurrency(invoice.total)}
              </span>
              <div className="text-xs text-slate-500 space-y-1 md:text-right">
                <p><span className="font-bold text-slate-600">Fecha de Emisión:</span> {invoice.date}</p>
                <p><span className="font-bold text-slate-600">Fecha de Vencimiento:</span> {invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Client Details Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Building2 className="size-3.5" />
                FACTURADO DE
              </h3>
              <p className="text-xs font-bold text-slate-800">{companyProfile.name}</p>
              <p className="text-xs text-slate-500 whitespace-pre-line mt-1">{companyProfile.address}</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <User className="size-3.5" />
                FACTURADO A
              </h3>
              <p className="text-xs font-bold text-slate-800">{invoice.customerName}</p>
              <p className="text-xs text-slate-500 mt-1">{invoice.customerEmail}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5">Concepto</th>
                  <th className="py-2.5 text-center w-20">Cantidad</th>
                  <th className="py-2.5 text-right w-28">Precio Unitario</th>
                  <th className="py-2.5 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-semibold text-slate-800">{item.description}</td>
                    <td className="py-3 text-center text-slate-500 font-mono">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-500 font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-semibold font-mono text-slate-800">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation Grid */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Impuesto ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                <span className="font-mono">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-800 text-sm">
                <span>Total General:</span>
                <span className="font-mono text-blue-700">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms Note */}
          {invoice.notes && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 mb-1">Notas contables e instrucciones:</p>
              <p className="whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stripe Payment Simulator Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Card Content Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans"
            >
              {/* Dynamic Header Banner */}
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-1.5 rounded-lg font-sans">
                    {checkoutType === 'ach' ? (
                      <Building2 className="size-4.5 text-emerald-400" />
                    ) : checkoutType === 'paypal' ? (
                      <span className="font-extrabold italic text-blue-400 font-sans text-xs">PP</span>
                    ) : (
                      <CreditCard className="size-4.5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-sans">
                      {checkoutType === 'ach' 
                        ? 'ACH Direct Debit Checkout' 
                        : checkoutType === 'paypal' 
                        ? 'PayPal Secure Checkout' 
                        : 'Stripe Credit Card Checkout'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Pago Seguro Encriptado (Simulación)</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  disabled={isProcessing}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Checkout details */}
              <div className="p-6">
                <div className="mb-4 text-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Monto a pagar</span>
                  <p className="text-2xl font-extrabold text-slate-800 leading-none mt-1 font-mono">
                    {formatCurrency(invoice.total)}
                  </p>
                  <p className="text-[10px] text-slate-450 mt-1">Factura: {invoice.invoiceNumber}</p>
                </div>

                {isProcessing ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <Loader2 className="size-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-xs font-bold text-slate-700 font-sans">{processingStep}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">No cierres esta pestaña por favor.</p>
                  </div>
                ) : paymentSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="size-7 text-emerald-600 animate-bounce" />
                    </div>
                    <p className="text-xs font-extrabold text-emerald-800 font-sans">¡Pago Aprobado y Conciliado!</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">Generando recibo oficial...</p>
                  </div>
                ) : (
                  <form onSubmit={handleFakeCheckout} className="space-y-4 text-xs text-left">
                    {checkoutType === 'card' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Nombre del Titular</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Ej. John Doe"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium bg-white text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Número de Tarjeta</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            placeholder="4242 4242 4242 4242"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono font-medium bg-white text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-650">Vencimiento</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/AA"
                              className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono font-medium bg-white text-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-650">CVV / CVC</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="•••"
                              className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono font-medium bg-white text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutType === 'ach' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Nombre del Banco</label>
                          <input
                            type="text"
                            required
                            value={achBankName}
                            onChange={(e) => setAchBankName(e.target.value)}
                            placeholder="Ej. Chase Bank, Bank of America"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-xs h-9 bg-white text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Número de Ruta (Routing Number)</label>
                          <input
                            type="text"
                            required
                            maxLength={9}
                            value={achRouting}
                            onChange={(e) => setAchRouting(e.target.value.replace(/\D/g, ''))}
                            placeholder="021000021"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono text-xs h-9 bg-white text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Número de Cuenta (Account Number)</label>
                          <input
                            type="text"
                            required
                            maxLength={17}
                            value={achAccount}
                            onChange={(e) => setAchAccount(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456789"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono text-xs h-9 bg-white text-slate-800"
                          />
                        </div>
                      </div>
                    )}

                    {checkoutType === 'paypal' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-slate-700 leading-relaxed font-sans font-medium text-[11px]">
                          Ingresa tus credenciales de PayPal para autorizar el cobro instantáneo.
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Correo Electrónico de PayPal</label>
                          <input
                            type="email"
                            required
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            placeholder="usuario@paypal.com"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-xs h-9 bg-white text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-650">Contraseña</label>
                          <input
                            type="password"
                            required
                            value={paypalPassword}
                            onChange={(e) => setPaypalPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-xs h-9 bg-white text-slate-800"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      style={{ backgroundColor: checkoutType === 'paypal' ? '#FFC439' : companyProfile.portalColor || '#2563eb', color: checkoutType === 'paypal' ? '#003087' : '#ffffff' }}
                      className="w-full font-bold rounded-lg h-10 px-4 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-0 mt-4 text-xs font-sans"
                    >
                      <Sparkles className="size-4.5" />
                      Confirmar Pago de {formatCurrency(invoice.total)}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple internal X icon helper
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
