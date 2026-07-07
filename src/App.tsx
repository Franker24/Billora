import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommandPalette } from './components/CommandPalette';
import { 
  Layers, 
  FileText, 
  Users, 
  CreditCard, 
  TrendingUp, 
  LayoutDashboard,
  LogOut,
  Briefcase,
  Settings,
  DollarSign,
  Users2,
  Home,
  Info,
  HelpCircle,
  Mail,
  Palette,
  Eye,
  Rocket,
  Menu,
  X,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { Invoice, Customer, Payment, ActivityLog, Expense, TeamMember, NotificationAlert, PaymentMethod } from './types';
import { 
  INITIAL_INVOICES, 
  INITIAL_CUSTOMERS, 
  INITIAL_PAYMENTS, 
  INITIAL_LOGS,
  INITIAL_EXPENSES,
  INITIAL_TEAM_MEMBERS
} from './data';
import { DashboardView } from './components/DashboardView';
import { InvoicesView } from './components/InvoicesView';
import { CustomersView } from './components/CustomersView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { CloudSyncModal } from './components/CloudSyncModal';

// Marketing Hub imports
import { HomeView } from './components/HomeView';
import { FeaturesView } from './components/FeaturesView';
import { PricingView } from './components/PricingView';
import { TemplatesView } from './components/TemplatesView';
import { FaqView } from './components/FaqView';
import { ContactView } from './components/ContactView';

// Console Dashboard imports
import { ExpensesView } from './components/ExpensesView';
import { TeamView } from './components/TeamView';

// Custom Upgrades imports
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { ClientPortalView } from './components/ClientPortalView';
import { AIAssistant } from './components/AIAssistant';
import { AdminLoginView } from './components/AdminLoginView';


export default function App() {
  // Navigation State - default to Home landing page index
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('billora_active_tab') || 'home';
  });

  // Command Palette & Global Shortcut States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [triggerInvoiceCreate, setTriggerInvoiceCreate] = useState(false);
  const [triggerExpenseCreate, setTriggerExpenseCreate] = useState(false);
  const [triggerCustomerCreate, setTriggerCustomerCreate] = useState(false);
  
  // Mobile drawer navigation open states
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMarketingMenuOpen, setIsMarketingMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Check if user is typing in standard inputs
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.tagName === 'SELECT' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );

      if (isTyping) return;

      // Quick action commands: Cmd/Ctrl + shortcuts
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          setActiveTab('invoices');
          setTriggerInvoiceCreate(true);
          return;
        }
        if (e.key.toLowerCase() === 'e') {
          e.preventDefault();
          setActiveTab('expenses');
          setTriggerExpenseCreate(true);
          return;
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setActiveTab('customers');
          setTriggerCustomerCreate(true);
          return;
        }
      }

      // Option/Alt Quick Navigation switching
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const tabs = ['dashboard', 'invoices', 'expenses', 'payments', 'customers', 'team', 'reports', 'settings'];
        const index = parseInt(e.key) - 1;
        if (tabs[index]) {
          setActiveTab(tabs[index]);
          setShortcutInvoice(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset scroll position of any layout containers when navigating
  useEffect(() => {
    localStorage.setItem('billora_active_tab', activeTab);
    
    // Scroll window to top
    window.scrollTo({ top: 0 });

    // Scroll main layout stage to top
    const scrollingStage = document.getElementById('scrolling-stage');
    if (scrollingStage) {
      scrollingStage.scrollTop = 0;
    }

    // Scroll any marketing layout or generic scroll container
    const mainElements = document.getElementsByTagName('main');
    for (let i = 0; i < mainElements.length; i++) {
      mainElements[i].scrollTop = 0;
    }
  }, [activeTab]);
  
  // Selected Invoice for global shortcut view (e.g. from Dashboard)
  const [shortcutInvoice, setShortcutInvoice] = useState<Invoice | null>(null);

  // Lazy state initializers from LocalStorage to support real, durable persistence
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const local = localStorage.getItem('billora_invoices_registry');
    return local ? JSON.parse(local) : INITIAL_INVOICES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const local = localStorage.getItem('billora_customers_registry');
    return local ? JSON.parse(local) : INITIAL_CUSTOMERS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const local = localStorage.getItem('billora_payments_registry');
    return local ? JSON.parse(local) : INITIAL_PAYMENTS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const local = localStorage.getItem('billora_logs_registry');
    return local ? JSON.parse(local) : INITIAL_LOGS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const local = localStorage.getItem('billora_expenses_registry');
    return local ? JSON.parse(local) : INITIAL_EXPENSES;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const local = localStorage.getItem('billora_team_registry');
    return local ? JSON.parse(local) : INITIAL_TEAM_MEMBERS;
  });

  const [companyProfile, setCompanyProfile] = useState(() => {
    const local = localStorage.getItem('billora_company_profile_registry');
    return local ? JSON.parse(local) : {
      name: 'Billora Ledger Services LLC',
      email: 'billing@billora.co',
      phone: '+1 (555) 100-3000',
      address: '100 Pine Street, Floor 18\nSan Francisco, CA 94111',
      taxRate: 0.08,
      termsDays: 30,
      portalTitle: 'Portal de Pago de Clientes',
      portalColor: '#2563eb',
      portalWelcome: 'Por favor, revise los detalles de su factura y procese el pago.',
      portalPayMethods: ['card', 'ach', 'paypal'],
      dunningEnabled: false,
      dunningSurchargePercent: 2,
      dunningSurchargeDays: 10,
      dunningReminderTone: 'Friendly'
    };
  });

  // Upgraded Feature States
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && envKey !== 'MY_GEMINI_API_KEY') {
      return envKey;
    }
    return localStorage.getItem('billora_gemini_key') || 'AIzaSyCll78o1SFrwHzqirXlhJotcOgLFX-Gqrc';
  });

  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => {
    const local = localStorage.getItem('billora_notifications');
    return local ? JSON.parse(local) : [
      {
        id: 'notif_welcome',
        title: '¡Bienvenido a Billora!',
        message: 'Tu Ledger sandbox de facturación está listo para operar. Presiona Ctrl+K para abrir los atajos de teclado rápidos.',
        date: new Date().toLocaleDateString('es-ES'),
        read: false,
        type: 'success'
      }
    ];
  });

  const [publicInvoiceViewId, setPublicInvoiceViewId] = useState<string | null>(null);

  // Administrative login authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('billora_admin_logged') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('billora_admin_logged', 'true');
    addSystemNotification('Acceso Autorizado', 'Sesión de administrador iniciada correctamente.', 'success');
  };

  // Sync API Key & Notifications
  useEffect(() => {
    localStorage.setItem('billora_gemini_key', geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    localStorage.setItem('billora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Notifications Operations
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const addSystemNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const newNotif: NotificationAlert = {
      id: `notif_${Date.now()}`,
      title,
      message,
      date: new Date().toLocaleDateString('es-ES'),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // CSV Data Exporter
  const handleExportCSV = (type: 'invoices' | 'expenses' | 'customers') => {
    let headers = '';
    let rows = '';
    let filename = '';

    if (type === 'invoices') {
      headers = 'ID,InvoiceNumber,CustomerName,CustomerEmail,Date,DueDate,Subtotal,TaxAmount,Total,Status\n';
      rows = invoices.map(i => 
        `"${i.id}","${i.invoiceNumber}","${i.customerName}","${i.customerEmail}","${i.date}","${i.dueDate}",${i.subtotal},${i.taxAmount},${i.total},"${i.status}"`
      ).join('\n');
      filename = 'billora_invoices.csv';
    } else if (type === 'expenses') {
      headers = 'ID,Description,Category,Amount,Date,Status,Merchant\n';
      rows = expenses.map(e => 
        `"${e.id}","${e.description}","${e.category}",${e.amount},"${e.date}","${e.status}","${e.merchant}"`
      ).join('\n');
      filename = 'billora_expenses.csv';
    } else if (type === 'customers') {
      headers = 'ID,Name,Email,Phone,Company,Address,OutstandingBalance,TotalBilled,Status,CreatedAt\n';
      rows = customers.map(c => 
        `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.company}","${c.address.replace(/\n/g, ' ')}",${c.outstandingBalance},${c.totalBilled},"${c.status}","${c.createdAt}"`
      ).join('\n');
      filename = 'billora_customers.csv';
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client checkout webhook simulation
  const handleClientPaymentSettled = (invoiceId: string, amount: number, method: PaymentMethod, reference: string) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'Paid' };
      }
      return inv;
    }));

    const targetInvoice = invoices.find(inv => inv.id === invoiceId);
    if (!targetInvoice) return;

    const newPayment: Payment = {
      id: `pay_portal_${Date.now()}`,
      invoiceId: invoiceId,
      invoiceNumber: targetInvoice.invoiceNumber,
      customerId: targetInvoice.customerId,
      customerName: targetInvoice.customerName,
      amount: amount,
      date: todayStr,
      method: method,
      reference: reference,
      status: 'Cleared'
    };

    setPayments(prev => [newPayment, ...prev]);

    setCustomers(prev => prev.map(c => {
      if (c.id === targetInvoice.customerId) {
        return {
          ...c,
          outstandingBalance: Math.max(0, c.outstandingBalance - amount)
        };
      }
      return c;
    }));

    const confirmLog: ActivityLog = {
      id: `log_pay_confirm_${Date.now()}`,
      type: 'invoice_paid',
      date: todayStr,
      message: `Portal Cliente: Factura ${targetInvoice.invoiceNumber} liquidada con éxito por ${targetInvoice.customerName}`,
      amount: amount,
      refId: invoiceId
    };

    const receiptLog: ActivityLog = {
      id: `log_pay_rec_${Date.now()}`,
      type: 'payment_received',
      date: todayStr,
      message: `Pago recibido vía Portal Cliente: $${amount.toLocaleString()} procesado con éxito`,
      amount: amount,
      refId: newPayment.id
    };

    setLogs(prev => [confirmLog, receiptLog, ...prev]);

    addSystemNotification(
      'Pago Recibido de Cliente',
      `El cliente ${targetInvoice.customerName} pagó la factura ${targetInvoice.invoiceNumber} por valor de $${amount}`,
      'success'
    );
  };

  // Process Recurring Invoices and Dunning Automations on mount
  useEffect(() => {
    const processRecurringAndDunning = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      let updatedInvoices = [...invoices];
      let hasChanges = false;
      let logsToAdd: ActivityLog[] = [];
      let notificationsToAdd: NotificationAlert[] = [];

      // 1. Process recurring invoices
      updatedInvoices = updatedInvoices.map(inv => {
        if (inv.isRecurring && inv.recurrenceNextDate && inv.recurrenceNextDate <= todayStr) {
          const nextInvNum = `INV-2026-R${Math.floor(100 + Math.random() * 900)}`;
          const baseDate = new Date(inv.recurrenceNextDate + 'T12:00:00');
          
          const due = new Date(baseDate);
          due.setDate(due.getDate() + (companyProfile?.termsDays ?? 30));
          
          const newClonedInvoice: Invoice = {
            ...inv,
            id: `inv_rec_gen_${Date.now()}_${Math.random().toString().slice(-4)}`,
            invoiceNumber: nextInvNum,
            date: inv.recurrenceNextDate,
            dueDate: due.toISOString().split('T')[0],
            status: 'Pending',
            isRecurring: false,
            recurrenceFrequency: undefined,
            recurrenceNextDate: undefined
          };

          const calculateNextRecurrenceDate = (baseDateStr: string, freq: 'Weekly' | 'Monthly' | 'Quarterly') => {
            const d = new Date(baseDateStr + 'T12:00:00');
            if (freq === 'Weekly') d.setDate(d.getDate() + 7);
            else if (freq === 'Monthly') d.setMonth(d.getMonth() + 1);
            else if (freq === 'Quarterly') d.setMonth(d.getMonth() + 3);
            return d.toISOString().split('T')[0];
          };

          const nextRecDate = calculateNextRecurrenceDate(inv.recurrenceNextDate, inv.recurrenceFrequency || 'Monthly');
          
          hasChanges = true;
          
          logsToAdd.push({
            id: `log_rec_${Date.now()}_${Math.random().toString().slice(-4)}`,
            type: 'invoice_created',
            date: todayStr,
            message: `Generación Automática Recurrente: Factura ${nextInvNum} emitida a ${inv.customerName} por $${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            amount: inv.total,
            refId: newClonedInvoice.id
          });

          // Add System notification
          setTimeout(() => {
            addSystemNotification(
              `Factura Recurrente Emitida`,
              `Se generó automáticamente la factura ${nextInvNum} para ${inv.customerName} por valor de $${inv.total}`,
              'success'
            );
          }, 50);

          setTimeout(() => {
            setInvoices(prev => [newClonedInvoice, ...prev]);
          }, 10);

          return {
            ...inv,
            recurrenceNextDate: nextRecDate
          };
        }
        return inv;
      });

      // 2. Process Dunning Surcharges for Overdue Invoices
      if (companyProfile?.dunningEnabled) {
        const surchargeDays = companyProfile.dunningSurchargeDays ?? 10;
        const surchargePercent = companyProfile.dunningSurchargePercent ?? 2;
        const today = new Date();
        
        updatedInvoices = updatedInvoices.map(inv => {
          if (inv.status === 'Overdue' && !inv.isDunningSurchargeApplied) {
            const dueDateObj = new Date(inv.dueDate + 'T12:00:00');
            const diffTime = today.getTime() - dueDateObj.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= surchargeDays) {
              const penaltyAmount = Math.round(inv.total * (surchargePercent / 100) * 100) / 100;
              const newTotal = inv.total + penaltyAmount;
              hasChanges = true;
              
              logsToAdd.push({
                id: `log_dun_${Date.now()}_${Math.random().toString().slice(-4)}`,
                type: 'invoice_overdue',
                date: todayStr,
                message: `Automatización Mora: Recargo del ${surchargePercent}% ($${penaltyAmount}) aplicado a factura ${inv.invoiceNumber} tras ${diffDays} días de retraso.`,
                amount: penaltyAmount,
                refId: inv.id
              });
              
              notificationsToAdd.push({
                id: `notif_dun_${Date.now()}_${Math.random().toString().slice(-4)}`,
                title: 'Recargo de Mora Aplicado',
                message: `Se aplicó un recargo del ${surchargePercent}% ($${penaltyAmount}) a la factura vencida ${inv.invoiceNumber}.`,
                date: todayStr,
                read: false,
                type: 'warning'
              });
              
              return {
                ...inv,
                total: newTotal,
                isDunningSurchargeApplied: true,
                originalTotalBeforeSurcharge: inv.total
              };
            }
          }
          return inv;
        });
      }

      if (hasChanges) {
        setInvoices(updatedInvoices);
        if (logsToAdd.length > 0) {
          setLogs(prev => [...logsToAdd, ...prev]);
        }
        if (notificationsToAdd.length > 0) {
          setNotifications(prev => [...notificationsToAdd, ...prev]);
        }
      }
    };

    const timer = setTimeout(processRecurringAndDunning, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Track & persist data state whenever they update
  useEffect(() => {
    localStorage.setItem('billora_invoices_registry', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('billora_customers_registry', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('billora_payments_registry', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('billora_logs_registry', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('billora_expenses_registry', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('billora_team_registry', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('billora_company_profile_registry', JSON.stringify(companyProfile));
  }, [companyProfile]);

  // Derived indicator
  const isMarketingTab = (tab: string) => {
    return ['home', 'features', 'pricing', 'templates', 'faq', 'contact'].includes(tab);
  };

  // State modifiers
  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const expenseId = `exp_${Date.now()}`;
    const preparedExp: Expense = {
      id: expenseId,
      ...newExp
    };
    setExpenses(prev => [preparedExp, ...prev]);

    const expLog: ActivityLog = {
      id: `log_exp_${Date.now()}`,
      type: 'invoice_overdue',
      date: new Date().toISOString().split('T')[0],
      message: `Logged cost receipt: ${preparedExp.description} at ${preparedExp.merchant} for $${preparedExp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      refId: preparedExp.id
    };
    setLogs(prev => [expLog, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleInviteMember = (newMem: Omit<TeamMember, 'id'>) => {
    const memberId = `team_${Date.now()}`;
    const preparedMem: TeamMember = {
      id: memberId,
      ...newMem
    };
    setTeamMembers(prev => [preparedMem, ...prev]);

    const seatLog: ActivityLog = {
      id: `log_mem_${Date.now()}`,
      type: 'customer_added',
      date: new Date().toISOString().split('T')[0],
      message: `Invited new team member seat: ${preparedMem.name} assigned as ${preparedMem.role}`,
      refId: preparedMem.id
    };
    setLogs(prev => [seatLog, ...prev]);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };


  // Handle invoice shortcut viewer from dashboard click
  const handleViewInvoiceDetailsShortcut = (invoice: Invoice) => {
    setShortcutInvoice(invoice);
    setActiveTab('invoices');
    // We let the view handle opening by utilizing a micro-state trick
    setTimeout(() => {
      const viewBtn = document.getElementById(`view-recent-inv-${invoice.id}`);
      if (viewBtn) viewBtn.click();
    }, 100);
  };

  // ==================== CORE STATE MANIPULATIONS ====================

  // Create Invoice
  const handleAddInvoice = (newInv: Omit<Invoice, 'id'>) => {
    const invoiceId = `inv_${Date.now()}`;
    const preparedInv: Invoice = {
      id: invoiceId,
      ...newInv
    };

    // Update invoices array
    setInvoices(prev => [preparedInv, ...prev]);

    // Update customer's billing aggregates
    setCustomers(prev => prev.map(c => {
      if (c.id === preparedInv.customerId) {
        return {
          ...c,
          totalBilled: c.totalBilled + preparedInv.total,
          outstandingBalance: preparedInv.status === 'Pending' 
            ? c.outstandingBalance + preparedInv.total 
            : c.outstandingBalance
        };
      }
      return c;
    }));

    // If customer record was dynamically created, add them to the database
    const customerExists = customers.some(c => c.id === preparedInv.customerId);
    if (!customerExists && preparedInv.customerId.startsWith('cust_gen_')) {
      const dynamicCustomer: Customer = {
        id: preparedInv.customerId,
        name: preparedInv.customerName,
        email: preparedInv.customerEmail,
        phone: '',
        company: '',
        address: preparedInv.notes || 'No registry details recorded.',
        outstandingBalance: preparedInv.status === 'Pending' ? preparedInv.total : 0,
        totalBilled: preparedInv.total,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCustomers(prev => [dynamicCustomer, ...prev]);
    }

    // Register log event
    const logText = preparedInv.status === 'Draft' 
      ? `Invoice ${preparedInv.invoiceNumber} created for ${preparedInv.customerName} as Draft`
      : `Invoice ${preparedInv.invoiceNumber} sent to ${preparedInv.customerName} for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(preparedInv.total)}`;

    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      type: 'invoice_created',
      date: new Date().toISOString().split('T')[0],
      message: logText,
      amount: preparedInv.total,
      refId: preparedInv.id
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Record Payment
  const handleRecordPayment = (newPay: Omit<Payment, 'id'>) => {
    const paymentId = `pay_${Date.now()}`;
    const preparedPay: Payment = {
      id: paymentId,
      ...newPay
    };

    // Append to payments ledger
    setPayments(prev => [preparedPay, ...prev]);

    // Set corresponding invoice state to 'Paid'
    setInvoices(prev => prev.map(inv => {
      if (inv.id === preparedPay.invoiceId) {
        return { ...inv, status: 'Paid' };
      }
      return inv;
    }));

    // Deduct outstanding customer liability
    setCustomers(prev => prev.map(c => {
      if (c.id === preparedPay.customerId) {
        return {
          ...c,
          outstandingBalance: Math.max(0, c.outstandingBalance - preparedPay.amount)
        };
      }
      return c;
    }));

    // Create log events
    const confirmLog: ActivityLog = {
      id: `log_pay_confirm_${Date.now()}`,
      type: 'invoice_paid',
      date: new Date().toISOString().split('T')[0],
      message: `Invoice ${preparedPay.invoiceNumber} marked as fully Paid by ${preparedPay.customerName}`,
      amount: preparedPay.amount,
      refId: preparedPay.invoiceId
    };

    const receiptLog: ActivityLog = {
      id: `log_pay_rec_${Date.now()}`,
      type: 'payment_received',
      date: new Date().toISOString().split('T')[0],
      message: `Payment of $${preparedPay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} cleared for ${preparedPay.customerName}`,
      amount: preparedPay.amount,
      refId: preparedPay.id
    };

    setLogs(prev => [confirmLog, receiptLog, ...prev]);
  };

  // Delete Invoice
  const handleDeleteInvoice = (id: string) => {
    const targetInvoice = invoices.find(i => i.id === id);
    if (!targetInvoice) return;

    // Delete invoice
    setInvoices(prev => prev.filter(inv => inv.id !== id));

    // Restore metrics from customer record
    setCustomers(prev => prev.map(c => {
      if (c.id === targetInvoice.customerId) {
        return {
          ...c,
          totalBilled: Math.max(0, c.totalBilled - targetInvoice.total),
          outstandingBalance: targetInvoice.status === 'Pending' || targetInvoice.status === 'Overdue'
            ? Math.max(0, c.outstandingBalance - targetInvoice.total)
            : c.outstandingBalance
        };
      }
      return c;
    }));

    // Register log event
    const deleteLog: ActivityLog = {
      id: `log_del_${Date.now()}`,
      type: 'invoice_overdue', // fallback classification
      date: new Date().toISOString().split('T')[0],
      message: `Invoice ${targetInvoice.invoiceNumber} was removed from ledger logs.`,
      refId: id
    };
    setLogs(prev => [deleteLog, ...prev]);
  };

  // Onboard Customer
  const handleOnboardCustomer = (newCust: Omit<Customer, 'id' | 'outstandingBalance' | 'totalBilled' | 'createdAt'>) => {
    const customerId = `cust_${Date.now()}`;
    const preparedCust: Customer = {
      id: customerId,
      outstandingBalance: 0,
      totalBilled: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...newCust
    };

    // Append to customers
    setCustomers(prev => [preparedCust, ...prev]);

    // Create log event
    const onboardLog: ActivityLog = {
      id: `log_onb_${Date.now()}`,
      type: 'customer_added',
      date: new Date().toISOString().split('T')[0],
      message: `Onboarded new client profile: ${preparedCust.name} (${preparedCust.company || 'Private account'})`,
      refId: customerId
    };
    setLogs(prev => [onboardLog, ...prev]);
  };

  // Public Client Portal Render Override
  if (publicInvoiceViewId) {
    const targetInv = invoices.find(i => i.id === publicInvoiceViewId);
    if (targetInv) {
      return (
        <ClientPortalView 
          invoice={targetInv}
          companyProfile={companyProfile}
          onPaymentSettled={handleClientPaymentSettled}
          onExitPortal={() => setPublicInvoiceViewId(null)}
        />
      );
    }
  }

  // Admin Authentication gate for Console tabs
  const isConsoleTab = ['dashboard', 'invoices', 'expenses', 'payments', 'customers', 'team', 'reports', 'settings'].includes(activeTab);
  if (isConsoleTab && !isAuthenticated) {
    return (
      <AdminLoginView 
        onLoginSuccess={handleLoginSuccess}
        onGoBack={() => setActiveTab('home')}
      />
    );
  }

  if (isMarketingTab(activeTab)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased" id="billora-marketing-layout">
        {/* PUBLIC MARKETING HEADER */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 h-16 flex items-center justify-between px-4 sm:px-12 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <Briefcase className="size-3 text-blue-600" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 uppercase">BILLORA</span>
          </div>

          {/* Marketing center links */}
          <nav className="hidden lg:flex items-center gap-1" id="marketing-nav-group">
            {[
              { id: 'home', label: 'Welcome', icon: Home },
              { id: 'features', label: 'Capabilities', icon: Rocket },
              { id: 'pricing', label: 'Pricing plans', icon: DollarSign },
              { id: 'templates', label: 'Template Gallery', icon: Palette },
              { id: 'faq', label: 'FAQ Accordions', icon: HelpCircle },
              { id: 'contact', label: 'Contact Support', icon: Mail }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <IconComponent className="size-3.5 text-slate-400" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md h-9 px-4 text-xs items-center justify-center gap-1.5 shadow-sm shadow-blue-500/15 cursor-pointer border-0"
            >
              Launch Sandbox Console
              <Eye className="size-3.5" />
            </button>
            
            {/* Mobile Hamburger toggle button */}
            <button
              onClick={() => setIsMarketingMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMarketingMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </header>

        {/* Dynamic Mobile Nav Dropdown for marketing */}
        <AnimatePresence>
          {isMarketingMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-b border-slate-200 shadow-md overflow-hidden sticky top-16 z-30"
              id="marketing-mobile-menu"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { id: 'home', label: 'Welcome', icon: Home },
                  { id: 'features', label: 'Capabilities', icon: Rocket },
                  { id: 'pricing', label: 'Pricing plans', icon: DollarSign },
                  { id: 'templates', label: 'Template Gallery', icon: Palette },
                  { id: 'faq', label: 'FAQ Accordions', icon: HelpCircle },
                  { id: 'contact', label: 'Contact Support', icon: Mail }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMarketingMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <IconComponent className={`size-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
                
                <div className="pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMarketingMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-11 px-4 text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/15 cursor-pointer border-0"
                  >
                    Launch Sandbox Console
                    <Eye className="size-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content staging with elegant center limit */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-12 bg-slate-50">
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: 'easeInOut' }}
              >
                {activeTab === 'home' && (
                  <HomeView 
                    onExploreFeatures={() => setActiveTab('features')}
                    onLaunchConsole={() => setActiveTab('dashboard')}
                    onContactSupport={() => setActiveTab('contact')}
                  />
                )}
                {activeTab === 'features' && (
                  <FeaturesView onLaunchConsole={() => setActiveTab('dashboard')} />
                )}
                {activeTab === 'pricing' && (
                  <PricingView onLaunchConsole={() => setActiveTab('dashboard')} />
                )}
                {activeTab === 'templates' && (
                  <TemplatesView 
                    onSelectTemplateStyle={(tpl) => console.log('Template configured to:', tpl)} 
                    onLaunchConsole={() => setActiveTab('dashboard')} 
                  />
                )}
                {activeTab === 'faq' && (
                  <FaqView onContactSupport={() => setActiveTab('contact')} />
                )}
                {activeTab === 'contact' && (
                  <ContactView />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        {/* Render floating AI Assistant in Marketing Hub pages */}
        <AIAssistant 
          invoices={invoices}
          customers={customers}
          payments={payments}
          expenses={expenses}
          geminiApiKey={geminiApiKey}
          activeTab={activeTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-50 flex font-sans text-slate-900 antialiased" id="billora-application-frame">
      {/* LEFT NAVIGATION DRAWER / SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 h-full" id="sidebar-navigation">
        <div className="flex flex-col flex-1">
          {/* Logo Brand Title */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 mb-6" id="brand-identity">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-xs cursor-pointer" 
              onClick={() => setActiveTab('home')}
            >
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <Briefcase className="size-3 text-blue-600" />
              </div>
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-slate-800 uppercase">BILLORA</span>
          </div>

          {/* Return Home Button Accent */}
          <div className="px-4 mb-2">
            <button
              onClick={() => setActiveTab('home')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold select-none cursor-pointer text-left border border-dashed border-slate-200"
            >
              <Home className="size-3.5 text-slate-400" />
              SaaS Home Landing Site
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto" id="nav-group">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'invoices', label: 'Invoices Ledger', icon: FileText },
              { id: 'expenses', label: 'Expense Registry', icon: DollarSign },
              { id: 'payments', label: 'Cleared Settle', icon: CreditCard },
              { id: 'customers', label: 'Client Accounts', icon: Users },
              { id: 'team', label: 'Corporate Team', icon: Users2 },
              { id: 'reports', label: 'Performance Stats', icon: TrendingUp },
              { id: 'settings', label: 'Ledger Config', icon: Settings }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShortcutInvoice(null);
                  }}
                  whileHover={{ 
                    x: 4, 
                    backgroundColor: isActive ? 'rgba(239, 246, 255, 1)' : 'rgba(241, 245, 249, 0.85)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm cursor-pointer text-left select-none ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-600'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  <IconComponent className={`size-4.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Card info at bottom conforming with Architectural Honesty */}
        <div className="p-4 border-t border-slate-100" id="sidebar-footer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 p-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm font-semibold text-[10px] flex items-center justify-center text-slate-705">
                AD
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Admin Desk</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Senior Auditor</p>
              </div>
            </div>
            <button 
              title="Cerrar Sesión de Administrador" 
              onClick={() => {
                if (confirm('¿Cerrar sesión de administrador en este navegador?')) {
                  setIsAuthenticated(false);
                  localStorage.removeItem('billora_admin_logged');
                  setActiveTab('home');
                }
              }}
              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER TOP NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 shadow-xs" id="mobile-header">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white cursor-pointer" onClick={() => {
            setActiveTab('home');
            setShortcutInvoice(null);
            setIsMobileDrawerOpen(false);
          }}>
            <Briefcase className="size-4.5" />
          </div>
          <span className="text-xs font-bold tracking-tight text-slate-800 uppercase">BILLORA</span>
        </div>
        
        {/* Quick Search trigger on mobile header */}
        <div className="flex items-center gap-2">
          <NotificationsDropdown 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearNotifications={handleClearNotifications}
          />
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
            title="Open Command Search (Ctrl+K)"
          >
            <Search className="size-4.5" />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE MAIN VIEW CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 md:pl-0 pt-16 pb-20 md:pb-0 md:pt-0 md:h-full md:overflow-hidden bg-slate-50/50" id="main-content-flow">
        
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-16 border-b border-slate-200/80 bg-white shrink-0 items-center justify-between px-8" id="desktop-top-header">
          {/* Left search bar simulation */}
          <div 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-500 rounded-lg cursor-pointer transition-colors border border-slate-200/50 max-w-xs w-64 text-xs font-semibold select-none"
          >
            <Search className="size-4 shrink-0 text-slate-400" />
            <span>Search commands (Ctrl+K)</span>
          </div>

          {/* Right actions: Bell + Profile details */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCloudSyncOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-sm shadow-blue-500/10 cursor-pointer border-0 transition-all hover:scale-102 active:scale-98"
            >
              <Rocket className="size-3.5" />
              Pasar a Producción
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <NotificationsDropdown 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearNotifications={handleClearNotifications}
              align="right"
            />
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-xs text-blue-600 border border-blue-100">
                AD
              </div>
              <div className="leading-tight">
                <span className="text-[11px] font-bold text-slate-700 block">Admin Desk</span>
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Auditor Console</span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10" id="scrolling-stage">
          <div className="w-full max-w-[1600px] mx-auto" id="scrolling-inner-grid">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardView
                    invoices={invoices}
                    customers={customers}
                    payments={payments}
                    logs={logs}
                    onNavigateToTab={(tab) => setActiveTab(tab)}
                    onViewInvoice={handleViewInvoiceDetailsShortcut}
                  />
                )}

                {activeTab === 'invoices' && (
                  <InvoicesView
                    invoices={invoices}
                    customers={customers}
                    onAddInvoice={handleAddInvoice}
                    onRecordPayment={handleRecordPayment}
                    onDeleteInvoice={handleDeleteInvoice}
                    companyProfile={companyProfile}
                    triggerOpenCreate={triggerInvoiceCreate}
                    onResetTriggerOpenCreate={() => setTriggerInvoiceCreate(false)}
                    geminiApiKey={geminiApiKey}
                    onViewClientPortal={(id) => setPublicInvoiceViewId(id)}
                  />
                )}

                {activeTab === 'expenses' && (
                  <ExpensesView
                    expenses={expenses}
                    onAddExpense={handleAddExpense}
                    onDeleteExpense={handleDeleteExpense}
                    triggerOpenCreate={triggerExpenseCreate}
                    onResetTriggerOpenCreate={() => setTriggerExpenseCreate(false)}
                    geminiApiKey={geminiApiKey}
                  />
                )}

                {activeTab === 'payments' && (
                  <PaymentsView
                    payments={payments}
                    customers={customers}
                    invoices={invoices}
                    onRecordPayment={handleRecordPayment}
                  />
                )}

                {activeTab === 'customers' && (
                  <CustomersView
                    customers={customers}
                    onAddCustomer={handleOnboardCustomer}
                    triggerOpenCreate={triggerCustomerCreate}
                    onResetTriggerOpenCreate={() => setTriggerCustomerCreate(false)}
                  />
                )}

                {activeTab === 'team' && (
                  <TeamView
                    teamMembers={teamMembers}
                    onInviteMember={handleInviteMember}
                    onRemoveMember={handleRemoveMember}
                  />
                )}

                {activeTab === 'reports' && (
                  <ReportsView
                    invoices={invoices}
                    customers={customers}
                    payments={payments}
                    expenses={expenses}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsView
                    companyProfile={companyProfile}
                    onUpdateProfile={(updated) => setCompanyProfile(updated)}
                    onRestoreDefaults={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    registeredClientsCount={customers.length}
                    registeredInvoicesCount={invoices.length}
                    registeredPaymentsCount={payments.length}
                    geminiApiKey={geminiApiKey}
                    onUpdateGeminiApiKey={setGeminiApiKey}
                    onExportData={handleExportCSV}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]" id="mobile-bottom-nav">
        {[
          { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
          { id: 'invoices', label: 'Bills', icon: FileText },
          { id: 'expenses', label: 'Costs', icon: DollarSign },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isMobileDrawerOpen;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShortcutInvoice(null);
                setIsMobileDrawerOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all cursor-pointer ${
                isActive ? 'text-blue-600 font-bold scale-105' : 'text-slate-450 hover:text-slate-700'
              }`}
            >
              <Icon className={`size-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
        
        {/* 'More' Button Toggle */}
        <button
          onClick={() => setIsMobileDrawerOpen(prev => !prev)}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all cursor-pointer ${
            isMobileDrawerOpen || ['payments', 'customers', 'team', 'reports', 'settings'].includes(activeTab)
              ? 'text-blue-600 font-bold scale-105'
              : 'text-slate-450 hover:text-slate-700'
          }`}
        >
          <Menu className={`size-5 ${(isMobileDrawerOpen || ['payments', 'customers', 'team', 'reports', 'settings'].includes(activeTab)) ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </div>

      {/* MOBILE MORE MENU SLIDE-UP DRAWER */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
              id="mobile-drawer-backdrop"
            />
            
            {/* Slide-Up Drawer Menu Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="md:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl z-45 max-h-[75vh] overflow-y-auto border-t border-slate-200 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] flex flex-col"
              id="mobile-drawer-sheet"
            >
              {/* Drawer Handle Accent */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0" />
              
              <div className="px-6 pb-8 pt-2 flex-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extended Console Ledger Tools</h3>
                
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {[
                    { id: 'payments', label: 'Cleared Settle', icon: CreditCard },
                    { id: 'customers', label: 'Client Accounts', icon: Users },
                    { id: 'team', label: 'Corporate Team', icon: Users2 },
                    { id: 'reports', label: 'Performance Stats', icon: TrendingUp },
                    { id: 'settings', label: 'Ledger Config', icon: Settings }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setShortcutInvoice(null);
                          setIsMobileDrawerOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-blue-50/80 border-blue-200 text-blue-700 shadow-xs' 
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <Icon className={`size-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fast Quick Actions</h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        setActiveTab('invoices');
                        setTriggerInvoiceCreate(true);
                      }}
                      className="bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-100 rounded-xl py-2.5 px-1.5 text-[10px] font-bold text-center cursor-pointer transition-colors"
                    >
                      + Invoice
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        setActiveTab('expenses');
                        setTriggerExpenseCreate(true);
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 rounded-xl py-2.5 px-1.5 text-[10px] font-bold text-center cursor-pointer transition-colors"
                    >
                      + Expense
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        setActiveTab('customers');
                        setTriggerCustomerCreate(true);
                      }}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 rounded-xl py-2.5 px-1.5 text-[10px] font-bold text-center cursor-pointer transition-colors"
                    >
                      + Client
                    </button>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3 text-slate-500 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('home');
                        setIsMobileDrawerOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg cursor-pointer font-medium transition-colors"
                    >
                      <Home className="size-4 text-slate-400" />
                      SaaS Marketing Website
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('¿Cerrar sesión de administrador?')) {
                          setIsAuthenticated(false);
                          localStorage.removeItem('billora_admin_logged');
                          setIsMobileDrawerOpen(false);
                          setActiveTab('home');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-rose-650 hover:bg-rose-50 rounded-lg cursor-pointer font-bold transition-colors"
                    >
                      <LogOut className="size-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setShortcutInvoice(null);
        }}
        onTriggerNewInvoice={() => setTriggerInvoiceCreate(true)}
        onTriggerNewExpense={() => setTriggerExpenseCreate(true)}
        onTriggerNewCustomer={() => setTriggerCustomerCreate(true)}
      />
      <AIAssistant 
        invoices={invoices}
        customers={customers}
        payments={payments}
        expenses={expenses}
        geminiApiKey={geminiApiKey}
        activeTab={activeTab}
      />
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        customersCount={customers.length}
        invoicesCount={invoices.length}
        expensesCount={expenses.length}
      />
    </div>
  );
}

