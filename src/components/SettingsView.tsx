import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Save, 
  MapPin, 
  Mail, 
  Phone, 
  Database, 
  RefreshCw, 
  DollarSign, 
  Percent, 
  Globe,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface CompanyProfile {
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
  dunningEnabled?: boolean;
  dunningSurchargePercent?: number;
  dunningSurchargeDays?: number;
  dunningReminderTone?: 'Friendly' | 'Professional' | 'Urgent';
}

interface SettingsViewProps {
  companyProfile: CompanyProfile;
  onUpdateProfile: (profile: CompanyProfile) => void;
  onRestoreDefaults: () => void;
  registeredClientsCount: number;
  registeredInvoicesCount: number;
  registeredPaymentsCount: number;
  geminiApiKey: string;
  onUpdateGeminiApiKey: (key: string) => void;
  onExportData: (type: 'invoices' | 'expenses' | 'customers') => void;
}

export function SettingsView({
  companyProfile,
  onUpdateProfile,
  onRestoreDefaults,
  registeredClientsCount,
  registeredInvoicesCount,
  registeredPaymentsCount,
  geminiApiKey,
  onUpdateGeminiApiKey,
  onExportData
}: SettingsViewProps) {
  // Local Form state
  const [name, setName] = useState(companyProfile.name);
  const [email, setEmail] = useState(companyProfile.email);
  const [phone, setPhone] = useState(companyProfile.phone);
  const [address, setAddress] = useState(companyProfile.address);
  const [taxRate, setTaxRate] = useState(companyProfile.taxRate);
  const [termsDays, setTermsDays] = useState(companyProfile.termsDays);
  const [localApiKey, setLocalApiKey] = useState(geminiApiKey);

  // Local Portal Customizer states
  const [portalTitle, setPortalTitle] = useState(companyProfile.portalTitle || 'Portal de Pago de Clientes');
  const [portalColor, setPortalColor] = useState(companyProfile.portalColor || '#2563eb');
  const [portalWelcome, setPortalWelcome] = useState(companyProfile.portalWelcome || 'Por favor, revise los detalles de su factura y procese el pago.');
  const [portalPayMethods, setPortalPayMethods] = useState<string[]>(companyProfile.portalPayMethods || ['card', 'ach', 'paypal']);

  // Local Dunning states
  const [dunningEnabled, setDunningEnabled] = useState(companyProfile.dunningEnabled || false);
  const [dunningSurchargePercent, setDunningSurchargePercent] = useState(companyProfile.dunningSurchargePercent || 2);
  const [dunningSurchargeDays, setDunningSurchargeDays] = useState(companyProfile.dunningSurchargeDays || 10);
  const [dunningReminderTone, setDunningReminderTone] = useState<'Friendly' | 'Professional' | 'Urgent'>(companyProfile.dunningReminderTone || 'Friendly');
  
  const [isSaved, setIsSaved] = useState(false);

  // Handle local save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      address,
      taxRate: Number(taxRate),
      termsDays: Number(termsDays),
      portalTitle,
      portalColor,
      portalWelcome,
      portalPayMethods,
      dunningEnabled,
      dunningSurchargePercent: Number(dunningSurchargePercent),
      dunningSurchargeDays: Number(dunningSurchargeDays),
      dunningReminderTone
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="space-y-6" 
      id="settings-workspace"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="settings-header-row">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Ledger & System Preferences</h1>
          <p className="text-xs text-slate-500">Configure your Billed From enterprise entity, general tax rules, terms, and monitor database statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="settings-split-layout">
        {/* Left Column (Forms & Settings) */}
        <div className="lg:col-span-2 space-y-6" id="settings-forms-column">
          {/* Profile Card & Form */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="size-4 text-blue-600" />
                Company Billing Entity Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Customize the "Billed From" details that appear instantly on all generated PDF/HTML customer invoice ledger bills.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corporate Registered Name *</label>
                    <Input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-8 text-xs border-slate-200 rounded-md focus:border-blue-500"
                      placeholder="e.g. Billora Fintech LLC"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Finance Email Coordinate *</label>
                    <Input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 text-xs border-slate-200 rounded-md focus:border-blue-500"
                      placeholder="e.g. accounts@yourcompany.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Support Phone</label>
                    <Input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-8 text-xs border-slate-200 rounded-md focus:border-blue-500"
                      placeholder="e.g. +1 (555) 982-1090"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Default Net Terms (Days) *</label>
                    <Input 
                      type="number" 
                      required 
                      value={termsDays}
                      onChange={(e) => setTermsDays(Number(e.target.value))}
                      className="h-8 text-xs border-slate-200 rounded-md focus:border-blue-500 font-mono"
                      placeholder="e.g. 30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Physical HQ Address Coordinates *</label>
                  <textarea 
                    required 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="e.g. 100 Pine Street, Suite 1800, San Francisco, CA 94111"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onRestoreDefaults}
                    size="sm"
                    className="h-8 rounded-md text-slate-600 border-slate-200 text-xs px-3"
                  >
                    Restaurar Datos Iniciales
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm"
                    className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer text-xs px-3 gap-1 border-0"
                  >
                    <Save className="size-3.5" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>

              {/* Keyboard Shortcuts Console */}
              <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Sparkles className="size-4 text-blue-600 animate-pulse" />
                    Consola de Atajos de Teclado y Comandos Rápidos
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Billora incluye accesos rápidos por hardware para acelerar el flujo de trabajo financiero sin tocar el mouse.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-700 text-xs">Acciones Rápidas (Atajos del Teclado)</h4>
                    <div className="space-y-2">
                      {[
                        { keys: 'Ctrl + K  /  Cmd + K', desc: 'Abrir Paleta de Comandos' },
                        { keys: 'Ctrl + N  /  Cmd + N', desc: 'Crear Nueva Factura' },
                        { keys: 'Ctrl + E  /  Cmd + E', desc: 'Registrar Nuevo Gasto' },
                        { keys: 'Ctrl + F  /  Cmd + F', desc: 'Añadir Nuevo Cliente' }
                      ].map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-655 font-medium">{s.desc}</span>
                          <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-bold text-slate-800 shadow-xs">
                            {s.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-700 text-xs">Navegación Rápida (Consola Alt/Option)</h4>
                    <div className="space-y-1.5">
                      {[
                        { tab: 'Dashboard', num: 'Alt + 1' },
                        { tab: 'Facturas', num: 'Alt + 2' },
                        { tab: 'Gastos', num: 'Alt + 3' },
                        { tab: 'Pagos', num: 'Alt + 4' },
                        { tab: 'Clientes', num: 'Alt + 5' },
                        { tab: 'Equipo', num: 'Alt + 6' },
                        { tab: 'Reportes', num: 'Alt + 7' },
                        { tab: 'Ajustes', num: 'Alt + 8' }
                      ].map((n, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
                          <span className="text-slate-600 font-semibold">{n.tab}</span>
                          <kbd className="px-1.5 py-0.2 bg-white border border-slate-200 rounded font-mono text-[8px] font-extrabold text-slate-800 shadow-3xs">
                            {n.num}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Client Portal Customization (Marca Blanca) */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Palette className="size-4 text-blue-600" />
                Personalización del Portal (Marca Blanca)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Ajusta la apariencia visual del portal VIP para tus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Título del Portal *</label>
                <Input
                  type="text"
                  value={portalTitle}
                  onChange={(e) => setPortalTitle(e.target.value)}
                  className="h-8 text-xs border-slate-200 rounded-md focus:border-blue-500"
                  placeholder="e.g. Portal de Pagos Directos"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Color de Marca del Portal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={portalColor}
                    onChange={(e) => setPortalColor(e.target.value)}
                    className="w-10 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                  <Input
                    type="text"
                    value={portalColor}
                    onChange={(e) => setPortalColor(e.target.value)}
                    className="h-8 text-xs border-slate-200 rounded-md font-mono w-28 text-center"
                  />
                  <div className="flex gap-1">
                    {['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#0f172a'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPortalColor(c)}
                        className="w-5 h-5 rounded-full border border-slate-350 cursor-pointer"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mensaje de Bienvenida del Portal</label>
                <textarea
                  value={portalWelcome}
                  onChange={(e) => setPortalWelcome(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-700 bg-white"
                  placeholder="Por favor, revise los detalles de su factura..."
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Métodos de Pago Habilitados</label>
                <div className="flex gap-4 font-semibold text-slate-650">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={portalPayMethods.includes('card')}
                      onChange={(e) => {
                        if (e.target.checked) setPortalPayMethods([...portalPayMethods, 'card']);
                        else setPortalPayMethods(portalPayMethods.filter(m => m !== 'card'));
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    Tarjeta
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={portalPayMethods.includes('ach')}
                      onChange={(e) => {
                        if (e.target.checked) setPortalPayMethods([...portalPayMethods, 'ach']);
                        else setPortalPayMethods(portalPayMethods.filter(m => m !== 'ach'));
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    ACH (Banco)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={portalPayMethods.includes('paypal')}
                      onChange={(e) => {
                        if (e.target.checked) setPortalPayMethods([...portalPayMethods, 'paypal']);
                        else setPortalPayMethods(portalPayMethods.filter(m => m !== 'paypal'));
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    PayPal
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dunning & Surcharge Engine */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="size-4 text-blue-600 animate-pulse" />
                Motor de Automatización de Cobros (Dunning & Mora)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Aplica penalizaciones automáticas a facturas vencidas y programa alertas de cobro.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div>
                  <span className="font-bold text-slate-800 block">Habilitar Automatización de Mora</span>
                  <span className="text-[10px] text-slate-450 block font-normal leading-relaxed">
                    Sanciona facturas vencidas sumando un interés porcentual tras superar un plazo.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={dunningEnabled}
                  onChange={(e) => setDunningEnabled(e.target.checked)}
                  className="rounded text-blue-605 focus:ring-blue-500 cursor-pointer w-4 h-4"
                />
              </div>

              {dunningEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recargo por Mora (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={dunningSurchargePercent}
                      onChange={(e) => setDunningSurchargePercent(Number(e.target.value))}
                      className="h-8 text-xs border-slate-200 focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plazo de Gracia (Días)</label>
                    <Input
                      type="number"
                      value={dunningSurchargeDays}
                      onChange={(e) => setDunningSurchargeDays(Number(e.target.value))}
                      className="h-8 text-xs border-slate-200 focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tono del recordatorio (IA)</label>
                    <select
                      value={dunningReminderTone}
                      onChange={(e) => setDunningReminderTone(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 h-8"
                    >
                      <option value="Friendly">Friendly / Amistoso</option>
                      <option value="Professional">Professional / Formal</option>
                      <option value="Urgent">Urgent / Exigente</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Database & Diagnostics Column */}
        <div className="space-y-6" id="settings-sidebar-col">
          {/* Default tax config options */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Percent className="size-4 text-blue-600" />
                Ledger Directives
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs text-slate-650">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Default Tax Rate (%)</label>
                <select 
                  value={taxRate}
                  onChange={(e) => {
                    const rate = Number(e.target.value);
                    setTaxRate(rate);
                    onUpdateProfile({ ...companyProfile, taxRate: rate });
                  }}
                  className="w-full px-2.5 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value={0.00}>0% - Tax Exempt</option>
                  <option value={0.05}>5% - VAT Standard</option>
                  <option value={0.08}>8% - State Service Tax LLC</option>
                  <option value={0.10}>10% - Standard Finance VAT</option>
                  <option value={0.15}>15% - High Premium Sales Tax</option>
                </select>
                <p className="text-[9px] text-slate-400 mt-1">
                  Tax automatically applied to newly composed customer drafts.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Google Gemini AI Configuration */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden bg-gradient-to-br from-white to-blue-50/5">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="size-4 text-blue-600" />
                Google Gemini API
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">API Key para Asistente</label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    className="h-8 text-xs border-slate-200 rounded-md focus:border-blue-500 flex-1 font-mono"
                    placeholder="AIzaSy..."
                  />
                  <Button
                    onClick={() => {
                      onUpdateGeminiApiKey(localApiKey);
                      setIsSaved(true);
                      setTimeout(() => setIsSaved(false), 2000);
                    }}
                    size="sm"
                    className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer text-xs px-3"
                  >
                    Guardar
                  </Button>
                </div>
                <p className="text-[9px] text-slate-400 leading-normal">
                  Guarda tu clave de Google AI para activar resúmenes analíticos contables y recordatorios de cobro inteligentes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Portability (CSV Exports) */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Globe className="size-4 text-blue-600" />
                Portabilidad de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                Descarga tus registros contables en formato CSV plano compatible con Excel o Google Sheets:
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={() => onExportData('invoices')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-center h-8 rounded-md text-slate-650 hover:bg-slate-50 border-slate-200 py-1 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  Exportar Facturas (.CSV)
                </Button>
                <Button 
                  onClick={() => onExportData('expenses')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-center h-8 rounded-md text-slate-650 hover:bg-slate-50 border-slate-200 py-1 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  Exportar Gastos (.CSV)
                </Button>
                <Button 
                  onClick={() => onExportData('customers')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-center h-8 rounded-md text-slate-650 hover:bg-slate-50 border-slate-200 py-1 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  Exportar Clientes (.CSV)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Diagnostics Info */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database className="size-4 text-blue-600" />
                System Audit Trace
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">Clients</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">{registeredClientsCount}</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-400 text-[9px] block font-bold uppercase">Invoices</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">{registeredInvoicesCount}</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-400 text-[9px] block font-bold uppercase">Settle</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">{registeredPaymentsCount}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Persistence Provider:</span>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 text-[9px] font-bold tracking-wider uppercase px-2 py-0 border">
                    Local Storage Key-Value
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Engine Framework:</span>
                  <span className="font-mono font-semibold text-slate-700">React 18 + Vite SPA</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Cleared:</span>
                  <span className="font-mono text-emerald-600 font-bold text-[9px]">ONLINE SECURE</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <Button 
                  onClick={() => {
                    if (confirm('Verify: Reset all company entities, metrics, invoices and clients back to original initial mock template values? This cannot be undone.')) {
                      onRestoreDefaults();
                      window.location.reload();
                    }
                  }}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-center h-8 rounded-md text-slate-650 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border-slate-205 py-1 text-xs font-semibold gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="size-3.5" />
                  Restore Factory Ledger Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
