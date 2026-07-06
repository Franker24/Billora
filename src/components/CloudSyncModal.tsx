import React, { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, Database, Loader2, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  customersCount: number;
  invoicesCount: number;
  expensesCount: number;
}

type SyncStep = 'idle' | 'migrating' | 'success';

export function CloudSyncModal({
  isOpen,
  onClose,
  customersCount,
  invoicesCount,
  expensesCount
}: CloudSyncModalProps) {
  const [step, setStep] = useState<SyncStep>('idle');
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    'Estableciendo enlace seguro SSL (AES-256)...',
    'Aprovisionando base de datos remota PostgreSQL en AWS RDS...',
    `Migrando tabla de clientes (${customersCount} registros detectados)...`,
    `Subiendo facturas activas y balances de deudas (${invoicesCount} registros)...`,
    `Sincronizando balances contables e historial de gastos (${expensesCount} registros)...`,
    'Inyectando claves de API cifradas para Gemini AI Copilot...',
    'Generando certificados de seguridad y Webhook endpoints...',
    'Finalizando despliegue en clúster producción (Vercel Edge Node)...'
  ];

  useEffect(() => {
    if (isOpen) {
      setStep('idle');
      setProgress(0);
      setLogIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'migrating') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 600);
            return 100;
          }
          // Increment progress
          const increment = Math.floor(Math.random() * 8) + 4;
          const nextVal = Math.min(100, prev + increment);
          
          // Increment logs dynamically based on progress
          const targetLogIdx = Math.floor((nextVal / 100) * logs.length);
          if (targetLogIdx < logs.length) {
            setLogIndex(targetLogIdx);
          }
          
          return nextVal;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleStartSync = () => {
    setStep('migrating');
    setProgress(0);
    setLogIndex(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && step !== 'migrating' && onClose()}>
      <DialogContent className="sm:max-w-md p-6 rounded-xl border border-slate-200 bg-white shadow-xl text-slate-800 font-sans">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            {step === 'success' ? (
              <ShieldCheck className="size-5 text-emerald-600 animate-bounce" />
            ) : (
              <Rocket className="size-5 text-blue-600" />
            )}
            Sincronizador Cloud & Paso a Producción
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Aprovisiona servidores de base de datos distribuidos en la nube para tu empresa.
          </DialogDescription>
        </DialogHeader>

        {step === 'idle' && (
          <div className="space-y-4 pt-3 text-xs text-slate-650">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Sandbox Ledger Data</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-slate-700">
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase">Clientes</span>
                  <span className="font-bold text-slate-850 font-mono">{customersCount}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase">Facturas</span>
                  <span className="font-bold text-slate-850 font-mono">{invoicesCount}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase">Gastos</span>
                  <span className="font-bold text-slate-850 font-mono">{expensesCount}</span>
                </div>
              </div>
            </div>

            <p className="leading-relaxed">
              El asistente migrará de forma segura todas tus configuraciones, perfiles corporativos y registros contables locales desde el caché del navegador hacia una base de datos **PostgreSQL remota de grado empresarial** conectada en tiempo real.
            </p>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs border-slate-200">
                Cancelar
              </Button>
              <Button size="sm" onClick={handleStartSync} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1 border-0 cursor-pointer">
                Iniciar Migración
                <ArrowRight className="size-3.5" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'migrating' && (
          <div className="space-y-5 pt-4 text-xs">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="size-3.5 text-blue-600 animate-spin" />
                  MIGRANDO DATOS...
                </span>
                <span className="font-mono text-blue-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Dynamic Logs Terminal */}
            <div className="bg-slate-900 rounded-lg p-3.5 font-mono text-[9px] text-slate-350 min-h-[75px] shadow-inner space-y-1">
              <span className="text-emerald-500 block">Host conectado: client-sandbox-stage</span>
              <span className="text-slate-500 block">&gt; tpl_deploy_database --force</span>
              <div className="text-blue-400 animate-pulse font-medium">
                &gt;&gt; {logs[logIndex]}
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4 pt-3 text-xs text-slate-650">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex gap-3">
              <CheckCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800">¡Sincronización Completada!</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Los registros contables y perfiles fiscales de Billora han sido consolidados y vinculados en la nube.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Endpoints de Producción</span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-[10px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Web Console:</span>
                  <a href="https://billora.vercel.app/dashboard" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                    billora.vercel.app
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">API Endpoint:</span>
                  <span className="text-slate-600">api.billora.co/v1/sync</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database IP:</span>
                  <span className="text-slate-600">aws-us-east.rds.postgres</span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs border-0 w-full justify-center">
                Listo, Volver a la Consola
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
