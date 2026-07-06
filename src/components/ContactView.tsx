import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';

export function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Integrations Desk',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    // Simulate API delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Integrations Desk',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-12 py-4" id="marketing-contact-workspace">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-sans">Corporate Coordinates</span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Connect with the Billora Group</h1>
        <p className="text-xs text-slate-500">
          Our global team handles technical deployments, database migrations, bespoke invoice design integrations, and custom payment compliance standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" id="contact-split-matrix">
        {/* Contact Info & Coordinates (Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="md:col-span-5 space-y-6" 
          id="contact-info-col"
        >
          <motion.div
            whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
            className="transition-all duration-300"
          >
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Headquarters</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5 text-xs text-slate-650">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-3"
                >
                  <MapPin className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">Billora Ledger Technologies LLC</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      100 Pine Street, Floor 18<br />
                      San Francisco, CA 94111, USA
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3 border-t border-slate-50 pt-4"
                >
                  <Mail className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">Financial Integrations Support</span>
                    <p className="text-slate-400 text-[11px]">integrations@billora.co</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 border-t border-slate-50 pt-4"
                >
                  <Phone className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">Telephone Lines</span>
                    <p className="text-slate-400 text-[11px]">+1 (555) 100-3000</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 border-t border-slate-50 pt-4"
                >
                  <Clock className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">Operating Hours</span>
                    <p className="text-slate-400 text-[11px]">Monday to Friday: 08:00 - 18:00 UTC</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Messaging Form (Right) */}
        <div className="md:col-span-7" id="contact-form-col">
          <Card className="border border-slate-205 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
              <CardTitle className="text-xs font-bold text-slate-800">Submit Corporate Inquiry</CardTitle>
              <CardDescription className="text-[10px] text-slate-500">Please provide clear specifics about database sync, licensing tiers or trial issues.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-3 animate-fadeIn">
                  <div className="size-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Inquiry Cleared Successfully</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Thank you. Your message has been logged inside our sandbox ledger database. An onboarding engineer will verify details and reach out within 12 standard business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Your Name / Title *</label>
                      <Input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-8 text-xs rounded-md border-slate-200 focus:border-blue-500"
                        placeholder="e.g. John Doe, CFO"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Corporate Email Address *</label>
                      <Input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-8 text-xs rounded-md border-slate-200 focus:border-blue-500"
                        placeholder="e.g. john@acme.corp"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Priority Desk</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-2.5 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Integrations Desk">Billing & API Integrations Desk</option>
                      <option value="Enterprise Sales">Enterprise SaaS Licensing & Quotations</option>
                      <option value="Account Audit">Account Ledger Audit & Clearings Help</option>
                      <option value="General Feedback">Sovereign Feature Requests</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Message *</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 ring-0 h-24 min-h-[96px]"
                      placeholder="Please specify configuration options, database volumes, or custom template requests..."
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <AlertCircle className="size-3.5 text-blue-500" />
                      Requires valid active email structure.
                    </span>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-md h-8 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>In Transit...</>
                      ) : (
                        <>
                          <Send className="size-3.5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
