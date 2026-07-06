import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-200 bg-white rounded-2xl max-w-md mx-auto space-y-4 shadow-xs"
      id="empty-state-card"
    >
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
        <Icon className="size-6 text-slate-400" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-1">
          <Button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs px-4 py-2 cursor-pointer shadow-xs border-0"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
