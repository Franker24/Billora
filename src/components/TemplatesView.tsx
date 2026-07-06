import React, { useState } from 'react';
import { Layout, Palette, FileText, CheckCircle2, Sliders, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface TemplatesViewProps {
  onSelectTemplateStyle: (styleName: string) => void;
  onLaunchConsole: () => void;
}

export function TemplatesView({ onSelectTemplateStyle, onLaunchConsole }: TemplatesViewProps) {
  const templates = [
    {
      id: 'swiss-minimal',
      name: 'Swiss Minimalist',
      description: 'Ultra-clean sans type focusing on negative space, deep dark grays, and light dividers. Preferred by modern consultancies.',
      author: 'Billora Core Team',
      tags: ['Modern', 'Elegant', 'Minimal'],
      primaryColor: '#1E293B',
      bgColor: 'bg-slate-50',
      fontStyle: 'font-sans'
    },
    {
      id: 'emerald-forest',
      name: 'Emerald Forest',
      description: 'Sophisticated deep green status accents with warm cream sub-blocks. Excellent for sustainable agencies and studios.',
      author: 'Studio Verde',
      tags: ['Organic', 'Warm', 'Creative'],
      primaryColor: '#059669',
      bgColor: 'bg-emerald-50/20',
      fontStyle: 'font-serif'
    },
    {
      id: 'crimson-elite',
      name: 'Crimson Executive',
      description: 'Bold professional corporate red highlighting with sharp contrast table headers. Well-suited for technical and financial consulting.',
      author: 'Fintech Lab',
      tags: ['Premium', 'Executive', 'Corporate'],
      primaryColor: '#DC2626',
      bgColor: 'bg-rose-50/20',
      fontStyle: 'font-sans'
    },
    {
      id: 'cyber-dark',
      name: 'Cosmic Tech (Dark Mode)',
      description: 'Gorgeous high-contrast dark theme optimized for developers, high-tech entities, and sovereign software contractors.',
      author: 'Billora Labs',
      tags: ['Dark Mode', 'Developer', 'Sleek'],
      primaryColor: '#3B82F6',
      bgColor: 'bg-slate-950 text-slate-100',
      fontStyle: 'font-mono'
    }
  ];

  const [selectedId, setSelectedId] = useState('swiss-minimal');

  const selectedTemplate = templates.find(t => t.id === selectedId) || templates[0];

  return (
    <div className="space-y-12 py-4" id="marketing-templates-view">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Design Gallery</span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tailored Invoice Templates</h1>
        <p className="text-xs text-slate-500">
          Select from various high-contrast layouts. You can configure outstanding styles that represent your corporate brand beautifully.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="templates-grid-split">
        {/* Template Selector Cards (Left) */}
        <div className="lg:col-span-5 space-y-4" id="templates-selector-column">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Choose Theme style</span>
          <div className="space-y-3">
            {templates.map((tpl) => {
              const isSelected = selectedId === tpl.id;
              return (
                <motion.div
                  key={tpl.id}
                  onClick={() => {
                    setSelectedId(tpl.id);
                    onSelectTemplateStyle(tpl.name);
                  }}
                  whileHover={{ scale: 1.015, x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/20' 
                      : 'border-slate-205 bg-white hover:border-slate-350 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{tpl.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: tpl.primaryColor }} />
                      {isSelected && <Badge className="bg-blue-600 text-white font-bold text-[8px] px-1 py-0 border-none uppercase">Engaged</Badge>}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {tpl.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 font-bold text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-2">
            <Button 
              onClick={onLaunchConsole}
              className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-9 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Use Selected Design in Workspace
            </Button>
          </div>
        </div>

        {/* Live Presentation Preview Card (Right) */}
        <div className="lg:col-span-7" id="templates-preview-column">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Eye className="size-3.5" />
                Live Showroom Mockup
              </span>
              <span className="text-[9px] text-slate-400">Rendered dynamically in real-time</span>
            </div>

            <div className={`border border-slate-200 rounded-xl overflow-hidden shadow-md max-w-full bg-white`}>
              <div className="bg-slate-50 border-b border-slate-100 py-2.5 px-4 flex items-center justify-between">
                <span className="font-mono text-[9px] text-slate-400">swiss_minimalist_invoice.pdf</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Live Preview</span>
              </div>

              {/* PDF representation */}
              <div className={`p-6 md:p-8 min-h-[420px] transition-all flex flex-col justify-between ${selectedTemplate.fontStyle} ${selectedTemplate.bgColor}`}>
                <div className="space-y-6">
                  {/* Top Billing Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: selectedTemplate.primaryColor }}>
                        BILLORA CO.
                      </h4>
                      <p className="text-[9px] text-slate-500 leading-tight mt-1">
                        100 Pine Street, Floor 18<br />
                        San Francisco, CA 94111<br />
                        billing@billora.co
                      </p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-bold tracking-tight uppercase" style={{ color: selectedTemplate.primaryColor }}>INVOICE</h2>
                      <p className="text-[9px] text-slate-500 mt-1">
                        Invoice ID: <span className="font-bold text-slate-700">#INV-2026-004</span><br />
                        Due Date: <span className="font-semibold text-slate-700">July 16, 2026</span>
                      </p>
                    </div>
                  </div>

                  {/* Customer Block */}
                  <div className="border-t border-slate-200/80 pt-4 flex justify-between gap-4">
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">Billed To</span>
                      <p className="font-bold text-[11px] text-slate-800 mt-1">ACME Industries LLC</p>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        billing@acme.corp<br />
                        400 Market Street, Suite 2100
                      </p>
                    </div>
                    <div className="text-right text-[10px] space-y-0.5">
                      <p className="text-slate-400 text-[8px] font-bold uppercase block">Status</p>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-100 font-extrabold text-[8px] uppercase px-1.5 py-0">
                        CLEARED & PAID
                      </Badge>
                    </div>
                  </div>

                  {/* Pricing Items Table Mock */}
                  <div className="border-t border-slate-200/80 pt-4">
                    <table className="w-full text-left text-[10px]">
                      <thead>
                        <tr className="border-b border-slate-250/80 text-[8px] uppercase tracking-wider text-slate-400 font-extrabold" style={{ color: selectedTemplate.primaryColor }}>
                          <th className="pb-1.5">Description</th>
                          <th className="pb-1.5 text-center">Qty</th>
                          <th className="pb-1.5 text-right">Rate</th>
                          <th className="pb-1.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        <tr>
                          <td className="py-2 font-medium text-slate-700">Digital Marketing Strategy Advisory Consulting</td>
                          <td className="py-2 text-center">40</td>
                          <td className="py-2 text-right">$125.00</td>
                          <td className="py-2 text-right font-bold text-slate-800">$5,000.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-slate-700">Figma UI Mockup Prototyping Assets Creation</td>
                          <td className="py-2 text-center">1</td>
                          <td className="py-2 text-right">$1,200.00</td>
                          <td className="py-2 text-right font-bold text-slate-800">$1,200.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Subtotals footer block */}
                <div className="border-t border-slate-200/80 pt-4 flex justify-between items-end gap-6 text-[10px]">
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">Footnotes</span>
                    <p className="text-slate-400 text-[9px] leading-tight mt-1 max-w-[280px]">
                      Thank you for trusting Billora with your corporate cash assets. Payment is due in bank ACH clearings.
                    </p>
                  </div>
                  <div className="flex justify-end gap-6 min-w-[124px]">
                    <div className="space-y-1 w-full text-right text-slate-500">
                      <div>Subtotal:</div>
                      <div>Tax (8%):</div>
                      <div className="font-bold text-slate-800 pt-1 border-t border-slate-200">Amount Due:</div>
                    </div>
                    <div className="space-y-1 text-right font-bold text-slate-800">
                      <div>$6,200.00</div>
                      <div className="text-slate-500 font-normal">$496.00</div>
                      <div className="pt-1 text-lg font-extrabold text-blue-600 font-mono" style={{ color: selectedTemplate.primaryColor }}>$6,696.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
