export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.08 for 8%
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  isRecurring?: boolean;
  recurrenceFrequency?: 'Weekly' | 'Monthly' | 'Quarterly';
  recurrenceNextDate?: string;
  isDunningSurchargeApplied?: boolean;
  originalTotalBeforeSurcharge?: number;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  outstandingBalance: number;
  totalBilled: number;
  status: CustomerStatus;
  createdAt: string;
}

export type PaymentMethod = 'Bank Transfer' | 'Credit Card' | 'PayPal' | 'Cash';

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference: string;
  status: 'Cleared' | 'Pending' | 'Failed';
}

export interface ActivityLog {
  id: string;
  type: 'invoice_created' | 'invoice_paid' | 'payment_received' | 'customer_added' | 'invoice_overdue';
  date: string;
  message: string;
  amount?: number;
  refId: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  pending: number;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  merchant: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
  permissions: string[];
}
