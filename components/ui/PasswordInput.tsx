"use client";

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const PasswordInput = ({ icon = <FiLock className="w-5 h-5" />, className, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
        {icon}
      </div>
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body ${className}`}
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-hosteloom-muted hover:text-white transition-colors flex items-center justify-center p-1"
          tabIndex={-1}
        >
          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
