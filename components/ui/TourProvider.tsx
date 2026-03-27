"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { TourConfig, TourStep } from '@/lib/tourConfig';
import { getTourForRole } from '@/lib/tourConfig';

interface TourContextValue {
  isActive: boolean;
  currentStep: number;
  tour: TourConfig | null;
  step: TourStep | null;
  totalSteps: number;
  next: () => void;
  prev: () => void;
  skip: () => void;
  start: (config: TourConfig) => void;
  startForRole: (role: string | undefined) => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within a TourProvider');
  return ctx;
}

const STORAGE_PREFIX = 'hosteloom_tour_completed_';

function isCompleted(tourId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${STORAGE_PREFIX}${tourId}`) === 'true';
}

function markCompleted(tourId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}${tourId}`, 'true');
}

export function resetTourForRole(role: string | undefined) {
  const tour = getTourForRole(role);
  if (tour && typeof window !== 'undefined') {
    localStorage.removeItem(`${STORAGE_PREFIX}${tour.id}`);
  }
}

interface TourProviderProps {
  children: React.ReactNode;
  role?: string;
  profileReady?: boolean;
}

export default function TourProvider({ children, role, profileReady = false }: TourProviderProps) {
  const [tour, setTour] = useState<TourConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasAutoLaunched, setHasAutoLaunched] = useState(false);

  const step = tour ? tour.steps[currentStep] ?? null : null;
  const totalSteps = tour ? tour.steps.length : 0;

  const start = useCallback((config: TourConfig) => {
    setTour(config);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const startForRole = useCallback((r: string | undefined) => {
    const config = getTourForRole(r);
    if (config) start(config);
  }, [start]);

  const endTour = useCallback(() => {
    if (tour) markCompleted(tour.id);
    setIsActive(false);
    setCurrentStep(0);
    setTour(null);
  }, [tour]);

  const next = useCallback(() => {
    if (!tour) return;
    if (currentStep < tour.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      endTour();
    }
  }, [tour, currentStep, endTour]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const skip = useCallback(() => {
    endTour();
  }, [endTour]);

  useEffect(() => {
    if (hasAutoLaunched || !role || !profileReady) return;

    const config = getTourForRole(role);
    if (!config || isCompleted(config.id)) {
      setHasAutoLaunched(true);
      return;
    }

    const timer = setTimeout(() => {
      start(config);
      setHasAutoLaunched(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [role, profileReady, hasAutoLaunched, start]);

  return (
    <TourContext.Provider value={{ isActive, currentStep, tour, step, totalSteps, next, prev, skip, start, startForRole }}>
      {children}
    </TourContext.Provider>
  );
}
