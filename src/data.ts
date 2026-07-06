import { Invoice, Customer, Payment, ActivityLog, MonthlyRevenue } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'John Carter',
    email: 'jcarter@acme.com',
    phone: '+1 (555) 234-5678',
    company: 'Acme Corporation',
    address: '123 Industrial Way, Suite A, San Francisco, CA 94107',
    outstandingBalance: 3450.00,
    totalBilled: 8300.00,
    status: 'Active',
    createdAt: '2025-10-15'
  },
  {
    id: 'cust_2',
    name: 'Pepper Potts',
    email: 'potts@stark.com',
    phone: '+1 (555) 789-0123',
    company: 'Stark Industries',
    address: '10880 Malibu Point, Malibu, CA 90265',
    outstandingBalance: 0.00,
    totalBilled: 12500.00,
    status: 'Active',
    createdAt: '2025-11-02'
  },
  {
    id: 'cust_3',
    name: 'Hank Scorpio',
    email: 'hscorpio@globex.org',
    phone: '+1 (555) 901-2345',
    company: 'Globex Corporation',
    address: '1000 Cypress Creek Blvd, Oregon 97401',
    outstandingBalance: 2900.00,
    totalBilled: 6020.00,
    status: 'Active',
    createdAt: '2025-12-10'
  },
  {
    id: 'cust_4',
    name: 'Peter Gibbons',
    email: 'pgibbons@initech.com',
    phone: '+1 (555) 345-6789',
    company: 'Initech LLC',
    address: '4120 Freemont Ave, Austin, TX 78759',
    outstandingBalance: 850.00,
    totalBilled: 2050.00,
    status: 'Active',
    createdAt: '2026-01-05'
  },
  {
    id: 'cust_5',
    name: 'Albert Wesker',
    email: 'awesker@umbrella.com',
    phone: '+1 (555) 456-7890',
    company: 'Umbrella Corporation',
    address: '500 Raccoon Forest Rd, Arklay County, CO 80401',
    outstandingBalance: 1650.00,
    totalBilled: 1650.00,
    status: 'Inactive',
    createdAt: '2025-08-22'
  },
  {
    id: 'cust_6',
    name: 'Lucius Fox',
    email: 'lfox@waynecorp.com',
    phone: '+1 (555) 890-1234',
    company: 'Wayne Enterprises',
    address: '1007 Mountain Drive, Gotham City, NJ 07001',
    outstandingBalance: 5400.00,
    totalBilled: 17120.00,
    status: 'Active',
    createdAt: '2025-09-01'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cust_2',
    customerName: 'Pepper Potts',
    customerEmail: 'potts@stark.com',
    date: '2026-01-10',
    dueDate: '2026-02-10',
    items: [
      { id: 'item_1', description: 'Quantum Grid Compute Resources (Monthly)', quantity: 3, unitPrice: 1500, amount: 4500 },
      { id: 'item_2', description: 'Enterprise Connectivity Service Support', quantity: 1, unitPrice: 350, amount: 350 }
    ],
    subtotal: 4850.00,
    taxRate: 0.08,
    taxAmount: 388.00,
    total: 5238.00,
    status: 'Paid',
    notes: 'Thank you for your business. Payment processed automatically on credit card.'
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2026-002',
    customerId: 'cust_1',
    customerName: 'John Carter',
    customerEmail: 'jcarter@acme.com',
    date: '2026-01-15',
    dueDate: '2026-02-15',
    items: [
      { id: 'item_3', description: 'Corporate Cloud Infrastructure Audit', quantity: 1, unitPrice: 1200, amount: 1200 }
    ],
    subtotal: 1200.00,
    taxRate: 0.08,
    taxAmount: 96.00,
    total: 1296.00,
    status: 'Paid',
    notes: 'Paid via ACH transfer.'
  },
  {
    id: 'inv_3',
    invoiceNumber: 'INV-2026-003',
    customerId: 'cust_1',
    customerName: 'John Carter',
    customerEmail: 'jcarter@acme.com',
    date: '2026-02-01',
    dueDate: '2026-03-01',
    items: [
      { id: 'item_4', description: 'DevOps Automation Setup & Implementation', quantity: 15, unitPrice: 150, amount: 2250 },
      { id: 'item_5', description: 'Production Deployment Support Pack', quantity: 1, unitPrice: 1200, amount: 1200 }
    ],
    subtotal: 3450.00,
    taxRate: 0.08,
    taxAmount: 276.00,
    total: 3726.00,
    status: 'Pending',
    notes: 'Net 30 payment terms.'
  },
  {
    id: 'inv_4',
    invoiceNumber: 'INV-2026-004',
    customerId: 'cust_3',
    customerName: 'Hank Scorpio',
    customerEmail: 'hscorpio@globex.org',
    date: '2026-01-05',
    dueDate: '2026-02-05',
    items: [
      { id: 'item_6', description: 'Thermal Regulation System Controls consultation', quantity: 1, unitPrice: 2000, amount: 2000 },
      { id: 'item_7', description: 'Laser System Safety Inspection Fee', quantity: 1, unitPrice: 900, amount: 900 }
    ],
    subtotal: 2900.00,
    taxRate: 0.08,
    taxAmount: 232.00,
    total: 3132.00,
    status: 'Overdue',
    notes: 'Please submit payment immediately. Lateness charges may apply after 30 days.'
  },
  {
    id: 'inv_5',
    invoiceNumber: 'INV-2026-005',
    customerId: 'cust_4',
    customerName: 'Peter Gibbons',
    customerEmail: 'pgibbons@initech.com',
    date: '2026-02-18',
    dueDate: '2026-03-18',
    items: [
      { id: 'item_8', description: 'Y2K Bug Compliance Audit & Remediation', quantity: 5, unitPrice: 170, amount: 850 }
    ],
    subtotal: 850.00,
    taxRate: 0.08,
    taxAmount: 68.00,
    total: 918.00,
    status: 'Draft',
    notes: 'Draft invoice for Initech team review.'
  },
  {
    id: 'inv_6',
    invoiceNumber: 'INV-2026-006',
    customerId: 'cust_5',
    customerName: 'Albert Wesker',
    customerEmail: 'awesker@umbrella.com',
    date: '2025-12-20',
    dueDate: '2026-01-20',
    items: [
      { id: 'item_9', description: 'Genetic Analysis Software Subscriptions', quantity: 11, unitPrice: 150, amount: 1650 }
    ],
    subtotal: 1650.00,
    taxRate: 0.08,
    taxAmount: 132.00,
    total: 1782.00,
    status: 'Overdue',
    notes: 'Notice of unpaid, past-due balance.'
  },
  {
    id: 'inv_7',
    invoiceNumber: 'INV-2026-007',
    customerId: 'cust_6',
    customerName: 'Lucius Fox',
    customerEmail: 'lfox@waynecorp.com',
    date: '2026-02-10',
    dueDate: '2026-03-10',
    items: [
      { id: 'item_10', description: 'Tactical Defense Plating Calibration', quantity: 1, unitPrice: 4000, amount: 4000 },
      { id: 'item_11', description: 'Advanced Signal Transceiver Core', quantity: 1, unitPrice: 1400, amount: 1400 }
    ],
    subtotal: 5400.00,
    taxRate: 0.08,
    taxAmount: 432.00,
    total: 5832.00,
    status: 'Pending'
  },
  {
    id: 'inv_8',
    invoiceNumber: 'INV-2026-008',
    customerId: 'cust_6',
    customerName: 'Lucius Fox',
    customerEmail: 'lfox@waynecorp.com',
    date: '2026-01-05',
    dueDate: '2026-02-05',
    items: [
      { id: 'item_12', description: 'High-Altitude Glide Suit Maintenance', quantity: 2, unitPrice: 1560, amount: 3120 }
    ],
    subtotal: 3120.00,
    taxRate: 0.08,
    taxAmount: 249.60,
    total: 3369.60,
    status: 'Paid',
    notes: 'Paid via Corporate Wire.'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    invoiceId: 'inv_1',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cust_2',
    customerName: 'Pepper Potts',
    amount: 5238.00,
    date: '2026-02-02',
    method: 'Credit Card',
    reference: 'PAY_TXN_998242A',
    status: 'Cleared'
  },
  {
    id: 'pay_2',
    invoiceId: 'inv_2',
    invoiceNumber: 'INV-2026-002',
    customerId: 'cust_1',
    customerName: 'John Carter',
    amount: 1296.00,
    date: '2026-02-05',
    method: 'Bank Transfer',
    reference: 'ACH_BILL_88201',
    status: 'Cleared'
  },
  {
    id: 'pay_3',
    invoiceId: 'inv_8',
    invoiceNumber: 'INV-2026-008',
    customerId: 'cust_6',
    customerName: 'Lucius Fox',
    amount: 3369.60,
    date: '2026-01-25',
    method: 'Bank Transfer',
    reference: 'FED_WIRE_77610A',
    status: 'Cleared'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log_1',
    type: 'invoice_created',
    date: '2026-02-18',
    message: 'Invoice INV-2026-005 created for Peter Gibbons (Initech LLC) as Draft',
    amount: 918.00,
    refId: 'inv_5'
  },
  {
    id: 'log_2',
    type: 'payment_received',
    date: '2026-02-05',
    message: 'Payment of $1,296.00 cleared for John Carter (Acme Corporation)',
    amount: 1296.00,
    refId: 'pay_2'
  },
  {
    id: 'log_3',
    type: 'invoice_paid',
    date: '2026-02-02',
    message: 'Invoice INV-2026-001 marked as fully Paid by Pepper Potts',
    amount: 5238.00,
    refId: 'inv_1'
  },
  {
    id: 'log_4',
    type: 'invoice_created',
    date: '2026-02-10',
    message: 'Invoice INV-2026-007 sent to Lucius Fox (Wayne Enterprises) for $5,832.00',
    amount: 5832.00,
    refId: 'inv_7'
  },
  {
    id: 'log_5',
    type: 'invoice_overdue',
    date: '2026-02-05',
    message: 'Invoice INV-2026-004 for Hank Scorpio is past its due date and marked Overdue',
    amount: 3132.00,
    refId: 'inv_4'
  }
];

export const MONTHLY_METRICS: MonthlyRevenue[] = [
  { month: 'Sep 25', revenue: 15400, pending: 2200 },
  { month: 'Oct 25', revenue: 18200, pending: 1450 },
  { month: 'Nov 25', revenue: 21000, pending: 3100 },
  { month: 'Dec 25', revenue: 14500, pending: 4200 },
  { month: 'Jan 26', revenue: 24700, pending: 5800 },
  { month: 'Feb 26', revenue: 9903, pending: 10476 } // updated dynamically in reporting
];

export const INITIAL_EXPENSES = [
  {
    id: 'exp_1',
    description: 'Github Enterprise Plan Subscription Team Access',
    category: 'Software',
    amount: 320.00,
    date: '2026-02-10',
    status: 'Approved' as const,
    merchant: 'Github Inc.'
  },
  {
    id: 'exp_2',
    description: 'Bespoke Office Desk & Premium Chairs',
    category: 'Office Utilities',
    amount: 1450.00,
    date: '2026-02-12',
    status: 'Approved' as const,
    merchant: 'Steelcase Corp.'
  },
  {
    id: 'exp_3',
    description: 'Google AdWords Campaign - Q1 Promotion',
    category: 'Marketing',
    amount: 2500.00,
    date: '2026-02-15',
    status: 'Approved' as const,
    merchant: 'Google Ads LLC'
  }
];

export const INITIAL_TEAM_MEMBERS = [
  {
    id: 'team_1',
    name: 'Sarah Jenkins',
    email: 'sarah@billora.co',
    role: 'Owner',
    status: 'Active' as const,
    permissions: ['Compose Bills', 'View Bills', 'Apply Settle Receipts', 'Config Ledger Settings']
  },
  {
    id: 'team_2',
    name: 'Michael Scott',
    email: 'mscott@billora.co',
    role: 'Finance Manager',
    status: 'Active' as const,
    permissions: ['Compose Bills', 'View Bills', 'Apply Settle Receipts']
  },
  {
    id: 'team_3',
    name: 'Pam Beesly',
    email: 'pam@billora.co',
    role: 'Accountant',
    status: 'Active' as const,
    permissions: ['View Bills', 'Apply Settle Receipts']
  },
  {
    id: 'team_4',
    name: 'Jim Halpert',
    email: 'jim@billora.co',
    role: 'Billing Clerk',
    status: 'Invited' as const,
    permissions: ['View Bills']
  }
];

