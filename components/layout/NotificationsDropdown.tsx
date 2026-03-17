"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MdNotifications, MdDoneAll, MdCircle } from 'react-icons/md';
import { useNotificationsStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationsStore();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-hosteloom-muted hover:text-white hover:bg-hosteloom-surface-light transition-all duration-200"
      >
        <MdNotifications className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hosteloom-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-hosteloom-accent text-[10px] items-center justify-center text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-hosteloom-surface border border-hosteloom-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-4 border-b border-hosteloom-border flex items-center justify-between bg-hosteloom-surface-light/50">
            <h3 className="font-heading font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] uppercase tracking-wider font-bold text-hosteloom-accent hover:text-white transition-colors flex items-center gap-1"
              >
                <MdDoneAll className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <MdNotifications className="w-10 h-10 text-hosteloom-muted/20 mx-auto mb-3" />
                <p className="text-sm text-hosteloom-muted">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-hosteloom-border">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.isRead)}
                    className={`px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-hosteloom-accent/5' : ''}`}
                  >
                    {!n.isRead && (
                      <MdCircle className="absolute left-2.5 top-5 w-2 h-2 text-hosteloom-accent" />
                    )}
                    <div className={`flex flex-col gap-1 ${!n.isRead ? 'pl-2' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-heading font-bold text-xs text-white leading-tight">{n.title}</span>
                        <span className="text-[10px] text-hosteloom-muted shrink-0">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-hosteloom-muted leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-hosteloom-border text-center bg-hosteloom-surface-light/30">
             <span className="text-[10px] text-hosteloom-muted uppercase tracking-widest font-medium">End of notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}
