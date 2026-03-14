"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger'
}: ConfirmModalProps) => {
  const variantStyles = {
    danger: "bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    warning: "bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    info: "bg-hosteloom-accent hover:bg-hosteloom-accent/80 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-hosteloom-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-hosteloom-border p-1"
          >
            <div className="bg-hosteloom-bg/50 rounded-[inherit] p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-hosteloom-accent/10 text-hosteloom-accent'}`}>
                    <FiAlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold tracking-tight text-white">{title}</h2>
                    <p className="text-[10px] text-hosteloom-muted font-heading font-bold uppercase tracking-widest leading-tight">Confirmation Required</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-hosteloom-muted hover:text-white hover:bg-hosteloom-surface-light transition-all"
                >
                  <FiX />
                </button>
              </div>

              <p className="text-hosteloom-muted font-body text-sm mb-8 leading-relaxed">
                {message}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-hosteloom-surface-light text-white font-heading font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors border border-hosteloom-border"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-3 text-white font-heading font-bold uppercase tracking-widest text-xs rounded-xl transition-all ${variantStyles[variant]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
