import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  MapPin, 
  Phone, 
  DollarSign, 
  Building2,
  Calendar
} from 'lucide-react';
import { Customer, CustomerStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from './Toast';
import { motion, AnimatePresence } from 'motion/react';
import { containerStagger, itemFadeSlide, hoverCard } from '../lib/motion';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'outstandingBalance' | 'totalBilled' | 'createdAt'>) => void;
  triggerOpenCreate?: boolean;
  onResetTriggerOpenCreate?: () => void;
}

export function CustomersView({
  customers,
  onAddCustomer,
  triggerOpenCreate,
  onResetTriggerOpenCreate
}: CustomersViewProps) {
  const { success: showSuccess, error: showError } = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    if (triggerOpenCreate) {
      setIsAddOpen(true);
      onResetTriggerOpenCreate?.();
    }
  }, [triggerOpenCreate, onResetTriggerOpenCreate]);

  // Add Customer Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Active');

  // Filtering
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust.company && cust.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cust.phone && cust.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || cust.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle submit addition
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showError('Contact Name and Email are mandatory fields.');
      return;
    }

    onAddCustomer({
      name,
      email,
      phone,
      company,
      address,
      status
    });

    showSuccess(`Client "${name}" onboarded successfully`);

    // Reset Form & Close
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setAddress('');
    setStatus('Active');
  };

  // Currency format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6" id="customers-workspace-container">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="customers-header-row">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Enterprise Client Database</h1>
          <p className="text-xs text-slate-500">Corporate registries, billing metrics, and contacts listing</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="rounded-md font-semibold gap-1.5 cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          id="trigger-add-customer-btn"
        >
          <UserPlus className="size-4" />
          Onboard New Client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm" id="customer-filters-container">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by contact name, company name, phone registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-205 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'all' as const, label: 'All Clients' },
              { id: 'Active' as const, label: 'Active Status' },
              { id: 'Inactive' as const, label: 'Inactive Status' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold select-none transition-all cursor-pointer ${
                  statusFilter === f.id 
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Customer Profiles */}
      <motion.div 
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        id="customers-grid"
      >
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 p-12 rounded-xl text-center text-slate-400 shadow-sm">
            <Users className="size-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-900">No customers found</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Try resetting search credentials or onboard a new client above.</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <motion.div 
              key={cust.id} 
              variants={{
                ...itemFadeSlide,
                hover: hoverCard.hover,
                tap: hoverCard.tap
              }}
              whileHover="hover" 
              whileTap="tap"
              className="h-full"
            >
              <Card className="border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm bg-white overflow-hidden h-full" id={`cust-card-${cust.id}`}>
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold text-slate-850 truncate max-w-[150px]">{cust.name}</CardTitle>
                    {cust.company && (
                      <CardDescription className="text-xs font-semibold text-blue-700 font-sans flex items-center gap-1">
                        <Building2 className="size-3 text-blue-500" />
                        {cust.company}
                      </CardDescription>
                    )}
                  </div>
                  <Badge 
                    className={
                      cust.status === 'Active' ? 'bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase border-0 rounded-sm' :
                      'bg-slate-100 text-slate-750 text-[10px] font-bold uppercase border-0 rounded-sm'
                    }
                  >
                    {cust.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs text-slate-600">
                {/* Contact Coordinates */}
                <div className="space-y-1.5 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-slate-400" />
                    <span className="truncate text-slate-650">{cust.email}</span>
                  </div>
                  {cust.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-slate-400" />
                      <span className="text-slate-650">{cust.phone}</span>
                    </div>
                  )}
                  {cust.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2 text-slate-500 leading-relaxed">{cust.address}</span>
                    </div>
                  )}
                </div>

                {/* Account Balances */}
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2.5 rounded-md border border-slate-100">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Ledger Billed</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{formatCurrency(cust.totalBilled)}</p>
                  </div>
                  <div className="border-l border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Outstanding</span>
                    <p className={`font-mono font-bold mt-0.5 text-xs ${cust.outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-705'}`}>
                      {formatCurrency(cust.outstandingBalance)}
                    </p>
                  </div>
                </div>

                {/* Account Onboarding stamp */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    Onboarded:
                  </span>
                  <span className="font-mono font-medium">{cust.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))
        )}
      </motion.div>

      {/* ==================== ONBOARD CLIENT DIALOG ==================== */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-800">Onboard Enterprise Client</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Provide corporate and billing directory info to initialize account ledger.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            {/* Primary contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Representative Name *</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Martha Wayne"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 shadow-xs rounded-md border-slate-200 focus:border-blue-500 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corporate Email *</label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. billing@wayne.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 shadow-xs rounded-md border-slate-200 focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Corporate identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Wayne Enterprises"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-8 shadow-xs rounded-md border-slate-200 focus:border-blue-500 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Coordinate</label>
                <Input
                  type="tel"
                  placeholder="e.g. +1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-8 shadow-xs rounded-md border-slate-200 focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billing Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Include street coordinates, suite numbers, and zip codes..."
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors h-14"
              />
            </div>

            {/* Status selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ledger Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-505 transition-colors"
              >
                <option value="Active">Active registry</option>
                <option value="Inactive">Inactive/Hold registry</option>
              </select>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="rounded-md text-slate-600 border-slate-200 h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-md cursor-pointer bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-semibold px-4">
                Onboard Client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
