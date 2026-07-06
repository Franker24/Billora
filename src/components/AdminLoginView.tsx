import React, { useState } from 'react';
import { Lock, User, Briefcase, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onGoBack: () => void;
}

export function AdminLoginView({ onLoginSuccess, onGoBack }: AdminLoginViewProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (username === 'admin' && password === 'password') {
      setIsLoading(true);
      // Nice realistic validation delay
      await new Promise(r => setTimeout(r, 1000));
      setIsLoading(false);
      onLoginSuccess();
    } else {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      setIsLoading(false);
      setErrorMsg('Credenciales incorrectas. Prueba con: admin / password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 font-sans text-slate-250">
      {/* Decorative blurred blobs for visual premium excellence */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-650/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand identity header */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Briefcase className="size-5.5 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-widest text-white uppercase">BILLORA SYSTEM</h2>
          <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Console Sandbox Gatekeeper</p>
        </div>

        {/* Login Card */}
        <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl">
          <CardHeader className="border-b border-white/5 pb-4 pt-5 px-6">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="size-4 text-blue-400" />
              Autenticación de Administrador
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-450">
              Introduce tus claves de auditor sénior para sincronizar registros locales.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-rose-400 text-[10px] font-bold text-center leading-normal"
              >
                {errorMsg}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
              {/* Username Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <User className="size-3 text-slate-500" />
                  Usuario de Acceso
                </label>
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-950/40 border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50 h-9 text-xs rounded-lg"
                  placeholder="ej. admin"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Lock className="size-3 text-slate-500" />
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50 h-9 text-xs rounded-lg pr-9 font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-350 cursor-pointer border-0 bg-transparent"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Info Tips */}
              <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg text-[10px] text-blue-300 leading-normal">
                🔑 **Credenciales Demo:** Usa `admin` y `password` para acceder con privilegios de administrador.
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 text-xs rounded-lg flex items-center justify-center gap-1.5 border-0 shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      Iniciar Consola Sandbox
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={onGoBack}
                  className="text-[10px] text-slate-500 hover:text-slate-350 text-center font-bold py-1 bg-transparent border-0 cursor-pointer transition-colors mt-1"
                >
                  ← Volver a la Web Principal
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
