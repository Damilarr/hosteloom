'use client';

import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative group inline-block">
      <button 
        className="p-2 rounded-full bg-hosteloom-surface hover:bg-hosteloom-border border border-hosteloom-border transition-colors flex items-center justify-center text-hosteloom-text"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <FiSun className="w-5 h-5" /> : 
         theme === 'dark' ? <FiMoon className="w-5 h-5" /> : 
         <FiMonitor className="w-5 h-5" />}
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-36 bg-hosteloom-surface border border-hosteloom-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="flex flex-col py-1">
          <button 
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-hosteloom-hover-bg transition-colors ${theme === 'light' ? 'text-hosteloom-accent' : 'text-hosteloom-text'}`}
          >
            <FiSun className="w-4 h-4" /> Light
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-hosteloom-hover-bg transition-colors ${theme === 'dark' ? 'text-hosteloom-accent' : 'text-hosteloom-text'}`}
          >
            <FiMoon className="w-4 h-4" /> Dark
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-hosteloom-hover-bg transition-colors ${theme === 'system' ? 'text-hosteloom-accent' : 'text-hosteloom-text'}`}
          >
            <FiMonitor className="w-4 h-4" /> System
          </button>
        </div>
      </div>
    </div>
  );
}
