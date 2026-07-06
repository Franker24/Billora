import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationAlert } from '../types';

interface NotificationsDropdownProps {
  notifications: NotificationAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  align?: 'left' | 'right';
}

export function NotificationsDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
  align = 'right'
}: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'warning':
        return <ShieldAlert className="size-4.5 text-amber-500" />;
      case 'success':
        return <Sparkles className="size-4.5 text-emerald-500" />;
      default:
        return <Clock className="size-4.5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef} id="notifications-menu-trigger">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
        title="Notifications"
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden ${
              align === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-0.5 cursor-pointer"
                    title="Clear All"
                  >
                    <Trash2 className="size-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <Bell className="size-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs text-slate-500 font-medium">All caught up!</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && onMarkAsRead(notif.id)}
                    className={`p-3.5 flex gap-3 text-left transition-colors cursor-pointer ${
                      notif.read ? 'bg-white hover:bg-slate-50/50' : 'bg-blue-50/20 hover:bg-blue-50/40'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-xs truncate ${notif.read ? 'text-slate-700 font-medium' : 'text-slate-800 font-bold'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[9px] text-slate-400 font-medium shrink-0">
                          {notif.date}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed break-words">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="shrink-0 self-center">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
