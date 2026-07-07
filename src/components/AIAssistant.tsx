import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CornerDownLeft, Loader2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Invoice, Customer, Payment, Expense } from '../types';

interface AIAssistantProps {
  invoices: Invoice[];
  customers: Customer[];
  payments: Payment[];
  expenses: Expense[];
  geminiApiKey: string;
  activeTab: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export function AIAssistant({
  invoices,
  customers,
  payments,
  expenses,
  geminiApiKey,
  activeTab
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Update welcome message depending on whether the user is on the marketing page or dashboard console
  useEffect(() => {
    const isMarketing = ['home', 'features', 'pricing', 'templates', 'faq', 'contact'].includes(activeTab);
    if (isMarketing) {
      setMessages([
        {
          id: 'welcome_marketing',
          sender: 'ai',
          text: '¡Bienvenido al portal de Billora! 🚀 Soy el Asistente de Ventas y Guía de Producto. Puedo responder tus dudas sobre nuestros planes de precios ($9 o $29/mes), características avanzadas de facturación, o cómo usar nuestro sandbox de pruebas. ¿Qué te gustaría saber hoy?',
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome_console',
          sender: 'ai',
          text: '¡Hola! Soy tu Copiloto Financiero en el Sandbox de Billora ✨. Puedo darte resúmenes financieros, analizar tus gastos, redactar correos de cobranza o aconsejarte sobre el flujo de caja. ¿En qué te puedo asistir hoy?',
          timestamp: new Date()
        }
      ]);
    }
  }, [activeTab]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Formulate business stats text for context
  const getContextSummary = () => {
    const isMarketing = ['home', 'features', 'pricing', 'templates', 'faq', 'contact'].includes(activeTab);
    
    if (isMarketing) {
      return `
CONTEXTO DE LA PÁGINA PÚBLICA DE BILLORA (MARKETING):
- Billora es un SaaS de facturación inteligente, gestión de gastos y cobro en línea.
- Planes de Precios:
  * Plan Starter: $9/mes. Incluye 50 facturas/mes, 1 miembro, reportes estándar.
  * Plan Professional: $29/mes. Facturación ilimitada, 5 miembros, IA Copilot básica, recordatorios automáticos.
  * Plan Enterprise: Precios a medida. Todo ilimitado, soporte prioritario 24/7, integraciones personalizadas.
- Características principales del SaaS:
  * Automatización de facturación recurrente (semanal, mensual, trimestral).
  * Asistente de IA (Gemini) integrado para correos de cobranza, resúmenes financieros y autocategorización de gastos.
  * Portal público para clientes con simulador de pagos interactivo (Stripe).
  * Exportación local de informes a archivos CSV.
  * Centro de notificaciones en tiempo real para el administrador.
- FAQ Comunes:
  * ¿Cómo se guardan los datos? Se guardan localmente en el navegador mediante LocalStorage en esta demo.
  * ¿Requiere tarjeta de crédito para el sandbox? No, es gratuito.
`;
    }

    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.status !== 'Draft' ? inv.total : 0), 0);
    const totalPaid = payments.reduce((sum, p) => p.status === 'Cleared' ? sum + p.amount : 0, 0);
    const totalOutstanding = invoices.reduce((sum, inv) => inv.status === 'Pending' ? sum + inv.total : 0, 0);
    const totalOverdue = invoices.reduce((sum, inv) => inv.status === 'Overdue' ? sum + inv.total : 0, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Category expense breakdown
    const categories = ['Software', 'Office Utilities', 'Marketing', 'Legal & Professional', 'Travel', 'Contractors'];
    const expenseBreakdown = categories
      .map(cat => {
        const amt = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
        return amt > 0 ? `- ${cat}: $${amt.toFixed(2)}` : null;
      })
      .filter(Boolean)
      .join('\n');

    return `
INFORMACIÓN DEL NEGOCIO (CONTEXTO DE LA APP):
- Facturación Total Activa: $${totalBilled.toFixed(2)}
- Fondos Cobrados/Pagos Recibidos: $${totalPaid.toFixed(2)}
- Pendiente de Cobro: $${totalOutstanding.toFixed(2)}
- Vencido por Cobrar: $${totalOverdue.toFixed(2)}
- Gastos Registrados: $${totalExpenses.toFixed(2)}
Desglose de Gastos:
${expenseBreakdown || 'Sin gastos registrados todavía.'}
- Clientes Registrados: ${customers.length}
- Facturas Registradas: ${invoices.length}
`;
  };

  // call Gemini API using raw fetch to avoid bundling/SDK issues
  const callGeminiAPI = async (prompt: string): Promise<string> => {
    const context = getContextSummary();
    const fullPrompt = `${context}\n\nPregunta del usuario: ${prompt}\n\nPor favor, responde de forma muy profesional, clara y amigable en español. Mantén el formato de texto limpio con viñetas si es necesario.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Error al conectar con la API de Gemini');
      }

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiReply) {
        throw new Error('Respuesta inválida de la API');
      }

      return aiReply;
    } catch (err) {
      console.error('Gemini API Error:', err);
      throw err;
    }
  };

  // Mock responses for when there is no API Key configured
  const getMockAIResponse = (userPrompt: string): string => {
    const p = userPrompt.toLowerCase();
    
    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.status !== 'Draft' ? inv.total : 0), 0);
    const totalPaid = payments.reduce((sum, p) => p.status === 'Cleared' ? sum + p.amount : 0, 0);
    const totalOutstanding = invoices.reduce((sum, inv) => inv.status === 'Pending' ? sum + inv.total : 0, 0);
    const totalOverdue = invoices.reduce((sum, inv) => inv.status === 'Overdue' ? sum + inv.total : 0, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalPaid - totalExpenses;
    const margin = totalPaid > 0 ? (profit / totalPaid) * 100 : 0;

    // Marketing specific queries
    if (p.includes('precio') || p.includes('plan') || p.includes('costo') || p.includes('suscripcion')) {
      return `💰 **Planes de Precios de Billora**

Ofrecemos opciones flexibles para escalar tu facturación:
1.  **Plan Starter ($9/mes):** Perfecto para freelancers. Incluye hasta 50 facturas/mes, 1 miembro y reportes básicos.
2.  **Plan Professional ($29/mes):** El más popular. Facturación ilimitada, 5 miembros de equipo, recordatorios automáticos e Inteligencia Artificial contable.
3.  **Plan Enterprise (Precios a medida):** Todo ilimitado, soporte 24/7 y pasarelas de pago personalizadas.

*Puedes probar todas las funciones gratis haciendo clic en "Launch Sandbox Console" arriba a la derecha.*`;
    }

    if (p.includes('caracteristica') || p.includes('funcion') || p.includes('que hace') || p.includes('ventajas')) {
      return `⚡ **Características Destacadas de Billora**

Nuestra plataforma automatiza tu cobranza de extremo a extremo:
*   **Facturación Recurrente:** Genera automáticamente facturas periódicas para tus clientes de abonos.
*   **Copiloto de IA (Gemini):** Redacción de recordatorios de cobro y categorización inteligente de gastos.
*   **Portal de Clientes:** Enlace para previsualizar, imprimir en PDF o pagar en línea (simulación).
*   **Reportes P&L:** Balance de pérdidas y ganancias, margen operativo y pronóstico de caja semanal.
*   **Exportación:** Descarga todos tus datos a CSV al instante.`;
    }

    if (p.includes('sandbox') || p.includes('demo') || p.includes('probar') || p.includes('gratis')) {
      return `🔒 **Sandbox de Pruebas de Billora**

Hemos integrado una consola de demostración completa que te permite simular un negocio real:
*   No requiere registro ni tarjeta de crédito.
*   Los datos se almacenan localmente en tu navegador de forma segura.
*   Puedes crear clientes, facturas, registrar gastos y simular cobros completos como si estuvieras en producción.
*   Haz clic en **"Launch Sandbox Console"** en la cabecera para ingresar ahora mismo.`;
    }

    if (p.includes('resumen') || p.includes('financiero') || p.includes('estado')) {
      return `📊 **Resumen Financiero del Negocio**

Aquí tienes el balance actual de tus registros de Billora:
*   **Ingresos Facturados:** $${totalBilled.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
*   **Ingresos Recaudados:** $${totalPaid.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
*   **Saldo Pendiente:** $${totalOutstanding.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
*   **Saldo Vencido (Acciones necesarias):** $${totalOverdue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
*   **Gastos Registrados:** $${totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}

**Análisis de Rendimiento:**
*   Tu **Beneficio Neto Conciliado** es de **$${profit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}**.
*   El **Margen Operativo** sobre cobros es del **${margin.toFixed(1)}%**.
*   Tienes **${customers.length} clientes** activos en cartera.`;
    }

    if (p.includes('gasto') || p.includes('costo') || p.includes('egreso')) {
      return `💸 **Análisis de Egresos y Costos**

Actualmente has registrado un total de **$${totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}** en gastos contables.

*Recomendaciones de optimización:*
1.  **Software:** Revisa las suscripciones inactivas en tu panel para recortar egresos recurrentes de TI.
2.  **Proveedores:** Centraliza tus facturas de contratistas para mejorar tu capacidad de negociación de tarifas.
3.  **Proporción:** Tus gastos representan el **${totalPaid > 0 ? ((totalExpenses / totalPaid) * 100).toFixed(1) : 0}%** de tus ingresos recaudados. Mantener esta proporción por debajo del 35% es ideal para la salud financiera de tu SaaS.`;
    }

    if (p.includes('correo') || p.includes('cobro') || p.includes('recordatorio') || p.includes('email')) {
      return `📧 **Generador de Recordatorios de Cobro**

Para cobrar una factura pendiente, puedes usar esta plantilla redactada profesionalmente:

*Asunto: Recordatorio amistoso: Factura pendiente de pago [Número_de_Factura]*

*Estimado [Nombre_Cliente],*

*Espero que te encuentres muy bien. Le escribimos para recordarle amablemente que la factura [Número_de_Factura] por un importe de $[Monto_Factura], emitida el [Fecha_Emisión], venció el [Fecha_Vencimiento].*

*Le agradeceríamos que realice el pago a través del enlace de pago adjunto a la brevedad. Si ya ha realizado la transferencia, por favor ignore este mensaje.*

*Agradecemos su colaboración.*
*Atentamente,*
*El equipo de ${invoices[0]?.customerName ? 'tu empresa' : 'Billora'}*`;
    }

    // Default reply
    return `💡 **Respuesta de Simulación Billora**

He recibido tu pregunta: *"${userPrompt}"*.

*(Nota: Para obtener respuestas contextuales avanzadas utilizando inteligencia artificial generativa, configura tu clave API de Gemini en la pestaña de Configuración).*

**Respuestas rápidas disponibles:**
*   Pregúntame sobre el **"Resumen financiero"** para ver tus balances.
*   Pregúntame sobre tus **"Gastos"** para analizar salidas.
*   Pídeme ayuda para redactar un **"Correo de cobranza"**.`;
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const query = customText || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let aiText = '';
      if (geminiApiKey && geminiApiKey.startsWith('AIza')) {
        aiText = await callGeminiAPI(query);
      } else {
        // Wait 900ms to simulate response delay
        await new Promise(resolve => setTimeout(resolve, 800));
        aiText = getMockAIResponse(query);
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: aiText,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: '❌ Lo siento, ha ocurrido un error al conectar con el servicio de IA. Verifica tu conexión o revisa la clave API en Configuración.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{ left: -800, right: 50, top: -800, bottom: 50 }}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`bg-white/95 backdrop-blur-md border border-slate-205 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4 transition-[width,height] duration-300 ${
              isExpanded ? 'w-[350px] sm:w-[600px] h-[700px] max-h-[85vh]' : 'w-[350px] sm:w-[400px] h-[500px]'
            }`}
          >
            {/* Header (Drag handle area) */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-sm select-none cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Sparkles className="size-4.5 text-blue-200 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">
                    {['home', 'features', 'pricing', 'templates', 'faq', 'contact'].includes(activeTab) 
                      ? 'Guía de Ventas Billora AI' 
                      : 'Billora AI Copilot'}
                  </h3>
                  <p className="text-[10px] text-blue-200 font-medium">
                    {['home', 'features', 'pricing', 'templates', 'faq', 'contact'].includes(activeTab) 
                      ? 'Asistente Comercial' 
                      : 'Asesor Financiero Digital'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-white/15 rounded-lg text-blue-100 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                  title={isExpanded ? 'Reducir' : 'Agrandar'}
                >
                  {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/15 rounded-lg text-blue-100 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* API Warning if not set */}
            {!geminiApiKey && (
              <div className="bg-amber-50 border-b border-amber-100 px-3.5 py-1.5 flex items-center gap-2 text-[10px] text-amber-700">
                <AlertCircle className="size-3.5 shrink-0" />
                <span className="leading-tight font-medium">
                  Modo Simulación. Configura tu Gemini API Key en **Ajustes** para respuestas reales.
                </span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Bot className="size-3.5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                    <span
                      className={`text-[8px] mt-1 block text-right font-medium ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Bot className="size-3.5 text-blue-600" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-slate-450 shadow-xs flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin text-blue-600" />
                    Analizando contabilidad...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              {['home', 'features', 'pricing', 'templates', 'faq', 'contact'].includes(activeTab) ? (
                <>
                  <button
                    onClick={(e) => handleSend(e, '¿Cuáles son los planes de precios de Billora y qué incluyen?')}
                    className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                  >
                    💰 Planes de Precios
                  </button>
                  <button
                    onClick={(e) => handleSend(e, '¿Cuáles son las características principales de Billora?')}
                    className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                  >
                    ⚡ Características
                  </button>
                  <button
                    onClick={(e) => handleSend(e, '¿Cómo puedo probar el Sandbox gratuito?')}
                    className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                  >
                    🔒 Probar Sandbox
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => handleSend(e, 'Dame un resumen financiero completo de hoy')}
                    className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                  >
                    📊 Resumen
                  </button>
                  <button
                    onClick={(e) => handleSend(e, 'Analiza mis gastos actuales')}
                    className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                  >
                    💸 Gastos
                  </button>
                  <button
                    onClick={(e) => handleSend(e, 'Plantilla de correo para reclamar un pago vencido')}
                    className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                  >
                    📧 Correo
                  </button>
                </>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-slate-150 bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta sobre saldos, gastos, etc..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl cursor-pointer transition-colors flex items-center justify-center shrink-0 border-0"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/25 cursor-pointer select-none border-0"
        id="ai-floating-trigger"
      >
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <div className="relative">
            <Sparkles className="size-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
